import { getAuthUserId } from "@/lib/auth-server";
import { formatGeminiError, geminiErrorStatus } from "@/lib/gemini-errors";
import { getGeminiApiKey, openGeminiTextStream } from "@/lib/gemini-stream";
import { prisma } from "@/lib/prisma";

const META_DELIMITER = "---WRITEFLOW_META---";

const SYSTEM_PROMPT = `You are an expert content writer for WriteFlow AI. Generate high-quality, well-structured content.

Output format (strict):
1. HTML content only for the article body — use <h1> for title, <h2>/<h3> for sections, <p> for paragraphs, <ul><li> for lists. No markdown.
2. After the HTML, on its own line, output exactly: ---WRITEFLOW_META---
3. Then a single JSON object (no markdown fences) with keys: title, metaDescription, tags (string array of 3-5 tags).

Write compelling, publication-ready copy. Match the requested tone and audience.`;

export async function POST(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!getGeminiApiKey()) {
    return new Response(
      JSON.stringify({
        error:
          "GEMINI_API_KEY is not configured. Add a valid API key to .env to enable AI generation.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await request.json();
  const topic = String(body.topic || "").trim();
  const tone = String(body.tone || "Professional").trim();
  const audience = String(body.audience || "general readers").trim();
  const templatePrompt = String(body.templatePrompt || "").trim();

  if (!topic) {
    return new Response(JSON.stringify({ error: "Topic is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userPrompt = [
    `Topic: ${topic}`,
    `Tone: ${tone}`,
    `Target audience: ${audience}`,
    templatePrompt ? `Template context: ${templatePrompt}` : "",
    "",
    "Generate a complete article following the output format in your instructions.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const { stream: textStream } = await openGeminiTextStream({
      system: SYSTEM_PROMPT,
      userPrompt,
      maxTokens: 4096,
    });

    const reader = textStream.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let fullText = "";
    const startTime = Date.now();

    const stream = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) {
          const metaIndex = fullText.indexOf(META_DELIMITER);
          let contentHtml = fullText;
          let meta = {
            title: topic,
            metaDescription: "",
            tags: [] as string[],
            tokensUsed: Math.ceil(fullText.length / 4),
          };

          if (metaIndex !== -1) {
            contentHtml = fullText.slice(0, metaIndex).trim();
            const metaRaw = fullText.slice(metaIndex + META_DELIMITER.length).trim();
            try {
              const parsed = JSON.parse(metaRaw);
              meta = {
                title: parsed.title || meta.title,
                metaDescription: parsed.metaDescription || "",
                tags: Array.isArray(parsed.tags) ? parsed.tags : [],
                tokensUsed: Math.ceil(fullText.length / 4),
              };
            } catch {
              // keep defaults if JSON parse fails
            }
          }

          try {
            await prisma.aIUsageHistory.create({
              data: {
                userId,
                agentType: "DRAFT",
                promptSnippet: topic.slice(0, 120),
                tokensUsed: meta.tokensUsed,
                responseTime: Date.now() - startTime,
              },
            });
          } catch (err) {
            console.error("Failed to save AI usage history:", err);
          }

          controller.enqueue(
            encoder.encode(
              `\n<<<WRITEFLOW_DONE>>>${JSON.stringify({
                ...meta,
                contentHtml,
              })}`
            )
          );
          controller.close();
          return;
        }

        const chunk = decoder.decode(value);
        fullText += chunk;
        const metaStart = fullText.indexOf(META_DELIMITER);
        if (metaStart === -1) {
          controller.enqueue(value);
        } else {
          const prevLen = fullText.length - chunk.length;
          if (prevLen < metaStart) {
            const safeChunk = fullText.slice(prevLen, metaStart);
            if (safeChunk) controller.enqueue(encoder.encode(safeChunk));
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message = formatGeminiError(error);
    return new Response(JSON.stringify({ error: message }), {
      status: geminiErrorStatus(error),
      headers: { "Content-Type": "application/json" },
    });
  }
}

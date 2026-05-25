import { getAuthUserId } from "@/lib/auth-server";
import { createGeminiTextStream, getGeminiApiKey } from "@/lib/gemini-stream";
import { prisma } from "@/lib/prisma";

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
      JSON.stringify({ error: "GEMINI_API_KEY is not configured." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await request.json();
  const text = String(body.text || "").trim();
  const mode = String(body.mode || "rewrite");

  if (!text) {
    return new Response(JSON.stringify({ error: "Text is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const system =
    mode === "expand"
      ? "You are a writing assistant. Expand the given text with more detail, examples, and clarity. Return ONLY the expanded HTML paragraph(s) — use <p> tags, no markdown or explanations."
      : "You are a writing assistant. Rewrite the given text to be clearer, more decisive, and professionally polished. Return ONLY the rewritten HTML — use <p> tags, no markdown or explanations.";

  const startTime = Date.now();

  try {
    const textStream = createGeminiTextStream({
      system,
      userPrompt: text,
      maxTokens: 2048,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const reader = textStream.getReader();
        let total = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            total += new TextDecoder().decode(value);
            controller.enqueue(value);
          }
          await prisma.aIUsageHistory.create({
            data: {
              userId,
              agentType: "REWRITE",
              promptSnippet: text.slice(0, 120),
              tokensUsed: Math.ceil(total.length / 4),
              responseTime: Date.now() - startTime,
            },
          });
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Rewrite failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

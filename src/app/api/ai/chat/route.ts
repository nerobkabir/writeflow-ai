import { getAuthUserId } from "@/lib/auth-server";
import { buildChatSystemPrompt } from "@/lib/chat-context";
import type { ChatMessage, DocumentChatContext } from "@/lib/chat-types";
import { trimChatMessages } from "@/lib/chat-types";
import { isDatabaseConnectionError } from "@/lib/db-error";
import { formatGeminiError, geminiErrorStatus } from "@/lib/gemini-errors";
import { getGeminiApiKey, openGeminiChatStream } from "@/lib/gemini-stream";
import { prisma } from "@/lib/prisma";
import { isAgentEnabled } from "@/lib/site-settings";

function parseMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((m) => {
      const role = m?.role === "assistant" ? "assistant" : "user";
      const content = String(m?.content ?? "").trim();
      if (!content) return null;
      return { role, content } as ChatMessage;
    })
    .filter((m): m is ChatMessage => m !== null);
}

function parseDocumentContext(raw: unknown): DocumentChatContext {
  const ctx = raw as Record<string, unknown> | null;
  return {
    title: String(ctx?.title ?? "Untitled Document").trim() || "Untitled Document",
    contentExcerpt: String(ctx?.contentExcerpt ?? "").slice(0, 2000),
    wordCount: Number(ctx?.wordCount) || 0,
    tone: String(ctx?.tone ?? "Professional").trim() || "Professional",
  };
}

export async function POST(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await isAgentEnabled("chat"))) {
    return Response.json({ error: "This agent is currently disabled" }, { status: 503 });
  }

  if (!getGeminiApiKey()) {
    return Response.json(
      { error: "GEMINI_API_KEY is not configured." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const messages = trimChatMessages(parseMessages(body.messages));
  const documentContext = parseDocumentContext(body.documentContext);

  if (messages.length === 0) {
    return Response.json({ error: "messages are required" }, { status: 400 });
  }

  const last = messages[messages.length - 1];
  if (last.role !== "user") {
    return Response.json(
      { error: "Last message must be from the user" },
      { status: 400 }
    );
  }

  const startTime = Date.now();

  try {
    const system = buildChatSystemPrompt(documentContext);
    const { stream } = await openGeminiChatStream({
      system,
      messages,
      maxTokens: 4096,
    });

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";

    const outStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              const tokensUsed = Math.ceil(
                (messages.reduce((n, m) => n + m.content.length, 0) + fullResponse.length) /
                  4
              );

              try {
                await prisma.aIUsageHistory.create({
                  data: {
                    userId,
                    agentType: "CHAT",
                    promptSnippet: last.content.slice(0, 120),
                    tokensUsed,
                    responseTime: Date.now() - startTime,
                  },
                });
              } catch (err) {
                if (!isDatabaseConnectionError(err)) {
                  console.error("Failed to save CHAT usage:", err);
                }
              }

              controller.close();
              return;
            }

            const chunk = decoder.decode(value, { stream: true });
            fullResponse += chunk;
            controller.enqueue(value);
          }
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(outStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("POST /api/ai/chat:", error);
    const message = formatGeminiError(error);
    return Response.json({ error: message }, { status: geminiErrorStatus(error) });
  }
}

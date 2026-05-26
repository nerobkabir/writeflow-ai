import { getAuthUserId } from "@/lib/auth-server";
import { formatGeminiError, geminiErrorStatus } from "@/lib/gemini-errors";
import { generateGeminiText, getGeminiApiKey } from "@/lib/gemini-stream";
import { prisma } from "@/lib/prisma";
import { buildRewriteSystemPrompt } from "@/lib/rewrite-prompts";

export async function POST(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!getGeminiApiKey()) {
    return Response.json(
      { error: "GEMINI_API_KEY is not configured." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const selectedText = String(body.selectedText || body.text || "").trim();
  const tone = body.tone != null ? String(body.tone).trim() : null;
  const action = String(body.action || "rewrite").trim();

  if (!selectedText) {
    return Response.json({ error: "selectedText is required" }, { status: 400 });
  }

  const startTime = Date.now();

  try {
    const system = buildRewriteSystemPrompt(tone, action);
    const { text: rewrittenText, tokensUsed } = await generateGeminiText({
      system,
      userPrompt: selectedText,
      maxTokens: 2048,
    });

    await prisma.aIUsageHistory.create({
      data: {
        userId,
        agentType: "REWRITE",
        promptSnippet: selectedText.slice(0, 120),
        tokensUsed,
        responseTime: Date.now() - startTime,
      },
    });

    return Response.json({ rewrittenText, tokensUsed });
  } catch (error) {
    const message = formatGeminiError(error);
    return Response.json({ error: message }, { status: geminiErrorStatus(error) });
  }
}

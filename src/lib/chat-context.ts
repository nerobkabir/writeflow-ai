import type { DocumentChatContext } from "@/lib/chat-types";

const CONTEXT_CHAR_LIMIT = 2000;

/** Strip HTML tags for document context sent to the model. */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractDocumentTitle(html: string, fallback = "Untitled Document"): string {
  const match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (!match) return fallback;
  const title = match[1].replace(/<[^>]+>/g, "").trim();
  return title || fallback;
}

export function buildDocumentChatContext(
  html: string,
  wordCount: number,
  tone: string,
  fallbackTitle?: string
): DocumentChatContext {
  const plain = htmlToPlainText(html);
  return {
    title: extractDocumentTitle(html, fallbackTitle || "Untitled Document"),
    contentExcerpt: plain.slice(0, CONTEXT_CHAR_LIMIT),
    wordCount,
    tone,
  };
}

export function buildChatSystemPrompt(ctx: DocumentChatContext): string {
  return `You are WriteFlow AI, an expert writing assistant embedded in a document editor.

The user is working on a document with the following context:
- Title: ${ctx.title}
- Tone: ${ctx.tone}
- Word count: ${ctx.wordCount}
- Content excerpt (first ${CONTEXT_CHAR_LIMIT} characters):
"""
${ctx.contentExcerpt}
"""

Help the user improve, structure, and refine their document. Be concise, actionable, and specific to their draft. Reference the document context when relevant. Use markdown sparingly (bold, lists) when it aids clarity. Do not invent facts not supported by the excerpt unless clearly labeled as suggestions.`;
}

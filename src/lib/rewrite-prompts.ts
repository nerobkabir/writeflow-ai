export type RewriteTone = "formal" | "casual" | "friendly" | "persuasive";
export type RewriteAction = "rewrite" | "shorten" | "expand" | "fix_grammar";

export interface RewriteToolbarOption {
  id: string;
  label: string;
  tone?: RewriteTone;
  action: RewriteAction;
}

export const REWRITE_TOOLBAR_OPTIONS: RewriteToolbarOption[] = [
  { id: "formal", label: "Formal", tone: "formal", action: "rewrite" },
  { id: "casual", label: "Casual", tone: "casual", action: "rewrite" },
  { id: "friendly", label: "Friendly", tone: "friendly", action: "rewrite" },
  { id: "persuasive", label: "Persuasive", tone: "persuasive", action: "rewrite" },
  { id: "shorten", label: "Shorten", action: "shorten" },
  { id: "expand", label: "Expand", action: "expand" },
  { id: "fix-grammar", label: "Fix Grammar", action: "fix_grammar" },
];

export function buildRewriteSystemPrompt(tone: string | null, action: string): string {
  const actionNorm = action.toLowerCase();

  if (actionNorm === "shorten") {
    return "You are a writing assistant. Shorten the given text while preserving meaning and clarity. Return ONLY the shortened plain text — no markdown, quotes, or explanations.";
  }
  if (actionNorm === "expand") {
    return "You are a writing assistant. Expand the given text with more detail and clarity. Return ONLY the expanded plain text — no markdown, quotes, or explanations.";
  }
  if (actionNorm === "fix_grammar") {
    return "You are a writing assistant. Fix grammar, spelling, and punctuation in the given text. Return ONLY the corrected plain text — no markdown, quotes, or explanations.";
  }

  const toneNorm = (tone || "neutral").toLowerCase();
  const toneInstructions: Record<string, string> = {
    formal:
      "Rewrite in a professional, formal tone suitable for business communication.",
    casual: "Rewrite in a relaxed, casual tone suitable for blogs or social media.",
    friendly: "Rewrite in a warm, friendly, approachable tone.",
    persuasive: "Rewrite in a compelling, persuasive tone that drives action.",
    neutral: "Rewrite to be clearer and more polished.",
  };

  const instruction =
    toneInstructions[toneNorm] || toneInstructions.neutral;

  return `You are a writing assistant. ${instruction} Return ONLY the rewritten plain text — no markdown, quotes, or explanations.`;
}

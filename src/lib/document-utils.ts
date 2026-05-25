export function countWordsFromHtml(html: string): number {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return 0;
  return text.split(" ").filter(Boolean).length;
}

export function computeReadabilityScore(html: string): number {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return 0;

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0 || sentences.length === 0) return 0;

  const avgWordsPerSentence = words.length / sentences.length;
  const avgWordLength =
    words.reduce((sum, w) => sum + w.replace(/[^a-zA-Z]/g, "").length, 0) / words.length;

  const raw = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * (avgWordLength / 4.7);
  return Math.min(99, Math.max(10, Math.round(raw)));
}

export function isEditorContentEmpty(html: string): boolean {
  const stripped = html
    .replace(/<h1[^>]*>.*?<\/h1>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, "")
    .trim();
  return stripped.length < 3;
}

/** User-facing message for Gemini API failures. */
export function formatGeminiError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  const msg = raw.replace(/^Gemini API error:\s*/i, "");

  if (
    msg.includes("429") ||
    msg.includes("Too Many Requests") ||
    msg.includes("quota") ||
    msg.includes("Quota exceeded")
  ) {
    const retrySec =
      msg.match(/retry in ([\d.]+)s/i)?.[1] ??
      msg.match(/"retryDelay":"(\d+)s"/)?.[1];
    if (retrySec) {
      const sec = Math.ceil(Number(retrySec));
      return `Gemini rate limit reached. Wait about ${sec} seconds, then try again. For higher limits, check billing at https://ai.google.dev/pricing`;
    }
    return "Gemini API quota exceeded for this API key. Wait a few minutes, switch GEMINI_MODEL in .env (e.g. gemini-2.5-flash), or enable billing at https://ai.google.dev/";
  }

  if (msg.includes("404 Not Found") && msg.includes("models/")) {
    return "Gemini model not available. Set GEMINI_MODEL=gemini-2.5-flash in .env and restart the dev server.";
  }

  if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
    return "Invalid GEMINI_API_KEY. Create a new key at https://aistudio.google.com/apikey";
  }

  return msg || "Gemini request failed";
}

export function isRetryableGeminiError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes("429") ||
    msg.includes("404") ||
    msg.includes("quota") ||
    msg.includes("Quota exceeded") ||
    msg.includes("not found") ||
    msg.includes("Too Many Requests")
  );
}

export function geminiErrorStatus(error: unknown): number {
  const msg = error instanceof Error ? error.message : String(error);
  if (
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("Too Many Requests")
  ) {
    return 429;
  }
  return 500;
}

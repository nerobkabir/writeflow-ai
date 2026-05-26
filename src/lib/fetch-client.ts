/** Fetch with an abort timeout so the UI does not hang on slow/unreachable APIs. */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit & { timeoutMs?: number }
): Promise<Response> {
  const timeoutMs = init?.timeoutMs ?? 12_000;
  const { timeoutMs: _, ...fetchInit } = init ?? {};
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...fetchInit, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out. Check your network or database connection.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

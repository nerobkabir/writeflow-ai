const DONE_MARKER = "<<<WRITEFLOW_DONE>>>";

export interface GenerateCompleteMeta {
  title: string;
  metaDescription: string;
  tags: string[];
  tokensUsed: number;
  contentHtml: string;
}

export async function consumeTextStream(
  response: Response,
  onDelta: (delta: string) => void
): Promise<GenerateCompleteMeta | null> {
  if (!response.body) throw new Error("Empty response stream");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let sentLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const markerIdx = buffer.indexOf(DONE_MARKER);

    if (markerIdx !== -1) {
      const newText = buffer.slice(sentLength, markerIdx);
      if (newText) onDelta(newText);
      sentLength = markerIdx;

      try {
        const metaJson = buffer.slice(markerIdx + DONE_MARKER.length);
        return JSON.parse(metaJson) as GenerateCompleteMeta;
      } catch {
        return null;
      }
    }

    const newText = buffer.slice(sentLength);
    if (newText) {
      onDelta(newText);
      sentLength = buffer.length;
    }
  }

  return null;
}

/** Consume a plain-text streaming response (no metadata trailer). */
export async function consumePlainTextStream(
  response: Response,
  onDelta: (delta: string) => void
): Promise<string> {
  if (!response.body) throw new Error("Empty response stream");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    full += chunk;
    if (chunk) onDelta(chunk);
  }

  return full;
}

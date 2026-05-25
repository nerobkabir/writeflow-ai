const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL =
  process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

export function getAnthropicApiKey(): string | null {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key || key === "mock-key") return null;
  return key;
}

interface StreamMessageOptions {
  system: string;
  userPrompt: string;
  maxTokens?: number;
}

export async function createAnthropicStream(
  options: StreamMessageOptions
): Promise<Response> {
  const apiKey = getAnthropicApiKey();
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. Add a valid API key to .env to enable AI generation."
    );
  }

  const upstream = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      max_tokens: options.maxTokens ?? 4096,
      stream: true,
      system: options.system,
      messages: [{ role: "user", content: options.userPrompt }],
    }),
  });

  if (!upstream.ok) {
    const errBody = await upstream.text();
    throw new Error(`Anthropic API error (${upstream.status}): ${errBody}`);
  }

  if (!upstream.body) {
    throw new Error("Anthropic API returned an empty response body");
  }

  return upstream;
}

/** Parse Anthropic SSE stream and emit plain text chunks to a TransformStream */
export function anthropicSSEToTextStream(
  upstream: ReadableStream<Uint8Array>
): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return upstream.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (
              parsed.type === "content_block_delta" &&
              parsed.delta?.type === "text_delta" &&
              parsed.delta.text
            ) {
              controller.enqueue(encoder.encode(parsed.delta.text));
            }
          } catch {
            // ignore malformed SSE lines
          }
        }
      },
      flush(controller) {
        if (buffer.startsWith("data: ")) {
          try {
            const parsed = JSON.parse(buffer.slice(6).trim());
            if (parsed.delta?.text) {
              controller.enqueue(encoder.encode(parsed.delta.text));
            }
          } catch {
            // ignore
          }
        }
      },
    })
  );
}

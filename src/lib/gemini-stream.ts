import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_MODEL = "gemini-1.5-flash";

export function getGeminiApiKey(): string | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key || key === "mock-key") return null;
  return key;
}

interface StreamMessageOptions {
  system: string;
  userPrompt: string;
  maxTokens?: number;
}

/** Stream plain text chunks from Gemini (gemini-1.5-flash) */
export function createGeminiTextStream(options: StreamMessageOptions): ReadableStream<Uint8Array> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add a valid API key to .env to enable AI generation."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: DEFAULT_MODEL,
    systemInstruction: options.system,
    generationConfig: {
      maxOutputTokens: options.maxTokens ?? 4096,
    },
  });

  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const result = await model.generateContentStream(options.userPrompt);

        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }

        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gemini API request failed";
        controller.error(new Error(`Gemini API error: ${message}`));
      }
    },
  });
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChatMessage } from "@/lib/chat-types";
import { formatGeminiError, isRetryableGeminiError } from "@/lib/gemini-errors";

/** Models tried in order when the primary hits 404/429 (free-tier friendly first). */
const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
] as const;

const DEFAULT_MODEL = MODEL_FALLBACK_CHAIN[0];

const PLACEHOLDER_KEYS = new Set(["mock-key", "your-gemini-api-key", ""]);

/** Ordered unique model ids: GEMINI_MODEL first, then optional fallbacks, then defaults. */
export function getGeminiModelCandidates(): string[] {
  const primary = process.env.GEMINI_MODEL?.trim();
  const extra = process.env.GEMINI_MODEL_FALLBACKS?.split(",")
    .map((s) => s.trim())
    .filter((s) => s && !PLACEHOLDER_KEYS.has(s));

  const ordered = [
    ...(primary && !PLACEHOLDER_KEYS.has(primary) ? [primary] : []),
    ...(extra ?? []),
    ...MODEL_FALLBACK_CHAIN,
  ];

  return [...new Set(ordered)];
}

export function getGeminiModel(): string {
  return getGeminiModelCandidates()[0] ?? DEFAULT_MODEL;
}

/** Resolve Gemini API key from supported env var names. */
export function getGeminiApiKey(): string | null {
  const key = (
    process.env.GEMINI_API_KEY ??
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ??
    process.env.GOOGLE_API_KEY
  )?.trim();

  if (!key || PLACEHOLDER_KEYS.has(key)) return null;
  return key;
}

interface StreamMessageOptions {
  system: string;
  userPrompt: string;
  maxTokens?: number;
}

function getGenAI(): GoogleGenerativeAI {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add a valid API key to .env to enable AI generation."
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

function getModel(
  genAI: GoogleGenerativeAI,
  modelId: string,
  options: { system: string; maxTokens?: number }
) {
  return genAI.getGenerativeModel({
    model: modelId,
    systemInstruction: options.system,
    generationConfig: {
      maxOutputTokens: options.maxTokens ?? 4096,
    },
  });
}

/** Single non-streaming completion with automatic model fallback. */
export async function generateGeminiText(
  options: StreamMessageOptions
): Promise<{ text: string; tokensUsed: number; modelUsed: string }> {
  const genAI = getGenAI();
  const candidates = getGeminiModelCandidates();
  let lastError: unknown;

  for (const modelId of candidates) {
    try {
      const model = getModel(genAI, modelId, {
        system: options.system,
        maxTokens: options.maxTokens ?? 2048,
      });
      const result = await model.generateContent(options.userPrompt);
      const text = result.response.text().trim();
      const tokensUsed =
        result.response.usageMetadata?.totalTokenCount ?? Math.ceil(text.length / 4);
      return { text, tokensUsed, modelUsed: modelId };
    } catch (error) {
      lastError = error;
      if (!isRetryableGeminiError(error)) break;
      console.warn(`[gemini] ${modelId} failed, trying next model…`);
    }
  }

  throw new Error(formatGeminiError(lastError));
}

/** Open a chat stream after validating the first chunk (tries fallback models on 429/404). */
export async function openGeminiChatStream(options: {
  system: string;
  messages: ChatMessage[];
  maxTokens?: number;
}): Promise<{ stream: ReadableStream<Uint8Array>; modelUsed: string }> {
  const genAI = getGenAI();
  const messages = options.messages.filter((m) => m.content.trim());
  if (messages.length === 0) throw new Error("At least one message is required");

  const last = messages[messages.length - 1];
  if (last.role !== "user") {
    throw new Error("The last message must be from the user");
  }

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: m.content }],
  }));

  const candidates = getGeminiModelCandidates();
  let lastError: unknown;

  for (const modelId of candidates) {
    try {
      const stream = await createChatStreamForModel(
        genAI,
        modelId,
        { system: options.system, maxTokens: options.maxTokens },
        history,
        last.content
      );
      return { stream, modelUsed: modelId };
    } catch (error) {
      lastError = error;
      if (!isRetryableGeminiError(error)) break;
      console.warn(`[gemini] chat ${modelId} failed, trying next model…`);
    }
  }

  throw new Error(formatGeminiError(lastError));
}

async function createChatStreamForModel(
  genAI: GoogleGenerativeAI,
  modelId: string,
  options: { system: string; maxTokens?: number },
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  lastUserMessage: string
): Promise<ReadableStream<Uint8Array>> {
  const model = getModel(genAI, modelId, options);
  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(lastUserMessage);
  const iterator = result.stream[Symbol.asyncIterator]();
  const encoder = new TextEncoder();

  const first = await iterator.next();
  if (first.done) {
    return new ReadableStream({
      start(controller) {
        controller.close();
      },
    });
  }

  const firstText = first.value.text() ?? "";

  return new ReadableStream({
    async start(controller) {
      try {
        if (firstText) controller.enqueue(encoder.encode(firstText));
        while (true) {
          const next = await iterator.next();
          if (next.done) break;
          const text = next.value.text();
          if (text) controller.enqueue(encoder.encode(text));
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

/** @deprecated Use openGeminiChatStream — validates before streaming */
export function createGeminiChatStream(options: {
  system: string;
  messages: ChatMessage[];
  maxTokens?: number;
}): ReadableStream<Uint8Array> {
  let streamPromise: Promise<ReadableStream<Uint8Array>> | null = null;

  return new ReadableStream({
    async start(controller) {
      try {
        if (!streamPromise) {
          streamPromise = openGeminiChatStream(options).then((r) => r.stream);
        }
        const inner = await streamPromise;
        const reader = inner.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
        }
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

/** Open a plain-text generation stream with model fallback. */
export async function openGeminiTextStream(
  options: StreamMessageOptions
): Promise<{ stream: ReadableStream<Uint8Array>; modelUsed: string }> {
  const genAI = getGenAI();
  const candidates = getGeminiModelCandidates();
  let lastError: unknown;

  for (const modelId of candidates) {
    try {
      const stream = await createTextStreamForModel(genAI, modelId, options);
      return { stream, modelUsed: modelId };
    } catch (error) {
      lastError = error;
      if (!isRetryableGeminiError(error)) break;
      console.warn(`[gemini] generate ${modelId} failed, trying next model…`);
    }
  }

  throw new Error(formatGeminiError(lastError));
}

async function createTextStreamForModel(
  genAI: GoogleGenerativeAI,
  modelId: string,
  options: StreamMessageOptions
): Promise<ReadableStream<Uint8Array>> {
  const model = getModel(genAI, modelId, options);
  const result = await model.generateContentStream(options.userPrompt);
  const iterator = result.stream[Symbol.asyncIterator]();
  const encoder = new TextEncoder();

  const first = await iterator.next();
  if (first.done) {
    return new ReadableStream({ start(c) { c.close(); } });
  }

  const firstText = first.value.text();

  return new ReadableStream({
    async start(controller) {
      try {
        if (firstText) controller.enqueue(encoder.encode(firstText));
        while (true) {
          const next = await iterator.next();
          if (next.done) break;
          const text = next.value.text();
          if (text) controller.enqueue(encoder.encode(text));
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

/** @deprecated Use openGeminiTextStream */
export function createGeminiTextStream(
  options: StreamMessageOptions
): ReadableStream<Uint8Array> {
  let streamPromise: Promise<ReadableStream<Uint8Array>> | null = null;

  return new ReadableStream({
    async start(controller) {
      try {
        if (!streamPromise) {
          streamPromise = openGeminiTextStream(options).then((r) => r.stream);
        }
        const inner = await streamPromise;
        const reader = inner.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
        }
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { fadeInUp, scaleIn } from "@/lib/animations";
import { consumePlainTextStream } from "@/lib/ai-stream-client";
import type { ChatMessage, DocumentChatContext } from "@/lib/chat-types";
import { trimChatMessages } from "@/lib/chat-types";
import { cn } from "@/lib/utils";

const SUGGESTED_PROMPTS = [
  "Suggest an outline for this document",
  "How can I improve the introduction?",
  "Generate 5 alternative titles",
];

export interface ChatUiMessage extends ChatMessage {
  id: string;
  streaming?: boolean;
}

interface EditorChatPanelProps {
  documentContext: DocumentChatContext;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5 rounded-2xl rounded-bl-md border border-border bg-surface w-fit">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="chat-typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: ChatUiMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      variants={scaleIn}
      initial="initial"
      animate="animate"
      style={{ transformOrigin: isUser ? "bottom right" : "bottom left" }}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start gap-2")}
    >
      {!isUser && (
        <div
          className="shrink-0 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-[9px] font-bold mt-0.5"
          aria-hidden
        >
          AI
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] px-3 py-2 text-[12px] leading-relaxed whitespace-pre-wrap break-words",
          isUser
            ? "max-w-[80%] bg-foreground text-background rounded-[16px_16px_4px_16px] dark:bg-white dark:text-black"
            : "bg-surface border border-border rounded-[16px_16px_16px_4px] text-foreground",
          message.streaming && "chat-streaming-cursor"
        )}
      >
        {message.content || (message.streaming ? "" : "…")}
      </div>
    </motion.div>
  );
}

export function EditorChatPanel({ documentContext }: EditorChatPanelProps) {
  const [messages, setMessages] = useState<ChatUiMessage[]>([]);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isWaiting, scrollToBottom]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = 20;
    const maxHeight = lineHeight * 4 + 16;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [input]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isWaiting || isStreaming) return;

      const userMsg: ChatUiMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
      };

      const assistantId = `assistant-${Date.now()}`;
      const assistantMsg: ChatUiMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        streaming: true,
      };

      const history = trimChatMessages([
        ...messages.map(({ role, content }) => ({ role, content })),
        { role: "user", content: trimmed },
      ]);

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setIsWaiting(true);
      setIsStreaming(false);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            documentContext,
          }),
          signal: controller.signal,
        });

        const contentType = res.headers.get("content-type") ?? "";

        if (!res.ok) {
          const err = contentType.includes("application/json")
            ? await res.json().catch(() => ({}))
            : { error: await res.text().catch(() => "Chat request failed") };
          const apiError = err.error || "Chat request failed";
          if (res.status === 429) {
            throw new Error(
              apiError.includes("rate limit") || apiError.includes("quota")
                ? apiError
                : "Gemini rate limit reached. Wait a minute and try again, or set GEMINI_MODEL=gemini-2.5-flash in .env."
            );
          }
          throw new Error(apiError);
        }

        if (!contentType.includes("text/plain")) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Unexpected chat response");
        }

        let started = false;

        await consumePlainTextStream(res, (delta) => {
          if (!started) {
            started = true;
            setIsWaiting(false);
            setIsStreaming(true);
          }
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + delta } : m
            )
          );
        });

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, streaming: false } : m
          )
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        let message = err instanceof Error ? err.message : "Chat failed";
        if (message.includes("404 Not Found") && message.includes("models/")) {
          message =
            "Gemini model unavailable. Add GEMINI_MODEL=gemini-2.0-flash to .env and restart the dev server.";
        }
        toast.error(message);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } finally {
        setIsWaiting(false);
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [documentContext, isStreaming, isWaiting, messages]
  );

  const handleClear = () => {
    if (messages.length === 0) return;
    if (!window.confirm("Clear all chat messages? This cannot be undone.")) return;
    abortRef.current?.abort();
    setMessages([]);
    setIsWaiting(false);
    setIsStreaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const hasInput = input.trim().length > 0;
  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="shrink-0 px-4 pt-3 pb-2 space-y-2 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground truncate">
              AI Assistant
            </span>
            <span className="ai-pulse-dot w-2 h-2 rounded-full bg-success shrink-0" />
          </div>
          <button
            type="button"
            onClick={handleClear}
            disabled={messages.length === 0}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-badge transition-colors disabled:opacity-30"
            title="Clear chat"
            aria-label="Clear chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-success bg-success-bg px-2 py-0.5 rounded-full">
          <span className="w-1 h-1 rounded-full bg-success" />
          Document context loaded
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-3">
        {isEmpty && !isWaiting && (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="space-y-2 pt-2"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
              Quick start
            </p>
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="w-full text-left text-[11px] leading-snug px-3 py-2 rounded-lg border border-border bg-background hover:border-foreground transition-colors"
              >
                {prompt}
              </button>
            ))}
          </motion.div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isWaiting && (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="flex gap-2"
          >
            <div
              className="shrink-0 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-[9px] font-bold"
              aria-hidden
            >
              AI
            </div>
            <TypingIndicator />
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 p-3 border-t border-border bg-surface">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your document..."
            disabled={isWaiting || isStreaming}
            className="flex-1 text-[12px] py-2 min-h-[40px] max-h-[96px]"
          />
          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={!hasInput || isWaiting || isStreaming}
            className={cn(
              "shrink-0 w-9 h-9 flex items-center justify-center rounded-lg transition-colors",
              hasInput && !isWaiting && !isStreaming
                ? "bg-foreground text-background hover:opacity-90"
                : "bg-badge text-muted-foreground cursor-not-allowed"
            )}
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

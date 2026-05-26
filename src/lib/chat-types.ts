export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface DocumentChatContext {
  title: string;
  contentExcerpt: string;
  wordCount: number;
  tone: string;
}

export const MAX_CHAT_MESSAGES = 20;

export function trimChatMessages(messages: ChatMessage[]): ChatMessage[] {
  if (messages.length <= MAX_CHAT_MESSAGES) return messages;
  return messages.slice(-MAX_CHAT_MESSAGES);
}

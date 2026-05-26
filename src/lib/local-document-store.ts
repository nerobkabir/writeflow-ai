import { countWordsFromHtml } from "@/lib/document-utils";
import type { DemoDocumentRecord } from "@/lib/demo-documents";

export type LocalDocumentRecord = DemoDocumentRecord;

declare global {
  // eslint-disable-next-line no-var
  var __writeflowLocalDocs: Map<string, LocalDocumentRecord> | undefined;
}

function getStore(): Map<string, LocalDocumentRecord> {
  if (!globalThis.__writeflowLocalDocs) {
    globalThis.__writeflowLocalDocs = new Map();
  }
  return globalThis.__writeflowLocalDocs;
}

export function createLocalDocument(
  userId: string,
  data: { title?: string; content?: string; templateId?: string | null }
): LocalDocumentRecord {
  const id = `local-${crypto.randomUUID()}`;
  const title = data.title || "Untitled Document";
  const content = data.content || "<h1>Untitled Document</h1><p></p>";
  const doc: LocalDocumentRecord = {
    id,
    userId,
    title,
    content,
    status: "DRAFT",
    wordCount: countWordsFromHtml(content),
    templateId: data.templateId ?? null,
    updatedAt: new Date().toISOString(),
    template: null,
  };
  getStore().set(id, doc);
  return doc;
}

export function getLocalDocument(
  id: string,
  userId: string
): LocalDocumentRecord | null {
  const doc = getStore().get(id);
  if (!doc || doc.userId !== userId) return null;
  return doc;
}

export function updateLocalDocument(
  id: string,
  userId: string,
  patch: Partial<Pick<LocalDocumentRecord, "title" | "content" | "wordCount">>
): LocalDocumentRecord | null {
  const existing = getLocalDocument(id, userId);
  if (!existing) return null;

  const content = patch.content ?? existing.content;
  const updated: LocalDocumentRecord = {
    ...existing,
    ...patch,
    content,
    wordCount:
      patch.wordCount !== undefined ? patch.wordCount : countWordsFromHtml(content),
    updatedAt: new Date().toISOString(),
  };
  getStore().set(id, updated);
  return updated;
}

export function listLocalDocuments(userId: string): LocalDocumentRecord[] {
  return Array.from(getStore().values()).filter((d) => d.userId === userId);
}

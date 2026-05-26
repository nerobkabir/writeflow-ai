import { countWordsFromHtml } from "@/lib/document-utils";

export interface DemoDocumentRecord {
  id: string;
  userId: string;
  title: string;
  content: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  wordCount: number;
  templateId: string | null;
  updatedAt: string;
  template?: null;
}

const DEMO_DOC_META: Array<{
  id: string;
  title: string;
  status: DemoDocumentRecord["status"];
  excerpt: string;
}> = [
  {
    id: "doc-1",
    title: "Q1 Operations Review Spec",
    status: "PUBLISHED",
    excerpt: "Annual Recurring Revenue (ARR): $42.6M (+14.2% YoY)...",
  },
  {
    id: "doc-2",
    title: "Consensus Engine Architecture",
    status: "DRAFT",
    excerpt:
      "This specification delineates a highly-available, distributed event streaming platform...",
  },
  {
    id: "doc-3",
    title: "SaaS Expansion Vision",
    status: "ARCHIVED",
    excerpt: "We do not measure time. We capture stability...",
  },
  {
    id: "doc-4",
    title: "User Acquisition Directive",
    status: "PUBLISHED",
    excerpt: "Actionable roadmap targeting growth multipliers within organic channels...",
  },
  {
    id: "doc-5",
    title: "Bio-Neurological Stim Protocol",
    status: "DRAFT",
    excerpt: "Transcranial Direct Current Stimulation (tDCS) evaluations...",
  },
  {
    id: "doc-6",
    title: "Quarterly Audit Ledger",
    status: "PUBLISHED",
    excerpt: "Review of global edge cloud expenses and server maintenance metrics...",
  },
];

function buildContent(title: string, excerpt: string): string {
  return `<h1>${title}</h1><p>${excerpt}</p><p>Edit this document in WriteFlow AI. When the database is connected, new documents are persisted to your account automatically.</p>`;
}

const DEMO_DOCUMENTS: DemoDocumentRecord[] = DEMO_DOC_META.map((meta) => {
  const content = buildContent(meta.title, meta.excerpt);
  return {
    id: meta.id,
    userId: "user-phase1",
    title: meta.title,
    content,
    status: meta.status,
    wordCount: countWordsFromHtml(content),
    templateId: null,
    updatedAt: new Date().toISOString(),
    template: null,
  };
});

export function isDemoDocumentId(id: string): boolean {
  return id.startsWith("doc-") && DEMO_DOCUMENTS.some((d) => d.id === id);
}

declare global {
  // eslint-disable-next-line no-var
  var __writeflowDemoOverrides: Map<string, DemoDocumentRecord> | undefined;
}

function overrideStore(): Map<string, DemoDocumentRecord> {
  if (!globalThis.__writeflowDemoOverrides) {
    globalThis.__writeflowDemoOverrides = new Map();
  }
  return globalThis.__writeflowDemoOverrides;
}

export function getDemoDocument(id: string, userId: string): DemoDocumentRecord | null {
  const overridden = overrideStore().get(id);
  if (overridden) return { ...overridden, userId };

  const doc = DEMO_DOCUMENTS.find((d) => d.id === id);
  if (!doc) return null;
  return { ...doc, userId };
}

export function patchDemoDocument(
  id: string,
  userId: string,
  patch: Partial<Pick<DemoDocumentRecord, "title" | "content" | "wordCount">>
): DemoDocumentRecord | null {
  const base = getDemoDocument(id, userId);
  if (!base) return null;

  const content = patch.content ?? base.content;
  const updated: DemoDocumentRecord = {
    ...base,
    ...patch,
    content,
    wordCount:
      patch.wordCount !== undefined ? patch.wordCount : countWordsFromHtml(content),
    updatedAt: new Date().toISOString(),
    userId,
  };
  overrideStore().set(id, updated);
  return updated;
}

export function listDemoDocuments(userId: string): DemoDocumentRecord[] {
  return DEMO_DOCUMENTS.map((d) => ({ ...d, userId }));
}

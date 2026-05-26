import type { DocStatus } from "@prisma/client";

export type DocumentTypeBadge = "REPORT" | "DOCS" | "CREATIVE" | "SOCIAL";

export type DisplayStatus = "FINALIZED" | "DRAFTING" | "ARCHIVED";

const CATEGORY_TO_TYPE: Record<string, DocumentTypeBadge> = {
  business: "REPORT",
  technical: "DOCS",
  marketing: "SOCIAL",
  creative: "CREATIVE",
  email: "DOCS",
  ads: "SOCIAL",
};

export function docStatusToDisplay(status: DocStatus | string): DisplayStatus {
  const s = String(status).toUpperCase();
  if (s === "PUBLISHED") return "FINALIZED";
  if (s === "ARCHIVED") return "ARCHIVED";
  return "DRAFTING";
}

export function filterStatusToPrisma(
  filter: string
): DocStatus | undefined {
  const f = filter.toLowerCase();
  if (f === "published") return "PUBLISHED";
  if (f === "draft") return "DRAFT";
  if (f === "archived") return "ARCHIVED";
  return undefined;
}

export function inferDocumentType(
  category?: string | null,
  tags?: string[]
): DocumentTypeBadge {
  if (category) {
    const key = category.toLowerCase();
    if (CATEGORY_TO_TYPE[key]) return CATEGORY_TO_TYPE[key];
  }
  const tag = tags?.[0]?.toLowerCase() ?? "";
  if (tag.includes("social")) return "SOCIAL";
  if (tag.includes("creative")) return "CREATIVE";
  if (tag.includes("report")) return "REPORT";
  return "DOCS";
}

export function formatDocumentDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

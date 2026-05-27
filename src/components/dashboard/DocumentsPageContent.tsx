"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  FileText,
  Search,
  MoreHorizontal,
  FileSearch,
  Zap,
  Square,
  Circle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  docStatusToDisplay,
  formatDocumentDate,
  inferDocumentType,
  type DisplayStatus,
} from "@/lib/document-display";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "draft" | "published" | "archived";

interface DocumentRow {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
  wordCount: number;
  tags?: string[];
  template?: { title: string; category: string | null; aiModel?: string } | null;
}

const FILTERS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "published", label: "Published" },
  { id: "archived", label: "Archived" },
];

function StatusCell({ status }: { status: DisplayStatus }) {
  if (status === "FINALIZED") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide">
        <Square className="w-3 h-3 fill-foreground stroke-foreground" />
        Finalized
      </span>
    );
  }
  if (status === "ARCHIVED") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        <Circle className="w-3 h-3" />
        Archived
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide">
      <Square className="w-3 h-3" />
      Drafting
    </span>
  );
}

function DocumentActionsMenu({
  doc,
  onRefresh,
}: {
  doc: DocumentRow;
  onRefresh: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const runAction = async (action: () => Promise<void>) => {
    setLoading(true);
    try {
      await action();
      onRefresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    } finally {
      setLoading(false);
      setOpen(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-md hover:bg-badge transition-colors"
        aria-label="Actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 w-40 bg-surface border border-border rounded-lg shadow-lg py-1 text-[12px] font-semibold">
            <button
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-badge"
              onClick={() => {
                setOpen(false);
                router.push(`/documents/${doc.id}`);
              }}
            >
              Open
            </button>
            <button
              type="button"
              disabled={loading}
              className="w-full text-left px-3 py-2 hover:bg-badge disabled:opacity-50"
              onClick={() =>
                runAction(async () => {
                  const res = await fetch(`/api/documents/${doc.id}/duplicate`, {
                    method: "POST",
                  });
                  if (!res.ok) throw new Error("Duplicate failed");
                  toast.success("Document duplicated");
                })
              }
            >
              Duplicate
            </button>
            <button
              type="button"
              disabled={loading}
              className="w-full text-left px-3 py-2 hover:bg-badge disabled:opacity-50"
              onClick={() =>
                runAction(async () => {
                  const res = await fetch(`/api/documents/${doc.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "ARCHIVED" }),
                  });
                  if (!res.ok) throw new Error("Archive failed");
                  toast.success("Document archived");
                })
              }
            >
              Archive
            </button>
            <button
              type="button"
              className="w-full text-left px-3 py-2 text-error hover:bg-error-bg"
              onClick={() => {
                setOpen(false);
                setConfirmDelete(true);
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40">
          <div className="bg-surface border border-border rounded-xl p-5 max-w-sm w-full shadow-xl">
            <p className="font-bold text-[15px]">Delete document?</p>
            <p className="text-[13px] text-muted-foreground mt-1">
              This will permanently remove &quot;{doc.title}&quot;. This cannot be undone.
            </p>
            <div className="flex gap-2 mt-4 justify-end">
              <button
                type="button"
                className="px-3 py-2 text-[12px] font-bold border border-border rounded-lg"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                className="px-3 py-2 text-[12px] font-bold bg-error text-white rounded-lg disabled:opacity-50"
                onClick={() =>
                  runAction(async () => {
                    const res = await fetch(`/api/documents/${doc.id}`, {
                      method: "DELETE",
                    });
                    if (!res.ok) throw new Error("Delete failed");
                    toast.success("Document deleted");
                  })
                }
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function DocumentsPageContent() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [page, setPage] = useState(1);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tableKey, setTableKey] = useState(0);
  const [tbodyRef] = useAutoAnimate<HTMLTableSectionElement>();
  const [usagePercent, setUsagePercent] = useState(0);
  const pageSize = 10;

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
        status: filter,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      });
      const res = await fetch(`/api/documents?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");

      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 300 - elapsed);
      await new Promise((resolve) => setTimeout(resolve, delay));

      setDocuments(data.documents ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [page, filter, debouncedSearch]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  useEffect(() => {
    setPage(1);
  }, [filter, debouncedSearch]);

  useEffect(() => {
    const t = requestAnimationFrame(() => setUsagePercent(84));
    return () => cancelAnimationFrame(t);
  }, []);

  const handlePageChange = (next: number) => {
    setTableKey((k) => k + 1);
    setPage(next);
  };

  const showingFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, total);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24 md:pb-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your professional AI-assisted workflows.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="pl-9 pr-4 py-2 w-full sm:w-56 text-[13px] rounded-lg border border-border bg-surface outline-none focus:border-foreground"
            />
          </div>
          <button
            type="button"
            className="px-4 py-2 text-[12px] font-bold border border-border rounded-lg hover:border-foreground active:scale-[0.97] transition-all duration-100 focus-visible:ring-2 focus-visible:ring-ring outline-none select-none whitespace-nowrap"
            onClick={() => toast.info("Export coming soon")}
          >
            Export All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.45fr] gap-4 md:gap-6">
        <div className="border border-border rounded-xl bg-surface p-6 flex flex-col justify-between min-h-[200px]">
          <div>
            <span className="text-xs tracking-widest uppercase font-medium border border-border px-2 py-0.5 rounded text-muted-foreground">
              Featured
            </span>
            <h2 className="text-xl font-semibold mt-4">Generate Technical Whitepaper</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-lg">
              Our specialized Intelligence Pro engine can now draft full technical
              specifications from minimal architectural notes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/documents/new"
              className="px-4 py-2.5 bg-foreground text-background text-[12px] font-bold rounded-lg active:scale-[0.97] transition-all duration-100 inline-block"
            >
              Start Drafting
            </Link>
            <Link
              href="/explore"
              className="px-4 py-2.5 text-[12px] font-bold text-muted-foreground hover:text-foreground active:scale-[0.97] transition-all duration-100 inline-block"
            >
              View Samples →
            </Link>
          </div>
        </div>
        <div className="rounded-xl bg-foreground text-background p-6 flex flex-col justify-between min-h-[200px]">
          <div>
            <Zap className="w-6 h-6 mb-3" />
            <p className="font-bold text-[15px]">Usage Analytics</p>
            <p className="text-[12px] opacity-80 mt-2 leading-relaxed">
              You have utilized 84% of your high-priority tokens for this cycle.
            </p>
          </div>
          <div className="mt-4">
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${usagePercent}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] mt-2 opacity-60">
              Resets in 4 days
            </p>
          </div>
        </div>
      </div>

      <div className="relative inline-flex p-1 rounded-full border border-border bg-background">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "relative z-10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide rounded-full transition-colors active:scale-[0.97] duration-100",
              filter === f.id ? "text-background" : "text-muted-foreground"
            )}
          >
            {filter === f.id && (
              <motion.span
                layoutId="filterTab"
                className="absolute inset-0 bg-foreground rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{f.label}</span>
          </button>
        ))}
      </div>

      <div className="border border-border rounded-xl bg-surface overflow-hidden">
        {loading && documents.length === 0 ? (
          <div className="w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {["Name", "Last Modified", "Type", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-xs tracking-widest uppercase font-medium text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-border last:border-0">
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3 animate-pulse">
                        <div className="w-5 h-5 rounded bg-muted shrink-0 mt-0.5" />
                        <div className="space-y-2 flex-grow max-w-[200px]">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 animate-pulse">
                        <div className="w-3 h-3 bg-muted rounded" />
                        <div className="h-3 w-12 bg-muted rounded" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-8 h-8 bg-muted rounded animate-pulse" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : documents.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center px-4">
            <FileSearch className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">No documents yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start writing your first document →
            </p>
            <Link
              href="/documents/new"
              className="px-4 py-2.5 bg-foreground text-background text-[12px] font-bold rounded-lg active:scale-[0.97] transition-all duration-100"
            >
              Create New
            </Link>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tableKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    {["Name", "Last Modified", "Type", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody ref={tbodyRef}>
                  {documents.map((doc) => {
                    const type = inferDocumentType(
                      doc.template?.category,
                      doc.tags
                    );
                    const model =
                      doc.template?.aiModel ?? "gemini-2.5-flash";
                    return (
                      <tr
                        key={doc.id}
                        className="border-b border-border last:border-0 hover:bg-badge/40 transition-colors duration-100"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 shrink-0 mt-0.5 text-muted-foreground" />
                            <div>
                              <Link
                                href={`/documents/${doc.id}`}
                                className="font-bold text-[14px] hover:underline"
                              >
                                {doc.title}
                              </Link>
                              <p className="text-[12px] text-muted-foreground mt-0.5">
                                Intelligence Engine: {model}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[13px] text-muted-foreground">
                          {formatDocumentDate(doc.updatedAt)}
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-[11px] font-bold uppercase tracking-wide border border-border px-2 py-0.5 rounded-full">
                            {type}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <StatusCell status={docStatusToDisplay(doc.status)} />
                        </td>
                        <td className="px-4 py-4">
                          <DocumentActionsMenu doc={doc} onRefresh={fetchDocs} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Showing {showingFrom}–{showingTo} of {total} documents
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              className="p-2 rounded-full border border-border disabled:opacity-30 hover:border-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePageChange(p)}
                className={cn(
                  "w-8 h-8 rounded-full text-[12px] font-bold transition-colors",
                  page === p
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-badge"
                )}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="p-2 rounded-full border border-border disabled:opacity-30 hover:border-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

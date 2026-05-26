"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileSearch, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AgentFilter = "all" | "draft" | "rewrite" | "chat" | "summarise";

interface UsageRow {
  id: string;
  agentType: string;
  promptSnippet: string;
  tokensUsed: number;
  createdAt: string;
}

const AGENT_FILTERS: { id: AgentFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "rewrite", label: "Rewrite" },
  { id: "chat", label: "Chat" },
  { id: "summarise", label: "Summarise" },
];

const AGENT_BADGE: Record<string, string> = {
  DRAFT: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
  REWRITE: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  CHAT: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  SUMMARISE: "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300",
};

function tokenColor(n: number): string {
  if (n < 500) return "text-success font-bold";
  if (n <= 1000) return "text-warning font-bold";
  return "text-error font-bold";
}

function formatUsageDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).replace(",", " ·");
}

export function UsageHistoryPageContent() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agent, setAgent] = useState<AgentFilter>("all");
  const [applied, setApplied] = useState({ startDate: "", endDate: "", agent: "all" as AgentFilter });
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<UsageRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tableKey, setTableKey] = useState(0);

  const fetchUsage = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (applied.agent !== "all") params.set("agent", applied.agent);
      if (applied.startDate) params.set("startDate", applied.startDate);
      if (applied.endDate) params.set("endDate", applied.endDate);

      const res = await fetch(`/api/ai/usage?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, applied]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const applyFilters = () => {
    setPage(1);
    setTableKey((k) => k + 1);
    setApplied({ startDate, endDate, agent });
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 md:pb-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Usage History</h1>
        <p className="text-[14px] text-muted-foreground mt-1">
          Track every AI request across your workspace.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 p-4 border border-border rounded-xl bg-surface">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Start date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block px-3 py-2 text-[13px] rounded-lg border border-border bg-background"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            End date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block px-3 py-2 text-[13px] rounded-lg border border-border bg-background"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Agent type
          </label>
          <select
            value={agent}
            onChange={(e) => setAgent(e.target.value as AgentFilter)}
            className="mt-1 block px-3 py-2 text-[13px] rounded-lg border border-border bg-background min-w-[140px]"
          >
            {AGENT_FILTERS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={applyFilters}
          className="px-4 py-2 bg-foreground text-background text-[12px] font-bold rounded-lg hover:opacity-90"
        >
          Apply Filters
        </button>
      </div>

      <div className="border border-border rounded-xl bg-surface overflow-hidden">
        {loading && items.length === 0 ? (
          <p className="py-16 text-center text-[13px] text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <div className="py-20 text-center px-4">
            <FileSearch className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="font-bold">No AI usage recorded yet</p>
            <p className="text-[13px] text-muted-foreground mt-1">
              Start using the AI Writer to see your history here
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tableKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Date", "Agent", "Prompt Snippet", "Tokens Used"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border last:border-0 hover:bg-badge/30"
                    >
                      <td className="px-4 py-3 text-[13px] text-muted-foreground whitespace-nowrap">
                        {formatUsageDate(row.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                            AGENT_BADGE[row.agentType] ?? "bg-badge"
                          )}
                        >
                          {row.agentType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[13px] max-w-md">
                        <span title={row.promptSnippet}>
                          {row.promptSnippet.length > 60
                            ? `${row.promptSnippet.slice(0, 60)}…`
                            : row.promptSnippet}
                        </span>
                      </td>
                      <td className={cn("px-4 py-3 text-[13px]", tokenColor(row.tokensUsed))}>
                        {row.tokensUsed.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Page {page} of {totalPages} · {total} records
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => {
                setTableKey((k) => k + 1);
                setPage((p) => p - 1);
              }}
              className="p-2 rounded-full border border-border disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => {
                setTableKey((k) => k + 1);
                setPage((p) => p + 1);
              }}
              className="p-2 rounded-full border border-border disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion as motionFramer } from "framer-motion";
import {
  Search, Plus, FileText, ChevronRight, MoreHorizontal,
  Trash2, ExternalLink, Filter, ArrowUpDown, ChevronLeft, ChevronRight as ChevronRightIcon
} from "lucide-react";

interface DocumentItem {
  id: string;
  title: string;
  category: string;
  words: number;
  updatedAt: string;
  status: "Draft" | "Published" | "Archived";
  excerpt: string;
}

const mockDocuments: DocumentItem[] = [
  {
    id: "doc-1",
    title: "Q1 Operations Review Spec",
    category: "Business",
    words: 850,
    updatedAt: "May 24, 2026",
    status: "Published",
    excerpt: "Annual Recurring Revenue (ARR): $42.6M (+14.2% YoY)...",
  },
  {
    id: "doc-2",
    title: "Consensus Engine Architecture",
    category: "Technical",
    words: 2450,
    updatedAt: "May 22, 2026",
    status: "Draft",
    excerpt: "This specification delineates a highly-available, distributed event streaming platform...",
  },
  {
    id: "doc-3",
    title: "SaaS Expansion Vision",
    category: "Marketing",
    words: 1100,
    updatedAt: "May 19, 2026",
    status: "Archived",
    excerpt: "We do not measure time. We capture stability. In a universe of accelerating noise...",
  },
  {
    id: "doc-4",
    title: "User Acquisition Directive",
    category: "Marketing",
    words: 950,
    updatedAt: "May 15, 2026",
    status: "Published",
    excerpt: "Actionable roadmap targeting growth multipliers within organic channels...",
  },
  {
    id: "doc-5",
    title: "Bio-Neurological Stim Protocol",
    category: "Creative",
    words: 1850,
    updatedAt: "May 10, 2026",
    status: "Draft",
    excerpt: "Transcranial Direct Current Stimulation (tDCS) evaluations in clinical trials...",
  },
  {
    id: "doc-6",
    title: "Quarterly Audit Ledger",
    category: "Business",
    words: 1200,
    updatedAt: "May 02, 2026",
    status: "Published",
    excerpt: "Review of global edge cloud expenses and server maintenance metrics...",
  },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("recent"); // recent, size, title
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const itemsPerPage = 5;

  const handleArchive = (id: string) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === id ? { ...doc, status: "Archived" as const } : doc
      )
    );
    setMenuOpenId(null);
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
    setMenuOpenId(null);
  };

  // Filter & Sort Logic
  const filteredDocs = documents
    .filter((doc) => {
      const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
                            doc.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || doc.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "size") return b.words - a.words;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      // default: recent (simulated order in array)
      return b.id.localeCompare(a.id);
    });

  // Pagination calculation
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortBy]);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Documents</h1>
          <p className="text-[13.5px] text-muted-foreground mt-1">
            Analyze, deploy, edit, and organize all generated content drafts within the workspace.
          </p>
        </div>
        <Link
          href="/documents/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-background rounded-lg font-bold text-[13px] hover:opacity-90 transition-opacity w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Document</span>
        </Link>
      </div>

      {/* Filters & search line */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[13px] rounded-lg bg-surface border border-border focus:border-accent outline-none transition-colors"
          />
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Buttons */}
          <div className="flex rounded-lg border border-border bg-surface p-0.5 text-[12px] font-semibold shrink-0">
            {["All", "Published", "Draft", "Archived"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  statusFilter === st
                    ? "bg-badge text-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort By Select */}
          <div className="relative shrink-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">
              SORT:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-14 pr-4 py-2 text-[12.5px] rounded-lg bg-surface border border-border focus:border-accent outline-none appearance-none cursor-pointer"
            >
              <option value="recent">Recent</option>
              <option value="size">Word Count</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Files Table */}
      <div className="border border-border bg-surface rounded-xl shadow-sm overflow-hidden">
        {paginatedDocs.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-surface/50">
            <p className="text-muted-foreground text-[14px]">
              No documents matching the current search parameters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setSortBy("recent");
              }}
              className="text-[13px] font-semibold text-foreground underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {paginatedDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-badge/10 transition-colors"
              >
                {/* Info block */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/documents/${doc.id}`}
                      className="font-bold text-[15px] hover:underline text-foreground leading-tight truncate block"
                    >
                      {doc.title}
                    </Link>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-badge px-1.5 py-0.5 rounded">
                      {doc.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        doc.status === "Published"
                          ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                          : doc.status === "Draft"
                          ? "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300"
                          : "bg-neutral-100 dark:bg-neutral-900 text-neutral-500"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-[13px] text-muted-foreground line-clamp-1 leading-relaxed">
                    {doc.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-[12px] text-muted-foreground font-semibold pt-1">
                    <span className="font-mono">{doc.words.toLocaleString()} words</span>
                    <span>•</span>
                    <span>Updated {doc.updatedAt}</span>
                  </div>
                </div>

                {/* Operations side */}
                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 relative">
                  <Link
                    href={`/documents/${doc.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-background hover:border-accent text-foreground font-semibold text-[12.5px] rounded-lg transition-colors"
                  >
                    <span>Edit File</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === doc.id ? null : doc.id)}
                      className="w-8 h-8 flex items-center justify-center border border-border bg-background rounded-lg text-muted-foreground hover:text-foreground hover:border-accent"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {menuOpenId === doc.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setMenuOpenId(null)} />
                        <div className="absolute right-0 top-full mt-1.5 w-36 bg-surface border border-border rounded-lg shadow-lg overflow-hidden z-50">
                          <button
                            onClick={() => handleArchive(doc.id)}
                            className="w-full text-left px-3 py-2 text-[12.5px] hover:bg-badge text-foreground transition-colors flex items-center gap-2"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Archive</span>
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="w-full text-left px-3 py-2 text-[12.5px] hover:bg-error-bg text-error transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-6 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-[12.5px] font-semibold hover:border-accent disabled:opacity-50 disabled:hover:border-border transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <span className="text-[12.5px] text-muted-foreground font-semibold">
            Page <strong className="text-foreground">{currentPage}</strong> of{" "}
            <strong className="text-foreground">{totalPages}</strong>
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-[12.5px] font-semibold hover:border-accent disabled:opacity-50 disabled:hover:border-border transition-colors"
          >
            <span>Next</span>
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

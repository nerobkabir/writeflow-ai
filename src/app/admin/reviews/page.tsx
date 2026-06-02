"use client";

import { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Check, X, Search, Sparkles, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type Review = {
  id: string;
  rating: number;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  template: {
    id: string;
    title: string;
  };
};

type SummaryPayload = {
  bullets: string[];
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  reviewCount: number;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // AI summary states
  const [summarizing, setSummarizing] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryPayload | null>(null);

  const [tbodyRef] = useAutoAnimate<HTMLTableSectionElement>();

  // Fetch reviews list
  const fetchReviews = () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      status,
      template: search,
    });
    fetch(`/api/admin/reviews?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setReviews(d.reviews ?? []);
        setTotalPages(d.totalPages ?? 1);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, [page, status, search]);

  // Patch review status (approve or reject) with optimistic updates
  const patchReviewStatus = async (id: string, newStatus: "PENDING" | "APPROVED" | "REJECTED") => {
    const originalReviews = [...reviews];

    // Optimistically update
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error();
      toast.success(`Review ${newStatus.toLowerCase()} successfully`);
    } catch {
      toast.error("Failed to update review status. Reverting...");
      setReviews(originalReviews);
    }
  };

  // Summarize Reviews via Real AI endpoint
  const handleSummarise = async () => {
    setSummarizing(true);
    try {
      const res = await fetch("/api/ai/summarise-reviews", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Synthesis failed");
      const data = await res.json();
      setSummaryData(data);
      toast.success("Reviews analyzed successfully!");
    } catch (err) {
      toast.error("Could not summarize reviews. Make sure you have approved reviews.");
    } finally {
      setSummarizing(false);
    }
  };

  const statusBadges = {
    PENDING: "bg-warning-bg text-warning border border-warning/10",
    APPROVED: "bg-success-bg text-success border border-success/10",
    REJECTED: "bg-error-bg text-error border border-error/10",
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Reviews</h1>
          <p className="text-sm text-muted-foreground">Approve, reject, and summarize public template reviews.</p>
        </div>

        <button
          onClick={handleSummarise}
          disabled={summarizing}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-semibold hover:bg-foreground/90 disabled:opacity-50 transition-all duration-200 shadow-sm"
        >
          {summarizing ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
              <span>Analysing reviews...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Summarise Reviews</span>
            </>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Filter by template name..."
            className="h-10 w-full sm:w-[240px] rounded-lg border border-border bg-surface pl-9 pr-4 text-sm focus:border-foreground focus:outline-none transition-colors"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="h-10 w-full sm:w-auto rounded-lg border border-border bg-surface px-3 text-sm focus:border-foreground focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Reviews — Desktop Table (hidden on mobile) */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-badge text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Template</th>
                <th className="px-5 py-4">Rating (★)</th>
                <th className="px-5 py-4">Comment</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody ref={tbodyRef} className="divide-y divide-border">
              {loading && reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 rounded-full border-2 border-border border-t-accent animate-spin" />
                      <span>Loading template reviews...</span>
                    </div>
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <p className="font-semibold text-foreground">No reviews found</p>
                      <p className="text-xs">Adjust your search criteria or review filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-badge/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{review.user?.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{review.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground truncate max-w-[150px]">
                      {review.template?.title}
                    </td>
                    <td className="px-5 py-3.5 shrink-0">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx < review.rating ? "fill-amber-500 text-amber-500" : "text-border"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs leading-relaxed max-w-[280px] break-words">
                      {review.comment}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                          statusBadges[review.status]
                        }`}
                      >
                        {review.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5 shrink-0">
                      {review.status === "PENDING" ? (
                        <>
                          <button
                            onClick={() => patchReviewStatus(review.id, "APPROVED")}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-success hover:border-success hover:bg-success-bg transition-all"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => patchReviewStatus(review.id, "REJECTED")}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-error hover:border-error hover:bg-error-bg transition-all"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => patchReviewStatus(review.id, "PENDING")}
                          className="text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:underline transition-all"
                        >
                          Reset Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reviews — Mobile Cards (hidden on desktop) */}
      <div className="md:hidden space-y-3">
        {loading && reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-2 text-muted-foreground">
            <div className="w-6 h-6 rounded-full border-2 border-border border-t-accent animate-spin" />
            <span className="text-sm">Loading reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-1 text-muted-foreground">
            <MessageSquare className="w-8 h-8 opacity-30" />
            <p className="font-semibold text-foreground text-sm">No reviews found</p>
            <p className="text-xs">Adjust your filters to see results.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-border bg-surface p-4 shadow-sm space-y-3"
            >
              {/* Card Header: User + Status */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{review.user?.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{review.user?.email}</p>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                    statusBadges[review.status]
                  }`}
                >
                  {review.status}
                </span>
              </div>

              {/* Template + Stars */}
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-foreground truncate">{review.template?.title}</p>
                <div className="flex items-center gap-0.5 shrink-0">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3 h-3 ${
                        idx < review.rating ? "fill-amber-500 text-amber-500" : "text-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              {review.comment && (
                <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-2">
                  {review.comment}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                {review.status === "PENDING" ? (
                  <>
                    <button
                      onClick={() => patchReviewStatus(review.id, "APPROVED")}
                      className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg border border-border bg-surface text-xs font-semibold text-muted-foreground hover:text-success hover:border-success hover:bg-success-bg transition-all"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => patchReviewStatus(review.id, "REJECTED")}
                      className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg border border-border bg-surface text-xs font-semibold text-muted-foreground hover:text-error hover:border-error hover:bg-error-bg transition-all"
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => patchReviewStatus(review.id, "PENDING")}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline transition-all"
                  >
                    Reset Status
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-border/60 pt-4">
        <p className="text-xs text-muted-foreground">
          Showing Page <span className="font-semibold text-foreground">{page}</span> of{" "}
          <span className="font-semibold text-foreground">{totalPages}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-badge transition-colors disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-badge transition-colors disabled:opacity-40"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>

      {/* Custom AI Summarizer Dialog Modal */}
      <AnimatePresence>
        {summaryData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSummaryData(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl relative z-10 space-y-6"
            >
              <div className="flex items-start justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                    <MessageSquare className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold tracking-tight text-foreground">Review Summary</h2>
                    <p className="text-[10px] text-muted-foreground">AI synthesis of {summaryData.reviewCount} approved customer reviews</p>
                  </div>
                </div>
                <button
                  onClick={() => setSummaryData(null)}
                  className="rounded-lg p-1.5 hover:bg-badge text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 3-Bullet Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key Themes</h3>
                <ul className="space-y-2">
                  {summaryData.bullets.map((bullet, idx) => (
                    <li key={idx} className="text-xs leading-relaxed text-foreground/90 pl-1.5 flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>{bullet.replace(/^-\s*/, "")}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sentiment Analysis */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sentiment Distribution</h3>
                
                {/* Horizontal Segment Bar */}
                <div className="h-3.5 w-full flex rounded-full overflow-hidden bg-badge border border-border">
                  <div
                    style={{ width: `${summaryData.sentiment.positive}%` }}
                    className="bg-success transition-all duration-500"
                    title={`Positive: ${summaryData.sentiment.positive}%`}
                  />
                  <div
                    style={{ width: `${summaryData.sentiment.neutral}%` }}
                    className="bg-warning transition-all duration-500"
                    title={`Neutral: ${summaryData.sentiment.neutral}%`}
                  />
                  <div
                    style={{ width: `${summaryData.sentiment.negative}%` }}
                    className="bg-error transition-all duration-500"
                    title={`Negative: ${summaryData.sentiment.negative}%`}
                  />
                </div>

                {/* Colored Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg border border-success/10 px-2.5 py-0.5 text-[10px] font-bold text-success">
                    Positive {summaryData.sentiment.positive}%
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-bg border border-warning/10 px-2.5 py-0.5 text-[10px] font-bold text-warning">
                    Neutral {summaryData.sentiment.neutral}%
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-error-bg border border-error/10 px-2.5 py-0.5 text-[10px] font-bold text-error">
                    Negative {summaryData.sentiment.negative}%
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-border/80">
                <button
                  className="rounded-xl bg-foreground hover:bg-foreground/90 px-4 py-2.5 text-xs font-bold text-background transition-colors shadow-sm"
                  onClick={() => setSummaryData(null)}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

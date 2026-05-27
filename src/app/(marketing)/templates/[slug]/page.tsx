"use client";

import React, { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ChevronRight,
  Check,
  Copy,
  Tag,
  Cpu,
  FileText,
  MessageSquare,
  BarChart3,
  Sparkles,
  Briefcase,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { StarPicker } from "@/components/templates/StarPicker";
import { RatingDistribution } from "@/components/templates/RatingDistribution";
import { RelatedTemplates } from "@/components/templates/RelatedTemplates";
import { scaleIn } from "@/lib/animations";
import type { Review, RatingBar, Template, TemplateDetail } from "@/lib/templates-data";
import { mapCategoryToFrontend } from "@/lib/templates-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Sparkles,
  Cpu,
  Briefcase,
};

interface TemplateDetailResponse {
  template: TemplateDetail;
  reviews: Review[];
  reviewCount: number;
  averageRating: number;
  ratingDistribution: RatingBar[];
  relatedTemplates: Template[];
}

function renderStars(rating: number, size = "w-4 h-4") {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < rounded ? "fill-foreground text-foreground" : "text-border"}`}
        />
      ))}
    </div>
  );
}

export default function TemplateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { data: session, status: authStatus } = useSession();

  const [data, setData] = useState<TemplateDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [copied, setCopied] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewListRef] = useAutoAnimate({ duration: 280, easing: "ease-out" });

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/templates/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const json: TemplateDetailResponse = await res.json();
        if (active) {
          setData(json);
          setReviews(json.reviews);
        }
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [slug]);

  const handleCopy = async () => {
    if (!data?.template.sampleOutput) return;
    await navigator.clipboard.writeText(data.template.sampleOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim() || reviewComment.length > 500) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/templates/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to submit review");
        return;
      }

      const { review } = await res.json();
      setReviews((prev) => [review, ...prev]);
      setReviewComment("");
      setReviewRating(5);
      toast.success("Review submitted successfully");
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-2">Template not found</h1>
          <p className="text-muted-foreground text-sm mb-6">
            The template you are looking for does not exist.
          </p>
          <Link href="/explore" className="text-sm font-bold underline">
            Back to Explore
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const { template, reviewCount, averageRating, ratingDistribution, relatedTemplates } = data;
  const categoryLabel = mapCategoryToFrontend(template.category);
  const categoryHref = `/explore?category=${encodeURIComponent(categoryLabel)}`;

  const metaPills = [
    { icon: Tag, label: categoryLabel },
    { icon: Cpu, label: template.modelDisplayName },
    { icon: FileText, label: template.estimatedWords },
    { icon: MessageSquare, label: template.tone },
  ];

  const sidebarRows = [
    { icon: Tag, label: "Category", value: categoryLabel },
    { icon: Cpu, label: "AI Model", value: template.modelDisplayName },
    { icon: MessageSquare, label: "Tone", value: template.tone },
    { icon: FileText, label: "Estimated Words", value: template.estimatedWords },
    { icon: BarChart3, label: "Usage Count", value: template.usageCount.toLocaleString() },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-1 text-[13px] mb-8" aria-label="Breadcrumb">
          <Link href="/explore" className="font-medium text-foreground hover:underline">
            Explore
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <Link href={categoryHref} className="font-medium text-foreground hover:underline">
            {categoryLabel}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground font-medium truncate max-w-[200px] sm:max-w-none">
            {template.name}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          {/* Main content — 65% */}
          <div className="lg:w-[65%] space-y-10">
            {/* Hero */}
            <section className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight text-foreground leading-tight">
                {template.name}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground max-w-2xl">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {metaPills.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-full bg-surface"
                  >
                    <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {label}
                  </span>
                ))}
              </div>
            </section>

            {/* Overview */}
            <section className="space-y-6">
              <div>
                <h4 className="text-base font-semibold mb-2">What this template is for</h4>
                <p className="text-base leading-relaxed text-muted-foreground">{template.overview}</p>
              </div>
              <div>
                <h4 className="text-base font-semibold mb-3">Best suited for</h4>
                <ul className="space-y-2.5">
                  {template.bestSuitedFor.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-base leading-relaxed text-muted-foreground">
                      <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Sample AI Output */}
            <section>
              <div className="relative rounded-xl border border-border bg-[#111111] dark:bg-black overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    AI Generated Sample
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-white/5"
                    aria-label="Copy sample output"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {copied ? (
                        <motion.span
                          key="check"
                          variants={scaleIn}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="flex items-center gap-1.5 text-success"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Copied
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          variants={scaleIn}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="flex items-center gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
                <pre className="p-5 font-mono text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed min-h-[200px]">
                  {template.sampleOutput}
                </pre>
                <p className="absolute bottom-4 right-5 text-[11px] text-muted-foreground">
                  Generated by {template.modelDisplayName}
                </p>
              </div>
            </section>

            {/* Reviews */}
            <section className="space-y-8 pt-2">
              <div className="flex flex-wrap items-end gap-4">
                <span className="text-4xl font-black tracking-tight">{averageRating.toFixed(1)}</span>
                <div className="space-y-1 pb-1">
                  {renderStars(averageRating, "w-5 h-5")}
                  <p className="text-[13px] text-muted-foreground">({reviewCount} reviews)</p>
                </div>
              </div>

              <div ref={reviewListRef} className="space-y-4">
                {reviews.map((rev, index) => (
                  <motion.article
                    key={rev.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: index * 0.08 }}
                    layout
                    className="border border-border bg-surface rounded-xl p-5"
                  >
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-badge border border-border flex items-center justify-center text-[12px] font-bold shrink-0">
                        {rev.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <p className="font-bold text-[14px]">{rev.name}</p>
                          <span className="text-[11px] text-muted-foreground">{rev.date}</span>
                        </div>
                        <div className="mb-2">{renderStars(rev.rating, "w-3.5 h-3.5")}</div>
                        <p className="text-[13px] text-muted-foreground leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Review form */}
              <div className="border border-border bg-surface rounded-xl p-6">
                <h4 className="text-base font-semibold mb-4 text-foreground">Leave a Review</h4>
                {authStatus === "authenticated" ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <StarPicker
                      value={reviewRating}
                      hoverValue={hoverRating}
                      onChange={setReviewRating}
                      onHover={setHoverRating}
                      onHoverEnd={() => setHoverRating(0)}
                    />
                    <div>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value.slice(0, 500))}
                        rows={4}
                        minLength={10}
                        maxLength={500}
                        required
                        placeholder="Share your experience with this template..."
                        className="w-full px-3 py-2.5 text-[13px] rounded-lg bg-background border border-border focus:border-accent outline-none resize-none min-h-[96px]"
                      />
                      <p className="text-right text-[11px] text-muted-foreground mt-1">
                        {reviewComment.length}/500
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting || reviewComment.trim().length < 10}
                      className="px-5 py-2.5 bg-foreground text-background font-bold text-[13px] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                    >
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      Submit Review
                    </button>
                  </form>
                ) : (
                  <p className="text-[13px] text-muted-foreground">
                    <Link href="/login" className="font-bold text-foreground underline">
                      Sign in
                    </Link>{" "}
                    to leave a review for this template.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar — 35% */}
          <aside className="lg:w-[35%] space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Link
              href={`/documents/new?template=${template.id}`}
              className="block w-full text-center py-4 bg-foreground text-background font-bold text-[15px] rounded-xl hover:opacity-90 transition-opacity"
            >
              Use This Template
            </Link>

            <div className="border border-border bg-surface rounded-xl p-6 space-y-4">
              <h4 className="text-base font-semibold tracking-tight text-foreground">Key Information</h4>
              <dl className="space-y-3.5">
                {sidebarRows.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <dt className="text-xs tracking-widest uppercase font-medium text-muted-foreground">
                        {label}
                      </dt>
                      <dd className="text-[13px] font-semibold mt-0.5">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div className="border border-border bg-surface rounded-xl p-6 space-y-4">
              <h4 className="text-base font-semibold tracking-tight text-foreground">Rating Distribution</h4>
              <RatingDistribution bars={ratingDistribution} />
            </div>
          </aside>
        </div>

        <RelatedTemplates templates={relatedTemplates} />
      </main>

      <Footer />
    </div>
  );
}

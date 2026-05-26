"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { slideInRight } from "@/lib/animations";

interface RewritePanelProps {
  originalText: string;
  rewrittenText: string;
  loading: boolean;
  onBack: () => void;
  onApply: () => void;
  onTryAgain: () => void;
  onDismiss: () => void;
}

export function RewritePanel({
  originalText,
  rewrittenText,
  loading,
  onBack,
  onApply,
  onTryAgain,
  onDismiss,
}: RewritePanelProps) {
  const skeletonLines = Math.min(4, Math.max(2, originalText.split(/\s+/).length > 30 ? 4 : 3));

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="rewrite-panel"
        variants={slideInRight}
        initial="initial"
        animate="animate"
        exit="exit"
        className="p-4 space-y-5"
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[14px] font-bold">Rewrite</h3>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Original
          </p>
          <p className="text-[13px] text-muted-foreground italic leading-relaxed">
            {originalText}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Rewritten
          </p>
          {loading ? (
            <div className="space-y-2" aria-busy="true" aria-label="Rewriting">
              {Array.from({ length: skeletonLines }).map((_, i) => (
                <div
                  key={i}
                  className="h-3.5 rounded bg-badge animate-pulse"
                  style={{ width: `${85 - i * 12}%` }}
                />
              ))}
            </div>
          ) : (
            <p className="text-[13px] leading-relaxed">{rewrittenText}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={onApply}
            disabled={loading || !rewrittenText}
            className="w-full py-2.5 bg-foreground text-background text-[11px] font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={onTryAgain}
            disabled={loading}
            className="w-full py-2 border border-border rounded-lg text-[11px] font-bold hover:border-foreground transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Try Again
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="w-full py-2 text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cloud, Check, Loader2 } from "lucide-react";

export type SaveDisplayStatus = "Saving..." | "Saved" | "Unsaved";

interface SaveStatusBadgeProps {
  status: SaveDisplayStatus;
}

export function SaveStatusBadge({ status }: SaveStatusBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider min-w-[88px]">
      <AnimatePresence mode="wait" initial={false}>
        {status === "Saving..." && (
          <motion.span
            key="saving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-muted-foreground"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Saving...
          </motion.span>
        )}
        {status === "Saved" && (
          <motion.span
            key="saved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-foreground"
          >
            <Cloud className="w-3.5 h-3.5" />
            <Check className="w-3 h-3 text-success -ml-2" />
            Saved
          </motion.span>
        )}
        {status === "Unsaved" && (
          <motion.span
            key="unsaved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-muted-foreground"
          >
            Unsaved
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

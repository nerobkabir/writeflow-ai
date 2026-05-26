"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { scaleIn } from "@/lib/animations";
import {
  REWRITE_TOOLBAR_OPTIONS,
  type RewriteAction,
  type RewriteTone,
} from "@/lib/rewrite-prompts";

export interface SelectionRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface SelectionFloatingToolbarProps {
  visible: boolean;
  rect: SelectionRect | null;
  activeOptionId: string | null;
  onSelect: (params: {
    optionId: string;
    tone?: RewriteTone;
    action: RewriteAction;
  }) => void;
  onDismiss: () => void;
}

export function SelectionFloatingToolbar({
  visible,
  rect,
  activeOptionId,
  onSelect,
  onDismiss,
}: SelectionFloatingToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;

    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (toolbarRef.current?.contains(target)) return;
      onDismiss();
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [visible, onDismiss]);

  if (typeof document === "undefined" || !rect) return null;

  const top = rect.top - 12;
  const left = rect.left + rect.width / 2;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={toolbarRef}
          key="selection-toolbar"
          variants={scaleIn}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            position: "fixed",
            top,
            left,
            transform: "translate(-50%, -100%)",
            transformOrigin: "bottom center",
            zIndex: 9999,
          }}
          className="flex flex-wrap items-center gap-1 p-1.5 rounded-xl border border-border bg-surface shadow-lg max-w-[min(100vw-24px,520px)]"
        >
          {REWRITE_TOOLBAR_OPTIONS.map((option) => {
            const isActive = activeOptionId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  onSelect({
                    optionId: option.id,
                    tone: option.tone,
                    action: option.action,
                  })
                }
                className={[
                  "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-[background,color] duration-150",
                  isActive
                    ? "bg-foreground text-background"
                    : "border border-border text-muted-foreground hover:bg-badge",
                ].join(" ")}
              >
                {option.label}
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

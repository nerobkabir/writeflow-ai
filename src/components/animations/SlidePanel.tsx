"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { slideInLeft, slideInRight } from "@/lib/animations";

interface SlidePanelProps {
  isOpen: boolean;
  children: React.ReactNode;
  side?: "left" | "right";
  className?: string;
}

export function SlidePanel({ isOpen, children, side = "right", className = "" }: SlidePanelProps) {
  const shouldReduceMotion = useReducedMotion();

  const variant = side === "left" ? slideInLeft : slideInRight;

  if (shouldReduceMotion) {
    return isOpen ? <div className={className}>{children}</div> : null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={variant}
          initial="initial"
          animate="animate"
          exit="exit"
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export default SlidePanel;

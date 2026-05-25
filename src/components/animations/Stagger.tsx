"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { stagger, staggerFast } from "@/lib/animations";

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  fast?: boolean;
  triggerOnce?: boolean;
}

export function Stagger({ children, className = "", fast = false, triggerOnce = true }: StaggerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={fast ? staggerFast : stagger}
      initial="initial"
      whileInView="animate"
      viewport={{ once: triggerOnce, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
export default Stagger;

"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface FadeInUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  triggerOnce?: boolean;
}

export function FadeInUp({ children, className = "", delay = 0, triggerOnce = true }: FadeInUpProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: triggerOnce, margin: "-80px" }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
export default FadeInUp;

"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface FadeInUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  triggerOnce?: boolean;
  /** Optional HTML id — used for in-page anchor links (e.g. privacy/terms pages) */
  id?: string;
}

export function FadeInUp({
  children,
  className = "",
  delay = 0,
  triggerOnce = true,
  id,
}: FadeInUpProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
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

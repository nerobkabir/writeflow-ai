"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, FileText, Sparkles, Cpu, Briefcase } from "lucide-react";
import type { Template } from "@/lib/templates-data";
import { mapCategoryToFrontend } from "@/lib/templates-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Sparkles,
  Cpu,
  Briefcase,
};

interface RelatedTemplatesProps {
  templates: Template[];
}

export function RelatedTemplates({ templates }: RelatedTemplatesProps) {
  if (templates.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="text-xl font-bold tracking-tight mb-6">Related Templates</h2>
      <div className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible scrollbar-thin">
        {templates.map((tpl) => {
          const Icon = iconMap[tpl.icon] || FileText;
          const rounded = Math.round(tpl.rating);
          return (
            <motion.div
              key={tpl.id}
              whileHover={{ y: -4, borderColor: "var(--accent)" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="min-w-[260px] sm:min-w-[280px] lg:min-w-0 snap-start border border-border bg-surface rounded-xl overflow-hidden flex flex-col h-[380px] shrink-0 lg:shrink"
            >
              <div className="relative aspect-[16/9] w-full shrink-0 border-b border-border bg-badge/40 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tpl.image}
                  alt={tpl.name}
                  className="w-full h-full object-cover grayscale opacity-75 transition-all duration-300 hover:opacity-90"
                />
                <div className="absolute top-3 left-3 bg-surface border border-border p-1.5 rounded-lg shadow-sm">
                  <Icon className="w-3.5 h-3.5 text-foreground" />
                </div>
                {tpl.isPremium && (
                  <div className="absolute top-3 right-3 bg-foreground text-background text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                    Pro
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                    {mapCategoryToFrontend(tpl.category)}
                  </span>
                  <h3 className="font-bold text-[14.5px] leading-tight line-clamp-2">{tpl.name}</h3>
                  <p className="text-[12.5px] text-muted-foreground line-clamp-3 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>
                <div className="mt-3 space-y-3">
                  <div className="w-full h-px bg-border" />
                  <div className="flex items-center justify-between text-[11.5px] text-muted-foreground">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rounded ? "fill-foreground text-foreground" : "text-border"
                          }`}
                        />
                      ))}
                    </div>
                    <span>
                      {tpl.usageCount >= 1000
                        ? `${(tpl.usageCount / 1000).toFixed(1)}k`
                        : tpl.usageCount}{" "}
                      uses
                    </span>
                  </div>
                  <Link
                    href={`/templates/${tpl.slug}`}
                    className="w-full inline-flex items-center justify-center py-2 border border-border hover:border-accent text-foreground text-[12.5px] font-bold rounded-lg transition-all hover:bg-foreground hover:text-background"
                  >
                    Use Template →
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

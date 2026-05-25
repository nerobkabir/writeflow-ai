"use client";

import { motion } from "framer-motion";
import type { RatingBar } from "@/lib/templates-data";

interface RatingDistributionProps {
  bars: RatingBar[];
}

export function RatingDistribution({ bars }: RatingDistributionProps) {
  return (
    <div className="space-y-2.5">
      {bars.map((bar, index) => (
        <div key={bar.stars} className="flex items-center gap-2 text-[12px]">
          <span className="w-6 text-muted-foreground font-medium shrink-0">{bar.stars}</span>
          <StarGlyph />
          <div className="flex-1 h-2 bg-badge rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-foreground rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${bar.percent}%` }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.08,
              }}
            />
          </div>
          <span className="w-9 text-right text-muted-foreground font-medium shrink-0">
            {bar.percent}%
          </span>
        </div>
      ))}
    </div>
  );
}

function StarGlyph() {
  return (
    <svg viewBox="0 0 12 12" className="w-3 h-3 text-foreground shrink-0" aria-hidden>
      <path
        fill="currentColor"
        d="M6 0.5l1.47 3.18 3.47.32-2.62 2.28.8 3.4L6 8.2 3.88 9.68l.8-3.4L2.06 4l3.47-.32L6 0.5z"
      />
    </svg>
  );
}

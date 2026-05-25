"use client";

import React, { useRef } from "react";
import CountUp from "react-countup";
import { useIntersection } from "@/hooks/useIntersection";

interface CountUpCardProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  label: string;
  subLabel?: string;
  className?: string;
}

export function CountUpCard({
  end,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2,
  label,
  subLabel,
  className = ""
}: CountUpCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useIntersection(containerRef, { triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={containerRef} className={`premium-card flex flex-col justify-center text-center ${className}`}>
      <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">
        {label}
      </span>
      <h3 className="text-[48px] font-bold tracking-tight text-foreground line-clamp-1">
        {inView ? (
          <CountUp
            start={0}
            end={end}
            duration={duration}
            separator=","
            decimals={decimals}
            prefix={prefix}
            suffix={suffix}
          />
        ) : (
          `${prefix}0${suffix}`
        )}
      </h3>
      {subLabel && <p className="text-[13px] text-muted-foreground mt-2">{subLabel}</p>}
    </div>
  );
}
export default CountUpCard;

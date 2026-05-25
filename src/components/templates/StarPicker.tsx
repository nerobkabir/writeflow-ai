"use client";

import { Star } from "lucide-react";

interface StarPickerProps {
  value: number;
  hoverValue: number;
  onChange: (rating: number) => void;
  onHover: (rating: number) => void;
  onHoverEnd: () => void;
}

export function StarPicker({ value, hoverValue, onChange, onHover, onHoverEnd }: StarPickerProps) {
  const display = hoverValue || value;

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Select rating">
      {Array.from({ length: 5 }).map((_, i) => {
        const starIndex = i + 1;
        const filled = starIndex <= display;
        return (
          <button
            key={starIndex}
            type="button"
            onClick={() => onChange(starIndex)}
            onMouseEnter={() => onHover(starIndex)}
            onMouseLeave={onHoverEnd}
            className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded"
            aria-label={`Rate ${starIndex} stars`}
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                filled ? "fill-foreground text-foreground" : "text-border fill-transparent"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

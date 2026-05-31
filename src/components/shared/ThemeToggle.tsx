"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg border border-border bg-surface" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-surface hover:border-accent text-foreground transition-all duration-200"
      aria-label="Toggle visual theme"
    >
      {theme === "dark" ? (
        <Sun className="w-[16px] h-[16px] text-accent animate-[spin_10s_linear_infinite]" />
      ) : (
        <Moon className="w-[16px] h-[16px] text-accent" />
      )}
    </button>
  );
}
export default ThemeToggle;

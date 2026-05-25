"use client";

import { Download } from "lucide-react";
import { SaveStatusBadge, SaveDisplayStatus } from "./SaveStatusBadge";

interface EditorTopBarProps {
  filename: string;
  saveStatus: SaveDisplayStatus;
  onExport: () => void;
}

export function EditorTopBar({ filename, saveStatus, onExport }: EditorTopBarProps) {
  return (
    <header className="h-12 shrink-0 border-b border-border bg-surface flex items-center justify-between px-5">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[13px] font-bold shrink-0">Intelligence Pro</span>
        <span className="text-border">|</span>
        <span className="text-[13px] text-muted-foreground truncate">
          Draft: {filename}
        </span>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <SaveStatusBadge status={saveStatus} />
        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-1.5 bg-foreground text-background text-[11px] font-bold uppercase tracking-wider rounded-md hover:opacity-90 transition-opacity"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>
    </header>
  );
}

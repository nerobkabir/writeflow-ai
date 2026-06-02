"use client";

import { useState, useEffect } from "react";
import { Download, Menu } from "lucide-react";
import { SaveStatusBadge, SaveDisplayStatus } from "./SaveStatusBadge";

interface EditorTopBarProps {
  filename: string;
  saveStatus: SaveDisplayStatus;
  onExport: () => void;
  onMenuClick?: () => void;
  onFilenameChange?: (name: string) => void;
}

export function EditorTopBar({
  filename,
  saveStatus,
  onExport,
  onMenuClick,
  onFilenameChange,
}: EditorTopBarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(filename.replace(/\.txt$/, ""));

  // Keep local input in sync with external filename updates
  useEffect(() => {
    setVal(filename.replace(/\.txt$/, ""));
  }, [filename]);

  const handleBlur = () => {
    setIsEditing(false);
    if (onFilenameChange && val.trim()) {
      onFilenameChange(val.trim() + ".txt");
    }
  };

  const displayName = filename.replace(/\.txt$/, "");

  return (
    <header className="h-14 shrink-0 border-b border-border bg-surface flex items-center justify-between px-4 z-40 relative">
      {/* Left: Hamburger (mobile) + Title (desktop) */}
      <div className="flex items-center gap-2 min-w-0 flex-1 md:flex-initial">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-badge text-foreground shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-[13px] font-bold shrink-0 hidden md:inline">Intelligence Pro</span>
        <span className="text-border hidden md:inline">|</span>
        
        {/* Center: Mobile Truncated & Editable Title */}
        <div className="md:hidden flex-1 flex justify-center px-2 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => e.key === "Enter" && handleBlur()}
              autoFocus
              className="bg-background border border-border text-foreground text-xs font-bold text-center px-2 py-1 rounded max-w-[150px] focus:outline-none"
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold text-foreground truncate cursor-pointer hover:underline max-w-[150px] text-center"
            >
              {displayName}
            </span>
          )}
        </div>

        {/* Desktop Editable Title */}
        <div className="hidden md:inline min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => e.key === "Enter" && handleBlur()}
              autoFocus
              className="bg-background border border-border text-foreground text-[13px] px-2 py-0.5 rounded focus:outline-none"
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className="text-[13px] text-muted-foreground truncate cursor-pointer hover:text-foreground hover:underline"
            >
              Draft: {filename}
            </span>
          )}
        </div>
      </div>

      {/* Right: Save Status & Export */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <SaveStatusBadge status={saveStatus} />
        <button
          type="button"
          onClick={onExport}
          className="flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-1.5 bg-foreground text-background text-[11px] font-bold uppercase tracking-wider rounded-md hover:opacity-90 transition-opacity min-h-[36px] md:min-h-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Export</span>
        </button>
      </div>
    </header>
  );
}

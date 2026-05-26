import type { Editor } from "@tiptap/react";

const CROSSFADE_MS = 250;

/**
 * Replaces the selection with new text using a brief crossfade overlay.
 */
export function applyRewriteWithCrossfade(
  editor: Editor,
  from: number,
  to: number,
  oldText: string,
  newText: string,
  onComplete?: () => void
): void {
  const view = editor.view;
  const start = view.coordsAtPos(from);
  const end = view.coordsAtPos(to);

  const rect = {
    top: Math.min(start.top, end.top),
    left: Math.min(start.left, end.left),
    width: Math.max(start.right, end.right) - Math.min(start.left, end.left),
    height: Math.max(start.bottom, end.bottom) - Math.min(start.top, end.top),
  };

  const overlay = document.createElement("div");
  overlay.setAttribute("data-rewrite-crossfade", "true");
  overlay.style.cssText = [
    "position:fixed",
    `top:${rect.top}px`,
    `left:${rect.left}px`,
    `width:${Math.max(rect.width, 120)}px`,
    `min-height:${Math.max(rect.height, 20)}px`,
    "z-index:9998",
    "pointer-events:none",
    "font:inherit",
    "line-height:1.6",
    "font-size:16px",
    "color:var(--foreground)",
  ].join(";");

  const oldEl = document.createElement("div");
  oldEl.textContent = oldText;
  oldEl.style.cssText = `opacity:1;transition:opacity ${CROSSFADE_MS}ms ease;position:absolute;inset:0;`;

  const newEl = document.createElement("div");
  newEl.textContent = newText;
  newEl.style.cssText = `opacity:0;transition:opacity ${CROSSFADE_MS}ms ease;position:relative;`;

  overlay.appendChild(oldEl);
  overlay.appendChild(newEl);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    oldEl.style.opacity = "0";
    newEl.style.opacity = "1";
  });

  window.setTimeout(() => {
    overlay.remove();
    editor
      .chain()
      .focus()
      .setTextSelection({ from, to })
      .deleteSelection()
      .insertContent(newText)
      .run();
    onComplete?.();
  }, CROSSFADE_MS);
}

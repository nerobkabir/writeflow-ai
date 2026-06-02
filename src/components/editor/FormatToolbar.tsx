"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Heading,
  List,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";

interface FormatToolbarProps {
  editor: Editor | null;
}

export function FormatToolbar({ editor }: FormatToolbarProps) {
  const btnClass = (active: boolean) =>
    `p-2 rounded-md transition-colors duration-100 ${
      active
        ? "bg-foreground text-background"
        : "text-muted-foreground hover:bg-badge hover:text-foreground"
    }`;

  const handleLink = () => {
    if (!editor) return;
    const url = window.prompt("Enter URL");
    if (!url) return;
    editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run();
  };

  const handleImage = () => {
    if (!editor) return;
    const url = window.prompt("Enter image URL");
    if (!url) return;
    editor.chain().focus().insertContent(`<img src="${url}" alt="" />`).run();
  };

  return (
    <div className="w-full md:w-11 shrink-0 overflow-x-auto md:overflow-x-visible border-b md:border-b-0 md:border-r border-border bg-surface flex flex-row md:flex-col items-center py-2 px-4 md:py-4 md:px-0 gap-2 md:gap-1">
      <button
        type="button"
        title="Bold"
        onClick={() => editor?.chain().focus().toggleBold().run()}
        className={btnClass(!!editor?.isActive("bold"))}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        title="Italic"
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        className={btnClass(!!editor?.isActive("italic"))}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        title="Heading"
        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btnClass(!!editor?.isActive("heading", { level: 1 }))}
      >
        <Heading className="w-4 h-4" />
      </button>
      <button
        type="button"
        title="List"
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        className={btnClass(!!editor?.isActive("bulletList"))}
      >
        <List className="w-4 h-4" />
      </button>
      <button type="button" title="Image" onClick={handleImage} className={btnClass(false)}>
        <ImageIcon className="w-4 h-4" />
      </button>
      <button type="button" title="Link" onClick={handleLink} className={btnClass(false)}>
        <LinkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

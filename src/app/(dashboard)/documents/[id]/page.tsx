"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { toast } from "sonner";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { EditorTopBar } from "@/components/editor/EditorTopBar";
import { FormatToolbar } from "@/components/editor/FormatToolbar";
import { EditorAIPanel } from "@/components/editor/EditorAIPanel";
import type { SaveDisplayStatus } from "@/components/editor/SaveStatusBadge";
import { useAutoSave } from "@/hooks/useAutoSave";
import { consumeTextStream } from "@/lib/ai-stream-client";
import {
  computeReadabilityScore,
  countWordsFromHtml,
  isEditorContentEmpty,
} from "@/lib/document-utils";

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default function DocumentEditorPage({ params }: EditorPageProps) {
  const { id: paramId } = React.use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");

  const [documentId, setDocumentId] = useState<string | null>(paramId === "new" ? null : paramId);
  const [loading, setLoading] = useState(true);
  const [filename, setFilename] = useState("untitled.txt");
  const [templatePrompt, setTemplatePrompt] = useState("");

  const [editorHtml, setEditorHtml] = useState("<h1>Untitled Document</h1><p></p>");
  const [wordCount, setWordCount] = useState(0);
  const [readability, setReadability] = useState(0);
  const [toneLabel, setToneLabel] = useState("PROFESSIONAL");

  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("");
  const [generating, setGenerating] = useState(false);
  const [streamingStatus, setStreamingStatus] = useState(false);
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [showGeneratePanel, setShowGeneratePanel] = useState(true);

  const lastSavedHtml = useRef(editorHtml);
  const isDirty = editorHtml !== lastSavedHtml.current;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({
        placeholder: "Click anywhere to begin augmenting your workflow...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: editorHtml,
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      setEditorHtml(html);
      setWordCount(countWordsFromHtml(html));
      setReadability(computeReadabilityScore(html));
      setShowGeneratePanel(isEditorContentEmpty(html));
    },
    editorProps: {
      attributes: {
        class: "prose prose-neutral dark:prose-invert max-w-none focus:outline-none",
      },
    },
  });

  const saveDocument = useCallback(
    async (html: string) => {
      if (!documentId) return;
      const wc = countWordsFromHtml(html);
      const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const title = titleMatch
        ? titleMatch[1].replace(/<[^>]+>/g, "").trim()
        : "Untitled Document";

      const res = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: html, wordCount: wc, title }),
      });

      if (!res.ok) throw new Error("Save failed");
      lastSavedHtml.current = html;
      setFilename(`${title.toLowerCase().replace(/\s+/g, "-") || "untitled"}.txt`);
    },
    [documentId]
  );

  const { saveState } = useAutoSave({
    data: editorHtml,
    onSave: saveDocument,
    delay: 2000,
  });

  const saveDisplayStatus: SaveDisplayStatus = useMemo(() => {
    if (saveState === "saving") return "Saving...";
    if (saveState === "saved") return "Saved";
    if (isDirty || saveState === "error") return "Unsaved";
    return "Saved";
  }, [saveState, isDirty]);

  // Create or load document
  useEffect(() => {
    let active = true;

    async function init() {
      try {
        if (paramId === "new") {
          const res = await fetch("/api/documents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ templateId, title: "Untitled Document" }),
          });
          if (!res.ok) throw new Error("Failed to create document");
          const { document } = await res.json();
          if (!active) return;
          const qs = templateId ? `?template=${templateId}` : "";
          router.replace(`/documents/${document.id}${qs}`);
          return;
        }

        const res = await fetch(`/api/documents/${paramId}`);
        if (!res.ok) throw new Error("Document not found");
        const { document } = await res.json();
        if (!active) return;

        setDocumentId(document.id);
        setEditorHtml(document.content);
        lastSavedHtml.current = document.content;
        setWordCount(document.wordCount || countWordsFromHtml(document.content));
        setReadability(computeReadabilityScore(document.content));
        setShowGeneratePanel(isEditorContentEmpty(document.content));

        const titleMatch = document.content.match(/<h1[^>]*>(.*?)<\/h1>/i);
        const title = titleMatch
          ? titleMatch[1].replace(/<[^>]+>/g, "").trim()
          : document.title;
        setFilename(`${(title || "untitled").toLowerCase().replace(/\s+/g, "-")}.txt`);

        if (document.template?.prompt) {
          setTemplatePrompt(document.template.prompt);
        }
      } catch {
        toast.error("Failed to load document");
        router.push("/documents");
      } finally {
        if (active) setLoading(false);
      }
    }

    init();
    return () => {
      active = false;
    };
  }, [paramId, router, templateId]);

  // Sync editor when document loads
  useEffect(() => {
    if (!editor || loading) return;
    if (editor.getHTML() !== editorHtml) {
      editor.commands.setContent(editorHtml, { emitUpdate: false });
    }
  }, [editor, editorHtml, loading]);

  const handleExport = () => {
    const html = editor?.getHTML() || editorHtml;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.replace(/\.txt$/, ".html");
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    if (!topic.trim() || !editor) return;

    setGenerating(true);
    setStreamingStatus(true);
    setShowGeneratePanel(false);

    let accumulated = "";

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          tone,
          audience: audience || "general readers",
          templatePrompt,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Generation failed");
      }

      const meta = await consumeTextStream(res, (delta) => {
        accumulated += delta;
        editor.commands.setContent(accumulated, { emitUpdate: false });
        setEditorHtml(accumulated);
        setWordCount(countWordsFromHtml(accumulated));
      });

      const finalHtml = meta?.contentHtml || accumulated;
      if (finalHtml) {
        editor.commands.setContent(finalHtml, { emitUpdate: false });
        setEditorHtml(finalHtml);
        setWordCount(countWordsFromHtml(finalHtml));
        setReadability(computeReadabilityScore(finalHtml));
      }

      setToneLabel(tone.toUpperCase());
      setShowGeneratePanel(false);

      if (meta && documentId) {
        await fetch(`/api/documents/${documentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: finalHtml,
            title: meta.title,
            metaDescription: meta.metaDescription,
            tags: meta.tags,
            wordCount: countWordsFromHtml(finalHtml),
          }),
        });
        lastSavedHtml.current = finalHtml;
        setFilename(`${meta.title.toLowerCase().replace(/\s+/g, "-")}.txt`);
      }

      toast.success("Content generated successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed";
      toast.error(message);
      setShowGeneratePanel(isEditorContentEmpty(editor.getHTML()));
    } finally {
      setGenerating(false);
      setStreamingStatus(false);
    }
  };

  const runRewriteStream = async (mode: "rewrite" | "expand") => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const selectedText =
      from !== to
        ? editor.state.doc.textBetween(from, to, " ")
        : editor.state.doc.textBetween(
            Math.max(0, from - 200),
            Math.min(editor.state.doc.content.size, to + 200),
            " "
          );

    if (!selectedText.trim()) {
      toast.error("Select text in the editor first");
      return;
    }

    setRewriteLoading(true);
    setStreamingStatus(true);

    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText, mode }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Rewrite failed");
      }

      let result = "";
      await consumeTextStream(res, (delta) => {
        result += delta;
      });

      if (from !== to) {
        editor.chain().focus().deleteSelection().insertContent(result).run();
      } else {
        editor.chain().focus().insertContent(result).run();
      }

      toast.success(mode === "expand" ? "Thought expanded" : "Selection rewritten");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI request failed");
    } finally {
      setRewriteLoading(false);
      setStreamingStatus(false);
    }
  };

  if (loading || paramId === "new") {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
          Initializing workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background text-foreground">
      <EditorSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <EditorTopBar
          filename={filename}
          saveStatus={saveDisplayStatus}
          onExport={handleExport}
        />

        <div className="flex-1 flex overflow-hidden min-h-0">
          <FormatToolbar editor={editor} />

          <div className="flex-1 flex flex-col overflow-hidden bg-background">
            <div className="px-8 pt-6 pb-2 shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Content Architecture
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-8 pb-16">
              <EditorContent editor={editor} className="tiptap-editor max-w-3xl" />
            </div>
          </div>

          <EditorAIPanel
            showGenerate={showGeneratePanel}
            wordCount={wordCount}
            readability={readability || (showGeneratePanel ? 0 : 94)}
            toneLabel={toneLabel}
            streamingStatus={streamingStatus}
            generating={generating}
            topic={topic}
            tone={tone}
            audience={audience}
            onTopicChange={setTopic}
            onToneChange={setTone}
            onAudienceChange={setAudience}
            onGenerate={handleGenerate}
            onRewrite={() => runRewriteStream("rewrite")}
            onExpand={() => runRewriteStream("expand")}
            rewriteLoading={rewriteLoading}
          />
        </div>
      </div>
    </div>
  );
}

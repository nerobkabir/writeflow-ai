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
import {
  SelectionFloatingToolbar,
  type SelectionRect,
} from "@/components/editor/SelectionFloatingToolbar";
import type { SaveDisplayStatus } from "@/components/editor/SaveStatusBadge";
import { useAutoSave } from "@/hooks/useAutoSave";
import { applyRewriteWithCrossfade } from "@/lib/apply-rewrite-crossfade";
import { consumeTextStream } from "@/lib/ai-stream-client";
import {
  computeReadabilityScore,
  countWordsFromHtml,
  isEditorContentEmpty,
} from "@/lib/document-utils";
import type { RewriteAction, RewriteTone } from "@/lib/rewrite-prompts";
import { fetchWithTimeout } from "@/lib/fetch-client";
import { buildDocumentChatContext } from "@/lib/chat-context";

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

interface SavedSelection {
  from: number;
  to: number;
  text: string;
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
  const [showGeneratePanel, setShowGeneratePanel] = useState(true);

  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);
  const [activeOptionId, setActiveOptionId] = useState<string | null>(null);

  const [rewritePanel, setRewritePanel] = useState({
    open: false,
    originalText: "",
    rewrittenText: "",
    loading: false,
  });

  const savedSelectionRef = useRef<SavedSelection | null>(null);
  const rewriteRequestRef = useRef<{
    tone?: RewriteTone;
    action: RewriteAction;
    optionId: string;
  } | null>(null);

  const lastSavedHtml = useRef(editorHtml);
  const createInFlight = useRef(false);
  const isDirty = editorHtml !== lastSavedHtml.current;

  const editor = useEditor({
    immediatelyRender: false,
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

  const updateSelectionToolbar = useCallback(() => {
    if (!editor || rewritePanel.open) {
      setToolbarVisible(false);
      return;
    }

    const { from, to, empty } = editor.state.selection;
    if (empty || from === to) {
      setToolbarVisible(false);
      setSelectionRect(null);
      return;
    }

    const text = editor.state.doc.textBetween(from, to, " ");
    if (!text.trim()) {
      setToolbarVisible(false);
      setSelectionRect(null);
      return;
    }

    const domSel = window.getSelection();
    if (!domSel || domSel.rangeCount === 0) {
      setToolbarVisible(false);
      return;
    }

    const range = domSel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setToolbarVisible(false);
      return;
    }

    setSelectionRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
    setToolbarVisible(true);
    savedSelectionRef.current = { from, to, text };
  }, [editor, rewritePanel.open]);

  useEffect(() => {
    if (!editor) return;

    editor.on("selectionUpdate", updateSelectionToolbar);
    return () => {
      editor.off("selectionUpdate", updateSelectionToolbar);
    };
  }, [editor, updateSelectionToolbar]);

  const saveDocument = useCallback(
    async (html: string) => {
      if (!documentId) return;
      const wc = countWordsFromHtml(html);
      const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const title = titleMatch
        ? titleMatch[1].replace(/<[^>]+>/g, "").trim()
        : "Untitled Document";

      const res = await fetchWithTimeout(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: html, wordCount: wc, title }),
        timeoutMs: 12_000,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
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

  const documentContext = useMemo(
    () =>
      buildDocumentChatContext(
        editorHtml,
        wordCount,
        toneLabel,
        filename.replace(/\.txt$/i, "").replace(/-/g, " ")
      ),
    [editorHtml, wordCount, toneLabel, filename]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    const startTime = Date.now();

    async function init() {
      try {
        if (paramId === "new") {
          if (createInFlight.current) {
            setLoading(false);
            return;
          }
          createInFlight.current = true;

          const res = await fetchWithTimeout("/api/documents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ templateId, title: "Untitled Document" }),
            timeoutMs: 12_000,
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(data.error || "Failed to create document");
          }
          if (!active) return;
          if (data.offline && data.message) {
            toast.info(data.message);
          }
          const qs = templateId ? `?template=${templateId}` : "";
          router.replace(`/documents/${data.document.id}${qs}`);
          return;
        }

        const res = await fetchWithTimeout(`/api/documents/${paramId}`, {
          timeoutMs: 12_000,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || "Document not found");
        }
        if (!active) return;

        const { document } = data;
        if (data.offline && data.message) {
          toast.info(data.message);
        }

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
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load document");
        router.push("/documents");
      } finally {
        if (active) {
          const elapsed = Date.now() - startTime;
          const delay = Math.max(0, 300 - elapsed);
          setTimeout(() => {
            if (active) setLoading(false);
          }, delay);
        }
      }
    }

    init();
    return () => {
      active = false;
      if (paramId === "new") createInFlight.current = false;
    };
  }, [paramId, router, templateId]);

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

  const fetchRewrite = useCallback(
    async (params: {
      tone?: RewriteTone;
      action: RewriteAction;
      optionId: string;
      originalText: string;
    }) => {
      setRewritePanel((prev) => ({
        ...prev,
        open: true,
        originalText: params.originalText,
        rewrittenText: "",
        loading: true,
      }));
      setToolbarVisible(false);
      setActiveOptionId(params.optionId);
      rewriteRequestRef.current = {
        tone: params.tone,
        action: params.action,
        optionId: params.optionId,
      };

      try {
        const res = await fetch("/api/ai/rewrite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selectedText: params.originalText,
            tone: params.tone ?? null,
            action: params.action,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Rewrite failed");
        }

        setRewritePanel((prev) => ({
          ...prev,
          rewrittenText: data.rewrittenText,
          loading: false,
        }));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Rewrite failed");
        setRewritePanel((prev) => ({
          ...prev,
          open: false,
          loading: false,
          rewrittenText: "",
        }));
        setActiveOptionId(null);
        if (savedSelectionRef.current && editor) {
          const { from, to } = savedSelectionRef.current;
          editor.chain().focus().setTextSelection({ from, to }).run();
        }
      }
    },
    [editor]
  );

  const handleToolbarSelect = useCallback(
    (params: { optionId: string; tone?: RewriteTone; action: RewriteAction }) => {
      const selection = savedSelectionRef.current;
      if (!selection?.text.trim()) {
        toast.error("Select text in the editor first");
        return;
      }
      fetchRewrite({
        ...params,
        originalText: selection.text,
      });
    },
    [fetchRewrite]
  );

  const restoreSelection = useCallback(() => {
    if (savedSelectionRef.current && editor) {
      const { from, to } = savedSelectionRef.current;
      editor.chain().focus().setTextSelection({ from, to }).run();
    }
  }, [editor]);

  const handleRewriteBack = () => {
    setRewritePanel({
      open: false,
      originalText: "",
      rewrittenText: "",
      loading: false,
    });
    setActiveOptionId(null);
    restoreSelection();
  };

  const handleRewriteDismiss = () => {
    handleRewriteBack();
  };

  const handleRewriteTryAgain = () => {
    const req = rewriteRequestRef.current;
    const selection = savedSelectionRef.current;
    if (!req || !selection) return;
    fetchRewrite({
      tone: req.tone,
      action: req.action,
      optionId: req.optionId,
      originalText: selection.text,
    });
  };

  const handleRewriteApply = () => {
    if (!editor || !savedSelectionRef.current || !rewritePanel.rewrittenText) return;

    const { from, to, text } = savedSelectionRef.current;
    applyRewriteWithCrossfade(
      editor,
      from,
      to,
      text,
      rewritePanel.rewrittenText,
      () => {
        const html = editor.getHTML();
        setEditorHtml(html);
        setWordCount(countWordsFromHtml(html));
        setReadability(computeReadabilityScore(html));
      }
    );

    setRewritePanel({
      open: false,
      originalText: "",
      rewrittenText: "",
      loading: false,
    });
    setActiveOptionId(null);
    savedSelectionRef.current = null;
    toast.success("Rewrite applied");
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex overflow-hidden bg-background text-foreground select-none">
        {/* Sidebar Skeleton */}
        <aside className="w-[200px] shrink-0 h-screen flex flex-col border-r border-border bg-surface p-4 justify-between animate-pulse">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-5 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
            <div className="h-8 bg-muted rounded w-full mt-4" />
            <div className="space-y-3 pt-6">
              <div className="h-6 bg-muted rounded w-full" />
              <div className="h-6 bg-muted rounded w-11/12" />
              <div className="h-6 bg-muted rounded w-4/5" />
              <div className="h-6 bg-muted rounded w-full" />
            </div>
          </div>
          <div className="flex items-center gap-3 border-t border-border pt-4">
            <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
            <div className="space-y-1 flex-grow">
              <div className="h-3 bg-muted rounded w-3/4" />
              <div className="h-2 bg-muted rounded w-1/2" />
            </div>
          </div>
        </aside>

        {/* Editor Main Skeleton */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header Skeleton */}
          <header className="h-12 border-b border-border bg-surface flex items-center justify-between px-5 animate-pulse">
            <div className="flex items-center gap-3 w-1/3">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 bg-muted rounded w-16" />
              <div className="h-7 bg-muted rounded w-24" />
            </div>
          </header>

          <div className="flex-grow flex">
            {/* Format toolbar skeleton */}
            <div className="w-12 border-r border-border bg-surface p-2 flex flex-col items-center gap-4 animate-pulse">
              <div className="w-8 h-8 bg-muted rounded" />
              <div className="w-8 h-8 bg-muted rounded" />
              <div className="w-8 h-8 bg-muted rounded" />
              <div className="w-8 h-8 bg-muted rounded" />
              <div className="w-8 h-8 bg-muted rounded" />
            </div>

            {/* Main Text Area Skeleton */}
            <main className="flex-1 bg-background p-8 relative flex flex-col gap-6 animate-pulse">
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-24 mb-6" />
                <div className="h-10 bg-muted rounded w-1/2 mb-4" />
              </div>
              <div className="space-y-4 max-w-3xl">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-11/12" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-4/5" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-11/12" />
              </div>
            </main>

            {/* AI Panel Skeleton */}
            <aside className="w-[300px] shrink-0 border-l border-border bg-surface p-5 flex flex-col justify-between animate-pulse">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
                <div className="space-y-4">
                  <div className="h-20 bg-muted rounded w-full" />
                  <div className="h-10 bg-muted rounded w-full" />
                  <div className="h-10 bg-muted rounded w-full" />
                </div>
              </div>
              <div className="h-10 bg-muted rounded w-full" />
            </aside>
          </div>
        </div>
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

          <div className="flex-1 flex flex-col overflow-hidden bg-background relative">
            <div className="px-8 pt-6 pb-2 shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Content Architecture
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-8 pb-16">
              <EditorContent editor={editor} className="tiptap-editor max-w-3xl" />
            </div>

            <SelectionFloatingToolbar
              visible={toolbarVisible && !rewritePanel.open}
              rect={selectionRect}
              activeOptionId={activeOptionId}
              onSelect={handleToolbarSelect}
              onDismiss={() => setToolbarVisible(false)}
            />
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
            documentContext={documentContext}
            onTopicChange={setTopic}
            onToneChange={setTone}
            onAudienceChange={setAudience}
            onGenerate={handleGenerate}
            rewritePanel={rewritePanel}
            onRewriteBack={handleRewriteBack}
            onRewriteApply={handleRewriteApply}
            onRewriteTryAgain={handleRewriteTryAgain}
            onRewriteDismiss={handleRewriteDismiss}
          />
        </div>
      </div>
    </div>
  );
}

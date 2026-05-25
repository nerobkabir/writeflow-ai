"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  ChevronLeft, Sparkles, Send, CheckCircle2, CloudLightning,
  RefreshCw, FileDown, Bold, Italic, List, Heading1, Heading2, MessageSquare, Edit3, Wand2
} from "lucide-react";

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default function DocumentEditorPage({ params }: EditorPageProps) {
  const { id } = React.use(params);
  const isNew = id === "new";

  const [title, setTitle] = useState(isNew ? "Untitled Document Spec" : "Q1 Operations Review Spec");
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving" | "Error">("Saved");
  const [aiPanelTab, setAiPanelTab] = useState<"generate" | "rewrite" | "chat">("generate");
  const [prompt, setPrompt] = useState("");
  const [rewriteText, setRewriteText] = useState("");
  const [selectedTone, setSelectedTone] = useState("clinical");
  const [generating, setGenerating] = useState(false);

  // Chat window state
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "System connection active. I can analyze, restructure, or expand your document parameters. What is your objective?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Configure Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something brilliant or use the AI Panel on the right...",
      }),
    ],
    content: isNew
      ? `<h1>Untitled Document Spec</h1><p>Start writing here...</p>`
      : `<h1>Q1 Operations Review Spec</h1>
<p>This strategic operational briefing delineates software-as-a-service billing metrics and execution vectors.</p>
<h2>1. High-Level Operations Overview</h2>
<ul>
  <li>Annual Recurring Revenue (ARR): $42.6M</li>
  <li>Net Revenue Retention (NRR): 114.8%</li>
</ul>
<p>We target stable growth through optimized multi-channel outbound paths, accelerating lead conversions by 14%.</p>`,
  });

  // Simulated auto-save trigger on editor content modification
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      setSaveStatus("Saving");
      const timer = setTimeout(() => {
        setSaveStatus("Saved");
      }, 1000);
      return () => clearTimeout(timer);
    };

    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor]);

  // Scroll chat window to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleGenerate = () => {
    if (!prompt.trim() || !editor) return;
    setGenerating(true);
    setTimeout(() => {
      // Append generated content to editor
      editor.commands.insertContent(
        `<p></p><h2>System Generated Section</h2><p>Synthesizing parameters for: <em>${prompt}</em>.</p><p>Operational models suggest key acceleration is achieved through immediate customer workspace onboarding pathways. Integration of automated pipelines drives retention multipliers by 4.2% within active cohorts.</p>`
      );
      setPrompt("");
      setGenerating(false);
    }, 1500);
  };

  const handleRewrite = () => {
    if (!rewriteText.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      const remappedTones: Record<string, string> = {
        clinical: "CLINICAL EVALUATION SPEC: " + rewriteText + " (Analysis validated through precision data structures.)",
        bold: "BOLD DIRECTIVE: " + rewriteText + " (Establish absolute authority immediately.)",
        direct: "EXECUTIVE SUMMARY: " + rewriteText + " (Action now.)",
      };
      // Append rewritten block
      editor?.commands.insertContent(
        `<p></p><blockquote class="border-l-4 border-foreground pl-4 italic bg-badge/40 py-2 rounded-r-lg">${remappedTones[selectedTone] || rewriteText}</blockquote>`
      );
      setRewriteText("");
      setGenerating(false);
    }, 1200);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      const aiReply = {
        sender: "ai",
        text: `Analysis complete. Based on: "${chatInput}", I recommend structuring your next section with precise metric bullet points to preserve high information density.`,
      };
      setChatMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background text-foreground font-sans">
      {/* Upper Control Bar */}
      <header className="border-b border-border bg-surface h-14 flex items-center justify-between px-6 shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/documents"
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-[14.5px] font-bold bg-transparent focus:bg-background border border-transparent focus:border-border outline-none rounded px-2 py-0.5 w-60 sm:w-80 transition-colors"
            />
            {/* Auto save indicator */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground select-none">
              {saveStatus === "Saving" ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Draft saved</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            const docHTML = editor?.getHTML() || "";
            const blob = new Blob([docHTML], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.html`;
            a.click();
          }}
          className="flex items-center gap-2 px-3 py-1.5 border border-border hover:border-accent bg-background rounded-lg font-bold text-[12.5px] transition-colors"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export HTML</span>
        </button>
      </header>

      {/* Main Panel Side-by-Side Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Pane (Left/Center) */}
        <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
          {/* Format Control bar */}
          <div className="border-b border-border bg-surface/50 h-10 flex items-center px-6 gap-2 shrink-0">
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded hover:bg-badge text-muted-foreground hover:text-foreground transition-colors ${editor?.isActive("bold") ? "bg-badge text-foreground font-bold" : ""}`}
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded hover:bg-badge text-muted-foreground hover:text-foreground transition-colors ${editor?.isActive("italic") ? "bg-badge text-foreground font-bold" : ""}`}
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded hover:bg-badge text-muted-foreground hover:text-foreground transition-colors ${editor?.isActive("bulletList") ? "bg-badge text-foreground font-bold" : ""}`}
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button
              onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-1.5 rounded hover:bg-badge text-muted-foreground hover:text-foreground transition-colors ${editor?.isActive("heading", { level: 1 }) ? "bg-badge text-foreground font-bold" : ""}`}
              title="H1"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1.5 rounded hover:bg-badge text-muted-foreground hover:text-foreground transition-colors ${editor?.isActive("heading", { level: 2 }) ? "bg-badge text-foreground font-bold" : ""}`}
              title="H2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Editor Body */}
          <div className="flex-1 overflow-y-auto px-10 py-8 prose prose-neutral dark:prose-invert max-w-none focus:outline-none">
            <EditorContent editor={editor} className="outline-none min-h-[300px] text-[15px] leading-relaxed max-w-3xl mx-auto" />
          </div>
        </div>

        {/* AI Control Panel Sidebar (Right) */}
        <aside className="w-80 sm:w-96 border-l border-border bg-surface flex flex-col h-full shrink-0 overflow-hidden">
          {/* Panel Header/Tab selectors */}
          <div className="border-b border-border bg-background p-3.5 grid grid-cols-3 gap-1 shrink-0">
            <button
              onClick={() => setAiPanelTab("generate")}
              className={`py-2 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors ${
                aiPanelTab === "generate"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-badge"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate</span>
            </button>
            <button
              onClick={() => setAiPanelTab("rewrite")}
              className={`py-2 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors ${
                aiPanelTab === "rewrite"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-badge"
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Rewrite</span>
            </button>
            <button
              onClick={() => setAiPanelTab("chat")}
              className={`py-2 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors ${
                aiPanelTab === "chat"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-badge"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>AI Chat</span>
            </button>
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-y-auto p-5 relative">
            {generating && (
              <div className="absolute inset-0 bg-surface/75 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
                <CloudLightning className="w-8 h-8 text-foreground animate-pulse" />
                <p className="text-[12.5px] font-bold tracking-widest text-foreground animate-pulse uppercase">
                  Engaging Reasoning Model...
                </p>
              </div>
            )}

            {aiPanelTab === "generate" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-[14px] mb-1.5">Direct Generation Directive</h3>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    Instruct the model to formulate outlines, summaries, or paragraphs based on active metrics or goals.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10.5px] font-bold text-muted-foreground uppercase mb-1">
                      PROMPT DIRECTIVE
                    </label>
                    <textarea
                      rows={4}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. Generate 3 strategic goals for cloud node distribution..."
                      className="w-full px-3 py-2 text-[12.5px] rounded-lg bg-background border border-border focus:border-accent outline-none resize-none"
                    />
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                    className="w-full py-2.5 bg-foreground text-background rounded-lg font-bold text-[13px] hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Generator</span>
                  </button>
                </div>
              </div>
            )}

            {aiPanelTab === "rewrite" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-[14px] mb-1.5">Precision Editor Rewrite</h3>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    Paste raw lines or ideas to format, structure, or align to Swiss precision aesthetics immediately.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10.5px] font-bold text-muted-foreground uppercase mb-1">
                      Target Copy / Raw Input
                    </label>
                    <textarea
                      rows={4}
                      value={rewriteText}
                      onChange={(e) => setRewriteText(e.target.value)}
                      placeholder="Paste text here to evaluate and reconstruct..."
                      className="w-full px-3 py-2 text-[12.5px] rounded-lg bg-background border border-border focus:border-accent outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-muted-foreground uppercase mb-1">
                      Aesthetic Style
                    </label>
                    <select
                      value={selectedTone}
                      onChange={(e) => setSelectedTone(e.target.value)}
                      className="w-full px-3 py-2 text-[12.5px] rounded-lg bg-background border border-border focus:border-accent outline-none"
                    >
                      <option value="clinical">Clinical Analysis (Academic)</option>
                      <option value="bold">Bold & Direct (Authority)</option>
                      <option value="direct">Action Summary (High-Density)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleRewrite}
                    disabled={!rewriteText.trim()}
                    className="w-full py-2.5 bg-foreground text-background rounded-lg font-bold text-[13px] hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-1.5"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Rewrite Directive</span>
                  </button>
                </div>
              </div>
            )}

            {aiPanelTab === "chat" && (
              <div className="flex flex-col h-full min-h-[300px]">
                {/* Chat Stream */}
                <div className="flex-1 space-y-3.5 mb-4 overflow-y-auto max-h-[350px] pr-1">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <span className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">
                        {msg.sender === "user" ? "Client Terminal" : "WriteFlow AI"}
                      </span>
                      <div
                        className={`p-3 rounded-xl text-[12.5px] leading-relaxed max-w-[85%] border ${
                          msg.sender === "user"
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-foreground border-border"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                {/* Form input */}
                <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-border shrink-0 mt-auto">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask assistant details..."
                    className="flex-1 px-3 py-2 text-[12.5px] rounded-lg bg-background border border-border focus:border-accent outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="w-9 h-9 flex items-center justify-center bg-foreground text-background rounded-lg hover:opacity-90 disabled:opacity-50 shrink-0 transition-opacity"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

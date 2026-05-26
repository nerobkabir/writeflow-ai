"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Scale } from "lucide-react";
import CountUp from "react-countup";
import { slideInRight } from "@/lib/animations";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { EditorChatPanel } from "@/components/editor/EditorChatPanel";
import { RewritePanel } from "@/components/editor/RewritePanel";
import type { DocumentChatContext } from "@/lib/chat-types";
import { cn } from "@/lib/utils";

const DENSITY_HEIGHTS = [40, 85, 45, 95, 55, 70, 35];

const REFINEMENTS = [
  {
    title: "Clarify Argument",
    body: 'The transition from static deployment models to dynamic scaling could be more decisive.',
  },
  {
    title: "Reduce Passive Voice",
    body: "3 instances detected in paragraph 2.",
  },
];

type SidePanelTab = "analysis" | "chat";

interface GenerateFormProps {
  topic: string;
  tone: string;
  audience: string;
  generating: boolean;
  onTopicChange: (v: string) => void;
  onToneChange: (v: string) => void;
  onAudienceChange: (v: string) => void;
  onGenerate: () => void;
}

function GenerateForm({
  topic,
  tone,
  audience,
  generating,
  onTopicChange,
  onToneChange,
  onAudienceChange,
  onGenerate,
}: GenerateFormProps) {
  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
          Topic *
        </label>
        <input
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          className="w-full px-3 py-2 text-[12px] rounded-lg border border-border bg-background outline-none focus:border-foreground"
          placeholder="What should we write about?"
        />
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
          Tone
        </label>
        <select
          value={tone}
          onChange={(e) => onToneChange(e.target.value)}
          className="w-full px-3 py-2 text-[12px] rounded-lg border border-border bg-background outline-none focus:border-foreground"
        >
          <option>Professional</option>
          <option>Casual</option>
          <option>Friendly</option>
          <option>Persuasive</option>
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
          Target Audience
        </label>
        <input
          value={audience}
          onChange={(e) => onAudienceChange(e.target.value)}
          className="w-full px-3 py-2 text-[12px] rounded-lg border border-border bg-background outline-none focus:border-foreground"
          placeholder="e.g. SaaS founders, developers..."
        />
      </div>
      <button
        type="button"
        onClick={onGenerate}
        disabled={!topic.trim() || generating}
        className="w-full py-3 bg-foreground text-background text-[12px] font-bold rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {generating ? "Generating..." : "Generate Content"}
      </button>
    </div>
  );
}

function StreamingStatusText({ text, active }: { text: string; active: boolean }) {
  const words = text.split(" ");

  if (!active) {
    return (
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Select text to rewrite, or switch to Chat for document Q&amp;A.
      </p>
    );
  }

  return (
    <p className="text-[11px] text-muted-foreground leading-relaxed flex flex-wrap gap-x-1 gap-y-0.5">
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05, duration: 0.2 }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

function PanelTabs({
  active,
  onChange,
}: {
  active: SidePanelTab;
  onChange: (tab: SidePanelTab) => void;
}) {
  return (
    <div className="shrink-0 flex p-1 mx-3 mt-3 rounded-lg border border-border bg-background">
      {(["analysis", "chat"] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(
            "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors",
            active === tab
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab === "analysis" ? "Analysis" : "Chat"}
        </button>
      ))}
    </div>
  );
}

function MetricsView({
  wordCount,
  readability,
  toneLabel,
  streamingStatus,
  generating,
}: {
  wordCount: number;
  readability: number;
  toneLabel: string;
  streamingStatus: boolean;
  generating: boolean;
}) {
  const [readabilityDisplay, setReadabilityDisplay] = useState(readability);
  const statusText =
    "Analyzing current draft for structural inconsistencies and tone resonance...";

  useEffect(() => {
    setReadabilityDisplay(readability);
  }, [readability]);

  return (
    <div className="p-4 space-y-5 overflow-y-auto">
      <div className="space-y-3">
        <StreamingStatusText text={statusText} active={streamingStatus || generating} />
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Highlight any passage to open the rewrite toolbar.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="border border-border rounded-lg p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Readability
          </p>
          <p className="text-[32px] font-bold leading-none mt-1">
            <CountUp end={readabilityDisplay} duration={0.8} preserveValue />
          </p>
          <div className="mt-2 h-1.5 bg-badge rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-foreground rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${readabilityDisplay}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
        <div className="border border-border rounded-lg p-3 flex flex-col">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Tone
          </p>
          <p className="text-[11px] font-bold mt-2 leading-tight flex-1">{toneLabel}</p>
          <Scale className="w-4 h-4 text-muted-foreground mt-1" />
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Semantic Density
        </p>
        <div className="flex items-end gap-1.5 h-16">
          {DENSITY_HEIGHTS.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-foreground rounded-sm origin-bottom"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Suggested Refinements
        </p>
        {REFINEMENTS.map((card, i) => (
          <FadeInUp key={card.title} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -2, borderColor: "var(--foreground)" }}
              transition={{ duration: 0.15 }}
              className="border border-border rounded-lg p-3 cursor-default"
            >
              <p className="text-[14px] font-bold">{card.title}</p>
              <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">
                {card.body}
              </p>
            </motion.div>
          </FadeInUp>
        ))}
      </div>
    </div>
  );
}

export interface RewritePanelState {
  open: boolean;
  originalText: string;
  rewrittenText: string;
  loading: boolean;
}

interface EditorAIPanelProps {
  showGenerate: boolean;
  wordCount: number;
  readability: number;
  toneLabel: string;
  streamingStatus: boolean;
  generating: boolean;
  topic: string;
  tone: string;
  audience: string;
  documentContext: DocumentChatContext;
  onTopicChange: (v: string) => void;
  onToneChange: (v: string) => void;
  onAudienceChange: (v: string) => void;
  onGenerate: () => void;
  rewritePanel: RewritePanelState;
  onRewriteBack: () => void;
  onRewriteApply: () => void;
  onRewriteTryAgain: () => void;
  onRewriteDismiss: () => void;
}

export function EditorAIPanel({
  showGenerate,
  wordCount,
  readability,
  toneLabel,
  streamingStatus,
  generating,
  topic,
  tone,
  audience,
  documentContext,
  onTopicChange,
  onToneChange,
  onAudienceChange,
  onGenerate,
  rewritePanel,
  onRewriteBack,
  onRewriteApply,
  onRewriteTryAgain,
  onRewriteDismiss,
}: EditorAIPanelProps) {
  const [activeTab, setActiveTab] = useState<SidePanelTab>("analysis");
  const [tabDirection, setTabDirection] = useState(1);

  const switchTab = (next: SidePanelTab) => {
    setTabDirection(next === "chat" ? 1 : -1);
    setActiveTab(next);
  };

  const tabVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 20 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -20 }),
  };

  return (
    <motion.aside
      variants={slideInRight}
      initial="initial"
      animate="animate"
      className="w-[280px] shrink-0 h-full border-l border-border bg-surface flex flex-col overflow-hidden"
    >
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {showGenerate ? (
          <div className="flex-1 overflow-y-auto">
            <GenerateForm
              topic={topic}
              tone={tone}
              audience={audience}
              generating={generating}
              onTopicChange={onTopicChange}
              onToneChange={onToneChange}
              onAudienceChange={onAudienceChange}
              onGenerate={onGenerate}
            />
          </div>
        ) : rewritePanel.open ? (
          <div className="flex-1 overflow-y-auto">
            <RewritePanel
              originalText={rewritePanel.originalText}
              rewrittenText={rewritePanel.rewrittenText}
              loading={rewritePanel.loading}
              onBack={onRewriteBack}
              onApply={onRewriteApply}
              onTryAgain={onRewriteTryAgain}
              onDismiss={onRewriteDismiss}
            />
          </div>
        ) : (
          <>
            <PanelTabs active={activeTab} onChange={switchTab} />
            <div className="flex-1 min-h-0 overflow-hidden relative">
              <AnimatePresence mode="wait" custom={tabDirection}>
                {activeTab === "analysis" ? (
                  <motion.div
                    key="analysis"
                    custom={tabDirection}
                    variants={tabVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute inset-0 overflow-y-auto"
                  >
                    <MetricsView
                      wordCount={wordCount}
                      readability={readability}
                      toneLabel={toneLabel}
                      streamingStatus={streamingStatus}
                      generating={generating}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    custom={tabDirection}
                    variants={tabVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute inset-0 flex flex-col min-h-0"
                  >
                    <EditorChatPanel documentContext={documentContext} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-border px-4 py-2.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span>L4 Model</span>
        <span>{wordCount} Words</span>
        <span className="text-success flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          Online
        </span>
      </div>
    </motion.aside>
  );
}

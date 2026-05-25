"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Scale, Loader2 } from "lucide-react";
import CountUp from "react-countup";
import { slideInRight } from "@/lib/animations";
import { FadeInUp } from "@/components/animations/FadeInUp";

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
        {generating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Content"
        )}
      </button>
    </div>
  );
}

function StreamingStatusText({ text, active }: { text: string; active: boolean }) {
  const words = text.split(" ");

  if (!active) {
    return (
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Ready to analyze your draft structure and tone alignment.
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
  onTopicChange: (v: string) => void;
  onToneChange: (v: string) => void;
  onAudienceChange: (v: string) => void;
  onGenerate: () => void;
  onRewrite: () => void;
  onExpand: () => void;
  rewriteLoading: boolean;
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
  onTopicChange,
  onToneChange,
  onAudienceChange,
  onGenerate,
  onRewrite,
  onExpand,
  rewriteLoading,
}: EditorAIPanelProps) {
  const [readabilityDisplay, setReadabilityDisplay] = useState(readability);

  useEffect(() => {
    setReadabilityDisplay(readability);
  }, [readability]);

  const statusText =
    "Analyzing current draft for structural inconsistencies and tone resonance...";

  return (
    <motion.aside
      variants={slideInRight}
      initial="initial"
      animate="animate"
      className="w-[240px] shrink-0 h-full border-l border-border bg-surface flex flex-col overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto">
        {showGenerate ? (
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
        ) : (
          <div className="p-4 space-y-5">
            {/* AI Assistant */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  AI Assistant
                </span>
                <span className="ai-pulse-dot w-2 h-2 rounded-full bg-success shrink-0" />
              </div>
              <StreamingStatusText text={statusText} active={streamingStatus || generating} />
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={onRewrite}
                  disabled={rewriteLoading}
                  className="w-full py-2 border border-border rounded-lg text-[10px] font-bold uppercase tracking-wider hover:border-foreground transition-colors disabled:opacity-50"
                >
                  Rewrite Selection →
                </button>
                <button
                  type="button"
                  onClick={onExpand}
                  disabled={rewriteLoading}
                  className="w-full py-2 border border-border rounded-lg text-[10px] font-bold uppercase tracking-wider hover:border-foreground transition-colors disabled:opacity-50"
                >
                  Expand Thought +
                </button>
              </div>
            </div>

            {/* Metrics */}
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

            {/* Semantic density */}
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

            {/* Refinements */}
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
        )}
      </div>

      {/* Status bar */}
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

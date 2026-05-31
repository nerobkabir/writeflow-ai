"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { 
  Sparkles, 
  Shield, 
  Terminal as TerminalIcon, 
  Activity, 
  ArrowRight, 
  Database, 
  RefreshCw, 
  TrendingUp, 
  CheckCircle,
  Users
} from "lucide-react";

interface AuthVisualsProps {
  initialMode?: "login" | "register";
}

export function AuthVisuals({ initialMode = "login" }: AuthVisualsProps) {
  // Start with Slide 1 for Register, Slide 2 for Login
  const [activeSlide, setActiveSlide] = useState(initialMode === "register" ? 0 : 1);

  // Auto cycle slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex flex-1 flex-col justify-between h-full bg-[#050505] p-10 xl:p-14 text-white overflow-hidden font-mono select-none">
      {/* Background cyber grid effect */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.3)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60"
        style={{ maskImage: "radial-gradient(ellipse at center, black, transparent 80%)" }}
      />
      {/* Scanline overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.005] to-transparent bg-[length:100%_4px] pointer-events-none" />

      {/* Top Header Row */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/80 backdrop-blur-sm px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          SYSTEM SECURE
        </span>
        <span className="text-[10px] text-neutral-500 font-medium tracking-wider">
          NODE: WF-CORE-009
        </span>
      </div>

      {/* Slide Container (Main Display) */}
      <div className="relative z-10 flex-1 flex flex-col justify-center my-12 min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeSlide === 0 && <WorkspaceIntelligenceSlide key="slide0" />}
          {activeSlide === 1 && <SystemIntelligenceSlide key="slide1" />}
          {activeSlide === 2 && <EngineTerminalSlide key="slide2" />}
        </AnimatePresence>
      </div>

      {/* Bottom Controls & Status Row */}
      <div className="relative z-10 flex flex-col gap-6 pt-6 border-t border-neutral-900">
        {/* Carousel Dots */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  activeSlide === idx 
                    ? "w-8 bg-white" 
                    : "w-2 bg-neutral-800 hover:bg-neutral-600"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-[9px] font-bold tracking-[0.12em] text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              LINK ACTIVE
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-emerald-500/80" />
              AES-256
            </span>
          </div>
        </div>

        {/* Brand Precision Footer */}
        <p className="text-[9px] tracking-[0.14em] text-neutral-600 uppercase font-semibold leading-relaxed">
          &copy; {new Date().getFullYear()} WRITEFLOW AI &bull; CLINICAL PRECISION INFRASTRUCTURE
        </p>
      </div>
    </div>
  );
}

/* ==========================================================================
   SLIDE 1: WORKSPACE INTELLIGENCE
   ========================================================================== */
function WorkspaceIntelligenceSlide() {
  // Height ratios for velocity bars
  const initialBarHeights = [40, 65, 30, 85, 55, 95, 45, 60, 80, 50, 70, 90];
  const [barHeights, setBarHeights] = useState(initialBarHeights);

  // Pulse effect on bars
  useEffect(() => {
    const interval = setInterval(() => {
      setBarHeights(prev => 
        prev.map(h => {
          const delta = Math.floor(Math.random() * 16) - 8;
          return Math.max(15, Math.min(100, h + delta));
        })
      );
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400 flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-neutral-400" />
          INTELLIGENCE OVERVIEW
        </span>
        <h2 className="font-display text-4xl xl:text-5xl font-black leading-tight tracking-tight text-white">
          Workspace
          <br />
          Intelligence.
        </h2>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-neutral-900/30 rounded-bl-full pointer-events-none" />
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-500 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-neutral-400" />
            Words Generated
          </p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-display text-3xl font-bold tracking-tight text-white">
              <CountUp end={842100} duration={2.2} separator="," formattingFn={(val) => (val / 1000).toFixed(1) + "K"} />
            </span>
            <span className="text-[10px] font-bold text-emerald-500">+12.4%</span>
          </div>
          <p className="mt-1 text-[9px] text-neutral-500 font-medium">SYSTEM CAPACITY</p>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-4 relative overflow-hidden">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-500 flex items-center gap-1.5">
            <Database className="h-3 w-3 text-neutral-400" />
            AI Accuracy
          </p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-display text-3xl font-bold tracking-tight text-white">
              <CountUp start={85} end={99.98} duration={2.5} decimals={2} suffix="%" />
            </span>
          </div>
          <p className="mt-1 text-[9px] text-neutral-400 font-bold tracking-wider uppercase">CLINICAL GRADE</p>
        </div>
      </div>

      {/* Animated Velocity Graph Panel */}
      <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-5 relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-500">CONTENT VELOCITY</p>
            <p className="text-sm font-semibold tracking-tight text-white mt-0.5">45.28 msg/sec</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-500">PRODUCTIVITY</p>
            <p className="text-xs font-bold text-white tracking-widest mt-0.5">HIGH-BANDWIDTH</p>
          </div>
        </div>

        {/* Bars Container */}
        <div className="h-28 flex items-end justify-between gap-1.5 px-2 border-b border-neutral-900">
          {barHeights.map((h, i) => (
            <motion.div
              key={i}
              className="w-full rounded-t-[2px] bg-gradient-to-t from-neutral-950 via-neutral-800 to-white/90"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            />
          ))}
        </div>

        {/* Timestamps indicator */}
        <div className="flex justify-between items-center text-[8px] text-neutral-600 font-semibold pt-2">
          <span>00:00:00</span>
          <span>00:12:00</span>
          <span>00:24:00</span>
          <span>00:36:00</span>
          <span>00:48:00</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   SLIDE 2: SYSTEM INTELLIGENCE / REVENUE
   ========================================================================== */
function SystemIntelligenceSlide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-5"
    >
      {/* Top Title */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400 flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-neutral-400" />
          SYSTEM INTELLIGENCE / REVENUE
        </span>
      </div>

      {/* Main Stats Split */}
      <div className="grid grid-cols-5 gap-4">
        {/* Left Giant stat card (3 cols) */}
        <div className="col-span-3 rounded-xl border border-neutral-900 bg-neutral-950 p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-neutral-500">PROJECTED METRIC</span>
            <h3 className="text-3xl xl:text-4xl font-extrabold tracking-tight mt-1 text-white">
              $<CountUp end={15832} duration={2} separator="," />
            </h3>
          </div>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-emerald-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            GROWTH RATIO: +12.4%
          </div>

          {/* Sparkline background graphic */}
          <div className="absolute bottom-0 right-0 left-0 h-10 opacity-30 pointer-events-none">
            <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0,25 Q15,10 30,22 T60,5 T90,12 L100,8 L100,30 L0,30 Z"
                fill="url(#sparkGradient)"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <defs>
                <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Right Circular progress card (2 cols) */}
        <div className="col-span-2 rounded-xl border border-neutral-900 bg-neutral-950 p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-neutral-500 mb-2">GLOBAL TARGET</p>
          <div className="relative w-18 h-18 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-neutral-900"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                className="text-white"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="100, 100"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: "80, 100" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute text-center flex flex-col justify-center items-center">
              <span className="text-sm font-black tracking-tighter">80%</span>
            </div>
          </div>
          <span className="text-[9px] text-neutral-400 font-bold mt-2">3,415 / 5,000</span>
        </div>
      </div>

      {/* Closed Won details */}
      <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-4 space-y-3.5">
        <div className="flex items-center justify-between text-[9px] font-bold tracking-wider text-neutral-500 uppercase pb-1 border-b border-neutral-900">
          <span>CLOSED WON BY TYPE</span>
          <span>VOLUME</span>
        </div>

        {/* Detail 1 */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-neutral-300">
            <span>Enterprise Intelligence</span>
            <span className="font-bold text-white">$11,680</span>
          </div>
          <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: "74%" }}
              transition={{ duration: 1.2, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Detail 2 */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-neutral-300">
            <span>Clinical Automation</span>
            <span className="font-bold text-white">$4,152</span>
          </div>
          <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-neutral-500"
              initial={{ width: 0 }}
              animate={{ width: "26%" }}
              transition={{ duration: 1.2, delay: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Mini Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-neutral-900 bg-neutral-950 p-2.5 text-center">
          <span className="block text-[8px] font-bold text-neutral-500 uppercase tracking-wider">CONVERSION</span>
          <span className="block text-xs font-bold text-white mt-1">75.3%</span>
        </div>
        <div className="rounded-lg border border-neutral-900 bg-neutral-950 p-2.5 text-center">
          <span className="block text-[8px] font-bold text-neutral-500 uppercase tracking-wider">SYNC RATE</span>
          <span className="block text-xs font-bold text-white mt-1">92%</span>
        </div>
        <div className="rounded-lg border border-neutral-900 bg-neutral-950 p-2.5 flex flex-col items-center justify-center">
          <span className="block text-[8px] font-bold text-neutral-500 uppercase tracking-wider mb-1">AUDIT</span>
          <div className="flex -space-x-1.5 overflow-hidden">
            <div className="inline-block h-4.5 w-4.5 rounded-full ring-2 ring-neutral-950 bg-neutral-800 text-[6px] flex items-center justify-center font-bold">U1</div>
            <div className="inline-block h-4.5 w-4.5 rounded-full ring-2 ring-neutral-950 bg-neutral-700 text-[6px] flex items-center justify-center font-bold">U2</div>
            <div className="inline-block h-4.5 w-4.5 rounded-full ring-2 ring-neutral-950 bg-neutral-600 text-[6px] flex items-center justify-center font-bold font-mono">+4</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   SLIDE 3: TERMINAL CODE LOG STREAM
   ========================================================================== */
function EngineTerminalSlide() {
  const [lines, setLines] = useState<string[]>([]);
  const terminalOutputs = [
    "&bull; SYSTEM: WF-CORE-INIT-SUITE [ENGAGED]",
    "&bull; SERVICE: loading vector weights...",
    "&bull; EMBEDDINGS: 1536 dimensions [OK]",
    "&bull; NET: connected to edge nodes: latency 12ms",
    "&bull; CONTEXT: optimization threshold &gt; 99.4%",
    "&bull; SEED: randomized entropy initialized",
    "&bull; CORE: agent engine online. cluster syncd [12 nodes]",
    "&bull; STATUS: pipeline status secure. ready."
  ];

  useEffect(() => {
    let currentLineIdx = 0;
    const streamInterval = setInterval(() => {
      if (currentLineIdx < terminalOutputs.length) {
        setLines((prev) => [...prev, terminalOutputs[currentLineIdx]]);
        currentLineIdx++;
      } else {
        clearInterval(streamInterval);
      }
    }, 850);

    return () => clearInterval(streamInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400 flex items-center gap-2">
          <TerminalIcon className="h-3.5 w-3.5 text-neutral-400" />
          DEEP CORE AGENT PROTOCOL
        </span>
      </div>

      <div className="rounded-xl border border-neutral-900 bg-black/90 p-5 font-mono text-[11px] leading-relaxed text-emerald-400 min-h-[220px] flex flex-col justify-between shadow-2xl">
        <div className="space-y-1.5 overflow-hidden">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              dangerouslySetInnerHTML={{ __html: line }}
            />
          ))}
          {lines.length < terminalOutputs.length && (
            <motion.div 
              className="inline-block h-3.5 w-2 bg-emerald-400/80 align-middle ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          )}
        </div>

        <div className="pt-4 border-t border-neutral-950 mt-4 flex justify-between items-center text-[9px] text-neutral-500 uppercase font-semibold">
          <span>CONSOLE MAIN STREAM</span>
          <span className="flex items-center gap-1 text-emerald-500 animate-pulse">
            <RefreshCw className="h-2.5 w-2.5 animate-spin-loader" />
            RECEIVING DATA
          </span>
        </div>
      </div>

      {/* Bottom Promo Content block */}
      <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500">AUTONOMOUS WRITING ENGINE</p>
        <p className="mt-2 text-xs leading-relaxed text-neutral-300">
          WriteFlow AI orchestrates context arrays, templates, and agentic cycles dynamically to ensure optimal generation speed.
        </p>
      </div>
    </motion.div>
  );
}

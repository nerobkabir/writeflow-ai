"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText, Type, Zap, Plus, ArrowRight, Star,
  TrendingUp, Calendar, ChevronRight
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

// Simulated usage tracking data
const usageHistory = [
  { date: "05/18", words: 2400 },
  { date: "05/19", words: 4100 },
  { date: "05/20", words: 1800 },
  { date: "05/21", words: 6200 },
  { date: "05/22", words: 3500 },
  { date: "05/23", words: 8900 },
  { date: "05/24", words: 5100 },
];

const mockStats = [
  {
    label: "Documents This Month",
    value: "14",
    total: "/ 50 limit",
    icon: FileText,
    desc: "2.4% increase from last month",
  },
  {
    label: "Total Words Generated",
    value: "32,450",
    total: "words",
    icon: Type,
    desc: "18.2% acceleration overall",
  },
  {
    label: "AI Generation Calls",
    value: "184",
    total: "calls",
    icon: Zap,
    desc: "99.8% model success rate",
  },
];

const recentDocs = [
  {
    id: "doc-1",
    title: "Q1 Operations Review Spec",
    category: "Business",
    words: 850,
    date: "May 24, 2026",
    status: "Published",
  },
  {
    id: "doc-2",
    title: "Consensus Engine Architecture",
    category: "Technical",
    words: 2450,
    date: "May 22, 2026",
    status: "Draft",
  },
  {
    id: "doc-3",
    title: "SaaS Expansion Vision",
    category: "Marketing",
    words: 1100,
    date: "May 19, 2026",
    status: "Archived",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Workspace Terminal</h1>
          <p className="text-[13.5px] text-muted-foreground mt-1">
            Overview of your active system integrations, content models, and usage metrics.
          </p>
        </div>
        <Link
          href="/documents/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-background rounded-lg font-bold text-[13px] hover:opacity-90 transition-opacity w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Document</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="border border-border bg-surface rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-badge border border-border flex items-center justify-center text-foreground shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold tracking-tight">{stat.value}</span>
                  <span className="text-[13px] text-muted-foreground">{stat.total}</span>
                </div>
                <p className="text-[11.5px] text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-foreground" />
                  <span>{stat.desc}</span>
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="border border-border bg-surface rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-[15px] tracking-tight">Generation Velocity</h3>
            <p className="text-[12px] text-muted-foreground">Words generated per day over the last 7 days</p>
          </div>
          <span className="text-[11px] font-mono bg-badge text-foreground px-2 py-0.5 rounded border border-border">
            MONITOR: ACTIVE
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usageHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--text-foreground)" stopOpacity={0.06} />
                  <stop offset="95%" stopColor="var(--text-foreground)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="var(--muted-text)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-text)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="words"
                stroke="var(--foreground)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorWords)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Documents Table & Action Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Column */}
        <div className="lg:col-span-2 border border-border bg-surface rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="font-bold text-[14.5px] tracking-tight">Recent System Files</h3>
            <Link
              href="/documents"
              className="text-[12px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <span>View all files</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[11px] font-bold text-muted-foreground uppercase">
                  <th className="py-2.5">File Name</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Words</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-[13.5px]">
                {recentDocs.map((doc) => (
                  <tr key={doc.id} className="group hover:bg-badge/20 transition-colors">
                    <td className="py-3 font-semibold text-foreground">
                      <Link href={`/documents/${doc.id}`} className="hover:underline">
                        {doc.title}
                      </Link>
                    </td>
                    <td className="py-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground bg-badge/60 px-1.5 py-0.5 rounded">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-[12px]">{doc.words.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/documents/${doc.id}`}
                        className="inline-flex items-center justify-center w-7 h-7 rounded border border-border bg-background text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Tips/Workflows Column */}
        <div className="border border-border bg-surface rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="w-4.5 h-4.5 fill-foreground text-foreground" />
              <h3 className="font-bold text-[14.5px] tracking-tight">System Directives</h3>
            </div>
            <p className="text-[12.5px] text-muted-foreground leading-relaxed">
              Enforce structural precision across all active AI drafts. For business outline creation, try deploying the <strong>Strategic Executive Memo</strong> template to minimize redundant reviews.
            </p>
          </div>

          <Link
            href="/explore"
            className="mt-6 w-full text-center py-2.5 bg-badge hover:bg-accent hover:text-background text-foreground rounded-lg font-bold text-[12.5px] transition-all duration-150 border border-border"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}

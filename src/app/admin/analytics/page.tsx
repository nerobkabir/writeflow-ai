"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { BarChart3, DollarSign, Sparkles, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Card = { key: string; label: string; value: number; trend: number };

type AnalyticsPayload = {
  cards: Card[];
  dailyAiUsage: { date: string; count: number }[];
  userSignups: { month: string; label: string; count: number }[];
  contentTypeBreakdown: { name: string; value: number }[];
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, []);

  const cards = data?.cards ?? [];
  const iconByKey: Record<string, React.ComponentType<{ className?: string }>> = {
    totalUsers: Users,
    totalDocuments: BarChart3,
    aiCallsToday: Sparkles,
    monthlyRevenue: DollarSign,
  };

  // Curated premium color schemes
  const isDark = resolvedTheme === "dark";
  const gridColor = isDark ? "#222222" : "#E5E5E5";
  const axisColor = isDark ? "#888888" : "#6B7280";
  const barColor = isDark ? "#FAFAFA" : "#0A0A0A";
  const lineColor = isDark ? "#38BDF8" : "#0284C7";
  const tooltipBg = isDark ? "#111111" : "#FFFFFF";
  const tooltipBorder = isDark ? "#222222" : "#E5E5E5";

  const PIE_COLORS = isDark
    ? ["#818CF8", "#38BDF8", "#34D399", "#FBBF24", "#F87171"] // Dark mode vibrant
    : ["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444"]; // Light mode solid

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
        <span className="text-sm text-muted-foreground animate-pulse">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Real-time admin metrics from database records.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = iconByKey[card.key] ?? BarChart3;
          const positive = card.trend >= 0;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
              className="rounded-xl border border-border bg-surface p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{card.label}</p>
                <div className="p-2 rounded-lg bg-badge">
                  <Icon className="h-4.5 w-4.5 text-foreground" />
                </div>
              </div>
              <div className="mt-4 text-3xl font-bold tracking-tight">
                {card.key === "monthlyRevenue" ? "$" : ""}
                <CountUp end={card.value} duration={1.2} separator="," />
              </div>
              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    positive ? "bg-success-bg text-success" : "bg-error-bg text-error"
                  }`}
                >
                  {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(card.trend).toFixed(1)}% vs last month
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Daily AI Usage Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-xl border border-border bg-surface p-6 shadow-sm"
        >
          <div className="mb-6">
            <h2 className="text-[15px] font-bold tracking-tight">Daily AI Usage</h2>
            <p className="text-xs text-muted-foreground">Volume of AI writer and assistant requests (last 30 days)</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.dailyAiUsage ?? []} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: axisColor }}
                  axisLine={{ stroke: gridColor }}
                  tickLine={{ stroke: gridColor }}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: axisColor }}
                  axisLine={{ stroke: gridColor }}
                  tickLine={{ stroke: gridColor }}
                />
                <Tooltip
                  contentStyle={{
                    background: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: "8px",
                    color: isDark ? "#FAFAFA" : "#0A0A0A",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar 
                  name="Requests" 
                  dataKey="count" 
                  fill={barColor} 
                  radius={[4, 4, 0, 0]}
                  animationBegin={0} 
                  animationDuration={800} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* User Signups Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl border border-border bg-surface p-6 shadow-sm"
        >
          <div className="mb-6">
            <h2 className="text-[15px] font-bold tracking-tight">User Signups</h2>
            <p className="text-xs text-muted-foreground">Monthly growth of user accounts (last 12 months)</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.userSignups ?? []} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 10, fill: axisColor }}
                  axisLine={{ stroke: gridColor }}
                  tickLine={{ stroke: gridColor }}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: axisColor }}
                  axisLine={{ stroke: gridColor }}
                  tickLine={{ stroke: gridColor }}
                />
                <Tooltip
                  contentStyle={{
                    background: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: "8px",
                    color: isDark ? "#FAFAFA" : "#0A0A0A",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Line 
                  name="New Users" 
                  type="monotone" 
                  dataKey="count" 
                  stroke={lineColor} 
                  strokeWidth={2.5} 
                  dot={{ r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6 }}
                  animationBegin={0}
                  animationDuration={900} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Content Type Breakdown Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="rounded-xl border border-border bg-surface p-6 shadow-sm"
      >
        <div className="mb-6">
          <h2 className="text-[15px] font-bold tracking-tight">Content Type Breakdown</h2>
          <p className="text-xs text-muted-foreground">Distribution of documents created across templates</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data?.contentTypeBreakdown ?? []}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={4}
                animationBegin={0}
                animationDuration={800}
                label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {(data?.contentTypeBreakdown ?? []).map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: "8px",
                  color: isDark ? "#FAFAFA" : "#0A0A0A",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

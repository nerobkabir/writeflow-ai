import { NextResponse } from "next/server";
import type { Plan } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PLAN_PRICE: Record<string, number> = {
  FREE: 0,
  PRO: 29,
  TEAM: 99,
};

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function monthLabel(date: Date) {
  return date.toLocaleString("en-US", { month: "short" });
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const now = new Date();
  const todayStart = startOfDay(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thirtyDaysAgo = new Date(todayStart);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

  const signupsStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [
    totalUsers,
    previousTotalUsers,
    totalDocuments,
    previousTotalDocuments,
    aiCallsToday,
    previousAiCalls,
    subscriptions,
    previousSubscriptions,
    aiUsageHistory,
    recentUsers,
    docsWithTemplates,
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null, createdAt: { lt: monthStart } } }),
    prisma.document.count({ where: { deletedAt: null } }),
    prisma.document.count({ where: { deletedAt: null, createdAt: { lt: monthStart } } }),
    prisma.aIUsageHistory.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.aIUsageHistory.count({
      where: {
        createdAt: {
          gte: new Date(todayStart.getTime() - 24 * 60 * 60 * 1000),
          lt: todayStart,
        },
      },
    }),
    prisma.subscription.findMany({ where: { status: "ACTIVE" }, select: { plan: true } }),
    prisma.subscription.findMany({
      where: { status: "ACTIVE", createdAt: { lt: monthStart } },
      select: { plan: true },
    }),
    prisma.aIUsageHistory.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.findMany({
      where: { deletedAt: null, createdAt: { gte: signupsStart } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.document.findMany({
      where: { deletedAt: null },
      select: { template: { select: { category: true } } },
    }),
  ]);

  const revenue = subscriptions.reduce(
    (sum: number, s: { plan: Plan }) => sum + (PLAN_PRICE[s.plan] ?? 0),
    0
  );
  const previousRevenue = previousSubscriptions.reduce(
    (sum: number, s: { plan: Plan }) => sum + (PLAN_PRICE[s.plan] ?? 0),
    0
  );

  const dailyMap = new Map<string, number>();
  for (let i = 0; i < 30; i += 1) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(thirtyDaysAgo.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    dailyMap.set(key, 0);
  }
  for (const row of aiUsageHistory) {
    const key = row.createdAt.toISOString().slice(0, 10);
    dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1);
  }
  const dailyAiUsage = [...dailyMap.entries()].map(([date, count]) => ({
    date,
    count,
  }));

  const signupMap = new Map<string, number>();
  for (let i = 0; i < 12; i += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    signupMap.set(key, 0);
  }
  for (const row of recentUsers) {
    const date = row.createdAt;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (signupMap.has(key)) signupMap.set(key, (signupMap.get(key) ?? 0) + 1);
  }
  const userSignups = [...signupMap.entries()].map(([month, count]) => {
    const [y, m] = month.split("-");
    return {
      month,
      label: monthLabel(new Date(Number(y), Number(m) - 1, 1)),
      count,
    };
  });

  const breakdown = {
    Blog: 0,
    Social: 0,
    Email: 0,
    AdCopy: 0,
    Other: 0,
  };
  for (const row of docsWithTemplates) {
    const category = row.template?.category ?? "Other";
    if (category in breakdown) {
      breakdown[category as keyof typeof breakdown] += 1;
    } else {
      breakdown.Other += 1;
    }
  }

  const cards = [
    {
      key: "totalUsers",
      label: "Total Users",
      value: totalUsers,
      trend: previousTotalUsers === 0 ? 100 : ((totalUsers - previousTotalUsers) / previousTotalUsers) * 100,
    },
    {
      key: "totalDocuments",
      label: "Total Documents",
      value: totalDocuments,
      trend:
        previousTotalDocuments === 0
          ? 100
          : ((totalDocuments - previousTotalDocuments) / previousTotalDocuments) * 100,
    },
    {
      key: "aiCallsToday",
      label: "AI Calls Today",
      value: aiCallsToday,
      trend: previousAiCalls === 0 ? 100 : ((aiCallsToday - previousAiCalls) / previousAiCalls) * 100,
    },
    {
      key: "monthlyRevenue",
      label: "Monthly Revenue",
      value: revenue,
      trend: previousRevenue === 0 ? 100 : ((revenue - previousRevenue) / previousRevenue) * 100,
    },
  ];

  return NextResponse.json({
    cards,
    dailyAiUsage,
    userSignups,
    contentTypeBreakdown: Object.entries(breakdown).map(([name, value]) => ({
      name,
      value,
    })),
  });
}

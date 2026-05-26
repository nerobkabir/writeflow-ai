import { NextResponse } from "next/server";
import { resolveAuthUser } from "@/lib/auth-server";
import { isDatabaseConnectionError } from "@/lib/db-error";
import { listDemoDocuments } from "@/lib/demo-documents";
import { listLocalDocuments } from "@/lib/local-document-store";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await resolveAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  try {
    const [documentsThisMonth, totalWords, aiRequestsThisMonth] = await Promise.all([
      prisma.document.count({
        where: { userId: user.id, deletedAt: null, createdAt: { gte: monthStart } },
      }),
      prisma.document.aggregate({
        where: { userId: user.id, deletedAt: null },
        _sum: { wordCount: true },
      }),
      prisma.aIUsageHistory.count({
        where: { userId: user.id, createdAt: { gte: monthStart } },
      }),
    ]);

    return NextResponse.json({
      documentsThisMonth,
      totalWordsGenerated: totalWords._sum.wordCount ?? 0,
      aiRequestsThisMonth,
      plan: user.plan,
    });
  } catch (error) {
    if (!isDatabaseConnectionError(error)) {
      console.error("GET /api/user/stats:", error);
      return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
    }

    const docs = [...listLocalDocuments(user.id), ...listDemoDocuments(user.id)];
    const totalWords = docs.reduce((n, d) => n + d.wordCount, 0);

    return NextResponse.json({
      documentsThisMonth: docs.length,
      totalWordsGenerated: totalWords,
      aiRequestsThisMonth: 0,
      plan: user.plan,
      offline: true,
    });
  }
}

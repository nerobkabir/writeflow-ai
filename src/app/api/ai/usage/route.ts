import { NextResponse } from "next/server";
import type { AgentType } from "@prisma/client";
import { resolveAuthUser } from "@/lib/auth-server";
import { isDatabaseConnectionError } from "@/lib/db-error";
import { prisma } from "@/lib/prisma";

const AGENT_MAP: Record<string, AgentType> = {
  draft: "DRAFT",
  rewrite: "REWRITE",
  chat: "CHAT",
  summarise: "SUMMARISE",
  summarize: "SUMMARISE",
};

export async function GET(request: Request) {
  const user = await resolveAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = 20;
  const agentFilter = searchParams.get("agent")?.toLowerCase() || "all";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const where: {
    userId: string;
    agentType?: AgentType;
    createdAt?: { gte?: Date; lte?: Date };
  } = { userId: user.id };

  if (agentFilter !== "all" && AGENT_MAP[agentFilter]) {
    where.agentType = AGENT_MAP[agentFilter];
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  try {
    const [items, total] = await Promise.all([
      prisma.aIUsageHistory.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.aIUsageHistory.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      pageSize: limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return NextResponse.json({
        items: [],
        total: 0,
        page: 1,
        pageSize: limit,
        totalPages: 1,
        offline: true,
      });
    }
    console.error("GET /api/ai/usage:", error);
    return NextResponse.json({ error: "Failed to load usage history" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const status = searchParams.get("status")?.trim() ?? "ALL";
  const templateSearch = searchParams.get("template")?.trim() ?? "";
  const take = 20;
  const skip = (Math.max(page, 1) - 1) * take;

  const where = {
    ...(status !== "ALL" ? { status: status as "PENDING" | "APPROVED" | "REJECTED" } : {}),
    ...(templateSearch
      ? {
          template: {
            title: { contains: templateSearch, mode: "insensitive" as const },
          },
        }
      : {}),
  };

  const [reviews, totalCount] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        template: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.review.count({ where }),
  ]);

  return NextResponse.json({
    reviews,
    totalCount,
    page: Math.max(page, 1),
    totalPages: Math.ceil(totalCount / take),
  });
}

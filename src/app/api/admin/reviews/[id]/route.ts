import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const { id } = await params;
  const body = (await request.json()) as { status: "PENDING" | "APPROVED" | "REJECTED" };

  const review = await prisma.review.update({
    where: { id },
    data: { status: body.status },
    select: { id: true, status: true },
  });

  return NextResponse.json({ review });
}

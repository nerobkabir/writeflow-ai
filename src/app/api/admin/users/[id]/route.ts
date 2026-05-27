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
  const body = (await request.json()) as {
    role?: "USER" | "ADMIN";
    isBanned?: boolean;
  };

  if (!body.role && typeof body.isBanned !== "boolean") {
    return NextResponse.json({ error: "No valid update fields" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(body.role ? { role: body.role } : {}),
      ...(typeof body.isBanned === "boolean" ? { isBanned: body.isBanned } : {}),
    },
    select: {
      id: true,
      role: true,
      isBanned: true,
    },
  });

  return NextResponse.json({ user: updated });
}

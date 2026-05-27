import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SETTINGS_ID = "singleton";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const settings = await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID },
  });

  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = (await request.json()) as Record<string, unknown>;
  const settings = await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: body,
    create: { id: SETTINGS_ID, ...(body as object) },
  });

  return NextResponse.json({ settings });
}

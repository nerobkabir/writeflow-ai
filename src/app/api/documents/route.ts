import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const documents = await prisma.document.findMany({
    where: { userId, deletedAt: null },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      status: true,
      wordCount: true,
      updatedAt: true,
      templateId: true,
    },
  });

  return NextResponse.json({ documents });
}

export async function POST(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const templateId = body.templateId as string | undefined;
  const title = (body.title as string) || "Untitled Document";

  const document = await prisma.document.create({
    data: {
      userId,
      templateId: templateId || null,
      title,
      content: "<h1>Untitled Document</h1><p></p>",
      wordCount: 2,
      status: "DRAFT",
    },
  });

  return NextResponse.json({ document }, { status: 201 });
}

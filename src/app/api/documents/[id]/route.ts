import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { countWordsFromHtml } from "@/lib/document-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const document = await prisma.document.findFirst({
    where: { id, userId, deletedAt: null },
    include: {
      template: { select: { id: true, title: true, prompt: true, slug: true } },
    },
  });

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json({ document });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.document.findFirst({
    where: { id, userId, deletedAt: null },
  });

  if (!existing) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const content = body.content !== undefined ? String(body.content) : existing.content;
  const title = body.title !== undefined ? String(body.title) : existing.title;
  const wordCount =
    body.wordCount !== undefined
      ? Number(body.wordCount)
      : countWordsFromHtml(content);

  const document = await prisma.document.update({
    where: { id },
    data: {
      title,
      content,
      wordCount,
      ...(body.metaDescription !== undefined && {
        metaDescription: String(body.metaDescription),
      }),
      ...(body.tags !== undefined && { tags: body.tags as string[] }),
    },
  });

  return NextResponse.json({ document });
}

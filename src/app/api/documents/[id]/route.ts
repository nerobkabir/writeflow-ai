import { NextResponse } from "next/server";
import type { DocStatus } from "@prisma/client";
import { resolveAuthUser } from "@/lib/auth-server";
import { databaseErrorMessage, isDatabaseConnectionError } from "@/lib/db-error";
import { getDemoDocument, isDemoDocumentId, patchDemoDocument } from "@/lib/demo-documents";
import { getLocalDocument, updateLocalDocument } from "@/lib/local-document-store";
import { prisma } from "@/lib/prisma";
import { countWordsFromHtml } from "@/lib/document-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await resolveAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (isDemoDocumentId(id)) {
    const demo = getDemoDocument(id, user.id);
    if (demo) {
      return NextResponse.json({ document: demo, offline: false });
    }
  }

  const local = getLocalDocument(id, user.id);
  if (local) {
    return NextResponse.json({ document: local, offline: true, message: databaseErrorMessage() });
  }

  try {
    const document = await prisma.document.findFirst({
      where: { id, userId: user.id, deletedAt: null },
      include: {
        template: { select: { id: true, title: true, prompt: true, slug: true } },
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ document, offline: false });
  } catch (error) {
    if (!isDatabaseConnectionError(error)) {
      console.error(`GET /api/documents/${id}:`, error);
      return NextResponse.json({ error: "Failed to load document" }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Document not found", message: databaseErrorMessage() },
      { status: 404 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await resolveAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const content =
    body.content !== undefined ? String(body.content) : undefined;
  const title = body.title !== undefined ? String(body.title) : undefined;
  const wordCount =
    body.wordCount !== undefined
      ? Number(body.wordCount)
      : content
        ? countWordsFromHtml(content)
        : undefined;

  if (isDemoDocumentId(id)) {
    const updated = patchDemoDocument(id, user.id, { title, content, wordCount });
    if (!updated) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }
    return NextResponse.json({ document: updated, offline: true });
  }

  const localExisting = getLocalDocument(id, user.id);
  if (localExisting) {
    const document = updateLocalDocument(id, user.id, {
      title,
      content,
      wordCount,
    });
    return NextResponse.json({ document, offline: true });
  }

  try {
    const existing = await prisma.document.findFirst({
      where: { id, userId: user.id, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const nextContent = content ?? existing.content;
    const nextTitle = title ?? existing.title;
    const nextWordCount =
      wordCount !== undefined ? wordCount : countWordsFromHtml(nextContent);

    const status =
      body.status !== undefined ? (String(body.status).toUpperCase() as DocStatus) : undefined;

    const document = await prisma.document.update({
      where: { id },
      data: {
        title: nextTitle,
        content: nextContent,
        wordCount: nextWordCount,
        ...(status && { status }),
        ...(body.metaDescription !== undefined && {
          metaDescription: String(body.metaDescription),
        }),
        ...(body.tags !== undefined && { tags: body.tags as string[] }),
      },
    });

    return NextResponse.json({ document, offline: false });
  } catch (error) {
    if (!isDatabaseConnectionError(error)) {
      console.error(`PATCH /api/documents/${id}:`, error);
      return NextResponse.json({ error: "Failed to save document" }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to save document", message: databaseErrorMessage() },
      { status: 503 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await resolveAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (isDemoDocumentId(id)) {
    return NextResponse.json({ success: true });
  }

  try {
    const existing = await prisma.document.findFirst({
      where: { id, userId: user.id, deletedAt: null },
    });
    if (!existing) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    await prisma.document.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return NextResponse.json({ success: true, offline: true });
    }
    console.error(`DELETE /api/documents/${id}:`, error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}

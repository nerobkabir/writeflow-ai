import { NextResponse } from "next/server";
import { resolveAuthUser } from "@/lib/auth-server";
import { isDatabaseConnectionError } from "@/lib/db-error";
import { getDemoDocument, isDemoDocumentId } from "@/lib/demo-documents";
import { createLocalDocument, getLocalDocument } from "@/lib/local-document-store";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await resolveAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    let source = await prisma.document.findFirst({
      where: { id, userId: user.id, deletedAt: null },
    });

    if (!source && isDemoDocumentId(id)) {
      const demo = getDemoDocument(id, user.id);
      if (demo) {
        const document = createLocalDocument(user.id, {
          title: `${demo.title} (Copy)`,
          content: demo.content,
          templateId: demo.templateId,
        });
        return NextResponse.json({ document }, { status: 201 });
      }
    }

    if (!source) {
      const local = getLocalDocument(id, user.id);
      if (local) {
        const document = createLocalDocument(user.id, {
          title: `${local.title} (Copy)`,
          content: local.content,
          templateId: local.templateId,
        });
        return NextResponse.json({ document }, { status: 201 });
      }
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const document = await prisma.document.create({
      data: {
        userId: user.id,
        templateId: source.templateId,
        title: `${source.title} (Copy)`,
        content: source.content,
        wordCount: source.wordCount,
        status: "DRAFT",
        metaDescription: source.metaDescription,
        tags: source.tags,
      },
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      const local = getLocalDocument(id, user.id) ?? getDemoDocument(id, user.id);
      if (!local) {
        return NextResponse.json({ error: "Document not found" }, { status: 404 });
      }
      const document = createLocalDocument(user.id, {
        title: `${local.title} (Copy)`,
        content: local.content,
        templateId: local.templateId,
      });
      return NextResponse.json({ document }, { status: 201 });
    }
    console.error(`POST /api/documents/${id}/duplicate:`, error);
    return NextResponse.json({ error: "Failed to duplicate document" }, { status: 500 });
  }
}

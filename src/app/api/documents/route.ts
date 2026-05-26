import { NextResponse } from "next/server";
import { resolveAuthUser } from "@/lib/auth-server";
import { databaseErrorMessage, isDatabaseConnectionError } from "@/lib/db-error";
import { filterStatusToPrisma } from "@/lib/document-display";
import { listDemoDocuments } from "@/lib/demo-documents";
import { createLocalDocument, listLocalDocuments } from "@/lib/local-document-store";
import { prisma } from "@/lib/prisma";

function filterOfflineDocs(
  docs: Array<{
    id: string;
    title: string;
    content: string;
    status: string;
    wordCount: number;
    updatedAt: string;
    templateId: string | null;
    template?: { title: string; category: string | null } | null;
  }>,
  search: string,
  statusFilter: string
) {
  let list = docs;
  const prismaStatus = filterStatusToPrisma(statusFilter);
  if (prismaStatus) {
    list = list.filter((d) => String(d.status).toUpperCase() === prismaStatus);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q)
    );
  }
  return list.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function GET(request: Request) {
  const user = await resolveAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || "";
  const statusFilter = searchParams.get("status") || "all";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));

  const prismaStatus = filterStatusToPrisma(statusFilter);

  try {
    const where = {
      userId: user.id,
      deletedAt: null as null,
      ...(prismaStatus ? { status: prismaStatus } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { content: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          content: true,
          status: true,
          wordCount: true,
          updatedAt: true,
          templateId: true,
          tags: true,
          template: { select: { title: true, category: true } },
        },
      }),
      prisma.document.count({ where }),
    ]);

    return NextResponse.json({
      documents,
      total,
      page,
      pageSize: limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      offline: false,
    });
  } catch (error) {
    if (!isDatabaseConnectionError(error)) {
      console.error("GET /api/documents:", error);
      return NextResponse.json({ error: "Failed to load documents" }, { status: 500 });
    }

    const merged = [
      ...listLocalDocuments(user.id),
      ...listDemoDocuments(user.id),
    ].map((d) => ({
      ...d,
      tags: [] as string[],
      template: null,
    }));

    const filtered = filterOfflineDocs(merged, search, statusFilter);
    const total = filtered.length;
    const documents = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      documents,
      total,
      page,
      pageSize: limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      offline: true,
      message: databaseErrorMessage(),
    });
  }
}

export async function POST(request: Request) {
  const user = await resolveAuthUser();
  if (!user) {
    return NextResponse.json(
      {
        error:
          "Not signed in or user not found. Sign in with user@writeflow.com / 123456.",
      },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const rawTemplateId = body.templateId as string | undefined;
  const title = (body.title as string) || "Untitled Document";

  try {
    let templateId: string | null = null;
    if (rawTemplateId) {
      const template = await prisma.template.findUnique({
        where: { id: rawTemplateId },
      });
      if (template) templateId = template.id;
    }

    const document = await prisma.document.create({
      data: {
        userId: user.id,
        templateId,
        title,
        content: "<h1>Untitled Document</h1><p></p>",
        wordCount: 2,
        status: "DRAFT",
      },
    });

    return NextResponse.json({ document, offline: false }, { status: 201 });
  } catch (error) {
    if (!isDatabaseConnectionError(error)) {
      console.error("POST /api/documents:", error);
      return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
    }

    const document = createLocalDocument(user.id, {
      title,
      templateId: rawTemplateId ?? null,
    });

    return NextResponse.json(
      {
        document,
        offline: true,
        message: databaseErrorMessage(),
      },
      { status: 201 }
    );
  }
}

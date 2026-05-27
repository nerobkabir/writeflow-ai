import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const templates = await prisma.template.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      description: true,
      thumbnail: true,
      tone: true,
      estimatedWords: true,
      aiModel: true,
      prompt: true,
      sampleOutput: true,
      isPublished: true,
      rating: true,
      createdAt: true,
      usageCount: true,
    },
  });

  return NextResponse.json({ templates });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = (await request.json()) as {
    title: string;
    slug: string;
    category: string;
    description: string;
    prompt: string;
    sampleOutput: string;
    thumbnail?: string;
    tone: string;
    estimatedWords: number;
    aiModel: string;
    isPublished: boolean;
  };

  const template = await prisma.template.create({
    data: {
      title: body.title,
      slug: body.slug,
      category: body.category,
      description: body.description,
      prompt: body.prompt,
      sampleOutput: body.sampleOutput,
      thumbnail: body.thumbnail || null,
      tone: body.tone,
      estimatedWords: Number(body.estimatedWords) || 0,
      aiModel: body.aiModel,
      isPublished: Boolean(body.isPublished),
    },
  });

  return NextResponse.json({ template }, { status: 201 });
}

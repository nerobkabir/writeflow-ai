import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const { id } = await params;
  const body = await request.json();

  const template = await prisma.template.update({
    where: { id },
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

  return NextResponse.json({ template });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const { id } = await params;

  await prisma.template.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

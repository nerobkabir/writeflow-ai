import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTemplateBySlug } from "@/lib/templates-data";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const body = await request.json();
  const rating = Number(body.rating);
  const comment = String(body.comment || "").trim();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }
  if (comment.length < 10) {
    return NextResponse.json({ error: "Comment must be at least 10 characters" }, { status: 400 });
  }
  if (comment.length > 500) {
    return NextResponse.json({ error: "Comment must be 500 characters or fewer" }, { status: 400 });
  }

  const user = session.user as { name?: string | null; id?: string };
  const name = user.name || "WriteFlow User";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const review = {
    id: `rev-${Date.now()}`,
    name,
    initials,
    rating,
    comment,
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };

  return NextResponse.json({ review }, { status: 201 });
}

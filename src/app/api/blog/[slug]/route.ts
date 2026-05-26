import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const post = await prisma.blogPost.findUnique({
      where: { slug, published: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Query 3 related posts from same category, excluding current post
    const related = await prisma.blogPost.findMany({
      where: {
        category: post.category,
        slug: { not: slug },
        published: true,
      },
      take: 3,
    });

    return NextResponse.json({ post, related });
  } catch (error) {
    console.error("Error loading blog post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

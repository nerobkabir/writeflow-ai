import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const categoryParam = searchParams.get("category") || "All";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 9;
    const skip = (page - 1) * limit;

    // Construct DB query condition
    const where: any = { published: true };
    if (categoryParam !== "All") {
      where.category = categoryParam;
    }

    const [posts, totalCount] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      posts,
      totalCount,
      totalPages,
      page,
    });
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

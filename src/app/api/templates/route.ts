import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim().toLowerCase() || "";
  const category = searchParams.get("category")?.trim() || "";
  const rating = parseFloat(searchParams.get("rating") || "0");
  const sort = searchParams.get("sort")?.trim().toLowerCase() || "popular";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  // Category mapping helper
  // Request uses "Social Media" -> maps to "Social", "Ad Copy" -> maps to "AdCopy"
  let dbCategory = category;
  if (category === "Social Media") {
    dbCategory = "Social";
  } else if (category === "Ad Copy") {
    dbCategory = "AdCopy";
  }

  const where = {
    isPublished: true,
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { category: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(dbCategory && dbCategory.toLowerCase() !== "all"
      ? { category: { equals: dbCategory, mode: "insensitive" as const } }
      : {}),
    ...(rating > 0 ? { rating: { gte: rating } } : {}),
  };

  const orderBy =
    sort === "newest"
      ? { createdAt: "desc" as const }
      : sort === "highest-rated"
      ? { rating: "desc" as const }
      : { usageCount: "desc" as const };

  const [templates, totalCount] = await Promise.all([
    prisma.template.findMany({
      where,
      orderBy,
      skip: (Math.max(page, 1) - 1) * limit,
      take: limit,
    }),
    prisma.template.count({ where }),
  ]);

  const paginated = templates.map((tpl) => ({
    id: tpl.id,
    slug: tpl.slug,
    name: tpl.title,
    title: tpl.title,
    description: tpl.description,
    category: tpl.category,
    icon:
      tpl.category === "Blog"
        ? "FileText"
        : tpl.category === "Social"
        ? "Sparkles"
        : tpl.category === "Email"
        ? "Cpu"
        : "Briefcase",
    isPremium: tpl.aiModel === "gpt-4o",
    rating: tpl.rating,
    usageCount: tpl.usageCount,
    image: tpl.thumbnail || "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200",
    thumbnail: tpl.thumbnail || undefined,
    createdAt: tpl.createdAt.toISOString(),
  }));

  const totalPages = Math.ceil(totalCount / limit);

  return NextResponse.json({
    templates: paginated,
    totalCount,
    page,
    totalPages,
  });
}

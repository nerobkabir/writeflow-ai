import { NextResponse } from "next/server";
import { templatesDb } from "@/lib/templates-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim().toLowerCase() || "";
  const category = searchParams.get("category")?.trim() || "";
  const rating = parseFloat(searchParams.get("rating") || "0");
  const sort = searchParams.get("sort")?.trim().toLowerCase() || "popular";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  // Simulated latency for high-quality premium feel loader validation
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Category mapping helper
  // Request uses "Social Media" -> maps to "Social", "Ad Copy" -> maps to "AdCopy"
  let dbCategory = category;
  if (category === "Social Media") {
    dbCategory = "Social";
  } else if (category === "Ad Copy") {
    dbCategory = "AdCopy";
  }

  // 1. Filtering
  let filtered = templatesDb.filter((tpl) => {
    // Search filter (matches name, title, description, or category keywords)
    const matchesSearch =
      search === "" ||
      tpl.name.toLowerCase().includes(search) ||
      tpl.description.toLowerCase().includes(search) ||
      tpl.category.toLowerCase().includes(search);

    // Category filter
    const matchesCategory =
      dbCategory === "" ||
      dbCategory.toLowerCase() === "all" ||
      tpl.category.toLowerCase() === dbCategory.toLowerCase();

    // Rating filter
    const matchesRating = tpl.rating >= rating;

    return matchesSearch && matchesCategory && matchesRating;
  });

  // 2. Sorting
  filtered.sort((a, b) => {
    if (sort === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sort === "highest-rated") {
      return b.rating - a.rating;
    }
    // "popular" (default)
    return b.usageCount - a.usageCount;
  });

  // 3. Pagination calculation
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    templates: paginated,
    totalCount,
    page,
    totalPages,
  });
}

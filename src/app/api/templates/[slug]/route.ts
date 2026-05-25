import { NextResponse } from "next/server";
import {
  enrichTemplateDetail,
  generateReviewsForTemplate,
  getRatingDistribution,
  getRelatedTemplates,
  getReviewCount,
  getTemplateBySlug,
} from "@/lib/templates-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  await new Promise((resolve) => setTimeout(resolve, 400));

  const detail = enrichTemplateDetail(template);
  const reviewCount = getReviewCount(template);
  const reviews = generateReviewsForTemplate(template, 6);
  const ratingDistribution = getRatingDistribution(template.rating, reviewCount);
  const relatedTemplates = getRelatedTemplates(template, 4);

  return NextResponse.json({
    template: detail,
    reviews,
    reviewCount,
    averageRating: template.rating,
    ratingDistribution,
    relatedTemplates,
  });
}

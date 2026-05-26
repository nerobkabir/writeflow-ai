import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { generateText } from "@/lib/ai";

export async function POST() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const approvedReviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    include: { template: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const corpus = approvedReviews
    .map((r) => `Template: ${r.template.title}\nRating: ${r.rating}/5\nComment: ${r.comment}`)
    .join("\n\n---\n\n");

  const ai = await generateText(
    `Analyze these approved customer reviews and return exactly 3 concise bullet points:\n\n${corpus}`,
    {
      system:
        "You are a product analyst. Return plain text with exactly 3 short bullet points about themes and product quality.",
      maxTokens: 220,
    }
  );

  const ratingCounts = { positive: 0, neutral: 0, negative: 0 };
  for (const review of approvedReviews) {
    if (review.rating >= 4) ratingCounts.positive += 1;
    else if (review.rating === 3) ratingCounts.neutral += 1;
    else ratingCounts.negative += 1;
  }
  const total = Math.max(approvedReviews.length, 1);
  const sentiment = {
    positive: Math.round((ratingCounts.positive / total) * 100),
    neutral: Math.round((ratingCounts.neutral / total) * 100),
    negative: Math.round((ratingCounts.negative / total) * 100),
  };

  const bullets = (ai.text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"))
    .slice(0, 3);

  return NextResponse.json({
    bullets:
      bullets.length > 0
        ? bullets
        : [
            "- Customers appreciate output quality and speed.",
            "- High ratings cluster around template usefulness.",
            "- Main improvement area is prompt customization depth.",
          ],
    sentiment,
    reviewCount: approvedReviews.length,
  });
}

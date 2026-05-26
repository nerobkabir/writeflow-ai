"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FadeInUp } from "@/components/animations/FadeInUp";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  authorName: string;
  authorAvatar: string | null;
  readTime: string;
  createdAt: string;
};

const categories = ["All", "AI Writing", "Product", "Tutorials", "Case Studies"];

function BlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") || "All";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const query = new URLSearchParams({
      category: categoryParam,
      page: String(pageParam),
    });

    fetch(`/api/blog?${query.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (active) {
          setPosts(data.posts ?? []);
          setTotalPages(data.totalPages ?? 1);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [categoryParam, pageParam]);

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    params.delete("page"); // Reset to page 1
    router.push(`/blog?${params.toString()}`);
  };

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/blog?${params.toString()}`);
  };

  // The first post in the list when page === 1 acts as the featured post
  const featuredPost = pageParam === 1 && posts.length > 0 ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Header Block */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted bg-badge px-3 py-1.5 rounded-full border border-border/40 w-fit">
            WriteFlow Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-foreground pt-1">
            WriteFlow Blog
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Insights on AI-powered content creation, copywriting strategies, and technology roadmaps.
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-border/60 pb-6">
          {categories.map((cat) => {
            const isActive = categoryParam === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                  isActive
                    ? "bg-foreground text-background border-foreground font-extrabold"
                    : "bg-surface text-muted-foreground border-border hover:border-accent hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {loading ? (
          /* Loading skeleton */
          <div className="space-y-12 animate-pulse">
            <div className="h-[360px] bg-badge/40 border border-border rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-[280px] bg-badge/40 border border-border rounded-xl" />
              ))}
            </div>
          </div>
        ) : posts.length === 0 ? (
          /* Empty state */
          <div className="border border-dashed border-border rounded-2xl p-16 text-center space-y-3 bg-surface/30">
            <h3 className="font-bold text-[16px] tracking-tight">No articles found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn't find any published blog posts under this category. Check back soon for new updates!
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Featured Post Card */}
            {featuredPost && (
              <FadeInUp className="group border border-border bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
                {/* Thumbnail */}
                <div className="lg:col-span-7 aspect-[16/10] sm:aspect-[21/9] lg:aspect-auto w-full relative overflow-hidden border-b lg:border-b-0 lg:border-r border-border bg-badge/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredPost.thumbnail}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover grayscale opacity-75 group-hover:opacity-90 group-hover:scale-102 transition-all duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-surface/90 border border-border/80 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-foreground">
                    {featuredPost.category}
                  </span>
                </div>

                {/* Content */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-accent">
                      FEATURED ARTICLE
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-foreground group-hover:text-accent transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="border-t border-border/60 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full border border-border bg-badge overflow-hidden flex items-center justify-center shrink-0">
                        {featuredPost.authorAvatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={featuredPost.authorAvatar} alt={featuredPost.authorName} className="h-full w-full object-cover" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-foreground leading-none">{featuredPost.authorName}</p>
                        <p className="text-[10px] text-muted-foreground">{formatDate(featuredPost.createdAt)}</p>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center justify-center px-4 py-2 border border-border hover:border-accent text-foreground text-xs font-bold rounded-lg hover:bg-foreground hover:text-background transition-all duration-200"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </FadeInUp>
            )}

            {/* Remaining Posts Grid */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridPosts.map((post, idx) => (
                  <FadeInUp
                    key={post.id}
                    delay={idx * 0.05}
                    className="group border border-border bg-surface rounded-xl overflow-hidden flex flex-col h-[390px] shadow-sm hover:shadow-md hover:border-accent transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/10] w-full shrink-0 border-b border-border bg-badge/40 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover grayscale opacity-75 group-hover:opacity-90 group-hover:scale-103 transition-all duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-surface/90 border border-border/80 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-foreground">
                        {post.category}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4 overflow-hidden">
                      <div className="space-y-2.5 flex-grow">
                        <h3 className="font-bold text-[14.5px] leading-tight text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-[12.5px] text-muted-foreground leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="border-t border-border/50 pt-3 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full border border-border bg-badge overflow-hidden flex items-center justify-center shrink-0">
                            {post.authorAvatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={post.authorAvatar} alt={post.authorName} className="h-full w-full object-cover" />
                            ) : (
                              <User className="w-3 h-3 text-muted-foreground" />
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[11px] font-semibold text-foreground leading-none">{post.authorName}</p>
                            <p className="text-[9.5px] text-muted-foreground">{formatDate(post.createdAt)}</p>
                          </div>
                        </div>

                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-[11px] font-bold text-foreground hover:underline flex items-center gap-0.5"
                        >
                          Read Post →
                        </Link>
                      </div>
                    </div>
                  </FadeInUp>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="border-t border-border pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between text-[13px]">
                <div className="text-muted-foreground font-medium">
                  Showing Page <strong className="text-foreground font-semibold">{pageParam}</strong> of{" "}
                  <strong className="text-foreground font-semibold">{totalPages}</strong>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(Math.max(1, pageParam - 1))}
                    disabled={pageParam === 1}
                    className="p-2 border border-border bg-surface rounded-lg hover:border-accent disabled:opacity-40 disabled:hover:border-border transition-colors cursor-pointer shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = pageParam === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8.5 h-8.5 text-[12.5px] font-bold rounded-lg border transition-all ${
                          isActive
                            ? "bg-foreground text-background border-foreground font-extrabold"
                            : "bg-surface text-muted-foreground border-border hover:border-accent hover:text-foreground"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage(Math.min(totalPages, pageParam + 1))}
                    disabled={pageParam === totalPages}
                    className="p-2 border border-border bg-surface rounded-lg hover:border-accent disabled:opacity-40 disabled:hover:border-border transition-colors cursor-pointer shrink-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BlogListingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
          <Navbar />
          <div className="flex-grow flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-4 border-t-accent border-r-border border-b-border border-l-border animate-spin" />
              <p className="text-[12px] font-bold text-muted uppercase tracking-wider">
                Syncing articles...
              </p>
            </div>
          </div>
          <Footer />
        </div>
      }
    >
      <BlogContent />
    </Suspense>
  );
}

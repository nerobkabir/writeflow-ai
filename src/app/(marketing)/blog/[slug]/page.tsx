"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Calendar, Clock, User, Twitter, Linkedin, Link as LinkIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
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

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/blog/${slug}`)
      .then((res) => {
        if (!res.ok) {
          router.push("/blog");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setPost(data.post);
          setRelated(data.related ?? []);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.push("/blog");
      });
  }, [slug, router]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Article link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-t-accent border-r-border border-b-border border-l-border animate-spin" />
            <p className="text-[12px] font-bold text-muted uppercase tracking-wider">Syncing article details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) return null;

  // A simple markdown to HTML renderer for standard headings, bold text, links, lists and linebreaks
  const renderMarkdown = (md: string) => {
    const paragraphs = md.split("\n\n");
    return paragraphs.map((p, index) => {
      const trimmed = p.trim();
      if (trimmed.startsWith("### ")) {
        return <h3 key={index} className="text-lg sm:text-xl font-bold tracking-tight text-foreground mt-8 mb-4">{trimmed.replace("### ", "")}</h3>;
      }
      if (trimmed.startsWith("#### ")) {
        return <h4 key={index} className="text-base font-bold tracking-tight text-foreground mt-6 mb-3">{trimmed.replace("#### ", "")}</h4>;
      }
      if (trimmed.startsWith("1. ") || trimmed.startsWith("- ")) {
        const items = trimmed.split("\n");
        return (
          <ul key={index} className="list-disc pl-5 space-y-2 text-muted-foreground text-[13.5px] leading-relaxed my-4">
            {items.map((it, idx) => (
              <li key={idx}>
                {it.replace(/^\d+\.\s*/, "").replace(/^-\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1")}
              </li>
            ))}
          </ul>
        );
      }
      // Bold text replacement
      const formattedText = trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <p
          key={index}
          className="text-muted-foreground text-[13.5px] leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Back button & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wide select-none">
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-accent">{post.category}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground truncate max-w-[120px]">{post.title}</span>
          </div>
        </div>

        {/* Hero Section */}
        <FadeInUp className="space-y-6">
          <span className="inline-block bg-badge border border-border/80 px-3 py-1 rounded-full text-[10px] font-bold text-foreground">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-foreground">
            {post.title}
          </h1>

          {/* Author details & Social share */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-y border-border/50 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border border-border bg-badge overflow-hidden flex items-center justify-center shrink-0">
                {post.authorAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.authorAvatar} alt={post.authorName} className="h-full w-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-foreground">{post.authorName}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.createdAt)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, "_blank");
                }}
                className="h-8 w-8 rounded-lg border border-border bg-surface flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                title="Share on Twitter"
              >
                <Twitter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank");
                }}
                className="h-8 w-8 rounded-lg border border-border bg-surface flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={copyToClipboard}
                className="h-8 w-8 rounded-lg border border-border bg-surface flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                title="Copy Article Link"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </FadeInUp>

        {/* Large thumbnail image */}
        <FadeInUp className="aspect-[16/9] w-full rounded-2xl border border-border bg-badge/40 overflow-hidden shadow-sm relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover grayscale opacity-80"
          />
        </FadeInUp>

        {/* Article Text Content */}
        <FadeInUp className="max-w-3xl mx-auto space-y-4">
          <div className="prose dark:prose-invert max-w-none">
            {renderMarkdown(post.content)}
          </div>
        </FadeInUp>

        {/* Related Articles section */}
        {related.length > 0 && (
          <div className="border-t border-border pt-12 space-y-6">
            <FadeInUp className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
                Contextual Recommendations
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Related Posts
              </h2>
            </FadeInUp>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item, idx) => (
                <FadeInUp
                  key={item.id}
                  delay={idx * 0.05}
                  className="group border border-border bg-surface rounded-xl overflow-hidden flex flex-col h-[320px] shadow-sm hover:shadow-md hover:border-accent transition-all duration-300"
                >
                  <div className="aspect-[16/10] w-full relative overflow-hidden bg-badge/40 border-b border-border shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover grayscale opacity-75 group-hover:opacity-90 group-hover:scale-103 transition-all duration-500"
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between overflow-hidden">
                    <div className="space-y-1 flex-grow">
                      <span className="text-[9px] font-bold text-muted uppercase tracking-wider block">
                        {item.category}
                      </span>
                      <h3 className="font-bold text-[13px] leading-snug text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <Link
                      href={`/blog/${item.slug}`}
                      className="text-[11px] font-bold text-foreground hover:underline mt-4 block"
                    >
                      Read Post →
                    </Link>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

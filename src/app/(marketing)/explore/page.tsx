"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  Search, SlidersHorizontal, Star, ChevronLeft, ChevronRight, 
  Cpu, Sparkles, FileText, Briefcase, X, FileSearch, ArrowUpDown 
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { useDebounce } from "@/hooks/useDebounce";

// Icon mapping helper to render category icons beautifully
const iconMap: Record<string, any> = {
  FileText: FileText,   // Blog
  Sparkles: Sparkles,   // Social Media
  Cpu: Cpu,             // Email
  Briefcase: Briefcase, // Ad Copy
};

interface Template {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  isPremium: boolean;
  rating: number;
  usageCount: number;
  image: string;
  thumbnail?: string;
  createdAt: string;
}

// Map frontend filter category values to API database values
const mapCategoryToApi = (cat: string) => {
  if (cat === "Social Media") return "Social";
  if (cat === "Ad Copy") return "AdCopy";
  return cat;
};

// Map API database category values to frontend filter category values
const mapCategoryToFrontend = (cat: string) => {
  if (cat === "Social") return "Social Media";
  if (cat === "AdCopy") return "Ad Copy";
  return cat;
};

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL search params
  const categoryParam = searchParams.get("category") || "All";
  const ratingParam = parseInt(searchParams.get("rating") || "0", 10);
  const sortParam = searchParams.get("sort") || "popular";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const searchParam = searchParams.get("search") || "";

  // Local state
  const [searchInput, setSearchInput] = useState(searchParam);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Custom dropdown states
  const [sortOpen, setSortOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mobile drawer states
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Debounced search logic (300ms)
  const debouncedSearch = useDebounce(searchInput, 300);

  // Sync debounced search to URL search parameters
  useEffect(() => {
    updateUrlParams({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch]);

  // Keep search input in sync if URL parameter is updated externally (e.g. Back/Forward or Clear All)
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Handle outside click to close sort dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch templates from API when URL search parameters change
  useEffect(() => {
    let active = true;

    async function fetchTemplates() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          search: searchParam,
          category: categoryParam,
          rating: String(ratingParam),
          sort: sortParam,
          page: String(pageParam),
          limit: "12",
        });

        const res = await fetch(`/api/templates?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (active) {
            setTemplates(data.templates);
            setTotalCount(data.totalCount);
            setTotalPages(data.totalPages);
          }
        }
      } catch (err) {
        console.error("Error loading templates", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchTemplates();

    return () => {
      active = false;
    };
  }, [searchParam, categoryParam, ratingParam, sortParam, pageParam]);

  // Helper to update URL search parameters without reloading
  const updateUrlParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "All" || (key === "rating" && value === 0) || (key === "page" && value === 1)) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // Make sure we update the route in Next.js
    router.replace(`/explore?${params.toString()}`, { scroll: false });
  };

  // Check if any filter is active to show "Clear All Filters" button
  const isFilterActive = categoryParam !== "All" || ratingParam !== 0 || searchParam !== "";

  // Reset all filters to default state
  const handleClearAllFilters = () => {
    setSearchInput("");
    router.replace("/explore", { scroll: false });
    setMobileDrawerOpen(false);
  };

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "newest", label: "Newest" },
    { value: "highest-rated", label: "Highest Rated" },
  ];

  const activeSortLabel = sortOptions.find((opt) => opt.value === sortParam)?.label || "Most Popular";

  // Framer Motion Animation Variants
  const containerVariants: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const cardVariants: Variants = {
    initial: { opacity: 0, y: 16 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as any } 
    },
    exit: { 
      opacity: 0, 
      y: 8,
      transition: { duration: 0.15 } 
    }
  };

  // Helper to render rating stars beautifully (premium clinical monochrome scale)
  const renderStars = (rating: number) => {
    const rounded = Math.round(rating);
    return (
      <div className="flex items-center text-foreground dark:text-foreground gap-0.5" aria-label={`Rating ${rating} stars`}>
        {Array.from({ length: 5 }).map((_, idx) => {
          const isFilled = idx < rounded;
          return (
            <Star
              key={idx}
              className={`w-3.5 h-3.5 ${
                isFilled ? "fill-foreground text-foreground" : "text-border"
              }`}
            />
          );
        })}
      </div>
    );
  };

  // Render the core filter elements (reused between desktop and mobile)
  const renderFilterControls = () => {
    const categories = ["All", "Blog", "Social Media", "Email", "Ad Copy"];
    const ratings = [
      { value: 0, label: "All Ratings" },
      { value: 4, label: "4★ and above" },
      { value: 3, label: "3★ and above" },
    ];

    return (
      <div className="space-y-8">
        {/* Category Radio Group */}
        <div className="space-y-4">
          <h3 className="text-[12px] font-bold text-muted uppercase tracking-wider">
            Category
          </h3>
          <div className="space-y-3">
            {categories.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-3 cursor-pointer group text-[13.5px] font-medium"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={categoryParam === cat}
                  onChange={() => updateUrlParams({ category: cat, page: 1 })}
                  className="sr-only"
                />
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  categoryParam === cat
                    ? "border-accent bg-accent"
                    : "border-border bg-surface group-hover:border-accent"
                }`}>
                  {categoryParam === cat && (
                    <span className="w-1.5 h-1.5 rounded-full bg-background" />
                  )}
                </span>
                <span className={`transition-colors ${
                  categoryParam === cat ? "text-foreground font-semibold" : "text-muted-foreground group-hover:text-foreground"
                }`}>
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating Radio Group */}
        <div className="space-y-4 pt-6 border-t border-border">
          <h3 className="text-[12px] font-bold text-muted uppercase tracking-wider">
            Minimum Rating
          </h3>
          <div className="space-y-3">
            {ratings.map((rate) => (
              <label
                key={rate.value}
                className="flex items-center gap-3 cursor-pointer group text-[13.5px] font-medium"
              >
                <input
                  type="radio"
                  name="rating"
                  value={rate.value}
                  checked={ratingParam === rate.value}
                  onChange={() => updateUrlParams({ rating: rate.value, page: 1 })}
                  className="sr-only"
                />
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  ratingParam === rate.value
                    ? "border-accent bg-accent"
                    : "border-border bg-surface group-hover:border-accent"
                }`}>
                  {ratingParam === rate.value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-background" />
                  )}
                </span>
                <span className={`transition-colors ${
                  ratingParam === rate.value ? "text-foreground font-semibold" : "text-muted-foreground group-hover:text-foreground"
                }`}>
                  {rate.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
  const getCategoryImage = (category: string, index: number): string => {
    const imagesByCategory: Record<string, string[]> = {
      Blog: [
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
        "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80",
      ],
      Social: [
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80",
        "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=80",
        "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=400&q=80",
      ],
      Email: [
        "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80",
        "https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=400&q=80",
        "https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=400&q=80",
      ],
      AdCopy: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
        "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=400&q=80",
      ],
    }
    const list = imagesByCategory[category] ?? [
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80",
    ]
    return list[index % list.length]
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Block */}
        <div className="border border-border bg-surface rounded-xl p-6 sm:p-8 mb-8 space-y-3 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/2 rounded-full blur-3xl" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted bg-badge px-2.5 py-1 rounded-full w-fit block border border-border/40">
            System Integration Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
            Template Catalog
          </h1>
          <p className="text-muted-foreground max-w-2xl text-[13.5px] leading-relaxed">
            Instantly deploy pre-engineered prompts and structured formats optimized for maximum analytical accuracy and generation speed.
          </p>
        </div>

        {/* Outer Grid split: Sidebar Filters vs Search/Sort/Listings */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR FILTER - Desktop (Fixed) */}
          <aside className="hidden lg:block w-[260px] shrink-0 border border-border bg-surface rounded-xl p-6 h-fit shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
              <h2 className="font-bold text-[15px] tracking-tight flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter Templates</span>
              </h2>
              {isFilterActive && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-[11.5px] font-bold text-error bg-error-bg border border-error/15 px-2 py-0.5 rounded hover:opacity-85 transition-opacity"
                  id="desktop-clear-all"
                >
                  Clear All
                </button>
              )}
            </div>
            {renderFilterControls()}
          </aside>

          {/* RIGHT PANELS - Search Bar, Controls, Gridings */}
          <div className="flex-1 space-y-6">
            
            {/* Search inputs & Sort selection bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full">
              
              {/* Responsive Prominent Search Input Box */}
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search templates by name or keyword..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-[13px] font-medium rounded-xl bg-surface border border-border focus:border-accent outline-none transition-all duration-150 shadow-sm"
                  id="search-templates-input"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-badge text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search input"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile Filter & Sort Triggers Panel */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-3 shrink-0">
                {/* Mobile Drawer Trigger Button */}
                <button
                  onClick={() => setMobileDrawerOpen(true)}
                  className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 border border-border bg-surface text-[13px] font-bold rounded-xl hover:border-accent transition-colors flex-1"
                  id="mobile-filters-trigger"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                  {isFilterActive && (
                    <span className="w-2 h-2 rounded-full bg-error" />
                  )}
                </button>

                {/* Custom Styled Select Dropdown (Shadcn UI custom) */}
                <div className="relative shrink-0 flex-1 sm:flex-initial" ref={dropdownRef}>
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="w-full sm:w-[170px] flex items-center justify-between gap-3 px-4 py-2.5 border border-border bg-surface text-[13px] font-bold rounded-xl hover:border-accent transition-colors shadow-sm"
                    id="sort-select-btn"
                  >
                    <span className="text-muted-foreground font-medium mr-1 uppercase text-[10px] sm:inline hidden">SORT:</span>
                    <span className="truncate">{activeSortLabel}</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  </button>

                  <AnimatePresence>
                    {sortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 mt-1.5 w-full sm:w-[170px] bg-surface border border-border rounded-xl shadow-lg z-30 py-1 overflow-hidden"
                      >
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              updateUrlParams({ sort: opt.value, page: 1 });
                              setSortOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-[12.5px] font-medium hover:bg-badge transition-colors ${
                              sortParam === opt.value
                                ? "text-foreground bg-badge/60 font-bold"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Core Listings Grid Area (with Skeletons and Empty State handling) */}
            {loading ? (
              /* SKELETON LOADING GRID: Renders 8 premium skeleton cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="border border-border bg-surface rounded-xl overflow-hidden p-0 flex flex-col h-[380px] select-none"
                  >
                    <div className="aspect-ratio-16/9 w-full h-[155px] bg-gray-200 dark:bg-gray-800 animate-pulse" />
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 animate-pulse" />
                        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse" />
                        <div className="space-y-1.5">
                          <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse" />
                          <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-5/6 animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-3 border-t border-border pt-3 mt-auto">
                        <div className="flex justify-between items-center">
                          <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse" />
                          <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-12 animate-pulse" />
                        </div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : templates.length === 0 ? (
              /* EMPTY STATE: Visual placeholder with Clear Filters button */
              <div className="border border-dashed border-border rounded-xl p-12 sm:p-20 text-center flex flex-col items-center justify-center space-y-4 bg-surface/40">
                <div className="w-12 h-12 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground shadow-sm">
                  <FileSearch className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-[16px] tracking-tight">No templates found</h3>
                  <p className="text-[13px] text-muted-foreground max-w-sm">
                    Try adjusting your search query, minimum rating levels, or filters to find what you need.
                  </p>
                </div>
                {isFilterActive && (
                  <button
                    onClick={handleClearAllFilters}
                    className="px-4 py-2 border border-border text-[12.5px] font-bold rounded-lg hover:border-accent hover:bg-badge transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              /* ACTIVE TEMPLATES GRID: Loaded with staggering and hover spring transitions */
              <div className="space-y-8">
                {/* Wrap in AnimatePresence to ensure page transition fade-in-out */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pageParam}
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {templates.map((template, index) => {
                      const Icon = iconMap[template.icon] || FileText;
                      return (
                        <motion.div
                          key={template.id}
                          variants={cardVariants}
                          whileHover={{ 
                            y: -4, 
                            borderColor: "var(--accent)",
                            boxShadow: "0 10px 20px -10px rgba(0,0,0,0.06)" 
                          }}
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          className="border border-border bg-surface rounded-xl overflow-hidden p-0 flex flex-col h-[380px] transition-colors relative"
                        >
                          {/* Image Thumbnail section */}
                          <div className="relative aspect-[16/9] w-full shrink-0 border-b border-border bg-badge/40 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={template.thumbnail || getCategoryImage(template.category, index)}
                              alt={template.name}
                              className="w-full h-full object-cover grayscale opacity-75 group-hover:opacity-90 group-hover:scale-103 transition-all duration-300"
                            />
                            {/* pill overlay icon */}
                            <div className="absolute top-3 left-3 bg-surface border border-border p-1.5 rounded-lg shadow-sm">
                              <Icon className="w-3.5 h-3.5 text-foreground" />
                            </div>
                            {/* premium status */}
                            {template.isPremium && (
                              <div className="absolute top-3 right-3 bg-foreground text-background text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                                Pro
                              </div>
                            )}
                          </div>

                          {/* Body - content wrapper */}
                          <div className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
                            <div className="space-y-1.5 flex-1 flex flex-col">
                              {/* Category Badge */}
                              <span className="text-[10px] font-bold text-muted uppercase tracking-wider w-fit">
                                {mapCategoryToFrontend(template.category)}
                              </span>

                              {/* Template Name */}
                              <h3 className="font-bold text-[14.5px] leading-tight text-foreground line-clamp-2" title={template.name}>
                                {template.name}
                              </h3>

                              {/* Template Description */}
                              <p className="text-[12.5px] text-muted-foreground line-clamp-3 leading-relaxed flex-1 mt-1">
                                {template.description}
                              </p>
                            </div>

                            {/* Divider line */}
                            <div className="w-full h-px bg-border my-3 shrink-0" />

                            {/* Bottom Rating + Usages & Outlined Button */}
                            <div className="space-y-3 shrink-0 mt-auto">
                              <div className="flex items-center justify-between text-[11.5px] text-muted-foreground font-medium">
                                {renderStars(template.rating)}
                                <span>{template.usageCount >= 1000 ? `${(template.usageCount / 1000).toFixed(1)}k` : template.usageCount} uses</span>
                              </div>

                              <Link
                                href={`/templates/${template.slug}`}
                                className="w-full inline-flex items-center justify-center py-2 border border-border hover:border-accent text-foreground text-[12.5px] font-bold rounded-lg transition-all duration-200 hover:bg-foreground hover:text-background"
                              >
                                Use Template →
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>

                {/* PAGINATION: Controls section */}
                {totalPages > 1 && (
                  <div className="border-t border-border pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between text-[13px]">
                    <div className="text-muted-foreground font-medium">
                      Showing{" "}
                      <strong className="text-foreground font-semibold">
                        {(pageParam - 1) * 12 + 1}–{Math.min(pageParam * 12, totalCount)}
                      </strong>{" "}
                      of <strong className="text-foreground font-semibold">{totalCount}</strong>{" "}
                      templates
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Previous Page Trigger */}
                      <button
                        onClick={() => updateUrlParams({ page: Math.max(1, pageParam - 1) })}
                        disabled={pageParam === 1}
                        className="p-2 border border-border bg-surface rounded-lg hover:border-accent disabled:opacity-40 disabled:hover:border-border transition-colors cursor-pointer shrink-0"
                        aria-label="Previous Page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Numbered Triggers */}
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        const isActive = pageParam === pageNum;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => updateUrlParams({ page: pageNum })}
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

                      {/* Next Page Trigger */}
                      <button
                        onClick={() => updateUrlParams({ page: Math.min(totalPages, pageParam + 1) })}
                        disabled={pageParam === totalPages}
                        className="p-2 border border-border bg-surface rounded-lg hover:border-accent disabled:opacity-40 disabled:hover:border-border transition-colors cursor-pointer shrink-0"
                        aria-label="Next Page"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* MOBILE DRAWER: Sliding filter controls drawer triggered from the left */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            {/* Backdrop shadow overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />

            {/* Left drawer panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-surface z-50 p-6 flex flex-col justify-between shadow-2xl border-r border-border lg:hidden"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <h2 className="font-bold text-[15px] tracking-tight flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filter Templates</span>
                  </h2>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 rounded-md hover:bg-badge text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[calc(100vh-180px)] pr-2">
                  {renderFilterControls()}
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-auto space-y-3">
                {isFilterActive && (
                  <button
                    onClick={handleClearAllFilters}
                    className="w-full py-2.5 border border-error/25 text-error bg-error-bg text-[13px] font-bold rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Clear All Filters
                  </button>
                )}
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full py-2.5 bg-foreground text-background text-[13px] font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  View Templates ({totalCount})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Wrapper to prevent static compilation issues when parsing searchParams on client pages
export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
          <Navbar />
          <div className="flex-grow flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-4 border-t-accent border-r-border border-b-border border-l-border animate-spin" />
              <p className="text-[12px] font-bold text-muted uppercase tracking-wider">
                Syncing system catalog...
              </p>
            </div>
          </div>
          <Footer />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}

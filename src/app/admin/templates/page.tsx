"use client";

import React, { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2, X, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.enum(["Blog", "Social Media", "Email", "Ad Copy"]),
  description: z.string().min(1, "Description is required"),
  prompt: z.string().min(1, "AI Prompt is required"),
  sampleOutput: z.string().min(1, "Sample Output is required"),
  thumbnail: z.string().optional(),
  tone: z.enum(["Professional", "Casual", "Formal", "Friendly"]),
  estimatedWords: z.number({ message: "Must be a valid number" }).min(1, "Must be greater than 0"),
  aiModel: z.enum(["claude-sonnet", "gpt-4o"]),
  isPublished: z.boolean(),
});

type FormValues = z.infer<typeof schema>;
type Template = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  prompt: string;
  sampleOutput: string;
  thumbnail: string | null;
  tone: string;
  estimatedWords: number;
  aiModel: string;
  isPublished: boolean;
  rating: number;
};

const defaults: FormValues = {
  title: "",
  slug: "",
  category: "Blog",
  description: "",
  prompt: "",
  sampleOutput: "",
  thumbnail: "",
  tone: "Professional",
  estimatedWords: 500,
  aiModel: "claude-sonnet",
  isPublished: true,
};

// Database schema $\leftrightarrow$ Client UI mappers
const categoryMap: Record<string, string> = {
  "Blog": "Blog",
  "Social Media": "Social",
  "Email": "Email",
  "Ad Copy": "AdCopy",
};

const reverseCategoryMap: Record<string, string> = {
  "Blog": "Blog",
  "Social": "Social Media",
  "Email": "Email",
  "AdCopy": "Ad Copy",
};

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [gridRef] = useAutoAnimate<HTMLDivElement>();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  const thumbnailWatch = form.watch("thumbnail");
  const titleWatch = form.watch("title");

  // Fetch all templates
  useEffect(() => {
    fetch("/api/admin/templates")
      .then((r) => r.json())
      .then((d) => setTemplates(d.templates ?? []));
  }, []);

  // Auto-generate slug from title (if editable/blank)
  useEffect(() => {
    if (!titleWatch) return;
    const currentSlug = form.getValues("slug");
    const generated = slugify(titleWatch);
    
    // Only auto-generate if we are creating or if the slug matches the previous generated slug
    if (!editingId || currentSlug === "" || currentSlug === slugify(form.getValues("title"))) {
      form.setValue("slug", generated);
    }
  }, [titleWatch, editingId, form]);

  const openCreate = () => {
    setEditingId(null);
    form.reset(defaults);
    setSheetOpen(true);
  };

  const openEdit = (template: Template) => {
    setEditingId(template.id);
    form.reset({
      title: template.title,
      slug: template.slug,
      category: (reverseCategoryMap[template.category] || "Blog") as any,
      description: template.description,
      prompt: template.prompt,
      sampleOutput: template.sampleOutput,
      thumbnail: template.thumbnail ?? "",
      tone: (template.tone || "Professional") as any,
      estimatedWords: template.estimatedWords,
      aiModel: (template.aiModel || "claude-sonnet") as any,
      isPublished: template.isPublished,
    });
    setSheetOpen(true);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setSaving(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/admin/templates/${editingId}` : "/api/admin/templates";

    // Translate category to database format
    const bodyValues = {
      ...values,
      category: categoryMap[values.category] || values.category,
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyValues),
    });

    if (!res.ok) {
      setSaving(false);
      toast.error("Failed to save template");
      return;
    }

    const payload = await res.json();
    const updatedTemplate = payload.template as Template;

    setTemplates((prev) =>
      editingId
        ? prev.map((p) => (p.id === updatedTemplate.id ? updatedTemplate : p))
        : [updatedTemplate, ...prev]
    );

    toast.success("Template saved successfully");
    setSaving(false);
    setSheetOpen(false);
  });

  const removeTemplate = async () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);

    // Optimistic remove
    setTemplates((prev) => prev.filter((p) => p.id !== id));
    
    try {
      const res = await fetch(`/api/admin/templates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Template deleted successfully");
    } catch {
      toast.error("Failed to delete template");
      // Refetch
      fetch("/api/admin/templates")
        .then((r) => r.json())
        .then((d) => setTemplates(d.templates ?? []));
    }
  };

  const togglePublished = async (template: Template, isPublished: boolean) => {
    // Optimistic toggle update
    setTemplates((prev) =>
      prev.map((p) => (p.id === template.id ? { ...p, isPublished } : p))
    );

    try {
      const res = await fetch(`/api/admin/templates/${template.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...template, isPublished }),
      });
      if (!res.ok) throw new Error();
      toast.success(isPublished ? "Template published to Explore" : "Template hidden from public");
    } catch {
      toast.error("Failed to toggle publish status");
      // Rollback
      setTemplates((prev) =>
        prev.map((p) => (p.id === template.id ? { ...p, isPublished: !isPublished } : p))
      );
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Templates</h1>
          <p className="text-sm text-muted-foreground">Add and edit AI content prompt templates.</p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background hover:bg-foreground/90 transition-colors shadow-sm"
          onClick={openCreate}
        >
          <Plus className="h-4.5 w-4.5" />
          Create Template
        </button>
      </div>

      {/* Grid view */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map((template) => {
          const mappedCategory = reverseCategoryMap[template.category] || template.category;
          return (
            <div
              key={template.id}
              className="overflow-hidden rounded-xl border border-border bg-surface flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="relative h-44 w-full bg-badge/40 overflow-hidden border-b border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={template.thumbnail || "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000"}
                    alt={template.title}
                    className="h-full w-full object-cover select-none transition-transform hover:scale-105 duration-500"
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-surface/95 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-foreground border border-border">
                    {mappedCategory}
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-[15px] tracking-tight leading-tight text-foreground truncate">
                      {template.title}
                    </h3>
                    <span className="text-xs font-bold text-foreground bg-badge px-1.5 py-0.5 roundedshrink-0">
                      ★ {template.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-border/50 flex items-center justify-between bg-badge/5">
                {/* Published Toggle Slider */}
                <button
                  type="button"
                  onClick={() => togglePublished(template, !template.isPublished)}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <div
                    className={`relative w-8 h-4.5 rounded-full transition-colors duration-200 ${
                      template.isPublished ? "bg-foreground" : "bg-border"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full bg-background transition-transform duration-200 ${
                        template.isPublished ? "translate-x-3.5" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                    {template.isPublished ? (
                      <>
                        <Eye className="w-3 h-3 text-foreground" /> Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" /> Hidden
                      </>
                    )}
                  </span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-badge transition-colors"
                    onClick={() => openEdit(template)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-lg p-2 text-error hover:bg-error-bg transition-colors"
                    onClick={() => setDeleteId(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-over create/edit sheet with spring animation */}
      <AnimatePresence>
        {sheetOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setSheetOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="h-full w-full max-w-[480px] overflow-y-auto border-l border-border bg-surface p-6 shadow-2xl relative z-10"
            >
              <div className="mb-6 flex items-center justify-between pb-4 border-b border-border/80">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground">
                    {editingId ? "Edit Template" : "Create Template"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Configure prompt context and metadata.
                  </p>
                </div>
                <button
                  className="rounded-lg p-2 hover:bg-badge text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setSheetOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <Input
                  label="Title"
                  error={form.formState.errors.title?.message}
                  {...form.register("title")}
                />
                
                <Input
                  label="Slug"
                  error={form.formState.errors.slug?.message}
                  {...form.register("slug")}
                />

                <Select
                  label="Category"
                  options={["Blog", "Social Media", "Email", "Ad Copy"]}
                  error={form.formState.errors.category?.message}
                  {...form.register("category")}
                />

                <TextArea
                  label="Description"
                  rows={2}
                  error={form.formState.errors.description?.message}
                  {...form.register("description")}
                />

                <TextArea
                  label="Prompt Formula"
                  rows={5}
                  className="font-mono text-xs"
                  error={form.formState.errors.prompt?.message}
                  {...form.register("prompt")}
                />

                <TextArea
                  label="Sample Output"
                  rows={4}
                  className="font-mono text-xs"
                  error={form.formState.errors.sampleOutput?.message}
                  {...form.register("sampleOutput")}
                />

                <div className="space-y-1">
                  <Input
                    label="Thumbnail URL"
                    error={form.formState.errors.thumbnail?.message}
                    {...form.register("thumbnail")}
                  />
                  {thumbnailWatch && (
                    <div className="mt-2 rounded-lg border border-border overflow-hidden bg-badge h-28 flex items-center justify-center relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbnailWatch}
                        alt="Thumbnail preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Tone"
                    options={["Professional", "Casual", "Formal", "Friendly"]}
                    error={form.formState.errors.tone?.message}
                    {...form.register("tone")}
                  />
                  <Input
                    label="Est. Words"
                    type="number"
                    error={form.formState.errors.estimatedWords?.message}
                    {...form.register("estimatedWords", { valueAsNumber: true })}
                  />
                </div>

                <Select
                  label="AI Model"
                  options={["claude-sonnet", "gpt-4o"]}
                  error={form.formState.errors.aiModel?.message}
                  {...form.register("aiModel")}
                />

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border bg-surface text-foreground focus:ring-0"
                      {...form.register("isPublished")}
                    />
                    <span className="text-xs font-semibold text-foreground">Publish to Explore page immediately</span>
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-foreground hover:bg-foreground/90 py-3 text-xs font-bold text-background disabled:opacity-60 transition-all duration-200 shadow-sm"
                    disabled={saving}
                  >
                    {saving ? "Saving Template..." : "Save Template"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation AlertDialog */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteId(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-xl relative z-10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-error-bg text-error mb-4">
                <AlertTriangle className="h-5.5 w-5.5" />
              </div>

              <h2 className="text-lg font-bold tracking-tight text-foreground">Delete template?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground/90">
                This will delete the template permanently. Existing documents generated from this template will remain unaffected.
              </p>

              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  className="rounded-xl border border-border bg-surface hover:bg-badge px-4 py-2 text-xs font-semibold text-foreground transition-colors"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-xl bg-error hover:bg-error/90 px-4 py-2 text-xs font-semibold text-white transition-colors"
                  onClick={removeTemplate}
                >
                  Delete Template
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, ...props }, ref) => {
  return (
    <label className="block space-y-1 text-sm">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <input
        ref={ref}
        {...props}
        className={`h-10 w-full rounded-lg border bg-surface px-3 text-xs focus:border-foreground focus:outline-none transition-colors ${
          error ? "border-error focus:border-error" : "border-border"
        } ${props.className ?? ""}`}
      />
      {error && <span className="text-[10px] font-semibold text-error block">{error}</span>}
    </label>
  );
});
Input.displayName = "Input";

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string };
const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ label, error, ...props }, ref) => {
  return (
    <label className="block space-y-1 text-sm">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <textarea
        ref={ref}
        {...props}
        className={`w-full rounded-lg border bg-surface px-3 py-2 text-xs focus:border-foreground focus:outline-none transition-colors ${
          error ? "border-error focus:border-error" : "border-border"
        } ${props.className ?? ""}`}
      />
      {error && <span className="text-[10px] font-semibold text-error block">{error}</span>}
    </label>
  );
});
TextArea.displayName = "TextArea";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[];
  error?: string;
};
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ label, options, error, ...props }, ref) => {
  return (
    <label className="block space-y-1 text-sm">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <select
        ref={ref}
        {...props}
        className={`h-10 w-full rounded-lg border bg-surface px-3 text-xs focus:border-foreground focus:outline-none transition-colors ${
          error ? "border-error focus:border-error" : "border-border"
        } ${props.className ?? ""}`}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <span className="text-[10px] font-semibold text-error block">{error}</span>}
    </label>
  );
});
Select.displayName = "Select";

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<"news" | "announcement" | "event">("news");
  const [published, setPublished] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const supabase = createBrowserSupabase();
    const slug = slugify(title) + "-" + Date.now();

    const { error: insertError } = await supabase.from("news").insert({
      title,
      slug,
      content,
      excerpt: excerpt || null,
      category,
      published,
      published_at: published ? new Date().toISOString() : null,
    });

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push("/admin/dashboard/news");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-primary mb-1">Add Article</h1>
      <p className="text-text-muted text-sm mb-6">
        Create a new news article, announcement, or event
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-border bg-surface-elevated p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              placeholder="Article title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            >
              <option value="news">News</option>
              <option value="announcement">Announcement</option>
              <option value="event">Event</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Excerpt (short summary)
            </label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              placeholder="Brief description shown in listings..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
              placeholder="Full article content..."
            />
          </div>

          <label className="flex items-center gap-2.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            Publish immediately
          </label>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-light transition-colors disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Article"}
        </button>
      </form>
    </div>
  );
}

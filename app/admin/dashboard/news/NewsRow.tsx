"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Pencil } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

type Article = {
  id: string;
  title: string;
  category: string;
  published: boolean;
  published_at: string | null;
};

export default function NewsRow({ article }: { article: Article }) {
  const [published, setPublished] = useState(article.published);
  const [updating, setUpdating] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function togglePublished() {
    setUpdating(true);
    const supabase = createBrowserSupabase();
    const { error } = await supabase
      .from("news")
      .update({ published: !published })
      .eq("id", article.id);
    setUpdating(false);
    if (!error) setPublished(!published);
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${article.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    const supabase = createBrowserSupabase();
    const { error } = await supabase
      .from("news")
      .delete()
      .eq("id", article.id);
    if (!error) setDeleted(true);
  }

  if (deleted) return null;

  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3 font-medium text-foreground max-w-xs truncate">
        {article.title}
      </td>
      <td className="px-4 py-3">
        <span className="inline-block rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold capitalize">
          {article.category}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={togglePublished}
          disabled={updating}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
            published
              ? "bg-primary text-white"
              : "bg-surface border border-border text-text-muted"
          }`}
        >
          {published ? "Published" : "Draft"}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/dashboard/news/${article.id}/edit`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors"
          >
            <Pencil size={15} />
          </Link>
          <button
            onClick={handleDelete}
            aria-label="Delete article"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

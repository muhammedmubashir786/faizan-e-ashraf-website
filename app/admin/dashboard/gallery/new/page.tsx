"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function NewAlbumPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const supabase = createBrowserSupabase();
    const { error: insertError } = await supabase
      .from("gallery_albums")
      .insert({
        title,
        description: description || null,
        event_date: eventDate || null,
      });

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push("/admin/dashboard/gallery");
    router.refresh();
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-primary mb-1">New Album</h1>
      <p className="text-text-muted text-sm mb-6">
        Create an album, then add photos to it
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-border bg-surface-elevated p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Album Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              placeholder="e.g. Annual Day 2026"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
              placeholder="Brief description of this album..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Event Date
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>
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
          {saving ? "Creating..." : "Create Album"}
        </button>
      </form>
    </div>
  );
}

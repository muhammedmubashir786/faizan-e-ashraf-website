"use client";

import Link from "next/link";
import { Images, Trash2 } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useState } from "react";

type Album = {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  event_date: string | null;
};

export default function AlbumCard({
  album,
  mediaCount,
}: {
  album: Album;
  mediaCount: number;
}) {
  const [deleted, setDeleted] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete album "${album.title}" and all its photos? This cannot be undone.`
    );
    if (!confirmed) return;

    const supabase = createBrowserSupabase();
    const { error } = await supabase
      .from("gallery_albums")
      .delete()
      .eq("id", album.id);

    if (!error) setDeleted(true);
  }

  if (deleted) return null;

  return (
    <div className="rounded-2xl border border-border bg-surface-elevated overflow-hidden">
      <div className="h-36 bg-primary/10 flex items-center justify-center text-primary">
        {album.cover_image_url ? (
          <img
            src={album.cover_image_url}
            alt={album.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <Images size={36} strokeWidth={1.5} />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground">{album.title}</h3>
        <p className="text-xs text-text-muted mt-1">
          {mediaCount} {mediaCount === 1 ? "item" : "items"}
          {album.event_date && ` • ${new Date(album.event_date).toLocaleDateString("en-IN")}`}
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Link
            href={`/admin/dashboard/gallery/${album.id}`}
            className="flex-1 rounded-lg bg-primary/10 text-primary text-sm font-semibold py-2 text-center hover:bg-primary/20 transition-colors"
          >
            Manage Photos
          </Link>
          <button
            onClick={handleDelete}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

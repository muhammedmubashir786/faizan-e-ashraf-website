"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

type Media = {
  id: string;
  media_url: string;
  caption: string | null;
  media_type: string;
};

export default function PhotoGrid({ media }: { media: Media[] }) {
  const [items, setItems] = useState(media);

  async function handleDelete(id: string, mediaUrl: string) {
    const confirmed = window.confirm("Delete this photo?");
    if (!confirmed) return;

    const supabase = createBrowserSupabase();

    const path = mediaUrl.split("/storage/v1/object/public/images/")[1];
    if (path) {
      await supabase.storage.from("images").remove([path]);
    }

    await supabase.from("gallery_media").delete().eq("id", id);
    setItems((prev) => prev.filter((m) => m.id !== id));
  }

  if (!items.length) {
    return (
      <p className="text-text-muted text-sm text-center py-8">
        No photos yet — upload some above.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map((item) => (
        <div key={item.id} className="group relative rounded-xl overflow-hidden aspect-square bg-surface">
          <img
            src={item.media_url}
            alt={item.caption ?? "Gallery photo"}
            className="h-full w-full object-cover"
          />
          <button
            onClick={() => handleDelete(item.id, item.media_url)}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

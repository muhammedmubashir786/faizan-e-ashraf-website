import Link from "next/link";
import { Plus } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";
import AlbumCard from "./AlbumCard";

export default async function GalleryAdminPage() {
  const supabase = await createServerSupabase();

  const { data: albums } = await supabase
    .from("gallery_albums")
    .select("id, title, description, cover_image_url, event_date")
    .order("created_at", { ascending: false });

  const { data: mediaCounts } = await supabase
    .from("gallery_media")
    .select("album_id");

  const countMap: Record<string, number> = {};
  mediaCounts?.forEach((m) => {
    countMap[m.album_id] = (countMap[m.album_id] ?? 0) + 1;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Gallery</h1>
          <p className="text-text-muted text-sm">
            Manage photo and video albums
          </p>
        </div>
        <Link
          href="/admin/dashboard/gallery/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-light transition-colors"
        >
          <Plus size={16} />
          New Album
        </Link>
      </div>

      {albums && albums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              mediaCount={countMap[album.id] ?? 0}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface-elevated p-12 text-center text-text-muted">
          No albums yet. Create your first album to get started.
        </div>
      )}
    </div>
  );
}

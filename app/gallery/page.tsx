import type { Metadata } from "next";
import Link from "next/link";
import { Images } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Gallery | Darul Uloom Faizan-E-Ashraf",
  description:
    "Photos and videos from events and activities at Darul Uloom Faizan-E-Ashraf.",
};

export default async function GalleryPage() {
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
    <>
      <section className="bg-primary-dark text-white py-14 md:py-20 px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">Gallery</h1>
        <p className="text-white/80 max-w-xl mx-auto">
          Moments and memories from our campus events and activities
        </p>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          {albums && albums.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <Link
                  key={album.id}
                  href={`/gallery/${album.id}`}
                  className="group rounded-2xl border border-border bg-surface-elevated overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="relative h-48 bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                    {album.cover_image_url ? (
                      <img
                        src={album.cover_image_url}
                        alt={album.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Images size={48} strokeWidth={1.5} />
                    )}
                    <div className="absolute bottom-2 right-2 rounded-full bg-black/60 text-white text-xs px-2.5 py-1 font-medium">
                      {countMap[album.id] ?? 0} photos
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="font-semibold text-foreground">
                      {album.title}
                    </h2>
                    {album.description && (
                      <p className="text-sm text-text-muted mt-1 line-clamp-2">
                        {album.description}
                      </p>
                    )}
                    {album.event_date && (
                      <p className="text-xs text-text-muted mt-2">
                        {new Date(album.event_date).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-text-muted">
              <Images size={48} className="mx-auto mb-4 opacity-30" />
              <p>No albums published yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

type Media = { id: string; media_url: string; caption: string | null };
type Album = { title: string; description: string | null };

export default function AlbumPublicPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createBrowserSupabase();
      const { data: albumData } = await supabase
        .from("gallery_albums")
        .select("title, description")
        .eq("id", albumId)
        .maybeSingle();
      setAlbum(albumData);

      const { data: mediaData } = await supabase
        .from("gallery_media")
        .select("id, media_url, caption")
        .eq("album_id", albumId)
        .order("display_order", { ascending: true });
      setMedia(mediaData ?? []);
    }
    load();
  }, [albumId]);

  function prev() {
    if (lightbox === null) return;
    setLightbox(lightbox === 0 ? media.length - 1 : lightbox - 1);
  }

  function next() {
    if (lightbox === null) return;
    setLightbox(lightbox === media.length - 1 ? 0 : lightbox + 1);
  }

  return (
    <>
      <section className="bg-primary-dark text-white py-14 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-accent-light mb-4"
          >
            <ArrowLeft size={16} />
            Back to Gallery
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold">
            {album?.title ?? "Album"}
          </h1>
          {album?.description && (
            <p className="text-white/70 mt-2">{album.description}</p>
          )}
        </div>
      </section>

      <section className="py-16 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          {media.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {media.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setLightbox(index)}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-surface"
                >
                  <img
                    src={item.media_url}
                    alt={item.caption ?? "Gallery photo"}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-text-muted py-16">
              No photos in this album yet.
            </p>
          )}
        </div>
      </section>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeft size={24} />
          </button>

          <img
            src={media[lightbox].media_url}
            alt={media[lightbox].caption ?? "Photo"}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronRight size={24} />
          </button>

          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>

          <p className="absolute bottom-4 text-white/60 text-sm">
            {lightbox + 1} / {media.length}
          </p>
        </div>
      )}
    </>
  );
}

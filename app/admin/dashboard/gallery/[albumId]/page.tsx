import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import PhotoUploader from "./PhotoUploader";
import PhotoGrid from "./PhotoGrid";

type Props = { params: Promise<{ albumId: string }> };

export default async function AlbumDetailPage({ params }: Props) {
  const { albumId } = await params;
  const supabase = await createServerSupabase();

  const { data: album } = await supabase
    .from("gallery_albums")
    .select("id, title")
    .eq("id", albumId)
    .maybeSingle();

  if (!album) notFound();

  const { data: media } = await supabase
    .from("gallery_media")
    .select("id, media_url, caption, media_type")
    .eq("album_id", albumId)
    .order("display_order", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-1">{album.title}</h1>
      <p className="text-text-muted text-sm mb-6">
        Upload and manage photos for this album
      </p>

      <PhotoUploader albumId={album.id} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Photos ({media?.length ?? 0})
        </h2>
        <PhotoGrid media={media ?? []} />
      </div>
    </div>
  );
}

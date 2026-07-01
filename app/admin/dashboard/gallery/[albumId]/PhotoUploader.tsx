"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function PhotoUploader({ albumId }: { albumId: string }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    if (!files.length) return;
    setUploading(true);
    setError("");

    const supabase = createBrowserSupabase();
    const fileArray = Array.from(files);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setProgress(`Uploading ${i + 1} of ${fileArray.length}...`);

      const ext = file.name.split(".").pop();
      const path = `gallery/${albumId}/${Date.now()}-${i}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(path, file, { upsert: false });

      if (uploadError) {
        setError(`Failed to upload ${file.name}: ${uploadError.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(path);

      await supabase.from("gallery_media").insert({
        album_id: albumId,
        media_url: urlData.publicUrl,
        media_type: file.type.startsWith("video/") ? "video" : "image",
        display_order: i,
      });
    }

    setUploading(false);
    setProgress("");
    window.location.reload();
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className="rounded-2xl border-2 border-dashed border-border bg-surface p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
      >
        <Upload size={32} className="mx-auto text-text-muted mb-3" />
        <p className="font-semibold text-foreground mb-1">
          {uploading ? progress : "Tap to upload photos"}
        </p>
        <p className="text-sm text-text-muted">
          JPG, PNG, or WebP — multiple files supported
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

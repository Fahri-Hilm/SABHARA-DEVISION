"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type Photo = {
  id: string;
  storage_path: string | null;
  signed_url?: string | null;
};

type PhotoGridProps = {
  photos: Photo[];
  className?: string;
};

function PhotoItem({ photo }: { photo: Photo }) {
  const [imgError, setImgError] = useState(false);
  const queryClient = useQueryClient();

  if (!photo.storage_path || !photo.signed_url || imgError) {
    return (
      <div
        className="flex aspect-square items-center justify-center rounded-md border border-border/40 bg-secondary/50 text-center"
        data-testid="photo-placeholder"
      >
        <div className="space-y-1 px-2">
          <ImageOff className="mx-auto h-5 w-5 text-muted-foreground/60" />
          <p className="text-[10px] text-muted-foreground/70">
            {imgError ? "Gagal memuat" : "Foto dihapus"}
          </p>
          {!imgError && <p className="text-[9px] text-muted-foreground/50">14 hari</p>}
        </div>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={photo.signed_url}
      src={photo.signed_url}
      alt="Bukti duty"
      className="aspect-square w-full rounded-md border border-border/40 object-cover"
      loading="lazy"
      onError={() => {
        setImgError(true);
        queryClient.invalidateQueries({ queryKey: ["duty-reports"] });
      }}
    />
  );
}

export function PhotoGrid({ photos, className }: PhotoGridProps) {
  if (photos.length === 0) return null;
  return (
    <div
      className={cn(
        "grid gap-1.5",
        photos.length === 1 && "grid-cols-1",
        photos.length === 2 && "grid-cols-2",
        photos.length === 3 && "grid-cols-3",
        className,
      )}
    >
      {photos.map((p) => (
        <PhotoItem key={p.id} photo={p} />
      ))}
    </div>
  );
}

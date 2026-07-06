"use client";

import { useState, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload, ImageOff } from "lucide-react";
import { processPhotosForUpload, type ProcessedPhoto } from "@/lib/upload/upload-pipeline";
import { MAX_PHOTOS, ALLOWED_PHOTO_MIME_TYPES } from "@/lib/schemas/upload";
import { submitDutyAction } from "../actions";
import { toast } from "sonner";
import type { Member } from "@/types/db";
import { TimeSelect } from "./TimeSelect";

type DutyFormProps = {
  roster: Member[];
};

export function DutyForm({ roster }: DutyFormProps) {
  const [photos, setPhotos] = useState<ProcessedPhoto[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const remaining = MAX_PHOTOS - photos.length;
    const toProcess = files.slice(0, remaining);
    if (files.length > remaining) {
      setError(`Maksimal ${MAX_PHOTOS} foto. Hanya ${remaining} tersisa.`);
    }

    setProcessing(true);
    const result = await processPhotosForUpload(toProcess);
    setProcessing(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.photos) {
      setPhotos((prev) => [...prev, ...result.photos!]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(index: number) {
    setError(null);
    setPhotos((prev) => {
      const photo = prev[index];
      if (photo) URL.revokeObjectURL(photo.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = formRef.current;
    if (!form) return;

    if (photos.length === 0) {
      setError("Minimal 1 foto bukti");
      return;
    }

    const formData = new FormData(form);
    formData.delete("photos");
    for (const photo of photos) {
      formData.append("photos", photo.file, photo.file.name);
    }

    startTransition(async () => {
      const result = await submitDutyAction(formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="member_id">Anggota</Label>
        <Select name="member_id" required>
          <SelectTrigger id="member_id">
            <SelectValue placeholder="Pilih nama anggota" />
          </SelectTrigger>
          <SelectContent>
            {roster
              .filter((m) => m.role === "member" && m.is_active)
              .map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name} {m.rank ? `(${m.rank})` : ""}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="duty_date">Tanggal Duty</Label>
          <Input id="duty_date" name="duty_date" type="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="on_duty_time">Jam On Duty</Label>
          <TimeSelect name="on_duty_time" defaultValue="08:00" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="off_duty_time">Jam Off Duty</Label>
          <TimeSelect name="off_duty_time" defaultValue="16:00" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Catatan (opsional, maks 1000 karakter)</Label>
        <Textarea
          id="notes"
          name="notes"
          maxLength={1000}
          placeholder="Patroli area X, aman terkendali..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Foto Bukti (maksimal {MAX_PHOTOS})</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_PHOTO_MIME_TYPES.join(",")}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={photos.length >= MAX_PHOTOS || processing}
          name="photos"
        />

        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-md border border-border/60"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.previewUrl}
                  alt={`Bukti ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute right-1 top-1 rounded-full bg-background/80 p-1 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label={`Hapus foto ${i + 1}`}
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 px-1 py-0.5 text-[10px] font-mono text-muted-foreground">
                  {(photo.compressedSize / 1024).toFixed(0)}KB
                </div>
              </div>
            ))}
          </div>
        )}

        {photos.length < MAX_PHOTOS && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={processing}
          >
            {processing ? (
              "Mengkompres..."
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Tambah Foto
              </>
            )}
          </Button>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {photos.length === 0 && (
          <p className="text-xs text-muted-foreground">
            <ImageOff className="inline h-3 w-3" /> Belum ada foto. Minimal 1 foto bukti wajib.
          </p>
        )}

        <Badge variant="secondary" className="text-[10px]">
          {photos.length}/{MAX_PHOTOS} foto
        </Badge>
      </div>

      <Button type="submit" className="w-full" disabled={pending || processing}>
        {pending ? "Mengirim..." : "Kirim Laporan Duty"}
      </Button>
    </form>
  );
}

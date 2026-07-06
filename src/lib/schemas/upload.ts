import { z } from "zod";

export const MAX_PHOTOS = 3;
export const MAX_ORIGINAL_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_PHOTO_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const photoFileSchema = z
  .instanceof(File, { message: "File tidak valid" })
  .refine((file) => ALLOWED_PHOTO_MIME_TYPES.includes(file.type as (typeof ALLOWED_PHOTO_MIME_TYPES)[number]), {
    message: "Format file harus JPEG, PNG, atau WebP",
  })
  .refine((file) => file.size <= MAX_ORIGINAL_SIZE_BYTES, {
    message: "Ukuran file maksimal 5MB",
  });

export const photoUploadSchema = z
  .array(photoFileSchema)
  .max(MAX_PHOTOS, `Maksimal ${MAX_PHOTOS} foto`)
  .min(1, "Minimal 1 foto bukti");

export type PhotoFile = z.infer<typeof photoFileSchema>;

import {
  MAX_PHOTOS,
  MAX_ORIGINAL_SIZE_BYTES,
  ALLOWED_PHOTO_MIME_TYPES,
} from "@/lib/schemas/upload";

export function validatePhotoFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_PHOTO_MIME_TYPES.includes(file.type as (typeof ALLOWED_PHOTO_MIME_TYPES)[number])) {
    return { valid: false, error: "Format file harus JPEG, PNG, atau WebP" };
  }
  if (file.size > MAX_ORIGINAL_SIZE_BYTES) {
    return { valid: false, error: "Ukuran file maksimal 5MB" };
  }
  return { valid: true };
}

export function validatePhotoCount(files: File[]): { valid: boolean; error?: string } {
  if (files.length > MAX_PHOTOS) {
    return { valid: false, error: `Maksimal ${MAX_PHOTOS} foto` };
  }
  if (files.length === 0) {
    return { valid: false, error: "Minimal 1 foto bukti" };
  }
  return { valid: true };
}

import { compressImage, type CompressedImage } from "./compress";
import { validatePhotoFile, validatePhotoCount } from "./validate";

export type ProcessedPhoto = CompressedImage;

export async function processPhotosForUpload(
  files: File[],
): Promise<{ photos?: ProcessedPhoto[]; error?: string }> {
  const countCheck = validatePhotoCount(files);
  if (!countCheck.valid) return { error: countCheck.error };

  for (const file of files) {
    const check = validatePhotoFile(file);
    if (!check.valid) return { error: check.error };
  }

  const photos = await Promise.all(files.map((f) => compressImage(f)));
  return { photos };
}

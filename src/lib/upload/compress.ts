import imageCompression from "browser-image-compression";

const MAX_WIDTH = 1280;
const QUALITY = 0.7;
const TARGET_SIZE_KB = 200;

export type CompressedImage = {
  file: File;
  originalSize: number;
  compressedSize: number;
  previewUrl: string;
};

export async function compressImage(
  file: File,
  options: { maxWidth?: number; quality?: number; maxSizeKB?: number } = {},
): Promise<CompressedImage> {
  const maxWidth = options.maxWidth ?? MAX_WIDTH;
  const quality = options.quality ?? QUALITY;
  const maxSizeKB = options.maxSizeKB ?? TARGET_SIZE_KB;

  const compressed = await imageCompression(file, {
    maxWidthOrHeight: maxWidth,
    initialQuality: quality,
    useWebWorker: true,
    fileType: "image/jpeg",
  });

  const previewUrl = URL.createObjectURL(compressed);

  return {
    file: compressed,
    originalSize: file.size,
    compressedSize: compressed.size,
    previewUrl,
  };
}

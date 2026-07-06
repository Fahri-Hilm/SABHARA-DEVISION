import { describe, it, expect, vi, beforeEach } from "vitest";
import { validatePhotoFile, validatePhotoCount } from "@/lib/upload/validate";
import { MAX_PHOTOS } from "@/lib/schemas/upload";

function makeFile(name: string, type: string, size: number): File {
  const blob = new Blob([new Uint8Array(size)], { type });
  return new File([blob], name, { type });
}

describe("validatePhotoFile", () => {
  it("accepts valid JPEG", () => {
    const result = validatePhotoFile(makeFile("p.jpg", "image/jpeg", 1000));
    expect(result.valid).toBe(true);
  });

  it("accepts valid PNG", () => {
    const result = validatePhotoFile(makeFile("p.png", "image/png", 1000));
    expect(result.valid).toBe(true);
  });

  it("accepts valid WebP", () => {
    const result = validatePhotoFile(makeFile("p.webp", "image/webp", 1000));
    expect(result.valid).toBe(true);
  });

  it("rejects PDF", () => {
    const result = validatePhotoFile(makeFile("doc.pdf", "application/pdf", 1000));
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/Format/);
  });

  it("rejects oversized file", () => {
    const result = validatePhotoFile(makeFile("big.jpg", "image/jpeg", 6 * 1024 * 1024));
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/5MB/);
  });
});

describe("validatePhotoCount", () => {
  it("rejects empty array", () => {
    const result = validatePhotoCount([]);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/Minimal/);
  });

  it("accepts 1-3 files", () => {
    expect(validatePhotoCount([makeFile("a.jpg", "image/jpeg", 100)]).valid).toBe(true);
    expect(validatePhotoCount(Array.from({ length: MAX_PHOTOS }, (_, i) =>
      makeFile(`p${i}.jpg`, "image/jpeg", 100),
    )).valid).toBe(true);
  });

  it("rejects more than MAX_PHOTOS", () => {
    const files = Array.from({ length: MAX_PHOTOS + 1 }, (_, i) =>
      makeFile(`p${i}.jpg`, "image/jpeg", 100),
    );
    const result = validatePhotoCount(files);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/Maksimal/);
  });
});

vi.mock("browser-image-compression", () => ({
  default: vi.fn(async (file: File) => {
    return new File([await file.arrayBuffer()], "compressed.jpg", {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  }),
  imageCompression: vi.fn(),
}));

import { compressImage } from "@/lib/upload/compress";

describe("compressImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns compressed file with metadata", async () => {
    const file = makeFile("test.jpg", "image/jpeg", 500_000);
    const result = await compressImage(file);
    expect(result.file).toBeInstanceOf(File);
    expect(result.file.type).toBe("image/jpeg");
    expect(result.originalSize).toBe(500_000);
    expect(result.compressedSize).toBe(result.file.size);
    expect(result.previewUrl).toMatch(/^blob:/);
  });
});

import { vi } from "vitest";

export const compressImageMock = vi.fn(
  async (file: File): Promise<File> => {
    void file;
    return new File([await file.arrayBuffer()], "compressed.jpg", {
      type: "image/jpeg",
    });
  },
);

vi.mock("browser-image-compression", () => ({
  default: compressImageMock,
  imageCompression: compressImageMock,
}));

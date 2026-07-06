import { describe, it, expect } from "vitest";
import { dutyReportInsertSchema } from "@/lib/schemas/duty-report";
import { photoUploadSchema, MAX_PHOTOS } from "@/lib/schemas/upload";
import { feedFilterSchema } from "@/lib/schemas/feed-filter";
import { dutyReportApprovalSchema } from "@/lib/schemas/duty-report";

function makeFile(name: string, type: string, size: number): File {
  const blob = new Blob([new Uint8Array(size)], { type });
  return new File([blob], name, { type });
}

describe("dutyReportInsertSchema", () => {
  it("rejects off_duty_at before on_duty_at", () => {
    const result = dutyReportInsertSchema.safeParse({
      member_id: "550e8400-e29b-41d4-a716-446655440000",
      duty_date: "2026-01-15",
      on_duty_at: "2026-01-15T16:00:00Z",
      off_duty_at: "2026-01-15T08:00:00Z",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/off_duty_at/);
    }
  });

  it("accepts valid duty report", () => {
    const result = dutyReportInsertSchema.safeParse({
      member_id: "550e8400-e29b-41d4-a716-446655440000",
      duty_date: "2026-01-15",
      on_duty_at: "2026-01-15T08:00:00Z",
      off_duty_at: "2026-01-15T16:00:00Z",
      notes: "Patroli aman",
    });
    expect(result.success).toBe(true);
  });
});

describe("photoUploadSchema", () => {
  it("rejects more than MAX_PHOTOS files", () => {
    const files = Array.from({ length: MAX_PHOTOS + 1 }, (_, i) =>
      makeFile(`p${i}.jpg`, "image/jpeg", 1000),
    );
    const result = photoUploadSchema.safeParse(files);
    expect(result.success).toBe(false);
  });

  it("rejects non-image MIME", () => {
    const file = makeFile("doc.pdf", "application/pdf", 1000);
    const result = photoUploadSchema.safeParse([file]);
    expect(result.success).toBe(false);
  });

  it("rejects oversized file", () => {
    const file = makeFile("big.jpg", "image/jpeg", 6 * 1024 * 1024);
    const result = photoUploadSchema.safeParse([file]);
    expect(result.success).toBe(false);
  });

  it("accepts 3 valid JPEG files", () => {
    const files = Array.from({ length: 3 }, (_, i) =>
      makeFile(`p${i}.jpg`, "image/jpeg", 500_000),
    );
    const result = photoUploadSchema.safeParse(files);
    expect(result.success).toBe(true);
  });
});

describe("feedFilterSchema", () => {
  it("rejects date_from after date_to", () => {
    const result = feedFilterSchema.safeParse({
      date_from: "2026-01-20",
      date_to: "2026-01-15",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid date range", () => {
    const result = feedFilterSchema.safeParse({
      date_from: "2026-01-01",
      date_to: "2026-01-31",
    });
    expect(result.success).toBe(true);
  });
});

describe("dutyReportApprovalSchema", () => {
  it("rejects reject without reason", () => {
    const result = dutyReportApprovalSchema.safeParse({
      report_id: "550e8400-e29b-41d4-a716-446655440000",
      status: "rejected",
    });
    expect(result.success).toBe(false);
  });

  it("accepts approved without reason", () => {
    const result = dutyReportApprovalSchema.safeParse({
      report_id: "550e8400-e29b-41d4-a716-446655440000",
      status: "approved",
    });
    expect(result.success).toBe(true);
  });

  it("accepts rejected with valid reason", () => {
    const result = dutyReportApprovalSchema.safeParse({
      report_id: "550e8400-e29b-41d4-a716-446655440000",
      status: "rejected",
      reject_reason: "Foto bukti kurang jelas",
    });
    expect(result.success).toBe(true);
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeedCard } from "@/components/discord/FeedCard";

describe("FeedCard", () => {
  it("renders member name and duty info", () => {
    render(
      <FeedCard
        memberName="Andi Saputra"
        memberRank="Bripda"
        dutyDate="2026-01-15"
        onDutyAt="2026-01-15T08:00:00Z"
        offDutyAt="2026-01-15T16:00:00Z"
        status="pending"
        createdAt="2026-01-15T16:30:00Z"
      />,
    );
    expect(screen.getByText("Andi Saputra")).toBeInTheDocument();
    expect(screen.getByText("Bripda")).toBeInTheDocument();
    expect(screen.getByText(/2026-01-15/)).toBeInTheDocument();
    expect(screen.getByText("Menunggu ACC")).toBeInTheDocument();
  });

  it("shows reject reason when status rejected", () => {
    render(
      <FeedCard
        memberName="Citra"
        dutyDate="2026-01-15"
        onDutyAt="2026-01-15T08:00:00Z"
        offDutyAt="2026-01-15T16:00:00Z"
        status="rejected"
        rejectReason="Foto kurang jelas"
        createdAt="2026-01-15T16:30:00Z"
      />,
    );
    expect(screen.getByText("Ditolak")).toBeInTheDocument();
    expect(screen.getByText(/Foto kurang jelas/)).toBeInTheDocument();
  });

  it("shows notes when provided", () => {
    render(
      <FeedCard
        memberName="Dewi"
        dutyDate="2026-01-15"
        onDutyAt="2026-01-15T08:00:00Z"
        offDutyAt="2026-01-15T16:00:00Z"
        status="approved"
        notes="Patroli aman"
        createdAt="2026-01-15T16:30:00Z"
      />,
    );
    expect(screen.getByText("Patroli aman")).toBeInTheDocument();
    expect(screen.getByText("Disetujui")).toBeInTheDocument();
  });

  it("renders placeholder for deleted photos", () => {
    render(
      <FeedCard
        memberName="Andi"
        dutyDate="2026-01-15"
        onDutyAt="2026-01-15T08:00:00Z"
        offDutyAt="2026-01-15T16:00:00Z"
        status="approved"
        photos={[{ id: "p1", storagePath: null }]}
        createdAt="2026-01-15T16:30:00Z"
      />,
    );
    expect(screen.getByText("Foto dihapus")).toBeInTheDocument();
  });
});

"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { FeedChannel } from "@/components/discord/FeedChannel";
import { PhotoGrid } from "./PhotoGrid";
import { MemberAvatar } from "@/components/discord/MemberAvatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ApprovalActions } from "@/components/approval/ApprovalActions";
import type { DutyReportWithMember } from "@/lib/supabase/queries";
import type { DutyReportStatus, FeedFilter } from "@/types/db";
import { ListChecks } from "lucide-react";

const STATUS_LABEL: Record<DutyReportStatus, string> = {
  pending: "Menunggu ACC",
  approved: "Disetujui",
  rejected: "Ditolak",
};

const STATUS_VARIANT: Record<DutyReportStatus, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type DutyFeedProps = {
  initialReports: DutyReportWithMember[];
  filter: FeedFilter;
  pollIntervalMs?: number;
  isAdmin: boolean;
};

function DutyReportCard({ report, isAdmin }: { report: DutyReportWithMember; isAdmin: boolean }) {
  return (
    <article
      className="rounded-lg border border-border/60 bg-card/80 p-4"
      data-testid="duty-feed-card"
    >
      <div className="flex gap-3">
        <MemberAvatar name={report.members.name} rank={report.members.rank} size="md" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-display font-semibold">{report.members.name}</span>
            {report.members.rank && (
              <span className="text-xs text-muted-foreground">{report.members.rank}</span>
            )}
            <Badge variant={STATUS_VARIANT[report.status]} className="ml-auto">
              {STATUS_LABEL[report.status]}
            </Badge>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            <span className="text-cyan">Duty:</span> {report.duty_date}
            <span className="mx-2 text-border">|</span>
            <span className="text-cyan">On:</span> {formatTime(report.on_duty_at)}
            <span className="mx-2 text-border">|</span>
            <span className="text-cyan">Off:</span> {formatTime(report.off_duty_at)}
          </div>
          {report.notes && (
            <p className="whitespace-pre-wrap text-sm text-foreground/90">{report.notes}</p>
          )}
          {report.status === "rejected" && report.reject_reason && (
            <p className="rounded-md bg-destructive/10 px-2 py-1 text-xs text-destructive">
              Alasan: {report.reject_reason}
            </p>
          )}
          {report.duty_photos.length > 0 && <PhotoGrid photos={report.duty_photos} />}
          <div className="font-mono text-[10px] text-muted-foreground/70">
            {formatTime(report.created_at)}
          </div>
        </div>
      </div>
      <ApprovalActions report={report} isAdmin={isAdmin} />
    </article>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-3" data-testid="feed-skeleton">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-lg border border-border/60 bg-card/80 p-4">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-64" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DutyFeed({ initialReports, filter, pollIntervalMs = 30000, isAdmin }: DutyFeedProps) {
  const queryKey = ["duty-reports", filter];

  const { data, isPending, isError, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter.member_id) params.set("member_id", filter.member_id);
      if (filter.status) params.set("status", filter.status);
      if (filter.date_from) params.set("date_from", filter.date_from);
      if (filter.date_to) params.set("date_to", filter.date_to);
      const res = await fetch(`/api/feed?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat feed");
      return (await res.json()) as { reports: DutyReportWithMember[] };
    },
    initialData: { reports: initialReports },
    refetchInterval: pollIntervalMs,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });

  const reports = data?.reports ?? [];

  return (
    <FeedChannel
      title="Laporan Duty Sabhara"
      subtitle="Semua laporan duty anggota divisi"
      count={reports.length}
    >
      {isPending && <FeedSkeleton />}
      {isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Gagal memuat feed: {error.message}
        </div>
      )}
      {!isPending && !isError && reports.length === 0 && (
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 py-12 text-center"
          data-testid="empty-state"
        >
          <ListChecks className="h-8 w-8 text-muted-foreground/60" />
          <p className="text-sm text-muted-foreground">Belum ada laporan duty</p>
        </div>
      )}
      {!isPending &&
        !isError &&
        reports.map((r) => <DutyReportCard key={r.id} report={r} isAdmin={isAdmin} />)}
    </FeedChannel>
  );
}

import { cn } from "@/lib/utils";
import { MemberAvatar } from "./MemberAvatar";
import { Badge } from "@/components/ui/badge";

export type DutyReportStatus = "pending" | "approved" | "rejected";

type FeedCardProps = {
  memberName: string;
  memberRank?: string | null;
  dutyDate: string;
  onDutyAt: string;
  offDutyAt: string;
  status: DutyReportStatus;
  notes?: string | null;
  rejectReason?: string | null;
  photos?: Array<{ id: string; storagePath: string | null }>;
  createdAt: string;
  children?: React.ReactNode;
};

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
  const d = new Date(iso);
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FeedCard({
  memberName,
  memberRank,
  dutyDate,
  onDutyAt,
  offDutyAt,
  status,
  notes,
  rejectReason,
  photos,
  createdAt,
  children,
}: FeedCardProps) {
  return (
    <article
      className={cn(
        "group relative rounded-lg border border-border/60 bg-card/80 p-4 transition-colors hover:border-cyan/40",
        status === "approved" && "border-success/40",
        status === "rejected" && "border-destructive/40",
      )}
      data-testid="duty-feed-card"
    >
      <div className="flex gap-3">
        <MemberAvatar name={memberName} rank={memberRank} size="md" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-display font-semibold text-foreground">{memberName}</span>
            {memberRank && (
              <span className="text-xs text-muted-foreground">{memberRank}</span>
            )}
            <Badge variant={STATUS_VARIANT[status]} className="ml-auto">
              {STATUS_LABEL[status]}
            </Badge>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            <span className="text-cyan">Duty:</span> {dutyDate}
            <span className="mx-2 text-border">|</span>
            <span className="text-cyan">On:</span> {formatTime(onDutyAt)}
            <span className="mx-2 text-border">|</span>
            <span className="text-cyan">Off:</span> {formatTime(offDutyAt)}
          </div>
          {notes && <p className="text-sm text-foreground/90 whitespace-pre-wrap">{notes}</p>}
          {status === "rejected" && rejectReason && (
            <p className="rounded-md bg-destructive/10 px-2 py-1 text-xs text-destructive">
              Alasan: {rejectReason}
            </p>
          )}
          {photos && photos.length > 0 && (
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square overflow-hidden rounded-md border border-border/40 bg-secondary"
                >
                  {photo.storagePath ? (
                    <div className="h-full w-full bg-gradient-to-br from-secondary to-muted" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                      Foto dihapus
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="font-mono text-[10px] text-muted-foreground/70">
            {formatTime(createdAt)}
          </div>
        </div>
      </div>
      {children && <div className="mt-3 flex gap-2 border-t border-border/40 pt-3">{children}</div>}
    </article>
  );
}

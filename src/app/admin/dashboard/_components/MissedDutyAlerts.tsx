import Link from "next/link";
import { MemberAvatar } from "@/components/discord/MemberAvatar";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { MissedDutyAlert } from "@/lib/supabase/alerts";

export function MissedDutyAlerts({ alerts }: { alerts: MissedDutyAlert[] }) {
  if (alerts.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-sm text-success">
        <CheckCircle2 className="h-4 w-4" />
        Semua anggota aktif duty
      </div>
    );
  }

  return (
    <div className="space-y-2" data-testid="missed-duty-alerts">
      {alerts.map((a) => {
        const isCritical = a.days_since > 7;
        return (
          <Link
            key={a.member_id}
            href={`/feed?member_id=${a.member_id}`}
            className="flex items-center gap-3 rounded-md border border-border/40 bg-card/60 p-2 transition-colors hover:border-cyan/40"
          >
            <MemberAvatar name={a.name} rank={a.rank} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{a.name}</p>
              <p className="text-xs text-muted-foreground">
                Terakhir duty: {a.last_duty ? new Date(a.last_duty).toLocaleDateString("id-ID") : "tidak pernah"}
              </p>
            </div>
            <Badge variant={isCritical ? "destructive" : "default"} className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {a.days_since} hari
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}

import { MemberAvatar } from "@/components/discord/MemberAvatar";
import type { DutyStats } from "@/lib/supabase/stats";

export function TopMembersList({ members }: { members: DutyStats["top_members"] }) {
  if (members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Belum ada duty minggu ini.</p>
    );
  }
  return (
    <div className="space-y-2">
      {members.map((m, i) => (
        <div key={m.member_id} className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground w-6">#{i + 1}</span>
          <MemberAvatar name={m.name} rank={m.rank} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{m.name}</p>
            {m.rank && <p className="text-xs text-muted-foreground">{m.rank}</p>}
          </div>
          <span className="font-mono text-sm text-cyan">{m.count} duty</span>
        </div>
      ))}
    </div>
  );
}

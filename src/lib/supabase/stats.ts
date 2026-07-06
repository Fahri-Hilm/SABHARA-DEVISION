import { createAdminClient } from "./admin";

export type DutyStats = {
  weekly_total: number;
  total_hours: number;
  pending_count: number;
  approved_count: number;
  rejected_count: number;
  missed_count: number;
  top_members: Array<{
    member_id: string;
    name: string;
    rank: string | null;
    count: number;
  }>;
};

export async function fetchDutyStats(): Promise<DutyStats> {
  const admin = createAdminClient();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: weekly_total },
    { count: pending_count },
    { count: approved_count },
    { count: rejected_count },
  ] = await Promise.all([
    admin.from("duty_reports").select("id", { count: "exact", head: true }).gt("created_at", oneWeekAgo).is("deleted_at", null),
    admin.from("duty_reports").select("id", { count: "exact", head: true }).eq("status", "pending").is("deleted_at", null),
    admin.from("duty_reports").select("id", { count: "exact", head: true }).eq("status", "approved").is("deleted_at", null),
    admin.from("duty_reports").select("id", { count: "exact", head: true }).eq("status", "rejected").is("deleted_at", null),
  ]);

  const { data: hoursData, error: hoursError } = await admin
    .from("duty_reports")
    .select("on_duty_at, off_duty_at")
    .gt("created_at", oneWeekAgo)
    .is("deleted_at", null);
  let total_hours = 0;
  if (!hoursError && hoursData) {
    for (const row of hoursData as Array<{ on_duty_at: string; off_duty_at: string }>) {
      const on = new Date(row.on_duty_at).getTime();
      const off = new Date(row.off_duty_at).getTime();
      total_hours += (off - on) / (1000 * 60 * 60);
    }
  }

  const { data: topData, error: topError } = await admin
    .from("duty_reports")
    .select("member_id, members!duty_reports_member_id_fkey(name, rank)")
    .gt("created_at", oneWeekAgo)
    .is("deleted_at", null);
  const memberCount = new Map<string, { name: string; rank: string | null; count: number }>();
  if (!topError && topData) {
    const rows = topData as unknown as Array<{ member_id: string; members: { name: string; rank: string | null } | { name: string; rank: string | null }[] }>;
    for (const row of rows) {
      const member = Array.isArray(row.members) ? row.members[0] : row.members;
      if (!member) continue;
      const existing = memberCount.get(row.member_id);
      if (existing) {
        existing.count++;
      } else {
        memberCount.set(row.member_id, { name: member.name, rank: member.rank, count: 1 });
      }
    }
  }
  const top_members = Array.from(memberCount.entries())
    .map(([member_id, v]) => ({ member_id, name: v.name, rank: v.rank, count: v.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const { data: activeMembers } = await admin
    .from("members")
    .select("id")
    .eq("is_active", true)
    .eq("role", "member");
  const activeIds = (activeMembers ?? []) as Array<{ id: string }>;

  let missed = 0;
  if (activeIds.length > 0) {
    const { data: recentReporters } = await admin
      .from("duty_reports")
      .select("member_id")
      .gt("created_at", threeDaysAgo)
      .is("deleted_at", null);
    const recentSet = new Set(
      ((recentReporters ?? []) as Array<{ member_id: string }>).map((r) => r.member_id),
    );
    missed = activeIds.filter((m) => !recentSet.has(m.id)).length;
  }

  return {
    weekly_total: weekly_total ?? 0,
    total_hours: Math.round(total_hours * 10) / 10,
    pending_count: pending_count ?? 0,
    approved_count: approved_count ?? 0,
    rejected_count: rejected_count ?? 0,
    missed_count: missed,
    top_members,
  };
}

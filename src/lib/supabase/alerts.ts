import { createAdminClient } from "@/lib/supabase/admin";

export type MissedDutyAlert = {
  member_id: string;
  name: string;
  rank: string | null;
  last_duty: string | null;
  days_since: number;
};

export async function fetchMissedDutyAlerts(daysThreshold = 3): Promise<MissedDutyAlert[]> {
  const admin = createAdminClient();
  const thresholdDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000).toISOString();

  const { data: members, error: membersError } = await admin
    .from("members")
    .select("id, name, rank, created_at")
    .eq("is_active", true)
    .eq("role", "member")
    .order("name", { ascending: true });

  if (membersError || !members) return [];

  const memberRows = members as Array<{ id: string; name: string; rank: string | null; created_at: string }>;

  if (memberRows.length === 0) return [];

  const { data: recentReports, error: reportsError } = await admin
    .from("duty_reports")
    .select("member_id, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (reportsError || !recentReports) return [];
  const reportRows = recentReports as Array<{ member_id: string; created_at: string }>;
  const latestByMember = new Map<string, string>();
  for (const r of reportRows) {
    if (!latestByMember.has(r.member_id)) latestByMember.set(r.member_id, r.created_at);
  }

  const alerts: MissedDutyAlert[] = [];
  for (const m of memberRows) {
    const lastDuty = latestByMember.get(m.id) ?? m.created_at;
    const lastDate = new Date(lastDuty);
    const daysSince = Math.floor((Date.now() - lastDate.getTime()) / (24 * 60 * 60 * 1000));
    if (lastDate.getTime() < new Date(thresholdDate).getTime()) {
      alerts.push({
        member_id: m.id,
        name: m.name,
        rank: m.rank,
        last_duty: lastDuty,
        days_since: daysSince,
      });
    }
  }

  return alerts.sort((a, b) => b.days_since - a.days_since);
}

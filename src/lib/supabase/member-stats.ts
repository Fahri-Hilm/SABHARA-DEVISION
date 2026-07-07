import { createAdminClient } from "./admin";
import type { DutyReport, DutyPhoto } from "@/types/db";

export type MemberDutyHistory = DutyReport & {
  duty_photos: DutyPhoto[];
};

export type MemberStats = {
  total_duty: number;
  total_hours: number;
  weekly_duty: number;
  weekly_hours: number;
  last_duty: string | null;
  first_duty: string | null;
  approved_count: number;
  pending_count: number;
  rejected_count: number;
};

export type MemberWithStats = {
  id: string;
  name: string;
  rank: string | null;
  badge_number: string | null;
  is_active: boolean;
  stats: MemberStats;
};

export async function fetchMemberStats(memberId: string): Promise<MemberStats | null> {
  const admin = createAdminClient();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: reports, error } = await admin
    .from("duty_reports")
    .select("id, on_duty_at, off_duty_at, status, created_at")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false });

  if (error) return null;

  const all = (reports ?? []) as Array<{
    id: string;
    on_duty_at: string;
    off_duty_at: string;
    status: string;
    created_at: string;
  }>;

  if (all.length === 0) {
    return {
      total_duty: 0,
      total_hours: 0,
      weekly_duty: 0,
      weekly_hours: 0,
      last_duty: null,
      first_duty: null,
      approved_count: 0,
      pending_count: 0,
      rejected_count: 0,
    };
  }

  let total_hours = 0;
  let weekly_hours = 0;
  let weekly_duty = 0;
  let approved = 0;
  let pending = 0;
  let rejected = 0;

  for (const r of all) {
    const on = new Date(r.on_duty_at).getTime();
    const off = new Date(r.off_duty_at).getTime();
    const hours = (off - on) / (1000 * 60 * 60);
    total_hours += hours;
    if (new Date(r.created_at).getTime() > new Date(oneWeekAgo).getTime()) {
      weekly_duty++;
      weekly_hours += hours;
    }
    if (r.status === "approved") approved++;
    else if (r.status === "pending") pending++;
    else if (r.status === "rejected") rejected++;
  }

  return {
    total_duty: all.length,
    total_hours: Math.round(total_hours * 10) / 10,
    weekly_duty,
    weekly_hours: Math.round(weekly_hours * 10) / 10,
    last_duty: all[0]!.created_at,
    first_duty: all[all.length - 1]!.created_at,
    approved_count: approved,
    pending_count: pending,
    rejected_count: rejected,
  };
}

export async function fetchMemberDutyHistory(
  memberId: string,
  limit = 100,
): Promise<MemberDutyHistory[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("duty_reports")
    .select("*, duty_photos(*)")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as MemberDutyHistory[];
}

export async function fetchMembersWithStats(): Promise<MemberWithStats[]> {
  const admin = createAdminClient();
  const { data: members, error } = await admin
    .from("members")
    .select("id, name, rank, badge_number, is_active, role, created_at")
    .eq("is_active", true)
    .eq("role", "member")
    .order("name", { ascending: true });

  if (error || !members) return [];

  const memberRows = members as Array<{
    id: string;
    name: string;
    rank: string | null;
    badge_number: string | null;
    is_active: boolean;
    role: string;
    created_at: string;
  }>;

  const result: MemberWithStats[] = [];
  for (const m of memberRows) {
    const stats = await fetchMemberStats(m.id);
    if (stats) {
      result.push({
        id: m.id,
        name: m.name,
        rank: m.rank,
        badge_number: m.badge_number,
        is_active: m.is_active,
        stats,
      });
    }
  }

  return result.sort((a, b) => b.stats.weekly_duty - a.stats.weekly_duty);
}

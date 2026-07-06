import { createAdminClient } from "./admin";
import type { DutyReport, Member, DutyPhoto, FeedFilter } from "@/types/db";

async function fetchRosterInternal(): Promise<Member[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("members")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Member[];
}

export async function fetchMemberRoster(): Promise<Member[]> {
  return fetchRosterInternal();
}

export type DutyReportWithMember = DutyReport & {
  members: Pick<Member, "id" | "name" | "rank" | "badge_number">;
  duty_photos: DutyPhoto[];
};

export async function fetchDutyReports(
  filter: FeedFilter = {},
  limit = 50,
): Promise<DutyReportWithMember[]> {
  const admin = createAdminClient();
  let query = admin
    .from("duty_reports")
    .select(
      "*, members!duty_reports_member_id_fkey(id, name, rank, badge_number), duty_photos(*)",
    )
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filter.member_id) query = query.eq("member_id", filter.member_id);
  if (filter.status) query = query.eq("status", filter.status);
  if (filter.date_from) query = query.gte("duty_date", filter.date_from);
  if (filter.date_to) query = query.lte("duty_date", filter.date_to);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as DutyReportWithMember[];
}

export async function fetchDutyReportById(
  id: string,
): Promise<DutyReportWithMember | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("duty_reports")
    .select(
      "*, members!duty_reports_member_id_fkey(id, name, rank, badge_number), duty_photos(*)",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as DutyReportWithMember | null;
}

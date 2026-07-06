"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";
import { fetchDutyReports } from "@/lib/supabase/queries";
import { unparse } from "papaparse";
import type { FeedFilter } from "@/types/db";

export async function exportDutyCsvAction(filter: FeedFilter = {}): Promise<{
  csv?: string;
  filename?: string;
  error?: string;
}> {
  await requireAdmin();

  try {
    const reports = await fetchDutyReports(filter, 1000);
    const rows = reports.map((r) => {
      const onDuty = new Date(r.on_duty_at);
      const offDuty = new Date(r.off_duty_at);
      const durationHours = Math.round(((offDuty.getTime() - onDuty.getTime()) / (1000 * 60 * 60)) * 10) / 10;
      return {
        member_name: r.members.name,
        rank: r.members.rank ?? "",
        badge_number: r.members.badge_number ?? "",
        duty_date: r.duty_date,
        on_duty: onDuty.toISOString(),
        off_duty: offDuty.toISOString(),
        duration_hours: durationHours,
        status: r.status,
        reject_reason: r.reject_reason ?? "",
        notes: r.notes ?? "",
        created_at: new Date(r.created_at).toISOString(),
      };
    });

    const csv = unparse({
      fields: [
        "member_name",
        "rank",
        "badge_number",
        "duty_date",
        "on_duty",
        "off_duty",
        "duration_hours",
        "status",
        "reject_reason",
        "notes",
        "created_at",
      ],
      data: rows,
    });

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    return {
      csv,
      filename: `duty-export-${date}.csv`,
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal export CSV" };
  }
}

export async function _checkAdmin() {
  await requireAdmin();
  const admin = createAdminClient();
  void admin;
}

"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";
import { unparse } from "papaparse";
import type { DutyReportWithMember } from "@/lib/supabase/queries";

const REPORT_TTL_DAYS = 14;

export type ExportAndCleanupResult = {
  exported: number;
  deleted: number;
  csvPath: string | null;
  errors: string[];
};

async function fetchOldReports(): Promise<DutyReportWithMember[]> {
  const admin = createAdminClient();
  const cutoff = new Date(Date.now() - REPORT_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await admin
    .from("duty_reports")
    .select(
      "*, members!duty_reports_member_id_fkey(id, name, rank, badge_number), duty_photos(*)",
    )
    .lt("created_at", cutoff)
    .is("deleted_at", null)
    .order("created_at", { ascending: true })
    .limit(1000);

  if (error) throw error;
  return (data ?? []) as DutyReportWithMember[];
}

function reportsToCsv(reports: DutyReportWithMember[]): string {
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

  return unparse({
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
}

async function uploadCsvToStorage(csv: string, date: string): Promise<string | null> {
  const admin = createAdminClient();
  const path = `duty-reports-${date}.csv`;
  const { error } = await admin
    .storage
    .from("exports")
    .upload(path, csv, { contentType: "text/csv", upsert: true });

  if (error) return null;
  return path;
}

async function deleteOldReports(): Promise<number> {
  const admin = createAdminClient();
  const cutoff = new Date(Date.now() - REPORT_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await admin
    .from("duty_reports")
    .delete()
    .lt("created_at", cutoff)
    .is("deleted_at", null)
    .select("id");

  if (error) throw error;
  return (data ?? []).length;
}

export async function exportAndCleanupOldReportsAction(): Promise<ExportAndCleanupResult> {
  await requireAdmin();
  return runExportAndCleanup();
}

export async function runExportAndCleanup(): Promise<ExportAndCleanupResult> {
  const errors: string[] = [];

  try {
    const reports = await fetchOldReports();
    if (reports.length === 0) {
      return { exported: 0, deleted: 0, csvPath: null, errors: [] };
    }

    const csv = reportsToCsv(reports);
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const csvPath = await uploadCsvToStorage(csv, date);

    if (!csvPath) {
      errors.push("Gagal upload CSV ke storage");
      return { exported: 0, deleted: 0, csvPath: null, errors };
    }

    const deleted = await deleteOldReports();

    return {
      exported: reports.length,
      deleted,
      csvPath,
      errors,
    };
  } catch (e) {
    errors.push(e instanceof Error ? e.message : "Unknown error");
    return { exported: 0, deleted: 0, csvPath: null, errors };
  }
}

export async function listExportFiles(): Promise<Array<{ name: string; size: number; created_at: string }>> {
  await requireAdmin();
  const admin = createAdminClient();
  const { data, error } = await admin
    .storage
    .from("exports")
    .list("", { limit: 50, sortBy: { column: "created_at", order: "desc" } });

  if (error || !data) return [];
  return data
    .filter((f) => f.name.endsWith(".csv"))
    .map((f) => ({
      name: f.name,
      size: f.metadata?.size ?? 0,
      created_at: f.created_at ?? "",
    }));
}

export async function createExportSignedUrl(name: string): Promise<string | null> {
  await requireAdmin();
  const admin = createAdminClient();
  const { data, error } = await admin
    .storage
    .from("exports")
    .createSignedUrl(name, 3600);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

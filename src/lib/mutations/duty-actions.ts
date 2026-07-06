"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";

export async function approveDutyAction(reportId: string): Promise<{ error?: string }> {
  const session = await requireAdmin();

  const admin = createAdminClient();
  const { error } = await admin
    .from("duty_reports")
    .update({
      status: "approved",
      approved_by: session.member_id,
      approved_at: new Date().toISOString(),
      reject_reason: null,
    })
    .eq("id", reportId)
    .eq("status", "pending");

  if (error) {
    return { error: `Gagal menyetujui: ${error.message}` };
  }

  revalidatePath("/feed");
  revalidatePath("/admin/dashboard");
  return {};
}

export async function rejectDutyAction(
  reportId: string,
  reason: string,
): Promise<{ error?: string }> {
  const session = await requireAdmin();

  const trimmed = reason.trim();
  if (trimmed.length < 5) {
    return { error: "Alasan penolakan minimal 5 karakter" };
  }
  if (trimmed.length > 500) {
    return { error: "Alasan penolakan maksimal 500 karakter" };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("duty_reports")
    .update({
      status: "rejected",
      reject_reason: trimmed,
      approved_by: session.member_id,
      approved_at: new Date().toISOString(),
    })
    .eq("id", reportId)
    .eq("status", "pending");

  if (error) {
    return { error: `Gagal menolak: ${error.message}` };
  }

  revalidatePath("/feed");
  revalidatePath("/admin/dashboard");
  return {};
}

export async function deleteDutyAction(reportId: string): Promise<{ error?: string }> {
  await requireAdmin();

  const admin = createAdminClient();
  const { data: report, error: findError } = await admin
    .from("duty_reports")
    .select("created_at")
    .eq("id", reportId)
    .maybeSingle();

  if (findError || !report) {
    return { error: "Laporan tidak ditemukan" };
  }

  const createdAt = new Date(report.created_at).getTime();
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  if (createdAt < oneHourAgo) {
    return { error: "Laporan hanya bisa dihapus dalam 1 jam pertama" };
  }

  const { error } = await admin
    .from("duty_reports")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", reportId);

  if (error) {
    return { error: `Gagal menghapus: ${error.message}` };
  }

  revalidatePath("/feed");
  return {};
}

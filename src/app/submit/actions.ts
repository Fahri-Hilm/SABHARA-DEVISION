"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireMember } from "@/lib/auth/session";
import { dutyReportInsertSchema } from "@/lib/schemas/duty-report";
import type { DutyPhoto } from "@/types/db";

export async function submitDutyAction(formData: FormData): Promise<{ error?: string }> {
  const session = await requireMember();

  const member_id = String(formData.get("member_id") ?? "");
  const duty_date = String(formData.get("duty_date") ?? "");
  const on_duty_time = String(formData.get("on_duty_time") ?? "");
  const off_duty_time = String(formData.get("off_duty_time") ?? "");
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!duty_date || !on_duty_time || !off_duty_time) {
    return { error: "Tanggal, jam on duty, dan jam off duty wajib diisi" };
  }

  const on_duty_iso = `${duty_date}T${on_duty_time}:00`;
  const off_duty_iso = `${duty_date}T${off_duty_time}:00`;
  const on_duty_at = new Date(on_duty_iso).toISOString();
  const off_duty_at = new Date(off_duty_iso).toISOString();

  const parsed = dutyReportInsertSchema.safeParse({
    member_id,
    duty_date,
    on_duty_at,
    off_duty_at,
    notes,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const photos = formData.getAll("photos") as File[];
  if (photos.length === 0) {
    return { error: "Minimal 1 foto bukti" };
  }
  if (photos.length > 3) {
    return { error: "Maksimal 3 foto" };
  }

  const admin = createAdminClient();

  const { data: reportRow, error: reportError } = await admin
    .from("duty_reports")
    .insert({
      member_id: parsed.data.member_id,
      duty_date: parsed.data.duty_date,
      on_duty_at: parsed.data.on_duty_at,
      off_duty_at: parsed.data.off_duty_at,
      notes: parsed.data.notes ?? null,
      status: "pending",
    })
    .select("id")
    .single();
  if (reportError || !reportRow) {
    return { error: `Gagal menyimpan laporan: ${reportError?.message ?? "unknown"}` };
  }
  const reportId = reportRow.id;

  const uploadedPaths: string[] = [];
  const photoRows: DutyPhoto[] = [];
  let failure: string | null = null;

  for (let i = 0; i < photos.length; i++) {
    const file = photos[i]!;
    const ext = file.type.split("/")[1] ?? "jpg";
    const path = `${parsed.data.member_id}/${reportId}/${crypto.randomUUID()}.${ext}`;
    const originalSize = 0;
    const compressedSize = file.size;

    const { error: uploadError } = await admin
      .storage
      .from("duty-photos")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      failure = `Gagal upload foto: ${uploadError.message}`;
      break;
    }
    uploadedPaths.push(path);

    const { data: photoRow, error: photoError } = await admin
      .from("duty_photos")
      .insert({
        duty_report_id: reportId,
        storage_path: path,
        original_size: originalSize,
        compressed_size: compressedSize,
      })
      .select()
      .single();

    if (photoError || !photoRow) {
      failure = `Gagal menyimpan metadata foto: ${photoError?.message ?? "unknown"}`;
      break;
    }
    photoRows.push(photoRow as DutyPhoto);
  }

  if (failure) {
    await Promise.all(
      uploadedPaths.map((p) => admin.storage.from("duty-photos").remove([p])),
    );
    await admin.from("duty_reports").delete().eq("id", reportId);
    return { error: failure };
  }

  void session;
  revalidatePath("/feed");
  redirect("/feed");
}

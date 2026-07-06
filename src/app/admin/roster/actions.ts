"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";
import { memberInsertSchema, memberUpdateSchema } from "@/lib/schemas/member";
import type { Member } from "@/types/db";

export async function addMemberAction(formData: FormData): Promise<{ error?: string; member?: Member }> {
  await requireAdmin();
  const parsed = memberInsertSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    rank: String(formData.get("rank") ?? "").trim() || undefined,
    badge_number: String(formData.get("badge_number") ?? "").trim() || undefined,
    role: String(formData.get("role") ?? "member"),
    is_active: true,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("members")
    .insert(parsed.data)
    .select()
    .single();
  if (error) {
    return { error: `Gagal menambah anggota: ${error.message}` };
  }
  revalidatePath("/admin/roster");
  revalidatePath("/admin/dashboard");
  return { member: data as Member };
}

export async function updateMemberAction(
  id: string,
  formData: FormData,
): Promise<{ error?: string }> {
  await requireAdmin();
  const parsed = memberUpdateSchema.safeParse({
    name: String(formData.get("name") ?? "").trim() || undefined,
    rank: String(formData.get("rank") ?? "").trim() || null,
    badge_number: String(formData.get("badge_number") ?? "").trim() || null,
    role: String(formData.get("role") ?? "") || undefined,
    is_active: formData.get("is_active") === "on" ? true : undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("members").update(parsed.data).eq("id", id);
  if (error) {
    return { error: `Gagal mengupdate anggota: ${error.message}` };
  }
  revalidatePath("/admin/roster");
  revalidatePath("/admin/dashboard");
  return {};
}

export async function deactivateMemberAction(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("members").update({ is_active: false }).eq("id", id);
  if (error) {
    return { error: `Gagal menonaktifkan anggota: ${error.message}` };
  }
  revalidatePath("/admin/roster");
  revalidatePath("/admin/dashboard");
  return {};
}

export async function deleteMemberAction(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const admin = createAdminClient();

  const { count } = await admin
    .from("duty_reports")
    .select("id", { count: "exact", head: true })
    .eq("member_id", id);
  if ((count ?? 0) > 0) {
    return {
      error: "Tidak bisa menghapus anggota yang sudah punya riwayat duty. Nonaktifkan saja.",
    };
  }

  const { error } = await admin.from("members").delete().eq("id", id);
  if (error) {
    return { error: `Gagal menghapus anggota: ${error.message}` };
  }
  revalidatePath("/admin/roster");
  revalidatePath("/admin/dashboard");
  return {};
}

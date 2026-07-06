"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { setSessionCookie, clearSession } from "@/lib/auth/session";
import type { AuthSession } from "@/types/db";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function callLogin(name: string, code: string): Promise<AuthSession> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ code }),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as { session?: AuthSession; error?: string };
  if (!response.ok || !data.session) {
    throw new Error(data.error ?? "Gagal login");
  }
  return data.session;
}

export async function loginMemberAction(formData: FormData): Promise<void> {
  const code = String(formData.get("code") ?? "").trim();
  if (!code) throw new Error("Kode akses wajib diisi");

  const session = await callLogin("member-login", code);
  await setSessionCookie(session);
  redirect("/feed");
}

export async function loginAdminAction(formData: FormData): Promise<void> {
  const code = String(formData.get("code") ?? "").trim();
  if (!code) throw new Error("Kode admin wajib diisi");

  const session = await callLogin("admin-login", code);
  await setSessionCookie(session);
  redirect("/admin/dashboard");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  const store = await cookies();
  void store;
  redirect("/login");
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AuthSession, MemberRole } from "@/types/db";

export const SESSION_COOKIE = "sabhara-session";

export async function getSession(): Promise<AuthSession | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(atob(raw)) as AuthSession;
    if (parsed.exp * 1000 < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function setSessionCookie(session: AuthSession): Promise<void> {
  const store = await cookies();
  const encoded = btoa(JSON.stringify(session));
  store.set(SESSION_COOKIE, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: session.exp - Math.floor(Date.now() / 1000),
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function requireRole(role: MemberRole): Promise<AuthSession> {
  const session = await getSession();
  if (!session || session.role !== role) {
    redirect("/login");
  }
  return session;
}

export async function requireMember(): Promise<AuthSession> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "member" && session.role !== "admin") redirect("/login");
  return session;
}

export async function requireAdmin(): Promise<AuthSession> {
  return requireRole("admin");
}

export async function getCurrentMemberId(): Promise<string | null> {
  const session = await getSession();
  return session?.member_id ?? null;
}

export { createClient };

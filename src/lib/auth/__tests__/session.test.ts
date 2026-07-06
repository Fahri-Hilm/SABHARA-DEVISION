import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { cookies } from "next/headers";
import { getSession, setSessionCookie, clearSession, requireAdmin, requireMember } from "@/lib/auth/session";
import type { AuthSession } from "@/types/db";

const VALID_SESSION: AuthSession = {
  role: "admin",
  member_id: "550e8400-e29b-41d4-a716-446655440000",
  exp: Math.floor(Date.now() / 1000) + 3600,
};

function mockCookieStore(getValue?: string, setters: Array<() => void> = []) {
  const store = {
    get: vi.fn(() => (getValue ? { value: getValue } : undefined)),
    getAll: vi.fn(() => (getValue ? [{ name: "sabhara-session", value: getValue }] : [])),
    set: vi.fn((...args: unknown[]) => setters.push(() => args)),
    delete: vi.fn(),
  };
  vi.mocked(cookies).mockResolvedValue(store as unknown as Awaited<ReturnType<typeof cookies>>);
  return store;
}

describe("session helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getSession returns null when no cookie", async () => {
    mockCookieStore(undefined);
    const session = await getSession();
    expect(session).toBeNull();
  });

  it("getSession parses valid cookie", async () => {
    const encoded = btoa(JSON.stringify(VALID_SESSION));
    mockCookieStore(encoded);
    const session = await getSession();
    expect(session).toEqual(VALID_SESSION);
  });

  it("getSession returns null for expired session", async () => {
    const expired: AuthSession = { ...VALID_SESSION, exp: Math.floor(Date.now() / 1000) - 100 };
    const encoded = btoa(JSON.stringify(expired));
    mockCookieStore(encoded);
    const session = await getSession();
    expect(session).toBeNull();
  });

  it("getSession returns null for invalid base64", async () => {
    mockCookieStore("not-valid-base64!@#");
    const session = await getSession();
    expect(session).toBeNull();
  });

  it("setSessionCookie sets httpOnly secure cookie", async () => {
    const store = mockCookieStore();
    await setSessionCookie(VALID_SESSION);
    expect(store.set).toHaveBeenCalledWith(
      "sabhara-session",
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      }),
    );
  });

  it("clearSession deletes cookie", async () => {
    const store = mockCookieStore();
    await clearSession();
    expect(store.delete).toHaveBeenCalledWith("sabhara-session");
  });

  it("requireAdmin redirects when no session", async () => {
    mockCookieStore(undefined);
    await expect(requireAdmin()).rejects.toThrow("REDIRECT:/login");
  });

  it("requireAdmin redirects when role is member", async () => {
    const memberSession: AuthSession = { ...VALID_SESSION, role: "member" };
    mockCookieStore(btoa(JSON.stringify(memberSession)));
    await expect(requireAdmin()).rejects.toThrow("REDIRECT:/login");
  });

  it("requireAdmin returns session when role is admin", async () => {
    mockCookieStore(btoa(JSON.stringify(VALID_SESSION)));
    const session = await requireAdmin();
    expect(session).toEqual(VALID_SESSION);
  });

  it("requireMember accepts member role", async () => {
    const memberSession: AuthSession = { ...VALID_SESSION, role: "member" };
    mockCookieStore(btoa(JSON.stringify(memberSession)));
    const session = await requireMember();
    expect(session.role).toBe("member");
  });
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SESSION_TTL_SECONDS = 24 * 60 * 60;

interface LoginRequest {
  code?: string;
}

interface AccessCodeRow {
  id: string;
  role: string;
  is_active: boolean;
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyCode(code: string, expectedRole: string): Promise<boolean> {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const codeHash = await sha256(code);
  const { data, error } = await supabase
    .from("access_codes")
    .select("id, role, is_active")
    .eq("code_hash", codeHash)
    .eq("role", expectedRole)
    .eq("is_active", true)
    .maybeSingle();

  if (error) return false;
  return Boolean(data as AccessCodeRow | null);
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: LoginRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const code = body.code?.trim();
  if (!code) {
    return new Response(JSON.stringify({ error: "Kode akses wajib diisi" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const valid = await verifyCode(code, "member");
  if (!valid) {
    return new Response(JSON.stringify({ error: "Kode akses tidak valid" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const session = {
    role: "member" as const,
    member_id: null,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  return new Response(JSON.stringify({ session }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

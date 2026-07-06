import { createAdminClient } from "./admin";

type CallEdgeFunctionOptions = {
  body: unknown;
  jwt?: string | null;
};

export async function callEdgeFunction<T = unknown>(
  name: string,
  { body, jwt }: CallEdgeFunctionOptions,
): Promise<T> {
  const admin = createAdminClient();
  const endpoint = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/functions/v1/${name}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    Authorization: `Bearer ${jwt ?? process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as T & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? `Edge function ${name} failed: ${response.status}`);
  }

  void admin;
  return data;
}

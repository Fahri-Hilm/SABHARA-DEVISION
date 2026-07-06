import { createAdminClient } from "@/lib/supabase/admin";

export async function getSignedPhotoUrl(
  storagePath: string,
  expiresIn: number = 3600,
): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .storage
    .from("duty-photos")
    .createSignedUrl(storagePath, expiresIn);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

export async function getSignedPhotoUrls(
  paths: string[],
  expiresIn: number = 3600,
): Promise<Map<string, string>> {
  const admin = createAdminClient();
  const result = new Map<string, string>();
  await Promise.all(
    paths.map(async (path) => {
      const url = await getSignedPhotoUrl(path, expiresIn);
      if (url) result.set(path, url);
      void admin;
    }),
  );
  return result;
}

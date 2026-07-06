"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";

const CLEANUP_BATCH = 100;
const PHOTO_TTL_DAYS = 14;

export type CleanupResult = {
  cleaned: number;
  photos: string[];
  errors: string[];
};

export async function cleanupOldPhotosAction(): Promise<CleanupResult> {
  await requireAdmin();
  return runCleanup();
}

export async function runCleanup(): Promise<CleanupResult> {
  const admin = createAdminClient();
  const errors: string[] = [];
  const cleanedPaths: string[] = [];

  const { data: oldPhotos, error: queryError } = await admin
    .from("duty_photos")
    .select("id, storage_path")
    .lt("created_at", new Date(Date.now() - PHOTO_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString())
    .is("deleted_at", null)
    .not("storage_path", "is", null)
    .limit(CLEANUP_BATCH);

  if (queryError) {
    return { cleaned: 0, photos: [], errors: [queryError.message] };
  }

  const photos = (oldPhotos ?? []) as Array<{ id: string; storage_path: string }>;
  if (photos.length === 0) {
    return { cleaned: 0, photos: [], errors: [] };
  }

  const paths = photos.map((p) => p.storage_path);
  const { error: removeError } = await admin
    .storage
    .from("duty-photos")
    .remove(paths);

  if (removeError) {
    errors.push(removeError.message);
  } else {
    cleanedPaths.push(...paths);
  }

  const ids = photos.map((p) => p.id);
  const { error: updateError } = await admin
    .from("duty_photos")
    .update({ storage_path: null, deleted_at: new Date().toISOString() })
    .in("id", ids);

  if (updateError) {
    errors.push(updateError.message);
  }

  return { cleaned: cleanedPaths.length, photos: ids, errors };
}

-- ============================================
-- KEPOLISIAN FUTURISTIC SABHARA DEVISION
-- RLS Policies + Storage Bucket
-- ============================================

-- ============================================
-- ENABLE RLS
-- ============================================
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE duty_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE duty_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SELECT POLICIES (authenticated users can read)
-- Members use anonymous Supabase Auth (after shared code verified by Edge Function)
-- Admins use magic link Supabase Auth
-- Both get auth.role() = 'authenticated'
-- ============================================
DROP POLICY IF EXISTS "members_select_authenticated" ON members;
CREATE POLICY "members_select_authenticated"
  ON members FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "duty_reports_select_authenticated" ON duty_reports;
CREATE POLICY "duty_reports_select_authenticated"
  ON duty_reports FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "duty_photos_select_authenticated" ON duty_photos;
CREATE POLICY "duty_photos_select_authenticated"
  ON duty_photos FOR SELECT
  TO authenticated
  USING (true);

-- access_codes: NO select policy = blocked for authenticated (service_role only)
-- This protects code hashes from being read by any client

-- ============================================
-- WRITE POLICIES
-- All writes (INSERT/UPDATE/DELETE) go through Edge Functions using service_role
-- service_role bypasses RLS. No client write policies = default deny.
-- This is defense-in-depth: even if anon key is compromised, no writes possible.
-- ============================================

-- ============================================
-- STORAGE BUCKET: duty-photos (private)
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'duty-photos',
  'duty-photos',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES
-- ============================================
DROP POLICY IF EXISTS "duty_photos_storage_select_authenticated" ON storage.objects;
CREATE POLICY "duty_photos_storage_select_authenticated"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'duty-photos');

-- INSERT/UPDATE/DELETE: no policies = blocked for authenticated
-- Edge Functions use service_role which bypasses RLS

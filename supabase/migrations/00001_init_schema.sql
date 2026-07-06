-- ============================================
-- KEPOLISIAN FUTURISTIC SABHARA DEVISION
-- Initial Schema Migration
-- ============================================

-- Extensions uuid-ossp + pgcrypto already installed on this project

-- ============================================
-- TABLE: members
-- ============================================
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  rank text,
  badge_number text,
  role text NOT NULL CHECK (role IN ('member', 'admin')) DEFAULT 'member',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_members_active ON members(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_members_role ON members(role);

-- ============================================
-- TABLE: duty_reports
-- ============================================
CREATE TABLE IF NOT EXISTS duty_reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE RESTRICT,
  duty_date date NOT NULL,
  on_duty_at timestamptz NOT NULL,
  off_duty_at timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reject_reason text,
  approved_by uuid REFERENCES members(id),
  approved_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_off_after_on' AND conrelid = 'duty_reports'::regclass
  ) THEN
    ALTER TABLE duty_reports ADD CONSTRAINT chk_off_after_on CHECK (off_duty_at > on_duty_at);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_duty_reports_member_id ON duty_reports(member_id);
CREATE INDEX IF NOT EXISTS idx_duty_reports_duty_date ON duty_reports(duty_date DESC);
CREATE INDEX IF NOT EXISTS idx_duty_reports_status ON duty_reports(status);
CREATE INDEX IF NOT EXISTS idx_duty_reports_created_at ON duty_reports(created_at DESC);

-- ============================================
-- TABLE: duty_photos
-- ============================================
CREATE TABLE IF NOT EXISTS duty_photos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  duty_report_id uuid NOT NULL REFERENCES duty_reports(id) ON DELETE CASCADE,
  storage_path text,
  original_size int,
  compressed_size int,
  created_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_duty_photos_duty_report_id ON duty_photos(duty_report_id);
CREATE INDEX IF NOT EXISTS idx_duty_photos_created_at ON duty_photos(created_at);
CREATE INDEX IF NOT EXISTS idx_duty_photos_active ON duty_photos(created_at) WHERE deleted_at IS NULL;

-- ============================================
-- TABLE: access_codes
-- ============================================
CREATE TABLE IF NOT EXISTS access_codes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code_hash text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('member', 'admin')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  rotated_at timestamptz
);

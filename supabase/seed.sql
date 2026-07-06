-- ============================================
-- KEPOLISIAN FUTURISTIC SABHARA DEVISION
-- Seed Data
-- ============================================

INSERT INTO members (name, rank, badge_number, role, is_active) VALUES
  ('Budi Admin', 'Kepala Divisi Sabhara', 'AD-001', 'admin', true),
  ('Andi Saputra', 'Bripda', 'BR-101', 'member', true),
  ('Citra Lestari', 'Bripda', 'BR-102', 'member', true),
  ('Dewi Sartika', 'Bripka', 'BR-103', 'member', true)
ON CONFLICT DO NOTHING;

INSERT INTO access_codes (code_hash, role, is_active) VALUES
  (encode(digest('sabhara2026', 'sha256'), 'hex'), 'member', true),
  (encode(digest('SABHARA-ADMIN-2026', 'sha256'), 'hex'), 'admin', true)
ON CONFLICT (code_hash) DO NOTHING;

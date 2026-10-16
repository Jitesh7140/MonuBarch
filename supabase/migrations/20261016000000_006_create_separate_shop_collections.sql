-- Portfolio, print-ready designs, and original drawings are intentionally
-- separate collections. Deleting an item from one does not affect the others.
CREATE TABLE IF NOT EXISTS print_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'pencil',
  medium text NOT NULL DEFAULT 'pencil',
  description text,
  size text,
  price numeric(10,2),
  year int,
  image_url text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  watermark boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS original_drawings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'pencil',
  medium text NOT NULL DEFAULT 'pencil',
  description text,
  size text,
  price numeric(10,2),
  year int,
  image_url text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  watermark boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_print_designs_published ON print_designs (published, sort_order);
CREATE INDEX IF NOT EXISTS idx_original_drawings_published ON original_drawings (published, sort_order);

ALTER TABLE print_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE original_drawings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_print_designs" ON print_designs;
CREATE POLICY "public_read_print_designs" ON print_designs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_print_designs" ON print_designs;
CREATE POLICY "auth_insert_print_designs" ON print_designs FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_print_designs" ON print_designs;
CREATE POLICY "auth_update_print_designs" ON print_designs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_print_designs" ON print_designs;
CREATE POLICY "auth_delete_print_designs" ON print_designs FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "public_read_original_drawings" ON original_drawings;
CREATE POLICY "public_read_original_drawings" ON original_drawings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_original_drawings" ON original_drawings;
CREATE POLICY "auth_insert_original_drawings" ON original_drawings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_original_drawings" ON original_drawings;
CREATE POLICY "auth_update_original_drawings" ON original_drawings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_original_drawings" ON original_drawings;
CREATE POLICY "auth_delete_original_drawings" ON original_drawings FOR DELETE TO authenticated USING (true);

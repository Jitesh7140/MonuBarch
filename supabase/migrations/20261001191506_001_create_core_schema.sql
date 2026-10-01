/*
# Create Core Schema for Portrait Artist Portfolio & Commission Website

## Overview
This migration creates the complete database schema for a premium portrait artist's website.
It supports artwork portfolio display, commission orders with pricing rules, testimonials,
contact enquiries, and an admin dashboard.

## New Tables
1. `artworks` - Portfolio artwork entries with title, category, medium, description, size, price, year, images, featured/published/watermark toggles, sort order
2. `artwork_images` - Additional images for each artwork (main image stored on artworks table)
3. `pricing_rules` - Configurable pricing rules (base prices, medium adjustments, size adjustments, extra person charges, frame costs, express charges, add-ons)
4. `orders` - Commission order requests with full customer details, portrait configuration, pricing, payment and order status
5. `order_images` - Private reference images uploaded by customers for their commission
6. `testimonials` - Customer reviews with optional images, publish toggle
7. `contact_enquiries` - Contact form submissions
8. `site_settings` - Website configuration: artist name, WhatsApp number, social links, etc.

## Security
- Admin authentication uses Supabase Auth (built-in `auth.users` table)
- Public tables (artworks, artwork_images, testimonials, pricing_rules, site_settings) have SELECT policies for anon+authenticated (public website reads)
- Write operations on all tables are restricted to authenticated admin users
- orders, order_images, contact_enquiries are INSERT-only for anon (public can submit), SELECT/UPDATE restricted to authenticated
- RLS enabled on all tables

## Notes
1. The admin user is created via Supabase Auth sign-up (email/password). Authenticated users can manage all data.
2. Order numbers use format POR-YYYY-#### generated via a sequence-based database function.
3. Pricing rules use a key-value structure for maximum flexibility.
*/
-- ===== ARTWORKS =====
CREATE TABLE IF NOT EXISTS artworks (
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
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_artworks_category ON artworks(category);
CREATE INDEX IF NOT EXISTS idx_artworks_published ON artworks(published);
CREATE INDEX IF NOT EXISTS idx_artworks_featured ON artworks(featured);

-- ===== ARTWORK IMAGES =====
CREATE TABLE IF NOT EXISTS artwork_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id uuid NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE artwork_images ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_artwork_images_artwork_id ON artwork_images(artwork_id);

-- ===== PRICING RULES =====
CREATE TABLE IF NOT EXISTS pricing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  key text NOT NULL,
  label text NOT NULL,
  numeric_value numeric(10,2) NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(type, key)
);
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

-- ===== ORDERS =====
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  whatsapp text,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  medium text NOT NULL DEFAULT 'pencil',
  size text NOT NULL DEFAULT 'a4',
  people_count int NOT NULL DEFAULT 1,
  framing text NOT NULL DEFAULT 'unframed',
  deadline_type text NOT NULL DEFAULT 'flexible',
  deadline_date date,
  special_instructions text,
  estimated_price numeric(10,2) NOT NULL DEFAULT 0,
  final_price numeric(10,2),
  payment_status text NOT NULL DEFAULT 'pending',
  order_status text NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- ===== ORDER IMAGES =====
CREATE TABLE IF NOT EXISTS order_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  storage_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE order_images ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_order_images_order_id ON order_images(order_id);

-- ===== TESTIMONIALS =====
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  review text NOT NULL,
  image_url text,
  portrait_image_url text,
  rating int NOT NULL DEFAULT 5,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- ===== CONTACT ENQUIRIES =====
CREATE TABLE IF NOT EXISTS contact_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_status ON contact_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_created_at ON contact_enquiries(created_at DESC);

-- ===== SITE SETTINGS =====
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ===== RLS POLICIES =====
-- Artworks: public read, admin write
DROP POLICY IF EXISTS "public_read_artworks" ON artworks;
CREATE POLICY "public_read_artworks" ON artworks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_artworks" ON artworks;
CREATE POLICY "auth_insert_artworks" ON artworks FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_artworks" ON artworks;
CREATE POLICY "auth_update_artworks" ON artworks FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_artworks" ON artworks;
CREATE POLICY "auth_delete_artworks" ON artworks FOR DELETE
  TO authenticated USING (true);

-- Artwork Images: public read, admin write
DROP POLICY IF EXISTS "public_read_artwork_images" ON artwork_images;
CREATE POLICY "public_read_artwork_images" ON artwork_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_artwork_images" ON artwork_images;
CREATE POLICY "auth_insert_artwork_images" ON artwork_images FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_artwork_images" ON artwork_images;
CREATE POLICY "auth_update_artwork_images" ON artwork_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_artwork_images" ON artwork_images;
CREATE POLICY "auth_delete_artwork_images" ON artwork_images FOR DELETE
  TO authenticated USING (true);

-- Pricing Rules: public read, admin write
DROP POLICY IF EXISTS "public_read_pricing_rules" ON pricing_rules;
CREATE POLICY "public_read_pricing_rules" ON pricing_rules FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_pricing_rules" ON pricing_rules;
CREATE POLICY "auth_insert_pricing_rules" ON pricing_rules FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_pricing_rules" ON pricing_rules;
CREATE POLICY "auth_update_pricing_rules" ON pricing_rules FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_pricing_rules" ON pricing_rules;
CREATE POLICY "auth_delete_pricing_rules" ON pricing_rules FOR DELETE
  TO authenticated USING (true);

-- Orders: public can insert (submit commission), admin can read/update
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_orders" ON orders;
CREATE POLICY "auth_read_orders" ON orders FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_orders" ON orders;
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_orders" ON orders;
CREATE POLICY "auth_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

-- Order Images: public can insert, admin can read/delete
DROP POLICY IF EXISTS "anon_insert_order_images" ON order_images;
CREATE POLICY "anon_insert_order_images" ON order_images FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_order_images" ON order_images;
CREATE POLICY "auth_read_order_images" ON order_images FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_delete_order_images" ON order_images;
CREATE POLICY "auth_delete_order_images" ON order_images FOR DELETE
  TO authenticated USING (true);

-- Testimonials: public read (published only via app filter), admin write
DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
CREATE POLICY "auth_insert_testimonials" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
CREATE POLICY "auth_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
CREATE POLICY "auth_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

-- Contact Enquiries: public can insert, admin can read/update/delete
DROP POLICY IF EXISTS "anon_insert_contact_enquiries" ON contact_enquiries;
CREATE POLICY "anon_insert_contact_enquiries" ON contact_enquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_contact_enquiries" ON contact_enquiries;
CREATE POLICY "auth_read_contact_enquiries" ON contact_enquiries FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_contact_enquiries" ON contact_enquiries;
CREATE POLICY "auth_update_contact_enquiries" ON contact_enquiries FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_contact_enquiries" ON contact_enquiries;
CREATE POLICY "auth_delete_contact_enquiries" ON contact_enquiries FOR DELETE
  TO authenticated USING (true);

-- Site Settings: public read, admin write
DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_site_settings" ON site_settings;
CREATE POLICY "auth_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
CREATE POLICY "auth_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_site_settings" ON site_settings;
CREATE POLICY "auth_delete_site_settings" ON site_settings FOR DELETE
  TO authenticated USING (true);
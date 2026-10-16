-- Storage used by the authenticated admin dashboard for portfolio and shop images.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'artwork-images',
  'artwork-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

DROP POLICY IF EXISTS "public_read_artwork_image_files" ON storage.objects;
CREATE POLICY "public_read_artwork_image_files"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'artwork-images');

DROP POLICY IF EXISTS "authenticated_upload_artwork_image_files" ON storage.objects;
CREATE POLICY "authenticated_upload_artwork_image_files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'artwork-images');

DROP POLICY IF EXISTS "authenticated_update_artwork_image_files" ON storage.objects;
CREATE POLICY "authenticated_update_artwork_image_files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'artwork-images')
WITH CHECK (bucket_id = 'artwork-images');

DROP POLICY IF EXISTS "authenticated_delete_artwork_image_files" ON storage.objects;
CREATE POLICY "authenticated_delete_artwork_image_files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'artwork-images');

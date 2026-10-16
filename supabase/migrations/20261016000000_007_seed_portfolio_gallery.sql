-- Original gallery artwork assets generated for the public portfolio.
-- Each entry is idempotent, so re-running this migration will not duplicate an item.
INSERT INTO artworks (title, category, medium, description, size, price, year, image_url, featured, published, watermark, sort_order)
SELECT 'Quiet Grace', 'pencil', 'pencil', 'A detailed graphite portrait with soft tonal layering and a calm, reflective presence.', 'A3 (29.7 × 42 cm)', 0, 2026, '/portfolio/portrait-grace.png', false, true, false, 10
WHERE NOT EXISTS (SELECT 1 FROM artworks WHERE title = 'Quiet Grace');

INSERT INTO artworks (title, category, medium, description, size, price, year, image_url, featured, published, watermark, sort_order)
SELECT 'Lines of a Life', 'charcoal', 'charcoal', 'A charcoal study celebrating character, texture, and the quiet strength of a life well lived.', 'A3 (29.7 × 42 cm)', 0, 2026, '/portfolio/portrait-legacy.png', false, true, false, 11
WHERE NOT EXISTS (SELECT 1 FROM artworks WHERE title = 'Lines of a Life');

INSERT INTO artworks (title, category, medium, description, size, price, year, image_url, featured, published, watermark, sort_order)
SELECT 'Together, Always', 'couple', 'pencil', 'An intimate pencil portrait that captures warmth, connection, and everyday closeness.', 'A3 (29.7 × 42 cm)', 0, 2026, '/portfolio/portrait-together.png', false, true, false, 12
WHERE NOT EXISTS (SELECT 1 FROM artworks WHERE title = 'Together, Always');

INSERT INTO artworks (title, category, medium, description, size, price, year, image_url, featured, published, watermark, sort_order)
SELECT 'Wonder', 'custom', 'colour', 'A softly coloured pencil portrait with gentle light and a hopeful upward gaze.', 'A3 (29.7 × 42 cm)', 0, 2026, '/portfolio/portrait-wonder.png', false, true, false, 13
WHERE NOT EXISTS (SELECT 1 FROM artworks WHERE title = 'Wonder');

INSERT INTO artworks (title, category, medium, description, size, price, year, image_url, featured, published, watermark, sort_order)
SELECT 'Faithful Companion', 'pet', 'pencil', 'A finely rendered pencil portrait that brings out the warmth and character of a beloved companion.', 'A3 (29.7 × 42 cm)', 0, 2026, '/portfolio/portrait-companion.png', false, true, false, 14
WHERE NOT EXISTS (SELECT 1 FROM artworks WHERE title = 'Faithful Companion');

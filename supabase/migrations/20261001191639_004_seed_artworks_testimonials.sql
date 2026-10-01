/*
# Seed Sample Artworks and Testimonials

## Overview
Inserts sample artwork entries for the portfolio and demo testimonials.
These use placeholder stock images for development and can be replaced with real artwork via the admin dashboard.

## Artworks Inserted
- 8 sample artworks across categories: pencil, charcoal, hyper_realistic, couple, family, celebrity, pet, custom
- Each with title, medium, description, size, year, image_url, and featured/published flags

## Testimonials
- 3 demo testimonials clearly marked as sample content

## Notes
1. Image URLs are from Pexels stock photography for development purposes.
2. All artworks are published and some are featured for the homepage gallery.
3. Admin can replace, edit, or delete all seeded data through the dashboard.
*/

INSERT INTO artworks (title, category, medium, description, size, price, year, image_url, featured, published, sort_order) VALUES
('Whispered Light', 'pencil', 'pencil', 'A study of quiet introspection, capturing the soft fall of light across a familiar face. Drawn over four sittings with gradual tonal layering.', 'A4 (21 × 29.7 cm)', 3500, 2025, 'https://images.pexels.com/photos/7608653/pexels-photo-7608653.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, true, 1),
('Solitude in Charcoal', 'charcoal', 'charcoal', 'A dramatic charcoal portrait exploring depth and contrast. The subject emerges from darkness through deliberate smudging and erasure techniques.', 'A3 (29.7 × 42 cm)', 5000, 2025, 'https://images.pexels.com/photos/36738957/pexels-photo-36738957.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, true, 2),
('The Gaze', 'hyper_realistic', 'pencil', 'An exercise in hyper-realism — every eyelash, every pore rendered with deliberate precision. A testament to patience and observation.', 'A3 (29.7 × 42 cm)', 8000, 2024, 'https://images.pexels.com/photos/7608654/pexels-photo-7608654.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, true, 3),
('Together', 'couple', 'charcoal', 'A couple drawn as one composition, their forms overlapping and connected. Charcoal on archival paper, sealed with fixative.', 'A3 (29.7 × 42 cm)', 6500, 2025, 'https://images.pexels.com/photos/4752046/pexels-photo-4752046.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, 4),
('Generations', 'family', 'pencil', 'A three-generation family portrait drawn from multiple reference photographs, blended into a single harmonious composition.', 'A2 (42 × 59.4 cm)', 12000, 2024, 'https://images.pexels.com/photos/4752047/pexels-photo-4752047.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, 5),
('Familiar Face', 'celebrity', 'charcoal', 'A charcoal study of a well-known portrait, reinterpreted with softer values and a focus on the eyes as the emotional centre.', 'A4 (21 × 29.7 cm)', 4500, 2025, 'https://images.pexels.com/photos/2123111/pexels-photo-2123111.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, 6),
('Loyal Companion', 'pet', 'pencil', 'A beloved dog rendered in pencil, capturing the warmth of fur texture and the particular intelligence in the eyes.', 'A4 (21 × 29.7 cm)', 3000, 2025, 'https://images.pexels.com/photos/3777910/pexels-photo-3777910.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, 7),
('In Colour', 'custom', 'colour', 'An experimental colour portrait using coloured pencils, pushing beyond the usual monochrome palette into warmth and vibrancy.', 'A3 (29.7 × 42 cm)', 7500, 2024, 'https://images.pexels.com/photos/39108160/pexels-photo-39108160.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, true, 8)
ON CONFLICT DO NOTHING;

-- Insert artwork images (additional images for first artwork)
INSERT INTO artwork_images (artwork_id, image_url, sort_order)
SELECT id, 'https://images.pexels.com/photos/6593327/pexels-photo-6593327.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 1
FROM artworks WHERE title = 'Whispered Light'
ON CONFLICT DO NOTHING;

INSERT INTO testimonials (customer_name, review, rating, published, sort_order) VALUES
('Demo Client — Replace with real review', 'This is a sample testimonial. Replace it with a genuine customer review through the admin dashboard. The portrait exceeded all our expectations — every detail was captured with such care and precision.', 5, true, 1),
('Demo Client — Replace with real review', 'This is a sample testimonial placeholder. The artist made the entire commission process feel personal and effortless. The final piece brought tears to our eyes.', 5, true, 2),
('Demo Client — Replace with real review', 'This is a sample testimonial placeholder. Absolutely stunning work. The likeness was perfect and the attention to detail was remarkable.', 5, true, 3)
ON CONFLICT DO NOTHING;
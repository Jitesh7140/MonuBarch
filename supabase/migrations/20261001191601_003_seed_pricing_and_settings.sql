/*
# Seed Pricing Rules and Site Settings

## Overview
Populates pricing_rules with default values for the price calculator and site_settings with default artist configuration.

## Pricing Rules Structure
- type 'base': Base prices per portrait type (single, couple, family, pet, large_custom)
- type 'medium': Price adjustments per medium (pencil, charcoal, colour)
- type 'size': Price adjustments per size (a5, a4, a3, a2, custom)
- type 'extra_person': Additional charge per extra person
- type 'framing': Frame cost (unframed, framed)
- type 'add_on': Additional services (premium_paper, express_delivery, extra_person, special_request)

## Site Settings
- artist_name, tagline, whatsapp_number, instagram_url, email, etc.

## Notes
1. All values are in INR (₹).
2. Admin can modify these values through the pricing management dashboard.
3. The price calculator reads these values dynamically.
*/

INSERT INTO pricing_rules (type, key, label, numeric_value, sort_order) VALUES
-- Base prices
('base', 'single', 'Single Portrait', 2500, 1),
('base', 'couple', 'Couple Portrait', 4500, 2),
('base', 'family', 'Family Portrait', 7000, 3),
('base', 'pet', 'Pet Portrait', 3000, 4),
('base', 'large_custom', 'Large Custom Artwork', 12000, 5),
-- Medium adjustments
('medium', 'pencil', 'Pencil', 0, 1),
('medium', 'charcoal', 'Charcoal', 500, 2),
('medium', 'colour', 'Colour', 1500, 3),
-- Size adjustments
('size', 'a5', 'A5 (14.8 × 21 cm)', -500, 1),
('size', 'a4', 'A4 (21 × 29.7 cm)', 0, 2),
('size', 'a3', 'A3 (29.7 × 42 cm)', 800, 3),
('size', 'a2', 'A2 (42 × 59.4 cm)', 2000, 4),
('size', 'custom', 'Custom Size', 1500, 5),
-- Framing
('framing', 'unframed', 'Unframed', 0, 1),
('framing', 'framed', 'Framed', 800, 2),
-- Extra person charge
('extra_person', 'per_person', 'Per Extra Person', 1200, 1),
-- Add-ons
('add_on', 'premium_paper', 'Premium Paper', 400, 1),
('add_on', 'express_delivery', 'Express Delivery', 1000, 2),
('add_on', 'special_request', 'Special / Custom Request', 500, 3)
ON CONFLICT (type, key) DO UPDATE SET label = EXCLUDED.label, numeric_value = EXCLUDED.numeric_value;

INSERT INTO site_settings (key, value) VALUES
('artist_name', 'MSARTIK'),
('brand_name', 'MSARTIK Portraits'),
('tagline', 'Turning Memories Into Art'),
('subtitle', 'Handcrafted Pencil & Charcoal Portraits'),
('description', 'Detailed, handcrafted portraits created from your most meaningful photographs.'),
('whatsapp_number', '919876543210'),
('instagram_url', 'https://instagram.com'),
('instagram_handle', '@aaravportraits'),
('email', 'hello@aaravmehtaportraits.com'),
('phone', '+91 98765 43210'),
('studio_location', 'Mumbai, India'),
('about_intro', 'I am a self-taught portrait artist based in Mumbai, specialising in pencil and charcoal drawings. Every portrait I create is a quiet conversation between the subject and the medium — a patient layering of graphite and charcoal that slowly reveals the person within the photograph.'),
('about_style', 'My work focuses on capturing not just likeness, but presence. I work primarily in pencil for its delicate tonal range and in charcoal for its dramatic depth. Each piece involves careful observation of light, shadow and texture — building values layer by layer until the drawing breathes.'),
('about_inspiration', 'I am inspired by the quiet dignity of ordinary faces, the way light falls on skin, and the stories that photographs carry. A portrait is never just a picture; it is a memory held in place, a moment made permanent by hand and patience.'),
('shipping_policy', 'All artworks are carefully packaged in protective tubes or flat rigid mailers depending on size. Framed portraits are shipped with additional protective corners and bubble wrap. Domestic shipping typically takes 3-7 business days. International shipping is available on request.'),
('refund_policy', 'Since each portrait is a custom, handcrafted piece created specifically for you, refunds are not available once work has begun. However, if you are unsatisfied with the initial sketch, revisions can be discussed. Cancellations are accepted before work begins, with a full refund minus processing fees.'),
('terms_text', 'By commissioning a portrait, you agree that the reference photograph provided is either your own or you have permission to use it. The artist retains reproduction rights to all artwork for portfolio and promotional purposes unless otherwise agreed in writing.'),
('privacy_text', 'Your personal information and reference photographs are kept strictly confidential. Reference images are used solely for creating your commissioned portrait and are not shared publicly without your explicit consent.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
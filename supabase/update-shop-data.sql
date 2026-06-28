-- ═══════════════════════════════════════════════════════════════════
-- UPDATE SHOP DATA — run this in Supabase SQL Editor
-- Replaces old categories & products with the new shop catalogue.
-- Safe: keeps admins, enquiries, orders, and page content.
-- ═══════════════════════════════════════════════════════════════════

DELETE FROM products;
DELETE FROM categories;

-- Categories (matches shop filter sidebar)
INSERT INTO categories (name, slug, image_url) VALUES
  ('Marble', 'marble', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Marble'),
  ('Wooden', 'wooden', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Wooden'),
  ('Ceramic', 'ceramic', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Ceramic'),
  ('Glass', 'glass', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Glass'),
  ('Metal', 'metal', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Metal'),
  ('Tea light holders', 'tea-light-holders', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Tea+Light'),
  ('Rugs & Carpets', 'rugs-carpets', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Rugs'),
  ('Jewellery', 'jewellery', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Jewellery'),
  ('Clay items', 'clay-items', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Clay'),
  ('Resin', 'resin', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Resin');

-- Products (3 per category — 30 total)
INSERT INTO products (name, slug, description, price, category_id, stock, image_urls, is_active) VALUES

  ('Big Flower Carved Ball', 'big-flower-carved-ball',
    'Hand-carved white marble decorative ball with intricate flower lattice work. A stunning centerpiece for your living room or garden display.',
    250, (SELECT id FROM categories WHERE slug = 'marble'), 25,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Flower+Carved+Ball'], true),

  ('Carved Black Marble Pen Stand', 'carved-black-marble-pen-stand',
    'Elegant black marble pen stand with elephant and floral carvings. Keeps your desk organized while adding traditional artistry.',
    300, (SELECT id FROM categories WHERE slug = 'marble'), 20,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Marble+Pen+Stand'], true),

  ('Handi Lampp', 'handi-lampp',
    'Delicate hand-carved marble handi lamp with fine jaali work. Perfect for ambient lighting in pooja rooms and festive décor.',
    250, (SELECT id FROM categories WHERE slug = 'marble'), 18,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Handi+Lampp'], true),

  ('Carved Wooden Basket', 'carved-wooden-basket',
    'Hand-carved dark wood decorative basket with traditional motifs. Ideal for dry flowers, potpourri, or table display.',
    450, (SELECT id FROM categories WHERE slug = 'wooden'), 22,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Wooden+Basket'], true),

  ('Spiral Carved Wooden Bowl', 'spiral-carved-wooden-bowl',
    'Beautiful spiral-pattern hand-carved wooden bowl in natural finish. Each piece is shaped and polished by skilled artisans.',
    350, (SELECT id FROM categories WHERE slug = 'wooden'), 30,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Spiral+Wood+Bowl'], true),

  ('Wooden Rehal Book Stand', 'wooden-rehal-book-stand',
    'Classic foldable wooden Rehal (book stand) for holy books and reading. Hand-finished Sheesham wood with smooth hinges.',
    400, (SELECT id FROM categories WHERE slug = 'wooden'), 15,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Wooden+Rehal'], true),

  ('Hand-painted Ceramic Vase', 'hand-painted-ceramic-vase',
    'Elegant ceramic vase with hand-painted floral motifs in warm terracotta and cream tones. Perfect for fresh or dried flowers.',
    550, (SELECT id FROM categories WHERE slug = 'ceramic'), 28,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Ceramic+Vase'], true),

  ('Blue Pottery Decorative Bowl', 'blue-pottery-decorative-bowl',
    'Authentic blue pottery bowl from Rajasthan with traditional geometric patterns. A stunning dining table centerpiece.',
    650, (SELECT id FROM categories WHERE slug = 'ceramic'), 20,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Blue+Pottery+Bowl'], true),

  ('Terracotta Planter Set', 'terracotta-planter-set',
    'Set of three hand-thrown terracotta planters in graduated sizes. Natural porous clay ideal for succulents and herbs.',
    480, (SELECT id FROM categories WHERE slug = 'ceramic'), 24,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Terracotta+Planters'], true),

  ('Stained Glass Tealight Holder', 'stained-glass-tealight-holder',
    'Colorful stained glass tealight holder that casts warm patterned light. Hand-assembled with lead-free solder.',
    320, (SELECT id FROM categories WHERE slug = 'glass'), 35,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Glass+Tealight'], true),

  ('Glass Mosaic Lantern', 'glass-mosaic-lantern',
    'Decorative glass mosaic lantern with metal frame. Creates a magical glow for balconies, gardens, and festive evenings.',
    890, (SELECT id FROM categories WHERE slug = 'glass'), 16,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Glass+Lantern'], true),

  ('Hand-blown Glass Vase', 'hand-blown-glass-vase',
    'Artisan hand-blown glass vase with subtle amber tint. Lightweight and elegant for modern and traditional interiors.',
    720, (SELECT id FROM categories WHERE slug = 'glass'), 12,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Glass+Vase'], true),

  ('Brass Decorative Urli', 'brass-decorative-urli',
    'Traditional brass urli bowl for floating flowers and diyas. Polished finish with engraved border — ideal for entrance décor.',
    1299, (SELECT id FROM categories WHERE slug = 'metal'), 14,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Brass+Urli'], true),

  ('Copper Hammered Bowl', 'copper-hammered-bowl',
    'Hand-hammered copper serving bowl with antique finish. Food-safe interior — perfect for dry fruits and festive serving.',
    699, (SELECT id FROM categories WHERE slug = 'metal'), 18,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Copper+Bowl'], true),

  ('Iron Candle Stand', 'iron-candle-stand',
    'Wrought iron candle stand with scrollwork design. Sturdy base and tall holder for dinner tables and outdoor patios.',
    450, (SELECT id FROM categories WHERE slug = 'metal'), 26,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Iron+Candle+Stand'], true),

  ('Brass Tealight Diya Set (Pack of 6)', 'brass-tealight-diya-set-6',
    'Handcrafted brass tealight diyas with intricate traditional patterns. Perfect for festivals, pooja rooms, and ambient home lighting.',
    899, (SELECT id FROM categories WHERE slug = 'tea-light-holders'), 40,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Brass+Diya+Set'], true),

  ('Hanging Metal Tealight Holder', 'hanging-metal-tealight-holder',
    'Five-tier hanging metal tealight chain for temple and festival décor. Creates a cascading warm glow when lit.',
    549, (SELECT id FROM categories WHERE slug = 'tea-light-holders'), 22,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Hanging+Tealight'], true),

  ('Clay Tealight Cup Set', 'clay-tealight-cup-set',
    'Set of 12 miniature clay tealight cups with natural finish. Eco-friendly and ideal for daily pooja and Diwali décor.',
    299, (SELECT id FROM categories WHERE slug = 'tea-light-holders'), 50,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Clay+Tealight+Cups'], true),

  ('Handloom Cotton Durry', 'handloom-cotton-durry',
    'Handwoven cotton durry rug in earthy stripes. Lightweight, washable, and perfect for living rooms and balconies.',
    1599, (SELECT id FROM categories WHERE slug = 'rugs-carpets'), 10,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Cotton+Durry'], true),

  ('Woolen Kashmiri Carpet (Small)', 'woolen-kashmiri-carpet-small',
    'Small hand-knotted wool carpet with traditional Kashmiri floral pattern. Soft underfoot and rich in heritage craftsmanship.',
    4999, (SELECT id FROM categories WHERE slug = 'rugs-carpets'), 6,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Kashmiri+Carpet'], true),

  ('Jute Braided Floor Mat', 'jute-braided-floor-mat',
    'Natural jute braided floor mat with non-slip backing. Sustainable, durable, and adds rustic charm to any room.',
    899, (SELECT id FROM categories WHERE slug = 'rugs-carpets'), 20,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Jute+Floor+Mat'], true),

  ('Oxidized Silver Jhumka Earrings', 'oxidized-silver-jhumka-earrings',
    'Traditional oxidized silver jhumka earrings with bell drops. Lightweight and perfect for ethnic and festive wear.',
    599, (SELECT id FROM categories WHERE slug = 'jewellery'), 30,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Jhumka+Earrings'], true),

  ('Meenakari Bangle Set', 'meenakari-bangle-set',
    'Set of four enamel meenakari bangles in vibrant colors. Hand-painted by artisans — a timeless festive accessory.',
    799, (SELECT id FROM categories WHERE slug = 'jewellery'), 25,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Meenakari+Bangles'], true),

  ('Brass Temple Necklace', 'brass-temple-necklace',
    'Statement brass temple jewellery necklace with coin and deity motifs. Antique gold finish for traditional occasions.',
    1299, (SELECT id FROM categories WHERE slug = 'jewellery'), 12,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Temple+Necklace'], true),

  ('Terracotta Kulhad Set', 'terracotta-kulhad-set',
    'Set of six traditional terracotta kulhads for chai and lassi. Unglazed natural clay enhances the earthy taste of beverages.',
    349, (SELECT id FROM categories WHERE slug = 'clay-items'), 40,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Kulhad+Set'], true),

  ('Clay Diya Pack (12)', 'clay-diya-pack-12',
    'Pack of twelve hand-moulded clay diyas ready for wick and oil. Essential for Diwali, daily pooja, and festive lighting.',
    199, (SELECT id FROM categories WHERE slug = 'clay-items'), 60,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Clay+Diya+Pack'], true),

  ('Hand-thrown Clay Pot', 'hand-thrown-clay-pot',
    'Large hand-thrown clay storage pot with lid. Traditional kitchen and décor piece fired in a wood kiln.',
    450, (SELECT id FROM categories WHERE slug = 'clay-items'), 18,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Clay+Pot'], true),

  ('Resin Ganesha Figurine', 'resin-ganesha-figurine',
    'Detailed resin Ganesha figurine with antique gold finish. Lightweight, durable, and ideal for home temple shelves.',
    899, (SELECT id FROM categories WHERE slug = 'resin'), 22,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Resin+Ganesha'], true),

  ('Resin Flower Coaster Set', 'resin-flower-coaster-set',
    'Set of four resin coasters with pressed real flowers embedded inside. Heat-resistant and a unique gifting option.',
    399, (SELECT id FROM categories WHERE slug = 'resin'), 35,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Resin+Coasters'], true),

  ('Epoxy Resin Wall Art', 'epoxy-resin-wall-art',
    'Hand-poured epoxy resin wall art panel with ocean-wave design. Ready to hang — adds modern artisan flair to any wall.',
    1499, (SELECT id FROM categories WHERE slug = 'resin'), 8,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Resin+Wall+Art'], true);

-- Verify (should show 10 categories, 30 products)
SELECT 'categories' AS t, COUNT(*) FROM categories
UNION ALL SELECT 'products', COUNT(*) FROM products;

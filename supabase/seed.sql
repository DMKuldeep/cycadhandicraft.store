
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
  ('Resin', 'resin', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Resin')
ON CONFLICT (slug) DO NOTHING;

-- Products (3 per category — 30 total)
INSERT INTO products (name, slug, description, price, category_id, stock, image_urls, is_active) VALUES

  -- Marble
  (
    'Big Flower Carved Ball',
    'big-flower-carved-ball',
    'Hand-carved white marble decorative ball with intricate flower lattice work. A stunning centerpiece for your living room or garden display.',
    250,
    (SELECT id FROM categories WHERE slug = 'marble'),
    25,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Flower+Carved+Ball'],
    true
  ),
  (
    'Carved Black Marble Pen Stand',
    'carved-black-marble-pen-stand',
    'Elegant black marble pen stand with elephant and floral carvings. Keeps your desk organized while adding traditional artistry.',
    300,
    (SELECT id FROM categories WHERE slug = 'marble'),
    20,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Marble+Pen+Stand'],
    true
  ),
  (
    'Handi Lampp',
    'handi-lampp',
    'Delicate hand-carved marble handi lamp with fine jaali work. Perfect for ambient lighting in pooja rooms and festive décor.',
    250,
    (SELECT id FROM categories WHERE slug = 'marble'),
    18,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Handi+Lampp'],
    true
  ),

  -- Wooden
  (
    'Carved Wooden Basket',
    'carved-wooden-basket',
    'Hand-carved dark wood decorative basket with traditional motifs. Ideal for dry flowers, potpourri, or table display.',
    450,
    (SELECT id FROM categories WHERE slug = 'wooden'),
    22,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Wooden+Basket'],
    true
  ),
  (
    'Spiral Carved Wooden Bowl',
    'spiral-carved-wooden-bowl',
    'Beautiful spiral-pattern hand-carved wooden bowl in natural finish. Each piece is shaped and polished by skilled artisans.',
    350,
    (SELECT id FROM categories WHERE slug = 'wooden'),
    30,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Spiral+Wood+Bowl'],
    true
  ),
  (
    'Wooden Rehal Book Stand',
    'wooden-rehal-book-stand',
    'Classic foldable wooden Rehal (book stand) for holy books and reading. Hand-finished Sheesham wood with smooth hinges.',
    400,
    (SELECT id FROM categories WHERE slug = 'wooden'),
    15,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Wooden+Rehal'],
    true
  ),

  -- Ceramic
  (
    'Hand-painted Ceramic Vase',
    'hand-painted-ceramic-vase',
    'Elegant ceramic vase with hand-painted floral motifs in warm terracotta and cream tones. Perfect for fresh or dried flowers.',
    550,
    (SELECT id FROM categories WHERE slug = 'ceramic'),
    28,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Ceramic+Vase'],
    true
  ),
  (
    'Blue Pottery Decorative Bowl',
    'blue-pottery-decorative-bowl',
    'Authentic blue pottery bowl from Rajasthan with traditional geometric patterns. A stunning dining table centerpiece.',
    650,
    (SELECT id FROM categories WHERE slug = 'ceramic'),
    20,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Blue+Pottery+Bowl'],
    true
  ),
  (
    'Terracotta Planter Set',
    'terracotta-planter-set',
    'Set of three hand-thrown terracotta planters in graduated sizes. Natural porous clay ideal for succulents and herbs.',
    480,
    (SELECT id FROM categories WHERE slug = 'ceramic'),
    24,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Terracotta+Planters'],
    true
  ),

  -- Glass
  (
    'Stained Glass Tealight Holder',
    'stained-glass-tealight-holder',
    'Colorful stained glass tealight holder that casts warm patterned light. Hand-assembled with lead-free solder.',
    320,
    (SELECT id FROM categories WHERE slug = 'glass'),
    35,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Glass+Tealight'],
    true
  ),
  (
    'Glass Mosaic Lantern',
    'glass-mosaic-lantern',
    'Decorative glass mosaic lantern with metal frame. Creates a magical glow for balconies, gardens, and festive evenings.',
    890,
    (SELECT id FROM categories WHERE slug = 'glass'),
    16,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Glass+Lantern'],
    true
  ),
  (
    'Hand-blown Glass Vase',
    'hand-blown-glass-vase',
    'Artisan hand-blown glass vase with subtle amber tint. Lightweight and elegant for modern and traditional interiors.',
    720,
    (SELECT id FROM categories WHERE slug = 'glass'),
    12,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Glass+Vase'],
    true
  ),

  -- Metal
  (
    'Brass Decorative Urli',
    'brass-decorative-urli',
    'Traditional brass urli bowl for floating flowers and diyas. Polished finish with engraved border — ideal for entrance décor.',
    1299,
    (SELECT id FROM categories WHERE slug = 'metal'),
    14,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Brass+Urli'],
    true
  ),
  (
    'Copper Hammered Bowl',
    'copper-hammered-bowl',
    'Hand-hammered copper serving bowl with antique finish. Food-safe interior — perfect for dry fruits and festive serving.',
    699,
    (SELECT id FROM categories WHERE slug = 'metal'),
    18,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Copper+Bowl'],
    true
  ),
  (
    'Iron Candle Stand',
    'iron-candle-stand',
    'Wrought iron candle stand with scrollwork design. Sturdy base and tall holder for dinner tables and outdoor patios.',
    450,
    (SELECT id FROM categories WHERE slug = 'metal'),
    26,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Iron+Candle+Stand'],
    true
  ),

  -- Tea light holders
  (
    'Brass Tealight Diya Set (Pack of 6)',
    'brass-tealight-diya-set-6',
    'Handcrafted brass tealight diyas with intricate traditional patterns. Perfect for festivals, pooja rooms, and ambient home lighting.',
    899,
    (SELECT id FROM categories WHERE slug = 'tea-light-holders'),
    40,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Brass+Diya+Set'],
    true
  ),
  (
    'Hanging Metal Tealight Holder',
    'hanging-metal-tealight-holder',
    'Five-tier hanging metal tealight chain for temple and festival décor. Creates a cascading warm glow when lit.',
    549,
    (SELECT id FROM categories WHERE slug = 'tea-light-holders'),
    22,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Hanging+Tealight'],
    true
  ),
  (
    'Clay Tealight Cup Set',
    'clay-tealight-cup-set',
    'Set of 12 miniature clay tealight cups with natural finish. Eco-friendly and ideal for daily pooja and Diwali décor.',
    299,
    (SELECT id FROM categories WHERE slug = 'tea-light-holders'),
    50,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Clay+Tealight+Cups'],
    true
  ),

  -- Rugs & Carpets
  (
    'Handloom Cotton Durry',
    'handloom-cotton-durry',
    'Handwoven cotton durry rug in earthy stripes. Lightweight, washable, and perfect for living rooms and balconies.',
    1599,
    (SELECT id FROM categories WHERE slug = 'rugs-carpets'),
    10,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Cotton+Durry'],
    true
  ),
  (
    'Woolen Kashmiri Carpet (Small)',
    'woolen-kashmiri-carpet-small',
    'Small hand-knotted wool carpet with traditional Kashmiri floral pattern. Soft underfoot and rich in heritage craftsmanship.',
    4999,
    (SELECT id FROM categories WHERE slug = 'rugs-carpets'),
    6,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Kashmiri+Carpet'],
    true
  ),
  (
    'Jute Braided Floor Mat',
    'jute-braided-floor-mat',
    'Natural jute braided floor mat with non-slip backing. Sustainable, durable, and adds rustic charm to any room.',
    899,
    (SELECT id FROM categories WHERE slug = 'rugs-carpets'),
    20,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Jute+Floor+Mat'],
    true
  ),

  -- Jewellery
  (
    'Oxidized Silver Jhumka Earrings',
    'oxidized-silver-jhumka-earrings',
    'Traditional oxidized silver jhumka earrings with bell drops. Lightweight and perfect for ethnic and festive wear.',
    599,
    (SELECT id FROM categories WHERE slug = 'jewellery'),
    30,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Jhumka+Earrings'],
    true
  ),
  (
    'Meenakari Bangle Set',
    'meenakari-bangle-set',
    'Set of four enamel meenakari bangles in vibrant colors. Hand-painted by artisans — a timeless festive accessory.',
    799,
    (SELECT id FROM categories WHERE slug = 'jewellery'),
    25,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Meenakari+Bangles'],
    true
  ),
  (
    'Brass Temple Necklace',
    'brass-temple-necklace',
    'Statement brass temple jewellery necklace with coin and deity motifs. Antique gold finish for traditional occasions.',
    1299,
    (SELECT id FROM categories WHERE slug = 'jewellery'),
    12,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Temple+Necklace'],
    true
  ),

  -- Clay items
  (
    'Terracotta Kulhad Set',
    'terracotta-kulhad-set',
    'Set of six traditional terracotta kulhads for chai and lassi. Unglazed natural clay enhances the earthy taste of beverages.',
    349,
    (SELECT id FROM categories WHERE slug = 'clay-items'),
    40,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Kulhad+Set'],
    true
  ),
  (
    'Clay Diya Pack (12)',
    'clay-diya-pack-12',
    'Pack of twelve hand-moulded clay diyas ready for wick and oil. Essential for Diwali, daily pooja, and festive lighting.',
    199,
    (SELECT id FROM categories WHERE slug = 'clay-items'),
    60,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Clay+Diya+Pack'],
    true
  ),
  (
    'Hand-thrown Clay Pot',
    'hand-thrown-clay-pot',
    'Large hand-thrown clay storage pot with lid. Traditional kitchen and décor piece fired in a wood kiln.',
    450,
    (SELECT id FROM categories WHERE slug = 'clay-items'),
    18,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Clay+Pot'],
    true
  ),

  -- Resin
  (
    'Resin Ganesha Figurine',
    'resin-ganesha-figurine',
    'Detailed resin Ganesha figurine with antique gold finish. Lightweight, durable, and ideal for home temple shelves.',
    899,
    (SELECT id FROM categories WHERE slug = 'resin'),
    22,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Resin+Ganesha'],
    true
  ),
  (
    'Resin Flower Coaster Set',
    'resin-flower-coaster-set',
    'Set of four resin coasters with pressed real flowers embedded inside. Heat-resistant and a unique gifting option.',
    399,
    (SELECT id FROM categories WHERE slug = 'resin'),
    35,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Resin+Coasters'],
    true
  ),
  (
    'Epoxy Resin Wall Art',
    'epoxy-resin-wall-art',
    'Hand-poured epoxy resin wall art panel with ocean-wave design. Ready to hang — adds modern artisan flair to any wall.',
    1499,
    (SELECT id FROM categories WHERE slug = 'resin'),
    8,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Resin+Wall+Art'],
    true
  )

ON CONFLICT (slug) DO NOTHING;

-- Static page content
INSERT INTO page_content (slug, title, content) VALUES
  (
    'about',
    'About Us',
    '<p>Welcome to <strong>Cycad Handicrafts</strong> — where tradition meets artistry in every piece we create.</p>
    <p>Based in the heart of Farrukhabad, Uttar Pradesh, we are a family-run workshop dedicated to preserving and celebrating India''s rich handicraft heritage. For generations, our artisans have honed their skills in brass work, terracotta, wood carving, stone sculpting, and ceramic arts.</p>
    <p>Each product in our collection is <em>handcrafted with love, made just for you</em>. We believe that home décor should tell a story — of craftsmanship, culture, and the warmth of handmade artistry.</p>
    <p>From intricate tealight diyas that light up your festivals, to serene Buddha sculptures that bring peace to your space, every item is made with care using traditional techniques passed down through generations.</p>
    <p>Thank you for supporting local artisans and choosing handmade over mass-produced. Your purchase directly supports our craftspeople and their families.</p>'
  ),
  (
    'faq',
    'Frequently Asked Questions',
    '<h3>How long does shipping take?</h3>
    <p>We typically dispatch orders within 2-3 business days. Delivery across India takes 5-10 business days depending on your location.</p>
    <h3>Do you offer custom orders?</h3>
    <p>Yes! We love creating custom pieces. Please contact us via the contact form or WhatsApp with your requirements.</p>
    <h3>What payment methods do you accept?</h3>
    <p>We accept UPI, bank transfer, and cash on delivery (for select locations). Online payment gateway integration coming soon.</p>
    <h3>Are your products handmade?</h3>
    <p>Absolutely. Every item in our collection is handcrafted by skilled artisans. Slight variations in color and design are natural and add to the uniqueness of each piece.</p>
    <h3>How do I care for brass and wooden items?</h3>
    <p>Brass items can be cleaned with lemon juice and salt. Wooden items should be kept away from direct sunlight and moisture. We include care instructions with every order.</p>
    <h3>Can I visit your workshop?</h3>
    <p>Yes, we welcome visitors! Please contact us in advance to schedule a visit to our workshop in Barjhala, Farrukhabad.</p>'
  ),
  (
    'terms',
    'Terms & Conditions',
    '<p>By using the Cycad Handicrafts website and placing orders, you agree to the following terms:</p>
    <h3>Orders & Pricing</h3>
    <p>All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify prices without prior notice.</p>
    <h3>Product Images</h3>
    <p>Product images are representative. As our items are handmade, slight variations in color, size, and finish may occur.</p>
    <h3>Order Confirmation</h3>
    <p>Orders are confirmed once we receive your order details and payment (if applicable). We will contact you via email or phone to confirm dispatch.</p>
    <h3>Intellectual Property</h3>
    <p>All content on this website, including images, text, and designs, is the property of Cycad Handicrafts and may not be reproduced without permission.</p>'
  ),
  (
    'privacy',
    'Privacy Policy',
    '<p>At Cycad Handicrafts, we respect your privacy and are committed to protecting your personal information.</p>
    <h3>Information We Collect</h3>
    <p>We collect information you provide when placing orders, submitting contact forms, or creating an account — including name, email, phone number, and shipping address.</p>
    <h3>How We Use Your Information</h3>
    <p>Your information is used to process orders, respond to enquiries, and improve our services. We do not sell or share your personal data with third parties for marketing purposes.</p>
    <h3>Data Security</h3>
    <p>We implement appropriate security measures to protect your personal information. Payment details are processed securely and not stored on our servers.</p>
    <h3>Cookies</h3>
    <p>Our website uses essential cookies for cart functionality and session management. No tracking cookies are used.</p>
    <h3>Contact</h3>
    <p>For privacy-related questions, contact us at hello@cycadhandicrafts.com.</p>'
  ),
  (
    'returns',
    'Return & Refund Policy',
    '<p>We want you to be completely satisfied with your purchase. Please review our return policy below.</p>
    <h3>Return Window</h3>
    <p>You may return items within 7 days of delivery if they arrive damaged or significantly different from the product description.</p>
    <h3>Non-Returnable Items</h3>
    <p>Custom-made or personalized items cannot be returned unless damaged during shipping.</p>
    <h3>Return Process</h3>
    <p>Contact us at hello@cycadhandicrafts.com or via WhatsApp with your order details and photos of the issue. We will arrange a pickup or provide return instructions.</p>
    <h3>Refunds</h3>
    <p>Refunds are processed within 7-10 business days after we receive and inspect the returned item. Refunds are issued to the original payment method.</p>
    <h3>Damaged in Transit</h3>
    <p>If your item arrives damaged, please document the damage with photos and contact us within 48 hours. We will arrange a replacement or full refund.</p>'
  )
ON CONFLICT (slug) DO NOTHING;

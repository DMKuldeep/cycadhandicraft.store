-- Seed data for Cycad Handicrafts
-- Run after schema.sql

-- Categories
INSERT INTO categories (name, slug, image_url) VALUES
  ('Tealight Diyas & Candle Holders', 'tealight-diyas-candle-holders', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Diyas'),
  ('Idols & Figurines', 'idols-figurines', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Idols'),
  ('Ceramics & Vases', 'ceramics-vases', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Ceramics'),
  ('Stone & Marble Carvings', 'stone-marble-carvings', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Stone'),
  ('Wooden Crafts', 'wooden-crafts', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Wood'),
  ('Bathroom Accessories', 'bathroom-accessories', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Bathroom')
ON CONFLICT (slug) DO NOTHING;

-- Products (using category slugs via subquery)
INSERT INTO products (name, slug, description, price, category_id, stock, image_urls, is_active) VALUES
  (
    'Brass Tealight Diya Set (Pack of 6)',
    'brass-tealight-diya-set-6',
    'Handcrafted brass tealight diyas with intricate traditional patterns. Perfect for festivals, pooja rooms, and creating a warm ambient glow in your home.',
    899,
    (SELECT id FROM categories WHERE slug = 'tealight-diyas-candle-holders'),
    45,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Brass+Diya+Set'],
    true
  ),
  (
    'Terracotta Candle Holder Trio',
    'terracotta-candle-holder-trio',
    'A set of three hand-painted terracotta candle holders in earthy tones. Each piece is unique, shaped and fired in traditional kilns.',
    649,
    (SELECT id FROM categories WHERE slug = 'tealight-diyas-candle-holders'),
    30,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Candle+Holders'],
    true
  ),
  (
    'Lord Ganesha Brass Idol (6 inch)',
    'lord-ganesha-brass-idol-6inch',
    'Exquisitely crafted brass Ganesha idol with fine detailing. A symbol of wisdom and prosperity, ideal for your home temple or living space.',
    2499,
    (SELECT id FROM categories WHERE slug = 'idols-figurines'),
    20,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Ganesha+Idol'],
    true
  ),
  (
    'Krishna Flute Playing Figurine',
    'krishna-flute-figurine',
    'Beautifully sculpted Krishna figurine playing the flute, made from premium resin with antique gold finish. A serene addition to any décor.',
    1899,
    (SELECT id FROM categories WHERE slug = 'idols-figurines'),
    15,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Krishna+Figurine'],
    true
  ),
  (
    'Hand-painted Ceramic Vase',
    'hand-painted-ceramic-vase',
    'Elegant ceramic vase with hand-painted floral motifs in warm terracotta and cream tones. Perfect for fresh or dried flower arrangements.',
    1299,
    (SELECT id FROM categories WHERE slug = 'ceramics-vases'),
    25,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Ceramic+Vase'],
    true
  ),
  (
    'Blue Pottery Decorative Bowl',
    'blue-pottery-decorative-bowl',
    'Authentic blue pottery bowl from Rajasthan, featuring traditional geometric patterns. A stunning centerpiece for your dining or coffee table.',
    1599,
    (SELECT id FROM categories WHERE slug = 'ceramics-vases'),
    18,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Blue+Pottery'],
    true
  ),
  (
    'Marble Elephant Pair (Small)',
    'marble-elephant-pair-small',
    'Hand-carved white marble elephant pair symbolizing good luck and strength. Smooth polished finish with delicate trunk details.',
    3499,
    (SELECT id FROM categories WHERE slug = 'stone-marble-carvings'),
    12,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Marble+Elephants'],
    true
  ),
  (
    'Soapstone Buddha Head Sculpture',
    'soapstone-buddha-head',
    'Serene Buddha head sculpture carved from natural soapstone. The meditative expression brings peace and tranquility to any room.',
    4299,
    (SELECT id FROM categories WHERE slug = 'stone-marble-carvings'),
    8,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Buddha+Sculpture'],
    true
  ),
  (
    'Sheesham Wood Serving Tray',
    'sheesham-wood-serving-tray',
    'Handcrafted serving tray from premium Sheesham wood with brass inlay handles. Ideal for serving tea, snacks, or as a decorative accent.',
    1799,
    (SELECT id FROM categories WHERE slug = 'wooden-crafts'),
    22,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Wood+Tray'],
    true
  ),
  (
    'Wooden Wall Key Holder',
    'wooden-wall-key-holder',
    'Rustic wooden key holder with 5 brass hooks and a small shelf. Hand-carved floral design adds charm to your entryway.',
    749,
    (SELECT id FROM categories WHERE slug = 'wooden-crafts'),
    35,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Key+Holder'],
    true
  ),
  (
    'Marble Soap Dispenser Set',
    'marble-soap-dispenser-set',
    'Luxurious bathroom accessory set including soap dispenser, tumbler, and tray — all crafted from natural marble with gold accents.',
    2199,
    (SELECT id FROM categories WHERE slug = 'bathroom-accessories'),
    16,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Soap+Dispenser'],
    true
  ),
  (
    'Hanuman Ji Brass Statue (8 inch)',
    'hanuman-brass-statue-8inch',
    'Majestic Hanuman Ji brass statue with detailed musculature and expressive face. A powerful spiritual presence for your home altar.',
    2999,
    (SELECT id FROM categories WHERE slug = 'idols-figurines'),
    10,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Hanuman+Statue'],
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

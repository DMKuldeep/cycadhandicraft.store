-- Cycad Handicrafts — COMPLETE SETUP (schema + seed)
-- Run this ENTIRE file once in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────

-- Cycad Handicrafts Database Schema
-- Run this FIRST in Supabase SQL Editor (before seed.sql)
-- Or use complete-setup.sql to run schema + seed in one step

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  image_urls TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact form enquiries
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Editable static page content
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_enquiries_read ON enquiries(is_read);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Helper function: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Categories: public read, admin write
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE USING (is_admin());

-- Products: public read active, admin full access
CREATE POLICY "Active products are viewable by everyone"
  ON products FOR SELECT USING (is_active = true OR is_admin());

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE USING (is_admin());

-- Enquiries: public insert, admin read/update
CREATE POLICY "Anyone can submit enquiries"
  ON enquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view enquiries"
  ON enquiries FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update enquiries"
  ON enquiries FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete enquiries"
  ON enquiries FOR DELETE USING (is_admin());

-- Admins table: only admins can read
CREATE POLICY "Admins can view admin list"
  ON admins FOR SELECT USING (is_admin());

-- Page content: public read, admin write
CREATE POLICY "Page content is viewable by everyone"
  ON page_content FOR SELECT USING (true);

CREATE POLICY "Admins can insert page content"
  ON page_content FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update page content"
  ON page_content FOR UPDATE USING (is_admin());

-- Orders: users see own orders, admins see all
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE USING (is_admin());

-- Order items: linked to order access
CREATE POLICY "Order items viewable with order access"
  ON order_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT WITH CHECK (true);

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Product images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND is_admin());
-- Cycad Handicrafts — SEED DATA ONLY
-- ⚠️  Run supabase/schema.sql FIRST (creates tables).
--     Or use supabase/complete-setup.sql (schema + seed in one go).
--
-- Run AFTER schema.sql in Supabase SQL Editor

-- ─── Categories (6) ───────────────────────────────────────────────
INSERT INTO categories (name, slug, image_url) VALUES
  ('Tealight Diyas & Candle Holders', 'tealight-diyas-candle-holders', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Diyas'),
  ('Idols & Figurines', 'idols-figurines', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Idols'),
  ('Ceramics & Vases', 'ceramics-vases', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Ceramics'),
  ('Stone & Marble Carvings', 'stone-marble-carvings', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Stone'),
  ('Wooden Crafts', 'wooden-crafts', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Wood'),
  ('Bathroom Accessories', 'bathroom-accessories', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Bathroom')
ON CONFLICT (slug) DO NOTHING;

-- ─── Products (18 — 3 per category) ─────────────────────────────
INSERT INTO products (name, slug, description, price, category_id, stock, image_urls, is_active) VALUES

  -- Tealight Diyas & Candle Holders
  (
    'Brass Tealight Diya Set (Pack of 6)',
    'brass-tealight-diya-set-6',
    'Handcrafted brass tealight diyas with intricate traditional patterns. Perfect for festivals, pooja rooms, and creating a warm ambient glow in your home. Each diya is polished by hand and fired in traditional workshops.',
    899,
    (SELECT id FROM categories WHERE slug = 'tealight-diyas-candle-holders'),
    45,
    ARRAY[
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Brass+Diya+1',
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Brass+Diya+2',
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Brass+Diya+Pack'
    ],
    true
  ),
  (
    'Terracotta Candle Holder Trio',
    'terracotta-candle-holder-trio',
    'A set of three hand-painted terracotta candle holders in earthy tones. Each piece is unique, shaped and fired in traditional kilns of Farrukhabad.',
    649,
    (SELECT id FROM categories WHERE slug = 'tealight-diyas-candle-holders'),
    30,
    ARRAY[
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Candle+Holder+1',
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Candle+Holder+2'
    ],
    true
  ),
  (
    'Hanging Brass Diya Chain (5 Tier)',
    'hanging-brass-diya-chain-5tier',
    'Elegant five-tier hanging brass diya chain for temple and festival décor. Creates a cascading warm glow when lit.',
    1599,
    (SELECT id FROM categories WHERE slug = 'tealight-diyas-candle-holders'),
    18,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Hanging+Diya'],
    true
  ),

  -- Idols & Figurines
  (
    'Lord Ganesha Brass Idol (6 inch)',
    'lord-ganesha-brass-idol-6inch',
    'Exquisitely crafted brass Ganesha idol with fine detailing. A symbol of wisdom and prosperity, ideal for your home temple or living space. Hand-finished by artisans in Farrukhabad. Dimensions: 6 inches · Material: Solid brass · Weight: approx. 850g.',
    2499,
    (SELECT id FROM categories WHERE slug = 'idols-figurines'),
    20,
    ARRAY[
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Ganesha+Front',
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Ganesha+Side',
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Ganesha+Detail'
    ],
    true
  ),
  (
    'Krishna Flute Playing Figurine',
    'krishna-flute-figurine',
    'Beautifully sculpted Krishna figurine playing the flute, made from premium resin with antique gold finish. A serene addition to any décor.',
    1899,
    (SELECT id FROM categories WHERE slug = 'idols-figurines'),
    15,
    ARRAY[
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Krishna+1',
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Krishna+2'
    ],
    true
  ),
  (
    'Hanuman Ji Brass Statue (8 inch)',
    'hanuman-brass-statue-8inch',
    'Majestic Hanuman Ji brass statue with detailed musculature and expressive face. A powerful spiritual presence for your home altar.',
    2999,
    (SELECT id FROM categories WHERE slug = 'idols-figurines'),
    10,
    ARRAY[
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Hanuman+Front',
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Hanuman+Side'
    ],
    true
  ),

  -- Ceramics & Vases
  (
    'Hand-painted Ceramic Vase',
    'hand-painted-ceramic-vase',
    'Elegant ceramic vase with hand-painted floral motifs in warm terracotta and cream tones. Perfect for fresh or dried flower arrangements.',
    1299,
    (SELECT id FROM categories WHERE slug = 'ceramics-vases'),
    25,
    ARRAY[
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Ceramic+Vase+1',
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Ceramic+Vase+2'
    ],
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
    'Terracotta Floor Vase (Large)',
    'terracotta-floor-vase-large',
    'Large terracotta floor vase with rustic finish. Ideal for dried pampas grass, bamboo sticks, or as a standalone décor piece.',
    2199,
    (SELECT id FROM categories WHERE slug = 'ceramics-vases'),
    12,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Floor+Vase'],
    true
  ),

  -- Stone & Marble Carvings
  (
    'Marble Elephant Pair (Small)',
    'marble-elephant-pair-small',
    'Hand-carved white marble elephant pair symbolizing good luck and strength. Smooth polished finish with delicate trunk details.',
    3499,
    (SELECT id FROM categories WHERE slug = 'stone-marble-carvings'),
    12,
    ARRAY[
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Elephants+1',
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Elephants+2'
    ],
    true
  ),
  (
    'Soapstone Buddha Head Sculpture',
    'soapstone-buddha-head',
    'Serene Buddha head sculpture carved from natural soapstone. The meditative expression brings peace and tranquility to any room.',
    4299,
    (SELECT id FROM categories WHERE slug = 'stone-marble-carvings'),
    8,
    ARRAY[
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Buddha+1',
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Buddha+2',
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Buddha+Detail'
    ],
    true
  ),
  (
    'Marble Pen Stand with Inlay',
    'marble-pen-stand-inlay',
    'Hand-carved marble pen stand with semi-precious stone inlay work. A functional art piece for your desk or study.',
    1899,
    (SELECT id FROM categories WHERE slug = 'stone-marble-carvings'),
    15,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Pen+Stand'],
    true
  ),

  -- Wooden Crafts
  (
    'Sheesham Wood Serving Tray',
    'sheesham-wood-serving-tray',
    'Handcrafted serving tray from premium Sheesham wood with brass inlay handles. Ideal for serving tea, snacks, or as a decorative accent.',
    1799,
    (SELECT id FROM categories WHERE slug = 'wooden-crafts'),
    22,
    ARRAY[
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Wood+Tray+1',
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Wood+Tray+2'
    ],
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
    'Carved Wooden Jewellery Box',
    'carved-wooden-jewellery-box',
    'Intricately carved Sheesham wood jewellery box with velvet-lined interior and brass latch. Perfect gift for weddings and festivals.',
    1299,
    (SELECT id FROM categories WHERE slug = 'wooden-crafts'),
    20,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Jewellery+Box'],
    true
  ),

  -- Bathroom Accessories
  (
    'Marble Soap Dispenser Set',
    'marble-soap-dispenser-set',
    'Luxurious bathroom accessory set including soap dispenser, tumbler, and tray — all crafted from natural marble with gold accents.',
    2199,
    (SELECT id FROM categories WHERE slug = 'bathroom-accessories'),
    16,
    ARRAY[
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Soap+Set+1',
      'https://placehold.co/600x600/F5E6D3/8B6F47?text=Soap+Set+2'
    ],
    true
  ),
  (
    'Brass Towel Ring (Wall Mount)',
    'brass-towel-ring-wall-mount',
    'Elegant wall-mounted brass towel ring with antique finish. Adds a touch of traditional luxury to your bathroom.',
    599,
    (SELECT id FROM categories WHERE slug = 'bathroom-accessories'),
    28,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Towel+Ring'],
    true
  ),
  (
    'Wooden Soap Dish with Drain',
    'wooden-soap-dish-drain',
    'Teak wood soap dish with natural drainage grooves. Keeps soap dry and adds an organic touch to your bathroom counter.',
    449,
    (SELECT id FROM categories WHERE slug = 'bathroom-accessories'),
    40,
    ARRAY['https://placehold.co/600x600/F5E6D3/8B6F47?text=Soap+Dish'],
    true
  )

ON CONFLICT (slug) DO NOTHING;

-- ─── Static page content ───────────────────────────────────────────
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
    <p>We accept UPI, bank transfer, and cash on delivery (for select locations). PayU online payment coming soon.</p>
    <h3>Are your products handmade?</h3>
    <p>Absolutely. Every item in our collection is handcrafted by skilled artisans. Slight variations in color and design are natural and add to the uniqueness of each piece.</p>
    <h3>How do I care for brass and wooden items?</h3>
    <p>Brass items can be cleaned with lemon juice and salt. Wooden items should be kept away from direct sunlight and moisture. We include care instructions with every order.</p>'
  ),
  (
    'terms',
    'Terms & Conditions',
    '<p>By using the Cycad Handicrafts website and placing orders, you agree to the following terms:</p>
    <h3>Orders & Pricing</h3>
    <p>All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.</p>
    <h3>Product Images</h3>
    <p>Product images are representative. As our items are handmade, slight variations in color, size, and finish may occur.</p>'
  ),
  (
    'privacy',
    'Privacy Policy',
    '<p>At Cycad Handicrafts, we respect your privacy and are committed to protecting your personal information.</p>
    <h3>Information We Collect</h3>
    <p>We collect information you provide when placing orders, submitting contact forms, or creating an account.</p>
    <h3>How We Use Your Information</h3>
    <p>Your information is used to process orders, respond to enquiries, and improve our services. We do not sell your personal data.</p>'
  ),
  (
    'returns',
    'Return & Refund Policy',
    '<p>We want you to be completely satisfied with your purchase.</p>
    <h3>Return Window</h3>
    <p>You may return items within 7 days of delivery if they arrive damaged or significantly different from the product description.</p>
    <h3>Refunds</h3>
    <p>Refunds are processed within 7-10 business days after we receive and inspect the returned item.</p>'
  )
ON CONFLICT (slug) DO NOTHING;

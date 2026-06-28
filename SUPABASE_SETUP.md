# Supabase Setup — Cycad Handicrafts (Step by Step)

Use a **new Supabase project** (separate from Himalayan Travels).

Go to: **Supabase Dashboard → SQL Editor → New query**  
Run each query below **in order**. Wait for **Success** before the next one.

---

## BEFORE SQL — Create project (Dashboard UI, not SQL)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New project**
3. Name: `cycad-handicrafts`
4. Set database password → **Create new project**
5. Wait until project status is **Active**

---

## QUERY 1 — Enable UUID extension

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## QUERY 2 — Create all tables

```sql
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0)
);
```

---

## QUERY 3 — Create indexes

```sql
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_enquiries_read ON enquiries(is_read);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
```

---

## QUERY 4 — Admin helper function

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## QUERY 5 — Enable Row Level Security

```sql
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
```

---

## QUERY 6 — RLS policies (categories + products)

```sql
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE USING (is_admin());

CREATE POLICY "Active products are viewable by everyone"
  ON products FOR SELECT USING (is_active = true OR is_admin());

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE USING (is_admin());
```

---

## QUERY 7 — RLS policies (enquiries + admins + pages)

```sql
CREATE POLICY "Anyone can submit enquiries"
  ON enquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view enquiries"
  ON enquiries FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update enquiries"
  ON enquiries FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete enquiries"
  ON enquiries FOR DELETE USING (is_admin());

CREATE POLICY "Admins can view admin list"
  ON admins FOR SELECT USING (is_admin());

CREATE POLICY "Page content is viewable by everyone"
  ON page_content FOR SELECT USING (true);

CREATE POLICY "Admins can insert page content"
  ON page_content FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update page content"
  ON page_content FOR UPDATE USING (is_admin());
```

---

## QUERY 8 — RLS policies (orders + order items)

```sql
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE USING (is_admin());

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
```

---

## QUERY 9 — Storage bucket + image upload policies

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

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
```

---

## QUERY 10 — Insert categories (6)

```sql
INSERT INTO categories (name, slug, image_url) VALUES
  ('Tealight Diyas & Candle Holders', 'tealight-diyas-candle-holders', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Diyas'),
  ('Idols & Figurines', 'idols-figurines', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Idols'),
  ('Ceramics & Vases', 'ceramics-vases', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Ceramics'),
  ('Stone & Marble Carvings', 'stone-marble-carvings', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Stone'),
  ('Wooden Crafts', 'wooden-crafts', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Wood'),
  ('Bathroom Accessories', 'bathroom-accessories', 'https://placehold.co/400x300/F5E6D3/8B6F47?text=Bathroom')
ON CONFLICT (slug) DO NOTHING;
```

---

## QUERY 11 — Insert products (18 dummy products)

Copy the full product INSERT from file: **`supabase/seed.sql`**  
(starts at `INSERT INTO products` — lines 18 to 245)

Or run the entire **`supabase/seed.sql`** file in one go (it includes categories + products + pages — use only if Query 10 was NOT run yet, otherwise run products + pages section only).

---

## QUERY 12 — Insert static pages (About, FAQ, Terms, Privacy, Returns)

Copy the `INSERT INTO page_content` block from **`supabase/seed.sql`** (lines 248–299).

---

## BEFORE QUERY 13 — Create admin login user (Dashboard UI)

1. Go to **Authentication → Users → Add user → Create new user**
2. Email: `owner@cycadhandicrafts.com` (or your email)
3. Password: your chosen password
4. ✅ Check **Auto Confirm User**
5. Click **Create user**
6. Click the user → copy **User UID** (UUID)

---

## QUERY 13 — Link user as admin

Replace `YOUR-USER-UUID` and email with your values:

```sql
INSERT INTO admins (id, email)
VALUES ('YOUR-USER-UUID', 'owner@cycadhandicrafts.com');
```

Example:

```sql
INSERT INTO admins (id, email)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'owner@cycadhandicrafts.com');
```

---

## QUERY 14 — Verify everything loaded

```sql
SELECT 'categories' AS table_name, COUNT(*) AS rows FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'page_content', COUNT(*) FROM page_content
UNION ALL
SELECT 'admins', COUNT(*) FROM admins;
```

Expected result:

| table_name   | rows |
|-------------|------|
| categories  | 6    |
| products    | 18   |
| page_content| 5    |
| admins      | 1    |

---

## AFTER SQL — Environment variables

1. Supabase → **Project Settings → API**
2. Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Run:

```bash
npm install
npm run dev
```

---

## Access URLs

| What | URL |
|------|-----|
| Store | http://localhost:3000 |
| Shop | http://localhost:3000/shop |
| Admin login | http://localhost:3000/admin/login |
| Admin dashboard | http://localhost:3000/admin |

Login with the email/password from Query 13 setup.

---

## Shortcut — run everything in 2 queries

If you prefer fewer steps:

| Query | File |
|-------|------|
| Query A | Paste all of `supabase/schema.sql` |
| Query B | Paste all of `supabase/seed.sql` |
| Then | Create auth user + run Query 13 |

Or **one file**: paste all of `supabase/complete-setup.sql` → then Query 13.

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `relation "categories" does not exist` | Run Query 2 first (tables not created) |
| `policy already exists` | You re-ran a policy query — skip or drop old policies |
| Admin login "not authorized" | Query 13 not run, or wrong UUID |
| Empty shop | Query 10–12 not run, or `.env.local` wrong project |
| Image upload fails | Query 9 not run — check Storage → `product-images` bucket exists |

---

## What owner manages from Admin dashboard

- **Products** — add/edit/delete, upload up to 6 images
- **Categories** — add/edit/delete
- **Orders** — view & update status
- **Enquiries** — contact form messages
- **Pages** — edit About, FAQ, Terms, Privacy, Returns
- **Settings** — PayU payment credentials (for later)

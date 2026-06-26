# Cycad Handicrafts

A full-stack e-commerce website for **Cycad Handicrafts** — a handmade/artisanal home décor brand from Farrukhabad, Uttar Pradesh.

## Tech Stack

- **Next.js 14** (App Router) with TypeScript
- **Tailwind CSS** — warm, earthy artisanal design
- **Supabase** — Postgres database, Auth, Storage
- **Zod + React Hook Form** — form validation
- **Lucide Icons**

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials
3. Run the SQL migrations in the Supabase SQL Editor:
   - `supabase/schema.sql` — creates tables, RLS policies, storage bucket
   - `supabase/seed.sql` — seeds demo categories, products, and page content

### 3. Create an admin user

1. In Supabase Dashboard → Authentication → Users, create a new user with email/password
2. Copy the user's UUID from the users table
3. Run in SQL Editor:

```sql
INSERT INTO admins (id, email) VALUES ('your-user-uuid', 'admin@example.com');
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the store and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

## Project Structure

```
src/
├── app/
│   ├── (store)/          # Public-facing pages
│   │   ├── page.tsx      # Home
│   │   ├── shop/         # Product listing
│   │   ├── products/     # Product detail
│   │   ├── cart/         # Shopping cart + checkout
│   │   ├── about/        # Static pages
│   │   ├── login/        # Customer auth
│   │   └── register/
│   └── admin/            # Protected admin panel
│       ├── products/     # CRUD products
│       ├── categories/   # Manage categories
│       ├── enquiries/    # Contact form submissions
│       ├── orders/         # Order management
│       └── pages/          # Edit static page content
├── components/
├── context/              # Cart context (localStorage)
├── lib/                  # Supabase clients, queries, actions
└── types/
supabase/
├── schema.sql
└── seed.sql
```

## Features

### Public Store
- Home page with hero, about intro, featured products, contact form
- Shop with category filters, search, and sort
- Product detail with image gallery and add to cart
- Cart with quantity editing and checkout (creates orders)
- Static pages (About, FAQ, Terms, Privacy, Returns) — editable from admin
- Customer login/register (optional account)

### Admin Panel (`/admin`)
- Dashboard with stats and recent enquiries
- Product management with image upload to Supabase Storage
- Category management
- Enquiry inbox with read/unread status
- Order management with status updates
- Static page content editor

## Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables from `.env.example`
4. Deploy

## License

Private — Cycad Handicrafts

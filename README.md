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

**Full step-by-step guide:** see **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

Quick summary:

1. Create a **new** Supabase project (not shared with other apps)
2. Run `supabase/schema.sql` then `supabase/seed.sql` in SQL Editor
3. Create an admin user in Auth + insert into `admins` table
4. Copy `.env.example` → `.env.local` and add your Supabase keys

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the store and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

Supabase is **required** — the app reads all products, categories, and orders from your database.

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

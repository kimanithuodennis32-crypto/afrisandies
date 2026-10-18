# AFRI SANDIES

React storefront (`frontend/`) + Express/Prisma API (`backend/`) + Postgres.

Two ways to host it. **Netlify (no card needed)** is the default here.

## Deploy on Netlify + Neon (no credit card)

The storefront is served as static files and the API runs as a Netlify
serverless function (`netlify/functions/api.ts`). `netlify.toml` wires it up.

1. **Database:** create a project at neon.tech. Copy the connection string
   (starts `postgresql://`, ends `?sslmode=require`). Use the *direct* one:
   turn **Connection pooling off** in the Connect dialog.
2. **Netlify:** Add new site > Import from GitHub > pick the repo. Leave the
   build settings as they are (they come from `netlify.toml`).
3. **Environment variables** (Site configuration > Environment variables,
   set BEFORE the build runs):
   - `DATABASE_URL` Neon string
   - `JWT_SECRET` a long random string (40+ random characters)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` your admin login
   - optional: `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`
4. Deploy. The build installs everything, builds the storefront, creates the
   database tables and seeds products + the admin user.
5. Test: open the site, visit `/health` (should show `{"ok":true}`), then
   `/#/admin` and log in.

Notes: the first API call after a quiet period can take a few seconds
(serverless + Neon waking up). The seed runs on every deploy; it never
overwrites products but resets the admin password to `ADMIN_PASSWORD`.

## Photo uploads (Cloudinary, free, no card)

Photo uploads (products and gallery) go straight from the browser to Cloudinary.
Without it, the admin forms fall back to "paste a photo link".

1. Sign up at cloudinary.com. Your **cloud name** is shown on the dashboard.
2. Settings > Upload > Upload presets > Add upload preset. Set **Signing mode: Unsigned**,
   save, and copy the preset name.
3. In Netlify (Site configuration > Environment variables) add two variables,
   leaving "Contains secret values" **unticked** (they're public by design):
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`
4. Trigger a new deploy. These are baked in at build time, so a redeploy is required.

## Customer accounts

Customers can create an account at `/#/account` (email + password) and see their
orders and each order's status. Guests can still check out without an account.

- Orders are linked to an account only if the customer was **logged in when
  placing them**. Earlier guest orders are not matched automatically.
- Admin: change an order's status in the Admin page (Recent orders). The customer
  sees the new status in their account straight away.
- Customer and admin logins use different token types, so a customer token can
  never be used on admin routes. Admins must log in again once after this update.
- Not built yet: "forgot password" (needs an email service) and login rate limiting.

## Gallery

Public page at `/#/gallery`. Manage photos in the Admin page under **Gallery**:
upload several at once, choose Event / Customer / Other, add a caption, change the
type later, or delete.

## Deploy on Render instead (needs a card for verification)

`render.yaml` is included: New > Blueprint > pick the repo, fill in
`DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`. One service serves site + API.

## Local development

```bash
cp .env.example .env            # fill in DATABASE_URL, JWT_SECRET, admin login
cp frontend/.env.example frontend/.env
npm install
npx prisma migrate deploy --schema backend/prisma/schema.prisma
npm run seed
npm run dev:api      # http://localhost:4000
npm run dev:web      # http://localhost:5173
```

## Known limitation: storefront catalog is still bundled

Checkout and admin use the API, but the product pages (Home, Shop, Category,
Product) still read `frontend/src/data/products.ts`, not the database.
Admin edits do not change what shoppers see, and checkout charges the
database price. Keep both in sync until the storefront reads from
`GET /api/products` (which also needs hosted image URLs).

## Before taking real orders

- `POST /api/orders` is public with no rate limiting; consider adding one.
- Orders are confirmed manually via WhatsApp + M-Pesa Paybill.

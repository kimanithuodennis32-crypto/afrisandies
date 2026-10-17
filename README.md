# AFRI SANDIES

Storefront (React + Vite) and API (Express + Prisma + Postgres) in one project,
deployed as **one service on one domain**. Express serves the API at `/api/*`
and the built storefront at everything else, so there is no CORS setup and no
second host to manage.

```
frontend/   React storefront + admin UI  -> built to frontend/dist
backend/    Express API, Prisma schema, migrations, seed
render.yaml One-click deploy blueprint for Render
```

## Deploy (Render + Neon, both have free tiers)

1. **Database:** create a project at neon.tech and copy its connection string
   (starts `postgresql://`, ends `?sslmode=require`).
2. **Code:** push this folder to a GitHub repo.
3. **Render:** New > Blueprint > pick the repo. When prompted, fill in:
   - `DATABASE_URL` - the Neon string
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` - your admin login (use a strong password)
   - `VITE_CLOUDINARY_CLOUD_NAME` / `VITE_CLOUDINARY_UPLOAD_PRESET` - optional,
     for image uploads in Admin (unsigned preset). Leave blank to paste URLs instead.
   `JWT_SECRET` is generated for you.
4. Render runs `npm run build`, which installs both apps, builds the
   storefront, compiles the API, applies database migrations, and seeds
   products plus the admin user. Then it runs `npm start`.
5. Open the Render URL. The admin is at `/#/admin`.
6. **Custom domain:** Render > Settings > Custom Domains, then add the DNS
   record it shows at your registrar.

Notes:
- The seed runs on every deploy. It never overwrites existing products, but it
  **resets the admin password to `ADMIN_PASSWORD`**.
- Free Render services sleep after ~15 min idle; the first visit afterwards
  takes ~30-60 s.
- On a different host, use: build `npm run build`, start `npm start`, and set
  `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (Node 18+).

## Local development

```bash
cp backend/.env.example backend/.env     # fill in DATABASE_URL, JWT_SECRET, admin login
cp frontend/.env.example frontend/.env
npm --prefix backend install
npx --yes pnpm@9 --dir frontend install
npm --prefix backend run prisma:generate
npx --prefix backend prisma migrate deploy --schema backend/prisma/schema.prisma
npm --prefix backend run seed
npm run dev:api     # http://localhost:4000
npm run dev:web     # http://localhost:5173
```

## Known limitation: storefront catalog is still bundled

The checkout and admin talk to the API, but the **product pages (Home, Shop,
Category, Product) still read `frontend/src/data/products.ts`**, not the
database. Consequences:

- Editing a product's price/title/images in Admin does **not** change what
  shoppers see.
- At checkout the server recomputes prices from the database. If you change a
  price in Admin but not in `products.ts`, the customer is charged the database
  price while seeing the old one. Keep both in sync until the storefront is
  moved to `GET /api/products`.
- Product IDs in `products.ts` must exist in the database (the seed covers
  them). New products added only in Admin can't be bought until the storefront
  reads from the API.

Moving the storefront to the API also needs images hosted somewhere real
(e.g. Cloudinary): the seeded image paths point at the frontend's source
folders and won't resolve as URLs.

## Before taking real orders

- `POST /api/orders` is public with no rate limiting; consider adding one.
- Orders are confirmed manually via WhatsApp + M-Pesa Paybill (unchanged).

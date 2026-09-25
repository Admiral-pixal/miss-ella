# Miss Ella — Online Catalog

Full-stack site for Miss Ella: a browsable catalog (Men / Women / Unisex / Accessories), WhatsApp checkout, and an admin dashboard so she can manage products and see order history herself.

## Stack
- Backend: Node.js, Express, MySQL (`mysql2`, no ORM), JWT auth, bcryptjs, multer for image uploads
- Frontend: React, Vite, React Router, inline styles (no CSS framework)

## Project structure
```
miss-ella/
  .env.example
  backend/
    server.js, db.js, auth.js, schema.sql, createAdmin.js
    routes/ (auth, products, orders)
    uploads/ (product images)
  frontend/
    src/
      pages/ (Home, Catalog, ProductDetail, Checkout, admin/)
      components/ (Navbar, Footer, ProductCard)
      theme.js, api.js, CartContext.jsx
```

## 1. Database
**Local (XAMPP):** start MySQL in the XAMPP control panel, open phpMyAdmin, and run `backend/schema.sql`.
**Production (Clever Cloud):** create a MySQL add-on, connect with a client, and run the same `backend/schema.sql`.

## 2. Environment variables
Copy `.env.example` to `.env` at the project root and fill in your values. Both the backend and the frontend read from this one file locally.

## 3. Backend
```
cd backend
npm install
npm run dev
```
Runs on the `PORT` from `.env` (default 5000).

Create Miss Ella's admin login (run once, locally or against production):
```
node createAdmin.js her@email.com herpassword
```
There's no public sign-up — only accounts created this way can log in at `/admin`.

## 4. Frontend
```
cd frontend
npm install
npm run dev
```

## 5. Deploying
- **Backend → Render or Koyeb:** set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `PORT` in the dashboard, using your Clever Cloud MySQL credentials.
- **Frontend → Vercel:** set `VITE_API_URL` to your deployed backend URL + `/api`, and `VITE_WHATSAPP_NUMBER`.
- After deploying, run `createAdmin.js` once against the production database to create Miss Ella's login.

## How it works
- Customers browse by category, pick size/color/quantity, and build up an order.
- At checkout, the order is saved to the `orders` table (visible to Miss Ella under the Orders tab in `/admin/dashboard`) and also opens WhatsApp with the same details pre-filled, sent to +233542066487.
- Payment is arranged after that WhatsApp chat (cash or MoMo) — nothing is charged on the site.
- Miss Ella logs in at `/admin`, adds/edits/removes products, and uploads a photo per item.

## Worth knowing
- Product photos are stored in the backend's `uploads/` folder. Render/Koyeb free tiers can wipe local disk storage on redeploy — fine to launch with, but worth moving to something like Cloudinary later if that becomes a problem.
- CORS is wide open for now to keep setup simple; worth locking it to your Vercel domain once it's live.

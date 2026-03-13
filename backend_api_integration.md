# CLEFEEL — Backend API Integration Guide

Complete reference for connecting the CLEFEEL frontend to the backend API.

---

## Setup

Set the environment variable in frontend `.env`:

```
VITE_API_URL=http://localhost:5000
```

All API functions in [api.ts](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/data/api.ts) check for `VITE_API_URL`. When set, real API calls are made. When empty, the app falls back to the local Zustand `productStore` (localStorage).

---

## Authentication Endpoints

> Frontend file: [authStore.ts](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/store/authStore.ts)

| Method | Endpoint | Body / Params | Response |
|--------|----------|---------------|----------|
| POST | `/api/auth/register` | `{ fullName, email, phone, password }` | `{ success, data: { user, tokens }, message }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ success, data: { user, tokens } }` |
| GET | `/api/auth/verify-email` | `?token=xxx` | `{ success, message }` |
| POST | `/api/auth/forgot-password` | `{ email }` | `{ success, message }` |
| POST | `/api/auth/reset-password` | `{ token, password }` | `{ success, message }` |
| GET | `/api/auth/me` | — (Bearer token) | `{ success, data: User }` |
| PUT | `/api/auth/profile` | `{ fullName, phone }` (Bearer) | `{ success, data: User }` |
| POST | `/api/auth/address` | Address object (Bearer) | `{ success, data: Address }` |
| DELETE | `/api/auth/address/:id` | — (Bearer) | `{ success }` |
| POST | `/api/auth/resend-verification` | — (Bearer) | `{ success, message }` |

### Email Verification Flow
1. User registers → verification email sent automatically
2. Email contains branded HTML with **VERIFY EMAIL** button
3. Button links to `FRONTEND_URL/verify-email?token=xxx`
4. Frontend calls `GET /api/auth/verify-email?token=xxx`
5. User gets `isVerified: true`

**Default admin**: `admin@clefeel.com` / `admin123`

---

## Product Endpoints (Public)

> Frontend file: [api.ts](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/data/api.ts)

| Method | Endpoint | Params | Response |
|--------|----------|--------|----------|
| GET | `/api/products` | `?category=Oud` (optional) | `{ success, data: Product[] }` |
| GET | `/api/products/similar` | `?excludeId=xxx&price=2499&limit=4` | `{ success, data: Product[] }` |
| GET | `/api/products/:id` | — | `{ success, data: Product }` |
| GET | `/api/features` | — | `{ success, data: Feature[] }` |

---

## Payment Endpoints (Razorpay)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/payment/create-order` | `{ amount, currency }` | `{ success, data: { orderId, amount, currency } }` |
| POST | `/api/payment/verify` | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` | `{ success, data: { verified } }` |

---

## Order Endpoints

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/orders/create` | `{ items, totalAmount, address, userId?, razorpayOrderId? }` | `{ success, data: Order }` |
| GET | `/api/orders/my-orders` | — (Bearer) | `{ success, data: Order[] }` |
| GET | `/api/orders/:id` | — | `{ success, data: Order }` |

---

## Admin Endpoints (Bearer + Admin role)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/api/admin/products` | — | `{ success, data: Product[] }` |
| POST | `/api/admin/products` | Product JSON | `{ success, data: Product }` |
| PUT | `/api/admin/products/:id` | Partial Product | `{ success, data: Product }` |
| DELETE | `/api/admin/products/:id` | — | `{ success }` |
| GET | `/api/admin/orders` | — | `{ success, data: Order[] }` |
| PATCH | `/api/admin/orders/:id/status` | `{ status }` | `{ success, data: Order }` |
| GET | `/api/admin/dashboard` | — | Dashboard stats |

---

## Image Upload (Bearer + Admin)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/upload` | `multipart/form-data` (field: `image`) | `{ success, data: { url, publicId } }` |
| DELETE | `/api/upload/:publicId` | — | `{ success }` |

---

## Server Setup Instructions

```bash
cd server
npm install
```

### Environment (.env)
Update `server/.env` with your credentials. See the `.env` file for all required variables.

### Database
```bash
npx prisma generate
npx prisma db push       # Push schema to PostgreSQL
npm run prisma:seed       # Seed 8 products + admin user
```

> [!IMPORTANT]
> You need the **External Database URL** from Render Dashboard → your PostgreSQL database → Connect → External.
> The internal URL (`dpg-xxx-a`) only works inside Render's network.

### Run Server
```bash
npm run dev               # Development (with auto-reload)
npm run build && npm start # Production
```

### SMTP Setup (Gmail) for Email Verification
1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Create app password for "Mail"
3. Set `SMTP_USER` and `SMTP_PASS` in `.env`

---

## File Structure

```
server/
├── .env
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── src/
    ├── index.ts
    ├── config/
    │   ├── db.ts          # Prisma + Cloudinary
    │   └── email.ts       # Email templates
    ├── middleware/
    │   └── auth.ts        # JWT + admin guard
    └── routes/
        ├── auth.ts        # Register, login, email verification
        ├── products.ts    # Public product API
        ├── admin.ts       # Admin CRUD
        ├── orders.ts      # Order management
        ├── payment.ts     # Razorpay
        └── upload.ts      # Cloudinary upload
```

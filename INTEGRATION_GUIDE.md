# CLEFEEL — Backend & Frontend Integration Guide

## Architecture Overview

```
┌──────────────────┐      REST API       ┌──────────────────┐
│   FRONTEND       │ ◄─────────────────► │   BACKEND        │
│   (Vite + React) │                     │   (Node.js +     │
│   Port: 5173     │                     │    Express)       │
│                  │                     │   Port: 3000      │
└──────────────────┘                     └───────┬──────────┘
                                                 │
                                         ┌───────▼──────────┐
                                         │   DATABASE        │
                                         │   (PostgreSQL +   │
                                         │    Prisma ORM)    │
                                         └──────────────────┘
```

---

## Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3000       # Backend API base URL
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxx   # Razorpay publishable key
```

### Backend (`.env`)
```env
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/clefeel
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Email (for verification & password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@clefeel.com

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Frontend URL (for CORS & redirects)
FRONTEND_URL=http://localhost:5173
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register with email + password | No |
| POST | `/api/auth/login` | Login with email + password | No |
| GET | `/api/auth/verify-email?token=xxx` | Verify email address | No |
| POST | `/api/auth/forgot-password` | Send password reset email | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |
| GET | `/api/auth/google` | Initiate Google OAuth | No |
| GET | `/api/auth/google/callback` | Google OAuth callback | No |
| POST | `/api/auth/refresh` | Refresh access token | RefreshToken |

**Register Request:**
```json
{ "fullName": "John", "email": "john@example.com", "password": "secret123" }
```

**Login Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "fullName": "...", "email": "...", "role": "user", "isVerified": true },
    "tokens": { "accessToken": "jwt...", "refreshToken": "jwt..." }
  }
}
```

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List active products (optional `?category=Oud`) | No |
| GET | `/api/products/:id` | Get product by ID | No |
| GET | `/api/products/similar?excludeId=X&price=Y&limit=4` | Similar products | No |

**Product Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod-1",
    "name": "Royal Oud",
    "description": "...",
    "basePrice": 2999,
    "category": "Oud",
    "status": "active",
    "images": [
      { "id": "img-1", "imageUrl": "/products/royal-oud-1.jpg", "sortOrder": 0 },
      { "id": "img-2", "imageUrl": "/products/royal-oud-2.jpg", "sortOrder": 1 }
    ],
    "sizes": [
      { "id": "size-1", "sizeName": "30ml", "price": 2999, "stock": 50 },
      { "id": "size-2", "sizeName": "50ml", "price": 4499, "stock": 30 }
    ],
    "topNotes": ["Saffron", "Nutmeg"],
    "middleNotes": ["Oud Wood"],
    "baseNotes": ["Amber", "Vanilla"],
    "image": "/products/royal-oud-1.jpg"
  }
}
```

### Payment (Razorpay)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/payment/create-order` | Create Razorpay order | JWT |
| POST | `/api/payment/verify` | Verify payment signature | JWT |

**Create Order Request:**
```json
{ "amount": 4999, "currency": "INR" }
```

**Verify Payment Request:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "sig_xxx"
}
```

### Features

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/features` | Get "Why Choose" features | No |

### Admin Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/products` | List all products (including inactive) | Admin JWT |
| POST | `/api/admin/products` | Create product | Admin JWT |
| PUT | `/api/admin/products/:id` | Update product | Admin JWT |
| DELETE | `/api/admin/products/:id` | Delete product | Admin JWT |
| GET | `/api/admin/orders` | List all orders | Admin JWT |
| PATCH | `/api/admin/orders/:id/status` | Update order status | Admin JWT |

---

## Authentication Flow

### Email + Password
1. User registers → backend sends verification email with token link
2. User clicks link → `GET /api/auth/verify-email?token=xxx`
3. User logs in → receives JWT `accessToken` + `refreshToken`
4. Frontend stores tokens in Zustand (persisted to localStorage)
5. All authenticated requests include `Authorization: Bearer <accessToken>`

### Google OAuth
1. Frontend redirects to `GET /api/auth/google`
2. Backend redirects to Google consent screen
3. After approval, Google redirects to `/api/auth/google/callback`
4. Backend creates/finds user, generates JWT tokens
5. Redirects to frontend: `FRONTEND_URL/account?token=xxx&refresh=xxx`
6. Frontend extracts tokens from URL and stores them

### Forgot Password
1. User enters email → `POST /api/auth/forgot-password`
2. Backend sends email with reset link containing a token
3. User clicks link → frontend shows reset password form
4. User submits new password → `POST /api/auth/reset-password`

---

## Admin Panel Access

### Default Admin Credentials (Frontend Mock Mode)
- **Email:** `admin@clefeel.com`
- **Password:** `admin123`

### How to Access
1. Navigate to `/account`
2. Log in with the admin credentials above
3. Once logged in, you'll see an **ADMIN** badge and a **"Go to Admin Panel"** button
4. Or navigate directly to `/admin`

### Admin Panel Features:
- **Dashboard:** Overview stats (products, orders, revenue)
- **Products:** Full CRUD — add/edit/delete products with multiple images, sizes, pricing
- **Orders:** View all orders, update order status (pending → processing → shipped → delivered)

---

## Database Schema (Recommended — Prisma)

```prisma
model User {
  id            String    @id @default(uuid())
  fullName      String
  email         String    @unique
  passwordHash  String?
  googleId      String?   @unique
  isVerified    Boolean   @default(false)
  role          String    @default("user") // "user" | "admin"
  createdAt     DateTime  @default(now())
  addresses     Address[]
  orders        Order[]
}

model Product {
  id          String         @id @default(uuid())
  name        String
  description String
  basePrice   Float
  category    String
  status      String         @default("active")
  topNotes    String[]
  middleNotes String[]
  baseNotes   String[]
  longevity   String?
  projection  String?
  bestseller  Boolean        @default(false)
  new         Boolean        @default(false)
  image       String         // Legacy main image URL
  createdAt   DateTime       @default(now())
  images      ProductImage[]
  sizes       ProductSize[]
  orderItems  OrderItem[]
}

model ProductImage {
  id        String   @id @default(uuid())
  imageUrl  String
  sortOrder Int      @default(0)
  product   Product  @relation(fields: [productId], references: [id])
  productId String
}

model ProductSize {
  id        String  @id @default(uuid())
  sizeName  String
  price     Float
  stock     Int     @default(0)
  product   Product @relation(fields: [productId], references: [id])
  productId String
}

model Address {
  id       String  @id @default(uuid())
  fullName String
  email    String?
  phone    String?
  address  String
  city     String
  state    String
  country  String
  pincode  String
  user     User    @relation(fields: [userId], references: [id])
  userId   String
  orders   Order[]
}

model Order {
  id                String      @id @default(uuid())
  totalAmount       Float
  paymentStatus     String      @default("pending")
  orderStatus       String      @default("pending")
  razorpayOrderId   String?
  razorpayPaymentId String?
  estimatedDelivery DateTime?
  createdAt         DateTime    @default(now())
  user              User        @relation(fields: [userId], references: [id])
  userId            String
  address           Address     @relation(fields: [addressId], references: [id])
  addressId         String
  items             OrderItem[]
}

model OrderItem {
  id        String  @id @default(uuid())
  sizeName  String
  price     Float
  quantity  Int
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   String
  product   Product @relation(fields: [productId], references: [id])
  productId String
}
```

---

## Frontend Files Where Backend Connects

| File | Purpose |
|------|---------|
| `src/data/api.ts` | **Main API layer** — all fetch calls. Currently has local fallbacks |
| `src/store/authStore.ts` | **Auth state** — login, register, tokens. Has API calls + mock fallback |
| `src/pages/CheckoutPage.tsx` | **Payment** — Creates Razorpay orders, verifies payments |
| `src/pages/admin/AdminProductForm.tsx` | **Admin** — Creates/updates products via API |
| `src/pages/admin/AdminProducts.tsx` | **Admin** — Fetches all products |
| `src/pages/admin/AdminOrders.tsx` | **Admin** — Fetches/manages orders |

### How the API Fallback Works:
```typescript
// In src/data/api.ts — every function checks VITE_API_URL:
const API_BASE = import.meta.env.VITE_API_URL || '';

if (API_BASE) {
  // Calls real backend API
} else {
  // Falls back to local data in src/data/products.ts
}
```

**To switch from mock to real backend**, simply set `VITE_API_URL` in your `.env` file.

---

## Deployment Checklist

1. **Backend Setup:**
   - Initialize Node.js project with Express + Prisma + PostgreSQL
   - Implement all API endpoints listed above
   - Set up JWT authentication middleware
   - Configure Google OAuth with Passport.js
   - Set up email service (Nodemailer + SMTP)
   - Integrate Razorpay SDK

2. **Frontend Setup:**
   - Set `VITE_API_URL` to your backend URL
   - Set `VITE_RAZORPAY_KEY_ID` to your Razorpay test/live key
   - Run `npm run build` to create production bundle

3. **Production:**
   - Deploy backend to a server (Railway, Render, AWS, etc.)
   - Deploy frontend (`dist/` folder) to a static host (Vercel, Netlify, etc.)
   - Update CORS origins in backend to match frontend domain
   - Switch Razorpay to live keys
   - Set up proper SMTP for production emails

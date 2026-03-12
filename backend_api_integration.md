# CLEFEEL — Backend API Integration Guide

Complete reference for connecting the CLEFEEL frontend to a backend API.

---

## Setup

Set the environment variable in `.env`:

```
VITE_API_URL=https://your-api-domain.com
```

All API functions in [api.ts](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/data/api.ts) check for `VITE_API_URL`. When set, real API calls are made. When empty, the app falls back to the local Zustand `productStore` (localStorage).

---

## Authentication Endpoints

> Frontend file: [authStore.ts](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/store/authStore.ts)

| Method | Endpoint                     | Body / Params                                          | Response                                      |
|--------|------------------------------|--------------------------------------------------------|-----------------------------------------------|
| POST   | `/api/auth/register`         | `{ fullName, email, phone, password }`                 | `{ success, data: { user } }`                 |
| POST   | `/api/auth/login`            | `{ email, password }`                                  | `{ success, data: { user, tokens } }`         |
| POST   | `/api/auth/forgot-password`  | `{ email }`                                            | `{ success }`                                 |
| GET    | `/api/auth/verify-email`     | `?token=xxx`                                           | `{ success }`                                 |

### Token Schema

```json
{
  "accessToken": "jwt-string",
  "refreshToken": "jwt-string"
}
```

### User Schema

```json
{
  "id": "string",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "isVerified": true,
  "role": "user | admin",
  "addresses": [],
  "orders": []
}
```

---

## Product Endpoints (Public)

> Frontend file: [api.ts](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/data/api.ts) — functions [fetchProducts](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/data/api.ts#21-42), [fetchProductById](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/data/api.ts#43-58), [fetchSimilarProducts](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/data/api.ts#59-87)

| Method | Endpoint                          | Params                                      | Response                              |
|--------|-----------------------------------|---------------------------------------------|---------------------------------------|
| GET    | `/api/products`                   | `?category=Oud` (optional)                  | `{ success, data: Product[] }`        |
| GET    | `/api/products/:id`               | —                                           | `{ success, data: Product }`          |
| GET    | `/api/products/similar`           | `?excludeId=xxx&price=2499&limit=4`         | `{ success, data: Product[] }`        |
| GET    | `/api/features`                   | —                                           | `{ success, data: WhyChooseFeature[] }` |

### Product Schema

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "basePrice": 2499,
  "category": "Oud",
  "status": "active | inactive",
  "image": "/product_royal_oud.jpg",
  "images": [
    { "id": "string", "imageUrl": "string", "sortOrder": 0 }
  ],
  "sizes": [
    { "id": "string", "sizeName": "50ml", "price": 2499, "stock": 30 }
  ],
  "topNotes": ["Saffron", "Nutmeg"],
  "middleNotes": ["Oud Wood", "Patchouli"],
  "baseNotes": ["Amber", "Vanilla"],
  "longevity": "8-12 Hours",
  "projection": "Moderate to Strong",
  "bestseller": true,
  "new": false
}
```

---

## Payment Endpoints (Razorpay)

> Frontend file: [api.ts](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/data/api.ts) — functions [createRazorpayOrder](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/data/api.ts#104-126), [verifyPayment](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/data/api.ts#127-145)
> Used in: [CheckoutPage.tsx](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/pages/CheckoutPage.tsx)

| Method | Endpoint                       | Body                                                       | Response                                            |
|--------|--------------------------------|------------------------------------------------------------|----------------------------------------------------|
| POST   | `/api/payment/create-order`    | `{ amount: 2499, currency: "INR" }`                       | `{ success, data: { orderId, amount, currency } }` |
| POST   | `/api/payment/verify`          | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` | `{ success, data: { verified: true } }`      |

### Backend Implementation Notes

1. **Create Order**: Use Razorpay's `orders.create()` API. Amount must be in **paise** (×100)
2. **Verify Payment**: Validate `razorpay_signature` using HMAC SHA256 with your Razorpay `key_secret`
3. Required env vars on backend: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

---

## Admin Endpoints (Protected)

> All require `Authorization: Bearer <accessToken>` header.  
> Frontend files: [api.ts](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/data/api.ts), [AdminProducts.tsx](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/pages/admin/AdminProducts.tsx), [AdminProductForm.tsx](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/pages/admin/AdminProductForm.tsx)

### Product Management

| Method | Endpoint                          | Body              | Response                       |
|--------|-----------------------------------|--------------------|-------------------------------|
| GET    | `/api/admin/products`             | —                  | `{ success, data: Product[] }` |
| POST   | `/api/admin/products`             | [Product](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/types/index.ts#14-36) JSON     | `{ success, data: Product }`   |
| PUT    | `/api/admin/products/:id`         | `Partial<Product>` | `{ success, data: Product }`   |
| DELETE | `/api/admin/products/:id`         | —                  | `{ success }`                  |

### Order Management

> Frontend files: [AdminOrders.tsx](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/pages/admin/AdminOrders.tsx), [AdminOrderDetail.tsx](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/pages/admin/AdminOrderDetail.tsx)

| Method | Endpoint                                | Body                | Response                      |
|--------|-----------------------------------------|---------------------|-------------------------------|
| GET    | `/api/admin/orders`                     | —                   | `{ success, data: Order[] }`  |
| PATCH  | `/api/admin/orders/:id/status`          | `{ status: "shipped" }` | `{ success }`             |

### Order Schema

```json
{
  "id": "string",
  "items": [
    {
      "id": "string",
      "product": { /* Product */ },
      "sizeName": "50ml",
      "price": 2499,
      "quantity": 1
    }
  ],
  "totalAmount": 2499,
  "paymentStatus": "pending | paid | failed | refunded",
  "orderStatus": "pending | processing | shipped | out_for_delivery | delivered",
  "createdAt": "ISO-8601",
  "address": { /* Address */ },
  "razorpayOrderId": "string",
  "razorpayPaymentId": "string"
}
```

---

## Frontend Files Summary

| File | What to connect | Current fallback |
|------|----------------|------------------|
| [api.ts](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/data/api.ts) | All product, payment, & admin API calls | Local `productStore` (Zustand + localStorage) |
| [authStore.ts](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/store/authStore.ts) | Login, register, forgot password, verify email | Mock users, admin: `admin@clefeel.com` / `admin123` |
| [CheckoutPage.tsx](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/pages/CheckoutPage.tsx) | Razorpay order creation & verification | Mock order IDs |
| [productStore.ts](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/store/productStore.ts) | Only used when no backend — provides local CRUD | [products.ts](file:///c:/Users/Ramkumar/Downloads/Kimi_Agent_CLEFEEL%20Luxury%20E%E2%80%91Commerce%20Design/app/src/data/products.ts) static data |

---

## Recommended Backend Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens) |
| Payments | Razorpay Node SDK |
| File Storage | AWS S3 / Cloudinary (for product images) |
| Hosting | Railway / Render / AWS |

### Key Backend Routes to Implement

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/forgot-password
GET    /api/auth/verify-email

GET    /api/products
GET    /api/products/:id
GET    /api/products/similar

GET    /api/features

POST   /api/payment/create-order
POST   /api/payment/verify

GET    /api/admin/products      (auth + admin role)
POST   /api/admin/products      (auth + admin role)
PUT    /api/admin/products/:id  (auth + admin role)
DELETE /api/admin/products/:id  (auth + admin role)
GET    /api/admin/orders        (auth + admin role)
PATCH  /api/admin/orders/:id/status (auth + admin role)
```

> [!TIP]
> All API responses must follow `{ success: boolean, data?: T, error?: string, message?: string }` format — the frontend checks `data.success` on every response.

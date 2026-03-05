# 🌿 Ecoyaan — Sustainable Checkout Flow

A production-ready Next.js 14 e-commerce checkout for eco-friendly products, built as per the assignment requirements.

## 🚀 Live Demo

Deploy to Vercel in one command:
```bash
npx vercel --prod
```
> No environment variables needed. Vercel sets `VERCEL_URL` automatically.

---

## 💻 Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

---

## 🛒 App Flow

```
/ → /shop → /checkout (Cart → Shipping → Payment → Success)
```

| Route | Type | Description |
|-------|------|-------------|
| `/` | Server | Redirects to `/shop` |
| `/shop` | Server + Client | Browse 12 products, Grid/List, search, cart drawer |
| `/checkout` | **SSR** | Cart → Shipping → Payment → Success |
| `/api/cart` | API Route | Returns mock cart JSON (GET) |
| `/api/orders` | API Route | Simulates order placement (POST) |

---

## 🏗️ Architecture

### Tech Stack
- **Next.js 14** — App Router, Server Components, SSR (`force-dynamic`)
- **TypeScript** — Strict types throughout
- **Tailwind CSS** — Utility-first, no external component lib
- **React Hook Form + Zod** — Type-safe form validation
- **Context API + useReducer** — Cart state across checkout steps
- **Lucide React** — Icons

### SSR Implementation
The `/checkout` page is a **Server Component** that fetches cart data on every request:
```typescript
export const dynamic = "force-dynamic"; // SSR on every request

async function getCartSSR(): Promise<CartData> {
  const res = await fetch(`${base}/api/cart`, { cache: "no-store" });
  return res.json();
}

export default async function CheckoutPage() {
  const initialCart = await getCartSSR(); // Runs on server
  return <CheckoutOrchestrator initialCart={initialCart} />;
}
```
This is equivalent to `getServerSideProps` in Pages Router.

### State Management
`CheckoutContext` uses `useReducer` + `useCallback` to manage:
- Current checkout step (cart → shipping → payment → success)
- Cart data (persists from /shop selection)
- Shipping address (pre-filled on back navigation)
- Payment method
- Placed order

### Form Validation
Zod schema validates all shipping fields:
- Email: RFC-compliant format check
- Phone: `^[6-9]\d{9}$` (Indian mobile)
- PIN Code: exactly 6 digits
- All fields: required with min-length checks

---

## 📦 Mock Data (from assignment brief)

The `/api/cart` route returns:
```json
{
  "cartItems": [
    { "product_id": 101, "product_name": "Bamboo Toothbrush (Pack of 4)", "product_price": 299, "quantity": 2, "image": "..." },
    { "product_id": 102, "product_name": "Reusable Cotton Produce Bags", "product_price": 450, "quantity": 1, "image": "..." }
  ],
  "shipping_fee": 50,
  "discount_applied": 0
}
```

The `/shop` page has all 12 products (IDs 101–112).

---

## ✅ Assignment Requirements Checklist

| Requirement | Status |
|-------------|--------|
| React + Next.js | ✅ Next.js 14 App Router |
| SSR data fetching | ✅ `force-dynamic` Server Component + `fetch` |
| Tailwind CSS styling | ✅ Responsive, clean, modern |
| Context API state management | ✅ `useReducer` + Context |
| Mock API (Next.js API routes) | ✅ `/api/cart` + `/api/orders` |
| Cart screen with product list | ✅ Image, name, price, quantity |
| Subtotal + shipping + grand total | ✅ Calculated dynamically |
| Proceed to Checkout button | ✅ |
| Shipping form: Name, Email, Phone, PIN, City, State | ✅ |
| Form validation (email, 10-digit phone, required) | ✅ Zod + react-hook-form |
| Payment screen with order summary + address | ✅ |
| Simulated Pay button → Order Success | ✅ 1.5s mock API call |
| Responsive (mobile + desktop) | ✅ |
| README with architecture + run instructions | ✅ This file |

---

## 📁 Project Structure

```
ecoyaan-checkout/
├── app/
│   ├── api/
│   │   ├── cart/route.ts          # GET: Returns mock cart (SSR source)
│   │   └── orders/route.ts        # POST: Simulates payment & order
│   ├── shop/page.tsx              # Product browsing page
│   ├── checkout/page.tsx          # SSR checkout flow ⭐
│   ├── layout.tsx                 # Root layout + CheckoutProvider
│   ├── page.tsx                   # Redirects to /shop
│   ├── loading.tsx                # Skeleton loading UI
│   └── error.tsx                  # Error boundary
├── components/
│   ├── checkout/
│   │   ├── ShopPage.tsx           # Product selection + cart drawer
│   │   ├── CheckoutOrchestrator.tsx # Step routing
│   │   ├── CartScreen.tsx         # Step 1: Cart review
│   │   ├── ShippingScreen.tsx     # Step 2: Address form
│   │   ├── PaymentScreen.tsx      # Step 3: Payment
│   │   ├── SuccessScreen.tsx      # Order confirmed
│   │   ├── OrderSummaryPanel.tsx  # Reusable sidebar
│   │   └── StepIndicator.tsx      # Progress stepper
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Select.tsx
├── context/
│   └── CheckoutContext.tsx        # Global state (useReducer)
├── lib/
│   ├── products.ts                # 12 eco products data
│   ├── mock-data.ts               # SSR cart mock (assignment JSON)
│   ├── constants.ts               # States, payment methods
│   ├── validations.ts             # Zod schemas
│   └── utils.ts                   # formatCurrency, calculateCartSummary…
└── types/
    └── index.ts                   # All TypeScript types
```

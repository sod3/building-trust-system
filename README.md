# FacilityOS Arabia

## Local Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` to your MongoDB Atlas connection string. If the URI does not include a database path, add `/building_trust_system` before the query string.
3. Set `MONGODB_DB_NAME=building_trust_system`.
4. Add Moyasar test keys:
   - `VITE_MOYASAR_PUBLISHABLE_KEY` is used by the browser checkout form.
   - `MOYASAR_SECRET_KEY` is used only by backend API routes.
5. Set a long random `JWT_SECRET`.
6. Optionally set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` to seed the first admin account securely.

## Run Locally

```bash
npm install
npm run dev
```

For local testing of Vercel `/api` functions, use Vercel's local runtime:

```bash
npx vercel dev
```

## Payment Flow

1. Select a pricing plan.
2. Checkout calls `/api/checkout/create-order`.
3. The backend validates the plan and creates a pending MongoDB order.
4. Moyasar receives the backend amount in halalas plus `orderId`, `userId`, and `planId` metadata.
5. Moyasar redirects to `/payment-result?id=PAYMENT_ID`.
6. The page calls `/api/verify-payment?id=PAYMENT_ID`.
7. The backend fetches Moyasar with `MOYASAR_SECRET_KEY`, verifies status/currency/amount/order, stores the payment, marks the order paid, and activates a 30-day subscription.

## Vercel Deployment

Add these Environment Variables in Vercel Project Settings:

```env
MONGODB_URI=PUT_FULL_MONGODB_CONNECTION_STRING_HERE
MONGODB_DB_NAME=building_trust_system
VITE_MOYASAR_PUBLISHABLE_KEY=PUT_MOYASAR_PUBLISHABLE_KEY_HERE
MOYASAR_SECRET_KEY=PUT_MOYASAR_SECRET_KEY_HERE
JWT_SECRET=CREATE_A_LONG_RANDOM_SECRET_HERE
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-strong-password
ADMIN_NAME=Platform Admin
```

MongoDB Atlas Network Access must allow Vercel connections. Use test Moyasar keys and test cards first, then replace both Moyasar keys with live keys when ready.

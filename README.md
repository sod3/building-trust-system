# FacilityOS Arabia

## Local Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` to your MongoDB Atlas connection string. If the URI does not include a database path, add `/building_trust_system` before the query string.
3. Set `MONGODB_DB_NAME=building_trust_system`.
4. Add Moyasar test keys:
   - `VITE_MOYASAR_PUBLISHABLE_KEY` is used by the browser checkout form.
   - `MOYASAR_SECRET_KEY` is used only by backend API routes.
   - `MOYASAR_WEBHOOK_SECRET` must match Moyasar's webhook `secret_token`.
5. Set a long random `JWT_SECRET`.
6. Optionally set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` to seed the first admin account securely.

## Run Locally

```bash
npm install
npm run dev
npm run seed
```

For local testing of Vercel `/api` functions, use Vercel's local runtime:

```bash
npx vercel dev
```

## Payment Flow

1. Select a pricing plan.
2. Checkout calls `/api/checkout/initiate`.
3. The backend validates the plan and creates a pending user, organization, subscription, invoice, and order.
4. Moyasar receives the backend amount in halalas plus `orderId`, `invoiceId`, `userId`, `orgId`, and `planId` metadata.
5. Moyasar redirects to `/payment-result?id=PAYMENT_ID`.
6. The page calls `/api/payments/verify?id=PAYMENT_ID`.
7. The backend fetches Moyasar with `MOYASAR_SECRET_KEY`, verifies status/currency/amount/order/invoice metadata, stores the payment, marks records paid, and activates a 30-day subscription.
8. Moyasar webhooks should post to `/api/webhooks/moyasar`; callback and webhook processing is idempotent.

## Recurring Billing

Automatic renewal processing lives at `/api/billing/run-recurring`. Configure your host scheduler to call it daily with:

```bash
Authorization: Bearer $CRON_SECRET
```

The job finds due automatic subscriptions, charges the saved Moyasar token, extends successful subscriptions by 30 days, retries failed renewals, and suspends access after the grace period.

## Vercel Deployment

Add these Environment Variables in Vercel Project Settings:

```env
MONGODB_URI=PUT_FULL_MONGODB_CONNECTION_STRING_HERE
MONGODB_DB_NAME=building_trust_system
VITE_MOYASAR_PUBLISHABLE_KEY=PUT_MOYASAR_PUBLISHABLE_KEY_HERE
MOYASAR_PUBLISHABLE_KEY=PUT_MOYASAR_PUBLISHABLE_KEY_HERE
MOYASAR_SECRET_KEY=PUT_MOYASAR_SECRET_KEY_HERE
MOYASAR_WEBHOOK_SECRET=PUT_MOYASAR_WEBHOOK_SECRET_TOKEN_HERE
JWT_SECRET=CREATE_A_LONG_RANDOM_SECRET_HERE
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-app.example
BACKEND_URL=https://your-app.example
CRON_SECRET=CHANGE_THIS
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-strong-password
ADMIN_NAME=Platform Admin
```

MongoDB Atlas Network Access must allow Vercel connections. Use test Moyasar keys and test cards first, then replace both Moyasar keys with live keys when ready.

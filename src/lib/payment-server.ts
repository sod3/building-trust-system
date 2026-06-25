// =============================================================================
// FacilityOS Arabia — Moyasar Payment Server Functions
// =============================================================================
// These functions run SERVER-SIDE ONLY via TanStack Start's createServerFn.
// The Moyasar SECRET KEY is read from process.env and is NEVER sent to the browser.
//
// How to switch from test to live:
//   1. Replace MOYASAR_SECRET_KEY in .env with your live key (sk_live_...)
//   2. Replace VITE_MOYASAR_PUBLISHABLE_KEY in .env with your live key (pk_live_...)
//   3. Add both in Vercel Dashboard → Project Settings → Environment Variables
//
// How backend verification works:
//   1. Moyasar redirects user to /payment-result?id={paymentId}&status=paid
//   2. Frontend calls verifyPayment(paymentId) — this runs on the server
//   3. Server fetches payment from Moyasar API using the secret key
//   4. Server verifies: status === "paid", currency === "SAR", amount is a valid plan
//   5. Returns structured result — plan is determined by VERIFIED amount, not frontend input
// =============================================================================

import { createServerFn } from "@tanstack/react-start";

// ---------------------------------------------------------------------------
// Allowed plan amounts (in halalas = SAR × 100)
// These must match the prices in pricing.tsx and checkout.tsx exactly.
// ---------------------------------------------------------------------------
const ALLOWED_PLANS: Record<number, string> = {
  29900: "starter",    // SAR 299
  89900: "professional", // SAR 899
  199900: "enterprise",  // SAR 1999
};

// ---------------------------------------------------------------------------
// Moyasar API base URL
// ---------------------------------------------------------------------------
const MOYASAR_API_BASE = "https://api.moyasar.com/v1";

// ---------------------------------------------------------------------------
// verifyPayment — called from /payment-result page
// ---------------------------------------------------------------------------
export const verifyPayment = createServerFn({ method: "GET" })
  .validator((paymentId: string) => paymentId)
  .handler(async ({ data: paymentId }): Promise<PaymentVerificationResult> => {
    // Secret key is read server-side only — NEVER exposed to browser
    const secretKey = process.env.MOYASAR_SECRET_KEY;

    if (!secretKey || secretKey === "PUT_FULL_SECRET_KEY_HERE") {
      console.error("[Moyasar] MOYASAR_SECRET_KEY is not configured in environment variables.");
      return {
        success: false,
        message: "Payment gateway not configured. Please contact support.",
      };
    }

    if (!paymentId || typeof paymentId !== "string") {
      return { success: false, message: "Invalid payment ID." };
    }

    try {
      // Fetch payment details from Moyasar using Basic Auth (secretKey as username, empty password)
      const credentials = Buffer.from(`${secretKey}:`).toString("base64");
      const response = await fetch(`${MOYASAR_API_BASE}/payments/${paymentId}`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("[Moyasar] API error:", response.status, errText);
        return { success: false, message: "Could not fetch payment details from Moyasar." };
      }

      const payment = await response.json() as MoyasarPayment;

      // --- Security checks ---

      // 1. Status must be "paid"
      if (payment.status !== "paid") {
        return {
          success: false,
          message: `Payment status is "${payment.status}". Only confirmed payments are accepted.`,
        };
      }

      // 2. Currency must be SAR
      if (payment.currency !== "SAR") {
        return {
          success: false,
          message: "Invalid payment currency. Only SAR is accepted.",
        };
      }

      // 3. Amount must match a known plan (backend determines plan — not frontend input)
      const plan = ALLOWED_PLANS[payment.amount];
      if (!plan) {
        return {
          success: false,
          message: `Payment amount ${payment.amount} halalas does not match any active plan.`,
        };
      }

      // All checks passed — return success
      return {
        success: true,
        status: payment.status,
        plan,
        amount: payment.amount,
        currency: payment.currency,
        paymentId: payment.id,
      };
    } catch (error) {
      console.error("[Moyasar] Verification error:", error);
      return { success: false, message: "Payment verification failed due to a server error." };
    }
  });

// ---------------------------------------------------------------------------
// logWebhookEvent — receives Moyasar webhook POST events
// ---------------------------------------------------------------------------
export const logWebhookEvent = createServerFn({ method: "POST" })
  .validator((body: unknown) => body)
  .handler(async ({ data: body }) => {
    // TODO (Phase 2 — DB integration):
    //   1. Parse webhook event type (e.g. "payment.paid", "payment.failed")
    //   2. Look up payment ID in your database
    //   3. Mark subscription as active / failed
    //   4. Save paymentId, planId, userId to subscriptions table
    //   5. Send confirmation email to owner
    //   6. Validate webhook signature using Moyasar secret key

    console.log("[Moyasar Webhook] Event received:", JSON.stringify(body, null, 2));

    // Return 200 OK so Moyasar doesn't retry
    return { received: true, timestamp: new Date().toISOString() };
  });

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PaymentVerificationResult =
  | {
      success: true;
      status: string;
      plan: string;
      amount: number;
      currency: string;
      paymentId: string;
    }
  | {
      success: false;
      message: string;
    };

interface MoyasarPayment {
  id: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  created_at: string;
  source: {
    type: string;
    company: string;
    name: string;
    number: string;
  };
}

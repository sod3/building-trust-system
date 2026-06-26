// =============================================================================
// FacilityOS Arabia — Payment Result Page
// =============================================================================
// This page is the callback_url that Moyasar redirects to after payment.
//
// Moyasar appends these query params to the URL:
//   ?id={paymentId}&status={paid|failed|initiated}&message={message}
//
// Flow:
//   1. Page loads → reads id, status, message from URL
//   2. Calls verifyPayment(id) server function (uses MOYASAR_SECRET_KEY server-side)
//   3. Server verifies: status, currency, and amount against allowed plans
//   4. On success: backend activates the account, sets a secure cookie, and shows success UI
//   5. On failure: shows retry UI with link back to checkout
//
//   paymentStatus: "paid"
//   selectedPlan: "{planKey}"
//   paymentId: "{moyasarPaymentId}"
// =============================================================================

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, Building2, ArrowRight, RotateCcw, MessageCircle } from "lucide-react";
import { z } from "zod";
import { apiFetch, storeAuthSession } from "@/lib/api-client";
import type { AuthUser } from "@/lib/auth-context";

const paymentResultSearchSchema = z.object({
  id: z.string().optional(),
  status: z.string().optional(),
  message: z.string().optional(),
  plan: z.string().optional(),
});

export const Route = createFileRoute("/payment-result")({
  validateSearch: (search) => paymentResultSearchSchema.parse(search),
  head: () => ({ meta: [{ title: "Payment Result — FacilityOS Arabia" }] }),
  component: PaymentResult,
});

type VerifyState =
  | { phase: "loading" }
  | { phase: "success"; result: PaymentVerificationSuccess }
  | { phase: "failed"; message: string };

type PaymentVerificationSuccess = {
  success: true;
  token?: string;
  user?: AuthUser;
  status: string;
  plan: string;
  planName?: string;
  amount: number;
  currency: string;
  paymentId: string;
  orderId: string;
};

function PaymentResult() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [state, setState] = useState<VerifyState>({ phase: "loading" });

  const planKey = search.plan || "starter";

  useEffect(() => {
    async function verify() {
      const paymentId = search.id;

      // If Moyasar returned a failed status before we even call our backend
      if (search.status && search.status !== "paid" && search.status !== "initiated") {
        setState({
          phase: "failed",
          message: search.message || "Payment was not completed. Please try again.",
        });
        return;
      }

      if (!paymentId) {
        setState({ phase: "failed", message: "No payment ID found. Please try again." });
        return;
      }

      try {
        // Call server function — verifies payment using MOYASAR_SECRET_KEY (server-side only)
        const result = await apiFetch<PaymentVerificationSuccess>(`/api/verify-payment?id=${encodeURIComponent(paymentId)}`);

        if (result.success) {
          if (result.token && result.user) {
            storeAuthSession(result.user, result.token, true);
          }
          // Store access state in localStorage (temporary — Phase 2 will use DB)
          setState({ phase: "success", result });
        } else {
          setState({ phase: "failed", message: result.message || "Unable to verify payment." });
        }
      } catch (err) {
        console.error("[PaymentResult] Verification error:", err);
        setState({
          phase: "failed",
          message: err instanceof Error
            ? err.message
            : "Unable to verify payment. Please contact support if you were charged.",
        });
      }
    }

    verify();
  }, [search.id, search.status, search.message]);

  return (
    <div className="min-h-screen bg-surface-2 flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-border bg-background/80 backdrop-blur px-6 py-4">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy/10 group-hover:bg-navy/15 transition">
            <Building2 className="h-4 w-4 text-navy" />
          </span>
          <span className="font-display font-semibold text-base tracking-tight text-foreground">FacilityOS</span>
        </Link>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* ===== LOADING STATE ===== */}
          {state.phase === "loading" && (
            <div className="text-center">
              <div className="relative mx-auto mb-8 h-24 w-24">
                <div className="absolute inset-0 rounded-full bg-navy/10 animate-ping" />
                <div className="relative h-24 w-24 rounded-full bg-navy/10 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-navy animate-spin" />
                </div>
              </div>
              <h1 className="font-display text-2xl font-semibold text-foreground mb-3">
                Verifying your payment…
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Please wait while we confirm your payment with Moyasar.<br />
                This usually takes just a few seconds.
              </p>
            </div>
          )}

          {/* ===== SUCCESS STATE ===== */}
          {state.phase === "success" && (
            <div className="text-center">
              {/* Success icon with animation */}
              <div className="relative mx-auto mb-8 h-24 w-24">
                <div className="absolute inset-0 rounded-full bg-emerald-100 scale-150 opacity-40" />
                <div className="absolute inset-0 rounded-full bg-emerald-100" />
                <div className="relative h-24 w-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-12 w-12 text-white" strokeWidth={2.5} />
                </div>
              </div>

              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Payment Successful!
              </h1>
              <p className="text-muted-foreground text-sm mb-8">
                Your{" "}
                <span className="font-semibold text-foreground capitalize">
                  {state.result.plan}
                </span>{" "}
                plan is now active.
              </p>

              {/* Payment summary card */}
              <div className="rounded-2xl border border-border bg-background p-5 text-left mb-8 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-semibold capitalize">{state.result.plan}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-semibold">
                    SAR {(state.result.amount / 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Currency</span>
                  <span className="font-semibold">{state.result.currency}</span>
                </div>
                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-muted-foreground truncate max-w-[200px]">
                    {state.result.paymentId}
                  </span>
                </div>
              </div>

              {/* Access activated notice */}
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 mb-8 text-sm text-emerald-800 text-left">
                <p className="font-semibold mb-1">✓ Owner Dashboard Access Activated</p>
                <p className="text-emerald-700 leading-relaxed">
                  Your account is ready. Head to the owner dashboard to set up your buildings, assign labour, and start managing operations.
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate({ to: "/dashboard/owner" })}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-navy text-white font-semibold text-base hover:bg-navy/90 transition shadow-md mb-3"
              >
                Go to Owner Dashboard
                <ArrowRight className="h-5 w-5" />
              </button>

              <Link
                to="/"
                className="block text-center text-sm text-muted-foreground hover:text-foreground transition"
              >
                Return to home
              </Link>
            </div>
          )}

          {/* ===== FAILED STATE ===== */}
          {state.phase === "failed" && (
            <div className="text-center">
              {/* Failure icon */}
              <div className="relative mx-auto mb-8 h-24 w-24">
                <div className="absolute inset-0 rounded-full bg-red-100 scale-150 opacity-40" />
                <div className="absolute inset-0 rounded-full bg-red-100" />
                <div className="relative h-24 w-24 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                  <XCircle className="h-12 w-12 text-white" strokeWidth={2.5} />
                </div>
              </div>

              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Payment Not Confirmed
              </h1>
              <p className="text-muted-foreground text-sm mb-8">
                We could not verify your payment. No charge has been made to your account.
              </p>

              {/* Error message card */}
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 mb-8 text-sm text-red-800 text-left">
                <p className="font-semibold mb-1">What happened?</p>
                <p className="leading-relaxed">{state.message}</p>
              </div>

              {/* Help note */}
              <div className="rounded-2xl border border-border bg-background p-4 mb-8 text-sm text-muted-foreground text-left">
                <p className="font-semibold text-foreground mb-1">💡 Tips</p>
                <ul className="space-y-1 leading-relaxed">
                  <li>• Check your card details and try again</li>
                  <li>• Make sure your card supports online payments</li>
                  <li>• Try a different card (mada, Visa, or Mastercard)</li>
                  <li>• Contact your bank if the issue persists</li>
                </ul>
              </div>

              {/* Retry CTA */}
              <Link
                to="/checkout"
                search={{ plan: planKey }}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-navy text-white font-semibold text-base hover:bg-navy/90 transition shadow-md mb-3"
              >
                <RotateCcw className="h-5 w-5" />
                Try Again
              </Link>

              <Link
                to="/contact"
                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-border bg-background text-foreground font-medium text-sm hover:bg-secondary transition mb-3"
              >
                <MessageCircle className="h-4 w-4" />
                Contact Support
              </Link>

              <Link
                to="/pricing"
                className="block text-center text-sm text-muted-foreground hover:text-foreground transition"
              >
                ← Back to pricing
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-6 text-center text-xs text-muted-foreground">
        🔒 Secure checkout powered by Moyasar · FacilityOS Arabia
      </footer>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, CheckCircle2, Shield, Lock, CreditCard } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api-client";

const checkoutSearchSchema = z.object({
  plan: z.string().optional(),
});

export const Route = createFileRoute("/checkout")({
  validateSearch: (search) => checkoutSearchSchema.parse(search),
  head: () => ({ meta: [{ title: "Checkout — FacilityOS Arabia" }] }),
  component: Checkout,
});

const planDetails: Record<
  string,
  { name: string; price: number; halalas: number; description: string; features: string[] }
> = {
  starter: {
    name: "Starter",
    price: 299,
    halalas: 29900, // SAR 299 × 100 — Moyasar requires amounts in halalas
    description: "Perfect for single-building owners getting started.",
    features: [
      "1 building",
      "Owner dashboard access",
      "Labour checklist dashboard",
      "Daily reports",
      "Basic report history",
      "Email support",
    ],
  },
  professional: {
    name: "Professional",
    price: 899,
    halalas: 89900, // SAR 899 × 100
    description: "Ideal for multi-building operations and growing portfolios.",
    features: [
      "Up to 5 buildings",
      "Multiple labour accounts",
      "Checklist templates",
      "Today's reports",
      "Full report history",
      "Priority support",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 1999,
    halalas: 199900, // SAR 1999 × 100
    description: "Full-scale solution for large property management operations.",
    features: [
      "Multiple buildings",
      "Custom setup",
      "Multiple user accounts",
      "Advanced report history",
      "Priority support",
      "Dedicated onboarding",
    ],
  },
};

// Extend window type for the Moyasar global loaded from CDN
declare global {
  interface Window {
    Moyasar?: {
      init: (config: MoyasarConfig) => void;
    };
  }
}

interface MoyasarConfig {
  element: HTMLElement;
  amount: number;
  currency: string;
  description: string;
  publishable_api_key: string;
  callback_url: string;
  methods: string[];
  supported_networks: string[];
  metadata?: Record<string, string>;
}

type CheckoutOrder = {
  orderId: string;
  invoiceId: string;
  userId: string;
  orgId: string;
  planId: string;
  planName: string;
  amountHalalas: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
};

function Checkout() {
  const { t } = useLang();
  const { user } = useAuth();
  const search = Route.useSearch();
  const planKey = search.plan && planDetails[search.plan] ? search.plan : "starter";
  const plan = planDetails[planKey];
  const formRef = useRef<HTMLDivElement>(null);
  const [ownerInfo, setOwnerInfo] = useState({
    ownerName: user?.name || "",
    email: user?.email || "",
    phone: "",
    companyName: "",
    password: "",
  });
  const [order, setOrder] = useState<CheckoutOrder | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    if (!order) return;
    const activeOrder = order;

    // cancelled flag — stops stale setTimeout callbacks from firing after unmount
    let cancelled = false;

    const callbackUrl = `${window.location.origin}/payment-result?plan=${activeOrder.planId}`;

    function initMoyasar() {
      if (cancelled) return;

      // Guard 1: the DOM element must exist before calling Moyasar.init
      const el = document.getElementById("moyasar-form");
      if (!el) {
        setTimeout(initMoyasar, 100);
        return;
      }

      // Guard 2: the Moyasar global must be available (script fully loaded)
      if (!window.Moyasar) {
        setTimeout(initMoyasar, 100);
        return;
      }

      // Clear any previous Moyasar form HTML before re-initialising
      el.innerHTML = "";

      window.Moyasar.init({
        // Pass the actual DOM element — avoids "Element: null" errors from selector lookups
        element: el,

        // Amount MUST be in halalas (SAR × 100)
        // SAR 299 → 29900 | SAR 899 → 89900 | SAR 1999 → 199900
        amount: activeOrder.amountHalalas,

        currency: activeOrder.currency,
        description: activeOrder.description,

        // Publishable key — SAFE for frontend (Vite inlines VITE_* env vars at build time)
        // NEVER put MOYASAR_SECRET_KEY here — it lives server-side in payment-server.ts only
        publishable_api_key: import.meta.env.VITE_MOYASAR_PUBLISHABLE_KEY as string,

        // Moyasar redirects here after payment, appending ?id=&status=&message=
        callback_url: callbackUrl,
        metadata: activeOrder.metadata || {
          orderId: activeOrder.orderId,
          order_id: activeOrder.orderId,
          invoiceId: activeOrder.invoiceId,
          invoice_id: activeOrder.invoiceId,
          userId: activeOrder.userId,
          user_id: activeOrder.userId,
          orgId: activeOrder.orgId,
          org_id: activeOrder.orgId,
          planId: activeOrder.planId,
          plan_id: activeOrder.planId,
        },

        // creditcard covers mada, Visa, and Mastercard
        methods: ["creditcard"],

        // Supported card networks for Saudi Arabia launch
        supported_networks: ["mada", "visa", "mastercard"],
      });
    }

    // Load Moyasar JS dynamically — only on the checkout page, not globally.
    // Global loading caused "Element: null" errors on other pages.
    // To switch from test to live: update VITE_MOYASAR_PUBLISHABLE_KEY in .env / Vercel
    const MOYASAR_SRC = "https://cdn.moyasar.com/mpf/1.14.0/moyasar.js";
    const existing = document.querySelector(`script[src="${MOYASAR_SRC}"]`);

    if (existing) {
      // Script already in DOM from a previous visit — Moyasar global may or may not be ready
      initMoyasar();
    } else {
      const script = document.createElement("script");
      script.src = MOYASAR_SRC;
      script.async = true;
      script.onload = () => {
        if (!cancelled) initMoyasar();
      };
      script.onerror = () => console.error("[Moyasar] Failed to load payment script from CDN.");
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true; // stop any pending retry timeouts
      const container = document.getElementById("moyasar-form");
      if (container) container.innerHTML = "";
    };
  }, [order]);

  async function handleCreateOrder(event: React.FormEvent) {
    event.preventDefault();
    setCheckoutError("");
    setIsCreatingOrder(true);

    try {
      const result = await apiFetch<CheckoutOrder>("/api/checkout/initiate", {
        method: "POST",
        body: JSON.stringify({ planId: planKey, ...ownerInfo }),
      });

      setOrder(result);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Could not start checkout.");
    } finally {
      setIsCreatingOrder(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-2 flex flex-col lg:flex-row">
      {/* ===== LEFT PANEL — ORDER SUMMARY ===== */}
      <div className="bg-navy text-primary-foreground p-8 md:p-12 lg:p-16 lg:w-[420px] xl:w-[480px] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2.5 mb-12 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 backdrop-blur border border-white/20 group-hover:bg-white/15 transition">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="font-display font-semibold tracking-tight text-lg">FacilityOS</span>
          </Link>

          {/* Plan badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/20 border border-gold/30 px-3 py-1 text-xs font-semibold text-gold uppercase tracking-widest mb-6">
            {t("checkout.selected_plan", { fallback: "Order Summary" })}
          </div>

          {/* Plan name + price */}
          <div className="pb-7 border-b border-white/10">
            <h2 className="font-display text-3xl font-bold mb-1">{plan.name} Plan</h2>
            <p className="text-white/60 text-sm leading-relaxed">{plan.description}</p>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold">{plan.price.toLocaleString()}</span>
              <span className="text-white/60 text-sm">{t("pricing.sar_mo")}</span>
            </div>
          </div>

          {/* Features list */}
          <ul className="mt-7 space-y-3.5">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/20 border border-gold/30">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
                </span>
                {f}
              </li>
            ))}
          </ul>

          {/* Dashboard access note */}
          <div className="mt-8 rounded-2xl bg-white/8 border border-white/12 p-4 text-sm text-white/70 leading-relaxed">
            <span className="text-gold font-semibold">✓ </span>
            After successful payment, your owner dashboard access will be activated immediately.
          </div>
        </div>

        {/* Footer trust copy */}
        <div className="mt-10 pt-7 border-t border-white/10 text-xs text-white/40 leading-relaxed">
          <p>
            You can cancel your subscription at any time. By continuing, you agree to our Terms of
            Service and Privacy Policy.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} FacilityOS Arabia. All rights reserved.
          </p>
        </div>
      </div>

      {/* ===== RIGHT PANEL — MOYASAR PAYMENT FORM ===== */}
      <div className="flex-1 p-8 md:p-12 lg:p-16 flex items-start justify-center overflow-y-auto bg-background">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold text-foreground tracking-tight">
              Complete Payment
            </h1>
            <p className="mt-2 text-muted-foreground">
              Pay securely using mada, Visa, or Mastercard.
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <Lock className="h-3.5 w-3.5" />
              256-bit SSL Encryption
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <Shield className="h-3.5 w-3.5" />
              PCI DSS Compliant
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-secondary border border-border px-3 py-1.5 text-xs font-semibold text-foreground">
              <CreditCard className="h-3.5 w-3.5" />
              Powered by Moyasar
            </div>
          </div>

          {/* Supported payment methods */}
          <div className="mb-8 rounded-2xl border border-border bg-secondary/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Accepted Payment Methods
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {/* mada */}
              <span className="flex items-center gap-1.5 rounded-xl bg-background border border-border px-3 py-2 text-sm font-bold text-[#0a5c2f]">
                <span className="h-4 w-4 rounded bg-[#0a5c2f] grid place-items-center text-white text-[9px] font-black">
                  m
                </span>
                mada
              </span>
              {/* Visa */}
              <span className="flex items-center gap-1.5 rounded-xl bg-background border border-border px-3 py-2 text-sm font-bold text-[#1a1f71]">
                <span className="font-black italic text-[#1a1f71]">VISA</span>
              </span>
              {/* Mastercard */}
              <span className="flex items-center gap-1.5 rounded-xl bg-background border border-border px-3 py-2 text-sm font-semibold text-foreground">
                <span className="flex">
                  <span className="h-4 w-4 rounded-full bg-[#eb001b] inline-block" />
                  <span className="h-4 w-4 rounded-full bg-[#f79e1b] inline-block -ml-2 opacity-90" />
                </span>
                Mastercard
              </span>
            </div>
          </div>

          <form
            onSubmit={handleCreateOrder}
            className="mb-6 rounded-2xl border border-border bg-secondary/20 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Owner Details
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">
                  Full Name
                </span>
                <input
                  value={ownerInfo.ownerName}
                  onChange={(event) =>
                    setOwnerInfo((current) => ({ ...current, ownerName: event.target.value }))
                  }
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  required
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Phone</span>
                <input
                  value={ownerInfo.phone}
                  onChange={(event) =>
                    setOwnerInfo((current) => ({ ...current, phone: event.target.value }))
                  }
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  placeholder="+966 55 000 0000"
                />
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Email</span>
                <input
                  type="email"
                  value={ownerInfo.email}
                  onChange={(event) =>
                    setOwnerInfo((current) => ({ ...current, email: event.target.value }))
                  }
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  required
                />
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">
                  Company / Building Group
                </span>
                <input
                  value={ownerInfo.companyName}
                  onChange={(event) =>
                    setOwnerInfo((current) => ({ ...current, companyName: event.target.value }))
                  }
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  placeholder="Riyadh Tower Group"
                  required
                />
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">
                  Password
                </span>
                <input
                  type="password"
                  value={ownerInfo.password}
                  onChange={(event) =>
                    setOwnerInfo((current) => ({ ...current, password: event.target.value }))
                  }
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  minLength={8}
                  required
                />
              </label>
            </div>
            {checkoutError && (
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                {checkoutError}
              </div>
            )}
            <button
              type="submit"
              disabled={
                isCreatingOrder ||
                !ownerInfo.ownerName ||
                !ownerInfo.email ||
                !ownerInfo.phone ||
                !ownerInfo.companyName ||
                ownerInfo.password.length < 8
              }
              className="mt-4 h-11 w-full rounded-xl bg-navy text-sm font-semibold text-white transition hover:bg-navy/90 disabled:opacity-60"
            >
              {order
                ? "Refresh Payment Form"
                : isCreatingOrder
                  ? "Preparing Secure Checkout..."
                  : "Prepare Secure Checkout"}
            </button>
          </form>

          {!order && (
            <div className="mb-3 rounded-2xl border border-dashed border-border bg-background p-5 text-center text-sm text-muted-foreground">
              Enter owner details to create a secure order before payment.
            </div>
          )}

          {/* Moyasar injects card fields into this div via Moyasar.init() */}
          <div id="moyasar-form" ref={formRef} className="moyasar-form-wrapper min-h-[200px]" />

          {/* Bottom trust copy */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            🔒 Secure checkout powered by{" "}
            <a
              href="https://moyasar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:underline"
            >
              Moyasar
            </a>{" "}
            — Saudi Arabia's trusted payment gateway
          </p>

          <div className="mt-3 text-center">
            <Link
              to="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              ← Back to pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

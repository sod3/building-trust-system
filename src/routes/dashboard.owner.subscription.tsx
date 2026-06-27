import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  ArrowUpRight,
  Download,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { PageHeader, Card, StatusPill, Btn, Toast, EmptyState } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api-client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/owner/subscription")({
  head: () => ({ meta: [{ title: "Billing & Plan - Owner Dashboard" }] }),
  component: OwnerSubscription,
});

function limitText(value: number | null | undefined) {
  return value === null || value === undefined ? "Unlimited" : value.toLocaleString();
}

function OwnerSubscription() {
  const { t } = useLang();
  const [billing, setBilling] = useState<any | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  }

  function load() {
    apiFetch<any>("/api/billing/subscription")
      .then(setBilling)
      .catch((error) =>
        showToast(error instanceof Error ? error.message : "Could not load billing.", "error"),
      );
    apiFetch<{ plans: any[] }>("/api/plans")
      .then((result) => setPlans(result.plans || []))
      .catch(() => setPlans([]));
  }

  useEffect(load, []);

  async function callBilling(path: string, body?: Record<string, unknown>) {
    try {
      const result = await apiFetch<any>(path, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      });
      showToast(result.message || "Billing request completed.");
      load();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Billing request failed.", "error");
    }
  }

  const subscription = billing?.subscription;
  const plan = billing?.plan;
  const usage = billing?.usage;
  const invoices = billing?.invoices || [];
  const paymentMethod = billing?.paymentMethod;

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Billing & Plan"
        subtitle={t("owner.subscription.subtitle", {
          fallback: "Manage your plan, billing, and payment history.",
        })}
      />

      {subscription?.status === "past_due" && (
        <Card className="border-amber-200 bg-amber-50 text-amber-900">
          <div className="flex items-start gap-3 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4" />
            <span>Payment failed. Please update your card to keep dashboard access active.</span>
          </div>
        </Card>
      )}

      {subscription?.status === "suspended" && (
        <Card className="border-rose-200 bg-rose-50 text-rose-900">
          <div className="flex items-start gap-3 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4" />
            <span>
              Dashboard access is suspended until payment is completed. Billing remains available.
            </span>
          </div>
        </Card>
      )}

      <div className="relative overflow-hidden rounded-3xl bg-navy-gradient p-8 text-white">
        <div className="relative z-10">
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/50">
            {t("owner.subscription.current_plan", { fallback: "Current Plan" })}
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold">
                {plan?.name || subscription?.planName || "Pending plan"}
              </h2>
              <p className="mt-1 text-white/70">
                {plan?.description || "Your subscription will activate after payment verification."}
              </p>
            </div>
            <div className="shrink-0 text-left sm:text-right">
              <div className="font-display text-3xl font-semibold">
                SAR {(subscription?.amountSar || plan?.priceSar || 0).toLocaleString()}
              </div>
              <div className="text-sm text-white/60">
                {t("common.per_month", { fallback: "/month" })}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="Status" value={subscription?.status || "pending"} />
            <Metric
              label="Buildings"
              value={`${usage?.buildingsUsed ?? 0} / ${limitText(usage?.buildingLimit ?? plan?.maxBuildings)}`}
            />
            <Metric
              label="Labour"
              value={`${usage?.labourUsersUsed ?? 0} / ${limitText(usage?.labourLimit ?? plan?.maxLabourUsers)}`}
            />
            <Metric
              label="Next Billing"
              value={
                subscription?.nextBillingDate
                  ? new Date(subscription.nextBillingDate).toLocaleDateString()
                  : "After activation"
              }
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => callBilling("/api/billing/reactivate")}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:bg-white/90"
            >
              <RotateCcw className="h-4 w-4" /> Reactivate
            </button>
            <button
              onClick={() => callBilling("/api/billing/cancel")}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              Cancel at period end
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-display font-semibold">Payment Method</h3>
          {paymentMethod ? (
            <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary">
                <CreditCard className="h-5 w-5 text-navy" />
              </div>
              <div>
                <div className="font-semibold">
                  {paymentMethod.brand || "Card"} ending {paymentMethod.last4 || "----"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Expires {paymentMethod.expiryMonth || "--"}/{paymentMethod.expiryYear || "--"}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={<CreditCard className="h-5 w-5" />}
              title="No saved payment method"
              body="Moyasar tokenized card details will appear after a successful payment."
            />
          )}
        </Card>

        <Card>
          <h3 className="mb-4 font-display font-semibold">Plan Features</h3>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            {(plan?.features || []).map((feature: string) => (
              <div
                key={feature}
                className="flex items-center gap-2.5 rounded-xl bg-secondary px-3 py-2"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                {feature}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 font-display font-semibold">
          {t("owner.subscription.available", { fallback: "Available Plans" })}
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {plans.map((availablePlan) => {
            const current =
              availablePlan.slug === plan?.slug || availablePlan.slug === subscription?.planId;
            const isUpgrade =
              (availablePlan.amountHalalas || 0) > (subscription?.amountHalalas || 0);
            return (
              <div
                key={availablePlan.slug}
                className={`rounded-2xl border-2 p-5 ${current ? "border-accent bg-accent/5" : "border-border"}`}
              >
                <div className="font-display text-lg font-semibold">{availablePlan.name}</div>
                <div className="text-xs text-muted-foreground">{availablePlan.description}</div>
                <div className="mt-3 font-display text-2xl font-semibold">
                  SAR {availablePlan.priceSar.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </div>
                <button
                  onClick={() =>
                    callBilling(isUpgrade ? "/api/billing/upgrade" : "/api/billing/downgrade", {
                      planId: availablePlan.slug,
                    })
                  }
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition ${
                    current
                      ? "cursor-default bg-secondary text-muted-foreground"
                      : "bg-navy text-white hover:bg-navy/90"
                  }`}
                  disabled={current}
                >
                  <ArrowUpRight className="h-4 w-4" />
                  {current
                    ? "Current Plan"
                    : isUpgrade
                      ? `Upgrade to ${availablePlan.name}`
                      : `Downgrade to ${availablePlan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-display font-semibold">
          {t("owner.subscription.history", { fallback: "Payment History" })}
        </h3>
        {invoices.length === 0 ? (
          <EmptyState
            title="No invoices yet"
            body="Invoices will appear after checkout or renewal attempts."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-start text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="pb-3">
                    {t("owner.subscription.invoice", { fallback: "Invoice" })}
                  </th>
                  <th className="pb-3">{t("common.date", { fallback: "Date" })}</th>
                  <th className="pb-3">{t("common.amount", { fallback: "Amount" })}</th>
                  <th className="pb-3">{t("common.status", { fallback: "Status" })}</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((invoice: any) => (
                  <tr key={invoice.invoiceId} className="transition hover:bg-secondary/30">
                    <td className="py-3 font-mono text-xs text-muted-foreground">
                      {invoice.invoiceId}
                    </td>
                    <td className="py-3">
                      {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="py-3 font-semibold">
                      SAR {((invoice.amount || invoice.amountHalalas || 0) / 100).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <StatusPill status={invoice.status} />
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() =>
                          showToast("Invoice export will use the invoice record stored in MongoDB.")
                        }
                        className="flex items-center gap-1.5 text-xs text-accent hover:underline"
                      >
                        <Download className="h-3.5 w-3.5" />{" "}
                        {t("common.download", { fallback: "Download" })}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 px-4 py-3">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-0.5 font-semibold">{value}</div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, Calendar, ArrowUpRight, Download, RotateCcw } from "lucide-react";
import { PageHeader, Card, StatusPill, Btn, Toast } from "@/components/dashboard/ui";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, getAuthToken } from "@/lib/api-client";
import { mockOwners, pricingPlans } from "@/lib/mock-data";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/owner/subscription")({
  head: () => ({ meta: [{ title: "Subscription — Owner Dashboard" }] }),
  component: OwnerSubscription,
});

const mockInvoices = [
  { id: "INV-2026-006", date: "Jun 1, 2026", amount: 899, status: "Paid" },
  { id: "INV-2026-005", date: "May 1, 2026", amount: 899, status: "Paid" },
  { id: "INV-2026-004", date: "Apr 1, 2026", amount: 899, status: "Paid" },
  { id: "INV-2026-003", date: "Mar 1, 2026", amount: 599, status: "Paid" },
];

function OwnerSubscription() {
  const { user } = useAuth();
  const { t } = useLang();
  const owner = mockOwners.find(o => o.id === user?.ownerId) || mockOwners[0];
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [liveSubscription, setLiveSubscription] = useState<any | null>(null);
  const [livePayments, setLivePayments] = useState<any[]>([]);

  useEffect(() => {
    if (!getAuthToken()) return;

    apiFetch<{ subscription: any | null; payments: any[] }>("/api/owner/subscription")
      .then((result) => {
        setLiveSubscription(result.subscription);
        setLivePayments(result.payments || []);
      })
      .catch(() => {
        setLiveSubscription(null);
        setLivePayments([]);
      });
  }, []);

  const planName = liveSubscription?.planName || owner.plan;
  const planStatus = liveSubscription?.status || owner.status;
  const nextBilling = liveSubscription?.currentPeriodEnd
    ? new Date(liveSubscription.currentPeriodEnd).toLocaleDateString()
    : owner.nextBilling;
  const amountSar = liveSubscription?.amountSar || owner.monthlyPayment;
  const currentPlan = pricingPlans.find(p => p.name === planName) || pricingPlans[1];
  const buildingLimit = liveSubscription?.buildingLimit ?? currentPlan.buildings;
  const labourLimit = liveSubscription?.labourLimit ?? currentPlan.labour;
  const invoices = livePayments.length
    ? livePayments.map((payment) => ({
        id: payment.paymentId,
        date: new Date(payment.createdAt).toLocaleDateString(),
        amount: (payment.amountHalalas || 0) / 100,
        status: payment.status === "paid" ? "Paid" : payment.status,
      }))
    : mockInvoices;

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title={t("dashboard.owner.nav.subscription", { fallback: "Subscription" })} subtitle={t("owner.subscription.subtitle", { fallback: "Manage your plan, billing, and payment history." })} />

      {/* Current plan card */}
      <div className="relative overflow-hidden rounded-3xl bg-navy-gradient text-white p-8">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute right-10 bottom-6 h-24 w-24 rounded-full bg-gold/10 blur-xl" />

        <div className="relative z-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">{t("owner.subscription.current_plan", { fallback: "Current Plan" })}</div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold">{planName}</h2>
              <p className="text-white/70 mt-1">{currentPlan.description}</p>
            </div>
            <div className="text-end shrink-0">
              <div className="font-display text-3xl font-semibold">SAR {amountSar.toLocaleString()}</div>
              <div className="text-sm text-white/60">{t("common.per_month", { fallback: "/month" })}</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white/10 px-4 py-3">
              <div className="text-xs text-white/60">{t("common.status", { fallback: "Status" })}</div>
              <div className="font-semibold mt-0.5 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {planStatus}
              </div>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-3">
              <div className="text-xs text-white/60">{t("common.buildings", { fallback: "Buildings" })}</div>
              <div className="font-semibold mt-0.5">{owner.buildingIds.length} / {buildingLimit > 0 && buildingLimit < 999 ? buildingLimit : "∞"}</div>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-3">
              <div className="text-xs text-white/60">{t("owner.subscription.next_billing", { fallback: "Next Billing" })}</div>
              <div className="font-semibold mt-0.5 text-sm">{nextBilling}</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setShowUpgrade(true)}
              className="flex items-center gap-2 rounded-xl bg-white text-navy px-4 py-2 text-sm font-semibold hover:bg-white/90 transition"
            >
              <ArrowUpRight className="h-4 w-4" /> {t("owner.subscription.upgrade", { fallback: "Upgrade Plan" })}
            </button>
            <button
              onClick={() => setToast("Change plan request sent (demo)")}
              className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/20 text-white px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
            >
              <RotateCcw className="h-4 w-4" /> {t("owner.subscription.change", { fallback: "Change Plan" })}
            </button>
          </div>
        </div>
      </div>

      {/* Plan features */}
      <Card>
        <h3 className="font-display font-semibold mb-4">{t("owner.subscription.included", { fallback: "What's included in" })} {planName}</h3>
        <div className="mb-4 grid gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-secondary px-3 py-2">Building limit: <strong>{buildingLimit > 0 && buildingLimit < 999 ? buildingLimit : "Unlimited"}</strong></div>
          <div className="rounded-xl bg-secondary px-3 py-2">Labour limit: <strong>{labourLimit > 0 && labourLimit < 999 ? labourLimit : "Unlimited"}</strong></div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {currentPlan.features.map(f => (
            <div key={f} className="flex items-center gap-2.5 text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              {f}
            </div>
          ))}
        </div>
      </Card>

      {/* Upgrade panel */}
      {showUpgrade && (
        <Card>
          <h3 className="font-display font-semibold mb-4">{t("owner.subscription.available", { fallback: "Available Plans" })}</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {pricingPlans.map(plan => (
              <div
                key={plan.id}
                className={`rounded-2xl border-2 p-5 ${plan.name === planName ? "border-accent bg-accent/5" : "border-border"}`}
              >
                {plan.popular && <div className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-1">{t("admin.earnings.popular", { fallback: "Most Popular" })}</div>}
                <div className="font-display text-lg font-semibold">{plan.name}</div>
                <div className="text-xs text-muted-foreground">{plan.description}</div>
                <div className="mt-3 font-display text-2xl font-semibold">
                  SAR {plan.price.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </div>
                <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  {plan.features.slice(0, 4).map(f => (
                    <li key={f} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => { setShowUpgrade(false); setToast(`Upgrade to ${plan.name} requested (demo)`); }}
                  className={`mt-4 w-full rounded-xl py-2 text-sm font-medium transition ${
                    plan.name === planName
                      ? "bg-secondary text-muted-foreground cursor-default"
                      : "bg-navy text-white hover:bg-navy/90"
                  }`}
                  disabled={plan.name === planName}
                >
                  {plan.name === planName ? t("owner.subscription.current_plan", { fallback: "Current Plan" }) : `${t("owner.subscription.switch_to", { fallback: "Switch to" })} ${plan.name}`}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
            💳 Payment integration coming soon. This is a demo — no real charges will be made.
          </div>
        </Card>
      )}

      {/* Invoice history */}
      <Card>
        <h3 className="font-display font-semibold mb-4">{t("owner.subscription.history", { fallback: "Payment History" })}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-start text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="pb-3">{t("owner.subscription.invoice", { fallback: "Invoice" })}</th>
                <th className="pb-3">{t("common.date", { fallback: "Date" })}</th>
                <th className="pb-3">{t("common.amount", { fallback: "Amount" })}</th>
                <th className="pb-3">{t("common.status", { fallback: "Status" })}</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-secondary/30 transition">
                  <td className="py-3 font-mono text-xs text-muted-foreground">{inv.id}</td>
                  <td className="py-3">{inv.date}</td>
                  <td className="py-3 font-semibold">SAR {inv.amount.toLocaleString()}</td>
                  <td className="py-3"><StatusPill status={inv.status} /></td>
                  <td className="py-3">
                    <button
                      onClick={() => setToast("Invoice downloaded (demo)")}
                      className="flex items-center gap-1.5 text-xs text-accent hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" /> {t("common.download", { fallback: "Download" })}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-elevated">
          {toast}
          <button onClick={() => setToast(null)} className="text-white/70 hover:text-white ml-2">×</button>
        </div>
      )}
    </div>
  );
}

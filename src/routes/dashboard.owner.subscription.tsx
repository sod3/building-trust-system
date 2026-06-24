import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, CreditCard, Calendar, ArrowUpRight, Download, RotateCcw } from "lucide-react";
import { PageHeader, Card, StatusPill, Btn, Toast } from "@/components/dashboard/ui";
import { useAuth } from "@/lib/auth-context";
import { mockOwners, pricingPlans } from "@/lib/mock-data";

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
  const owner = mockOwners.find(o => o.id === user?.ownerId) || mockOwners[0];
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const currentPlan = pricingPlans.find(p => p.name === owner.plan) || pricingPlans[1];

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Subscription" subtitle="Manage your plan, billing, and payment history." />

      {/* Current plan card */}
      <div className="relative overflow-hidden rounded-3xl bg-navy-gradient text-white p-8">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute right-10 bottom-6 h-24 w-24 rounded-full bg-gold/10 blur-xl" />

        <div className="relative z-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">Current Plan</div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold">{owner.plan}</h2>
              <p className="text-white/70 mt-1">{currentPlan.description}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-display text-3xl font-semibold">SAR {owner.monthlyPayment.toLocaleString()}</div>
              <div className="text-sm text-white/60">/month</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white/10 px-4 py-3">
              <div className="text-xs text-white/60">Status</div>
              <div className="font-semibold mt-0.5 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {owner.status}
              </div>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-3">
              <div className="text-xs text-white/60">Buildings</div>
              <div className="font-semibold mt-0.5">{owner.buildingIds.length} / {currentPlan.buildings > 0 ? currentPlan.buildings : "∞"}</div>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-3">
              <div className="text-xs text-white/60">Next Billing</div>
              <div className="font-semibold mt-0.5 text-sm">{owner.nextBilling}</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setShowUpgrade(true)}
              className="flex items-center gap-2 rounded-xl bg-white text-navy px-4 py-2 text-sm font-semibold hover:bg-white/90 transition"
            >
              <ArrowUpRight className="h-4 w-4" /> Upgrade Plan
            </button>
            <button
              onClick={() => setToast("Change plan request sent (demo)")}
              className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/20 text-white px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
            >
              <RotateCcw className="h-4 w-4" /> Change Plan
            </button>
          </div>
        </div>
      </div>

      {/* Plan features */}
      <Card>
        <h3 className="font-display font-semibold mb-4">What's included in {owner.plan}</h3>
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
          <h3 className="font-display font-semibold mb-4">Available Plans</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {pricingPlans.map(plan => (
              <div
                key={plan.id}
                className={`rounded-2xl border-2 p-5 ${plan.name === owner.plan ? "border-accent bg-accent/5" : "border-border"}`}
              >
                {plan.popular && <div className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-1">Most Popular</div>}
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
                    plan.name === owner.plan
                      ? "bg-secondary text-muted-foreground cursor-default"
                      : "bg-navy text-white hover:bg-navy/90"
                  }`}
                  disabled={plan.name === owner.plan}
                >
                  {plan.name === owner.plan ? "Current Plan" : `Switch to ${plan.name}`}
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
        <h3 className="font-display font-semibold mb-4">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="pb-3">Invoice</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockInvoices.map(inv => (
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
                      <Download className="h-3.5 w-3.5" /> Download
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

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Wallet, Users, TrendingUp, AlertTriangle, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Kpi, Card, SectionTitle, StatusPill } from "@/components/dashboard/ui";
import { mockSubscriptions, mockOwners, revenueChart, pricingPlans } from "@/lib/mock-data";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { useLang } from "@/lib/i18n";
import { apiFetch, getAuthToken } from "@/lib/api-client";

export const Route = createFileRoute("/dashboard/admin/earnings")({
  head: () => ({ meta: [{ title: "Earnings — Admin Dashboard" }] }),
  component: AdminEarnings,
});

function AdminEarnings() {
  const { t } = useLang();
  const [earnings, setEarnings] = useState<{
    totalRevenueSar: number;
    monthlyRevenueSar: number;
    activeSubscriptions: number;
    paidOwners: number;
    recentPayments: any[];
  } | null>(null);
  const planColors: Record<string, string> = {
    Starter: "bg-sky-100 text-sky-800",
    Professional: "bg-indigo-100 text-indigo-800",
    Enterprise: "bg-navy/15 text-navy",
  };
  const recentPayments = earnings?.recentPayments?.length
    ? earnings.recentPayments.map((payment) => ({
        id: payment.paymentId,
        owner: payment.owner?.name || "Owner",
        plan: payment.planId ? payment.planId[0].toUpperCase() + payment.planId.slice(1) : "Plan",
        amount: (payment.amountHalalas || 0) / 100,
        date: payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "",
        status: payment.status === "paid" ? "Paid" : payment.status,
      }))
    : mockSubscriptions.recentPayments;

  useEffect(() => {
    if (!getAuthToken()) return;
    apiFetch<{
      totalRevenueSar: number;
      monthlyRevenueSar: number;
      activeSubscriptions: number;
      paidOwners: number;
      recentPayments: any[];
    }>("/api/admin/earnings")
      .then(setEarnings)
      .catch(() => setEarnings(null));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("admin.earnings.subs_rev", { fallback: "Subscriptions & Revenue" })}</div>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">{t("admin.earnings.title", { fallback: "Earnings Dashboard" })}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("admin.earnings.subtitle", { fallback: "Track subscription revenue, plan breakdown, and payment activity." })}</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi accent="navy" label={t("admin.earnings.mrr", { fallback: "Monthly Recurring Revenue" })} value={`SAR ${(earnings?.monthlyRevenueSar ?? mockSubscriptions.totalMRR).toLocaleString()}`} sub={t("admin.earnings.subs", { fallback: "3 subscriptions" })} icon={<Wallet className="h-4 w-4" />} delta={`SAR ${(earnings?.totalRevenueSar ?? mockSubscriptions.totalMRR).toLocaleString()} total`} tone="up" />
        <Kpi accent="emerald" label={t("admin.earnings.active_owners", { fallback: "Active Owners" })} value={earnings?.paidOwners ?? mockSubscriptions.activeOwners} sub={t("admin.earnings.paying", { fallback: "Paying customers" })} icon={<Users className="h-4 w-4" />} />
        <Kpi label={t("admin.earnings.trial_owners", { fallback: "Trial Owners" })} value={mockSubscriptions.trialOwners} icon={<TrendingUp className="h-4 w-4" />} sub={t("admin.earnings.converting", { fallback: "Converting soon" })} />
        <Kpi label={t("admin.earnings.failed", { fallback: "Failed Payments" })} value={mockSubscriptions.failedAlerts.length} icon={<AlertTriangle className="h-4 w-4" />} sub={t("admin.earnings.follow_up", { fallback: "Needs follow-up" })} delta={t("admin.earnings.action", { fallback: "Requires action" })} tone="down" />
      </div>

      {/* Charts + Plans */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle title={t("admin.earnings.trend", { fallback: "Revenue Trend (Last 6 Months)" })} />
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={revenueChart} margin={{ left: -10, right: 4, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f1b3d" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#0f1b3d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                  formatter={(v: unknown) => [`SAR ${(v as number).toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0f1b3d" strokeWidth={2.5} fill="url(#revG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionTitle title={t("admin.earnings.breakdown", { fallback: "Plan Breakdown" })} />
          <div className="space-y-3">
            {pricingPlans.map(plan => {
              const count = plan.id === "starter" ? mockSubscriptions.plans.starter :
                plan.id === "professional" ? mockSubscriptions.plans.professional :
                mockSubscriptions.plans.enterprise;
              const revenue = count * plan.price;
              const pct = Math.round((revenue / mockSubscriptions.totalMRR) * 100);
              return (
                <div key={plan.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${planColors[plan.name]}`}>
                        {plan.name}
                      </span>
                      <span className="text-muted-foreground text-xs">{count} {t("common.owner", { fallback: "owner" })}{count !== 1 ? "s" : ""}</span>
                    </div>
                    <span className="font-semibold">SAR {revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-navy to-brand transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-end text-xs text-muted-foreground">{pct}% of MRR</div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total MRR</span>
              <span className="font-display text-xl font-semibold">SAR {mockSubscriptions.totalMRR.toLocaleString()}</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
              <ArrowUpRight className="h-3 w-3" />
              +SAR 1,999 vs last month
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <SectionTitle title={t("admin.earnings.recent", { fallback: "Recent Payments" })} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-start text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="pb-3">{t("admin.earnings.tx", { fallback: "Transaction ID" })}</th>
                <th className="pb-3">{t("common.owner", { fallback: "Owner" })}</th>
                <th className="pb-3">{t("common.plan", { fallback: "Plan" })}</th>
                <th className="pb-3">{t("common.amount", { fallback: "Amount" })}</th>
                <th className="pb-3">{t("common.date", { fallback: "Date" })}</th>
                <th className="pb-3">{t("common.status", { fallback: "Status" })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentPayments.map(p => (
                <tr key={p.id} className="hover:bg-secondary/30 transition">
                  <td className="py-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                  <td className="py-3 font-medium">{p.owner}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${planColors[p.plan]}`}>{p.plan}</span>
                  </td>
                  <td className="py-3 font-semibold">SAR {p.amount.toLocaleString()}</td>
                  <td className="py-3 text-muted-foreground">{p.date}</td>
                  <td className="py-3"><StatusPill status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Failed Payment Alerts */}
      {mockSubscriptions.failedAlerts.length > 0 && (
        <Card>
          <SectionTitle title={t("admin.earnings.alerts", { fallback: "Failed Payment Alerts" })} action={<span className="text-xs text-rose-600 font-medium">{t("admin.earnings.action", { fallback: "Requires action" })}</span>} />
          <div className="space-y-3">
            {mockSubscriptions.failedAlerts.map((alert, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl bg-rose-50 border border-rose-200 p-4">
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />
                <div className="flex-1">
                  <div className="font-medium text-rose-900 text-sm">{alert.owner}</div>
                  <div className="text-xs text-rose-700">{alert.plan} — SAR {alert.amount} · {alert.date} · {alert.reason}</div>
                </div>
                <button className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 transition">
                  {t("admin.earnings.follow_up_btn", { fallback: "Follow Up" })}
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Pricing reference */}
      <Card>
        <SectionTitle title={t("admin.earnings.pricing", { fallback: "Plan Pricing Reference" })} />
        <div className="grid gap-4 sm:grid-cols-3">
          {pricingPlans.map(plan => (
            <div key={plan.id} className={`rounded-2xl border-2 p-5 ${plan.popular ? "border-accent bg-accent/5" : "border-border"}`}>
              {plan.popular && <span className="text-[11px] font-semibold text-accent uppercase tracking-wider">{t("admin.earnings.popular", { fallback: "Most Popular" })}</span>}
              <div className="mt-1 font-display text-lg font-semibold">{plan.name}</div>
              <div className="text-xs text-muted-foreground">{plan.description}</div>
              <div className="mt-3 font-display text-2xl font-semibold">
                SAR {plan.price.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                {plan.features.slice(0, 3).map(f => (
                  <div key={f} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

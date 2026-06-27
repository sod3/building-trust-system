import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Wallet, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Kpi, Card, SectionTitle, StatusPill, EmptyState } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api-client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/admin/earnings")({
  head: () => ({ meta: [{ title: "Earnings - Admin Dashboard" }] }),
  component: AdminEarnings,
});

function AdminEarnings() {
  const { t } = useLang();
  const [overview, setOverview] = useState<any | null>(null);

  useEffect(() => {
    apiFetch<any>("/api/admin/overview")
      .then(setOverview)
      .catch(() => setOverview(null));
  }, []);

  const metrics = overview?.metrics || {};
  const planDistribution = overview?.planDistribution || [];
  const recentPayments = overview?.recentPayments || [];
  const failedPayments = recentPayments.filter((payment: any) => payment.status !== "paid");
  const totalMrr = planDistribution.reduce(
    (sum: number, plan: any) => sum + (plan.mrrHalalas || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("admin.earnings.subs_rev", { fallback: "Subscriptions & Revenue" })}
        </div>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          {t("admin.earnings.title", { fallback: "Earnings Dashboard" })}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("admin.earnings.subtitle", {
            fallback: "Track subscription revenue, plan breakdown, and payment activity.",
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi
          accent="navy"
          label={t("admin.earnings.mrr", { fallback: "Monthly Recurring Revenue" })}
          value={`SAR ${(metrics.monthlyRecurringRevenueSar || 0).toLocaleString()}`}
          sub={`${metrics.activeSubscriptions || 0} subscriptions`}
          icon={<Wallet className="h-4 w-4" />}
        />
        <Kpi
          accent="emerald"
          label={t("admin.earnings.active_owners", { fallback: "Active Owners" })}
          value={metrics.activeCustomers || 0}
          sub={t("admin.earnings.paying", { fallback: "Paying customers" })}
          icon={<Users className="h-4 w-4" />}
        />
        <Kpi
          label="Paid Invoices"
          value={metrics.paidInvoices || 0}
          icon={<CheckCircle2 className="h-4 w-4" />}
          sub="Verified invoice records"
        />
        <Kpi
          label={t("admin.earnings.failed", { fallback: "Failed Payments" })}
          value={metrics.failedPayments || 0}
          icon={<AlertTriangle className="h-4 w-4" />}
          sub={t("admin.earnings.follow_up", { fallback: "Needs follow-up" })}
          tone={(metrics.failedPayments || 0) > 0 ? "down" : "up"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <SectionTitle title={t("admin.earnings.breakdown", { fallback: "Plan Breakdown" })} />
          {planDistribution.length === 0 ? (
            <EmptyState
              title="No paid plans yet"
              body="Plan distribution appears after subscriptions activate."
            />
          ) : (
            <div className="space-y-4">
              {planDistribution.map((plan: any) => {
                const revenue = (plan.mrrHalalas || 0) / 100;
                const pct = totalMrr ? Math.round(((plan.mrrHalalas || 0) / totalMrr) * 100) : 0;
                return (
                  <div key={plan._id || "unknown"} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold capitalize">{plan._id || "unknown"}</span>
                      <span className="text-muted-foreground">{plan.count} customers</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-navy to-brand"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-end text-xs text-muted-foreground">
                      SAR {revenue.toLocaleString()} MRR
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <SectionTitle title={t("admin.earnings.recent", { fallback: "Recent Payments" })} />
          {recentPayments.length === 0 ? (
            <EmptyState
              title="No payments yet"
              body="Moyasar payments will appear after checkout or renewal charges."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-start text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="pb-3">
                      {t("admin.earnings.tx", { fallback: "Transaction ID" })}
                    </th>
                    <th className="pb-3">{t("common.owner", { fallback: "Owner" })}</th>
                    <th className="pb-3">{t("common.plan", { fallback: "Plan" })}</th>
                    <th className="pb-3">{t("common.amount", { fallback: "Amount" })}</th>
                    <th className="pb-3">{t("common.status", { fallback: "Status" })}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentPayments.map((payment: any) => (
                    <tr
                      key={payment.paymentId || payment.moyasarPaymentId}
                      className="transition hover:bg-secondary/30"
                    >
                      <td className="py-3 font-mono text-xs text-muted-foreground">
                        {payment.paymentId || payment.moyasarPaymentId}
                      </td>
                      <td className="py-3 font-medium">
                        {payment.organization?.name || payment.user?.name || "Customer"}
                      </td>
                      <td className="py-3 capitalize">{payment.planId}</td>
                      <td className="py-3 font-semibold">
                        SAR{" "}
                        {((payment.amountHalalas || payment.amount || 0) / 100).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <StatusPill status={payment.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {failedPayments.length > 0 && (
        <Card>
          <SectionTitle
            title={t("admin.earnings.alerts", { fallback: "Failed Payment Alerts" })}
            action={
              <span className="text-xs font-medium text-rose-600">
                {t("admin.earnings.action", { fallback: "Requires action" })}
              </span>
            }
          />
          <div className="space-y-3">
            {failedPayments.map((payment: any) => (
              <div
                key={payment.paymentId || payment.moyasarPaymentId}
                className="flex items-center gap-4 rounded-xl border border-rose-200 bg-rose-50 p-4"
              >
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-rose-900">
                    {payment.organization?.name || payment.user?.name || "Customer"}
                  </div>
                  <div className="text-xs text-rose-700">
                    {payment.planId} - SAR{" "}
                    {((payment.amountHalalas || payment.amount || 0) / 100).toLocaleString()} -{" "}
                    {payment.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

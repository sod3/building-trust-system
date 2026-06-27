import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  FileBarChart2,
} from "lucide-react";
import { Kpi, Card, SectionTitle, StatusPill, EmptyState } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api-client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/admin/")({
  head: () => ({ meta: [{ title: "Admin Overview - FacilityOS Arabia" }] }),
  component: AdminOverview,
});

function AdminOverview() {
  const { t } = useLang();
  const [overview, setOverview] = useState<any | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<any>("/api/admin/overview")
      .then(setOverview)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Could not load admin overview."),
      );
  }, []);

  if (error) {
    return <Card className="border-rose-200 bg-rose-50 text-sm text-rose-700">{error}</Card>;
  }

  const metrics = overview?.metrics || {};
  const planDistribution = overview?.planDistribution || [];
  const recentPayments = overview?.recentPayments || [];
  const totalMrr = planDistribution.reduce(
    (sum: number, plan: any) => sum + (plan.mrrHalalas || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("dashboard.admin.center", { fallback: "Platform Control Center" })}
        </div>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("dashboard.admin.nav.overview", { fallback: "Admin Overview" })}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real platform metrics from organizations, subscriptions, invoices, payments, buildings,
          labour, and reports.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi
          accent="navy"
          label={t("admin.kpi.revenue", { fallback: "Monthly Revenue" })}
          value={`SAR ${(metrics.monthlyRecurringRevenueSar || 0).toLocaleString()}`}
          sub={`${metrics.activeSubscriptions || 0} active subscriptions`}
          icon={<Wallet className="h-4 w-4" />}
        />
        <Kpi
          accent="teal"
          label="Organizations"
          value={metrics.totalOrganizations || 0}
          sub={`${metrics.activeCustomers || 0} active customers`}
          icon={<Building2 className="h-4 w-4" />}
        />
        <Kpi
          accent="emerald"
          label="Paid Invoices"
          value={metrics.paidInvoices || 0}
          sub="All-time paid invoices"
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <Kpi
          accent="gold"
          label="Failed Payments"
          value={metrics.failedPayments || 0}
          sub="Needs follow-up"
          icon={<AlertTriangle className="h-4 w-4" />}
          tone={(metrics.failedPayments || 0) > 0 ? "down" : "up"}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label={t("admin.kpi.buildings", { fallback: "Total Buildings" })}
          value={metrics.totalBuildings || 0}
          icon={<Building2 className="h-4 w-4" />}
          sub="Across all organizations"
        />
        <Kpi
          label={t("admin.kpi.labour", { fallback: "Total Labour" })}
          value={metrics.totalLabour || 0}
          icon={<Users className="h-4 w-4" />}
          sub="Active labour users"
        />
        <Kpi
          label="Reports Today"
          value={metrics.todayReports || 0}
          icon={<FileBarChart2 className="h-4 w-4" />}
          sub="Submitted daily reports"
        />
        <Kpi
          label="Suspended"
          value={metrics.suspendedAccounts || 0}
          icon={<AlertTriangle className="h-4 w-4" />}
          sub="Organizations without access"
          tone={(metrics.suspendedAccounts || 0) > 0 ? "down" : "up"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <SectionTitle
            title="Plan Distribution"
            action={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
          />
          {planDistribution.length === 0 ? (
            <EmptyState
              title="No subscriptions yet"
              body="Paid subscriptions will appear here after checkout verification."
            />
          ) : (
            <div className="space-y-3">
              {planDistribution.map((plan: any) => {
                const pct = totalMrr ? Math.round(((plan.mrrHalalas || 0) / totalMrr) * 100) : 0;
                return (
                  <div key={plan._id || "unknown"} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium capitalize">{plan._id || "unknown"}</span>
                      <span className="text-muted-foreground">{plan.count} subscriptions</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-navy" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      SAR {((plan.mrrHalalas || 0) / 100).toLocaleString()} MRR
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <SectionTitle title="Recent Payments" />
          {recentPayments.length === 0 ? (
            <EmptyState
              title="No payments yet"
              body="Moyasar payment records will appear here after checkout or renewal."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-start text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3">Organization</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
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
    </div>
  );
}

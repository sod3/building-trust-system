import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Building2, Users, FileBarChart2, Wallet, CheckCircle2,
  Clock, TrendingUp, AlertTriangle, BarChart3,
} from "lucide-react";
import {
  Kpi, Card, SectionTitle, StatusPill, ProgressBar,
} from "@/components/dashboard/ui";
import {
  adminKpis, mockOwners, mockBuildings, mockLabour, mockReports,
  revenueChart, completionChart, mockSubscriptions,
} from "@/lib/mock-data";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { useLang } from "@/lib/i18n";
import { apiFetch, getAuthToken } from "@/lib/api-client";

export const Route = createFileRoute("/dashboard/admin/")({
  head: () => ({ meta: [{ title: "Admin Overview — FacilityOS Arabia" }] }),
  component: AdminOverview,
});

function AdminOverview() {
  const { t } = useLang();
  const [earnings, setEarnings] = useState<{
    monthlyRevenueSar: number;
    activeSubscriptions: number;
    paidOwners: number;
  } | null>(null);
  const todayReports = mockReports.filter(r => r.date === "Jun 24, 2026");
  const recentOwners = mockOwners.slice(0, 3);
  const recentReports = mockReports.slice(0, 5);

  useEffect(() => {
    if (!getAuthToken()) return;
    apiFetch<{ monthlyRevenueSar: number; activeSubscriptions: number; paidOwners: number }>("/api/admin/earnings")
      .then(setEarnings)
      .catch(() => setEarnings(null));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("dashboard.admin.center", { fallback: "Platform Control Center" })}</div>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("dashboard.admin.nav.overview", { fallback: "Admin Overview" })}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("dashboard.admin.desc", { fallback: "Manage owners, buildings, subscriptions, labour activity, and daily verification reports from one place." })}
        </p>
      </div>

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi accent="navy" label={t("admin.kpi.revenue", { fallback: "Monthly Revenue" })} value={`SAR ${(earnings?.monthlyRevenueSar ?? adminKpis.monthlyRevenue).toLocaleString()}`} sub={`${earnings?.activeSubscriptions ?? 3} active subscriptions`} icon={<Wallet className="h-4 w-4" />} delta={t("admin.kpi.revenue.delta", { fallback: "+SAR 1,999 this month" })} tone="up" />
        <Kpi accent="teal" label={t("admin.kpi.buildings", { fallback: "Total Buildings" })} value={adminKpis.totalBuildings} sub={t("admin.kpi.buildings.sub", { fallback: "Across all owners" })} icon={<Building2 className="h-4 w-4" />} delta={t("admin.kpi.buildings.delta", { fallback: "+1 this month" })} tone="up" />
        <Kpi accent="emerald" label={t("admin.kpi.today_submitted", { fallback: "Today Submitted" })} value={adminKpis.todaySubmittedReports} sub={`${adminKpis.pendingReports} ${t("common.pending", { fallback: "pending" })}`} icon={<CheckCircle2 className="h-4 w-4" />} />
        <Kpi accent="gold" label={t("admin.kpi.completion", { fallback: "Completion Rate" })} value={`${adminKpis.completionRate}%`} sub={t("admin.kpi.completion.sub", { fallback: "Platform average today" })} icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label={t("admin.kpi.owners", { fallback: "Total Owners" })} value={earnings?.paidOwners ?? adminKpis.totalOwners} icon={<Users className="h-4 w-4" />} sub={t("admin.kpi.owners.sub", { fallback: "2 active, 1 trial" })} />
        <Kpi label={t("admin.kpi.subs", { fallback: "Active Subscriptions" })} value={earnings?.activeSubscriptions ?? adminKpis.activeSubscriptions} icon={<CheckCircle2 className="h-4 w-4" />} sub={t("admin.kpi.subs.sub", { fallback: "Paying customers" })} />
        <Kpi label={t("admin.kpi.labour", { fallback: "Total Labour" })} value={adminKpis.totalLabour} icon={<Users className="h-4 w-4" />} sub={t("admin.kpi.labour.sub", { fallback: "Across 5 buildings" })} />
        <Kpi label={t("admin.kpi.missed", { fallback: "Missed Reports" })} value={adminKpis.missedReports} icon={<AlertTriangle className="h-4 w-4" />} sub={t("admin.kpi.missed.sub", { fallback: "Today, needs attention" })} delta={t("admin.kpi.missed.delta", { fallback: "1 building unassigned" })} tone="down" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle title={t("admin.chart.revenue", { fallback: "Monthly Revenue (SAR)" })} action={<span className="text-xs text-muted-foreground">{t("admin.chart.last_6", { fallback: "Last 6 months" })}</span>} />
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={revenueChart} margin={{ left: -10, right: 4, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b6fa0" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3b6fa0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={(v: unknown) => [`SAR ${(v as number).toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#3b6fa0" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionTitle title={t("admin.chart.completion", { fallback: "Daily Completion Rate %" })} action={<span className="text-xs text-emerald-600">↑ {t("admin.chart.improving", { fallback: "improving" })}</span>} />
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={completionChart} margin={{ left: -20, right: 4, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="completion" fill="#0e7c66" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Building Status + Today Summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle
            title={t("admin.bstatus.title", { fallback: "Building Status Today" })}
            action={<span className="text-xs text-muted-foreground">{mockBuildings.length} {t("common.buildings", { fallback: "buildings" })}</span>}
          />
          <div className="space-y-3">
            {mockBuildings.map(b => (
              <div key={b.id} className="flex items-center gap-4 rounded-xl border border-border p-3.5 hover:bg-secondary/30 transition">
                <img src={b.cover} alt={b.name} className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.city} · {b.ownerName}</div>
                  <div className="mt-1.5">
                    <ProgressBar value={b.completionToday} color={b.completionToday >= 80 ? "emerald" : b.completionToday >= 50 ? "amber" : "rose"} />
                  </div>
                </div>
                <div className="shrink-0 text-end">
                  <div className="text-sm font-semibold">{b.completionToday}%</div>
                  <div className="text-xs text-muted-foreground">{b.doneTasksToday}/{b.totalTasksToday}</div>
                  <StatusPill status={b.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          {/* Today's Labour Summary */}
          <Card>
            <SectionTitle title={t("admin.labour_activity", { fallback: "Labour Activity Today" })} />
            <div className="space-y-2.5">
              {mockLabour.map(l => (
                <div key={l.id} className="flex items-center gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">
                    {l.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{l.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{l.buildingName}</div>
                  </div>
                  <StatusPill status={l.todayStatus} />
                </div>
              ))}
            </div>
          </Card>

          {/* Subscription summary */}
          <Card>
            <SectionTitle title={t("admin.subs.title", { fallback: "Subscriptions" })} />
            <div className="space-y-2">
              {[
                { label: "Starter (SAR 299)", count: mockSubscriptions.plans.starter, color: "bg-sky-400" },
                { label: "Professional (SAR 899)", count: mockSubscriptions.plans.professional, color: "bg-brand" },
                { label: "Enterprise (SAR 1,999)", count: mockSubscriptions.plans.enterprise, color: "bg-navy" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span className="flex-1 text-muted-foreground text-xs">{item.label}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
              <div className="mt-3 border-t border-border pt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">{t("admin.subs.mrr", { fallback: "Total MRR" })}</span>
                <span className="font-display text-base font-semibold text-foreground">SAR {mockSubscriptions.totalMRR.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Reports */}
      <Card>
        <SectionTitle
          title={t("admin.recent.reports", { fallback: "Recent Daily Reports" })}
          action={<a href="/dashboard/admin/reports" className="text-xs text-accent hover:underline">{t("common.view_all", { fallback: "View all" })}</a>}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-start text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="pb-2">{t("common.building", { fallback: "Building" })}</th>
                <th className="pb-2">{t("common.labour", { fallback: "Labour" })}</th>
                <th className="pb-2">{t("common.owner", { fallback: "Owner" })}</th>
                <th className="pb-2">{t("common.tasks", { fallback: "Tasks" })}</th>
                <th className="pb-2">{t("common.submitted", { fallback: "Submitted" })}</th>
                <th className="pb-2">{t("common.status", { fallback: "Status" })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentReports.map(r => (
                <tr key={r.id} className="hover:bg-secondary/30 transition">
                  <td className="py-3 font-medium">{r.buildingName}</td>
                  <td className="py-3 text-muted-foreground">{r.labourName}</td>
                  <td className="py-3 text-muted-foreground">{r.ownerName}</td>
                  <td className="py-3 text-muted-foreground">{r.completedTasks}/{r.totalTasks}</td>
                  <td className="py-3 text-muted-foreground text-xs">{r.submittedAt}</td>
                  <td className="py-3"><StatusPill status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Owners */}
      <Card>
        <SectionTitle title={t("admin.recent.owners", { fallback: "Active Owners" })} action={<a href="/dashboard/admin/owners" className="text-xs text-accent hover:underline">{t("common.view_all", { fallback: "View all" })}</a>} />
        <div className="grid gap-4 sm:grid-cols-3">
          {recentOwners.map(o => (
            <div key={o.id} className="rounded-xl border border-border p-4 hover:bg-secondary/20 transition">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-sm">{o.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{o.email}</div>
                </div>
                <StatusPill status={o.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-secondary px-2 py-1.5">
                  <div className="text-muted-foreground">{t("common.plan", { fallback: "Plan" })}</div>
                  <div className="font-semibold">{t(`pricing.plan.${o.plan.toLowerCase()}`, { fallback: o.plan })}</div>
                </div>
                <div className="rounded-lg bg-secondary px-2 py-1.5">
                  <div className="text-muted-foreground">{t("common.buildings", { fallback: "Buildings" })}</div>
                  <div className="font-semibold">{o.buildingIds.length}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

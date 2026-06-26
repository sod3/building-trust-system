import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, Users, CheckCircle2, Clock, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { Kpi, Card, SectionTitle, StatusPill, ProgressBar, AlertBanner, EmptyState } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api-client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/owner/")({
  head: () => ({ meta: [{ title: "Owner Overview - FacilityOS Arabia" }] }),
  component: OwnerOverview,
});

type OwnerDashboard = {
  organization: any;
  subscription: any;
  plan: any;
  usage: any;
  kpis: any;
  buildings: any[];
  labour: any[];
  todayReports: any[];
};

function formatLimit(value: number | null | undefined) {
  return value === null || value === undefined ? "Unlimited" : value.toLocaleString();
}

function OwnerOverview() {
  const { t } = useLang();
  const [dashboard, setDashboard] = useState<OwnerDashboard | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiFetch<OwnerDashboard>("/api/owner/overview")
      .then((result) => {
        if (!cancelled) setDashboard(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load dashboard.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading your live dashboard...</div>;
  }

  if (error) {
    return (
      <Card>
        <EmptyState icon={<AlertTriangle className="h-6 w-6" />} title="Dashboard unavailable" body={error} />
      </Card>
    );
  }

  if (!dashboard) return null;

  const { organization, subscription, plan, usage, kpis, buildings, labour, todayReports } = dashboard;
  const hasPlanLimitWarning =
    (usage.buildingLimit !== null && usage.buildingsUsed >= usage.buildingLimit) ||
    (usage.labourLimit !== null && usage.labourUsersUsed >= usage.labourLimit);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("dashboard.owner.hub", { fallback: "Your Building Operations Hub" })}</div>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {organization?.name || "FacilityOS"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live dashboard data from your organization, subscription, buildings, labour, and reports.
        </p>
      </div>

      {subscription?.status === "past_due" && (
        <AlertBanner
          message="Payment failed. Please update your card to keep dashboard access active."
          type="warning"
        />
      )}

      {hasPlanLimitWarning && (
        <AlertBanner
          message={plan?.slug === "starter"
            ? "Your Starter plan includes 1 building and 1 labour account. Upgrade to Professional for more capacity."
            : "You are near a plan limit. Upgrade to unlock more buildings, labour accounts, and reporting features."}
          type="warning"
        />
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Kpi accent="navy" label={t("dashboard.owner.nav.buildings", { fallback: "My Buildings" })} value={usage.buildingsUsed} sub={`${plan?.name || "Plan"}: ${formatLimit(usage.buildingLimit)}`} icon={<Building2 className="h-4 w-4" />} />
        <Kpi accent="emerald" label={t("owner.overview.tasks_done", { fallback: "Tasks Completed Today" })} value={kpis.tasksCompletedToday} sub={`${t("common.of", { fallback: "of" })} ${kpis.tasksTotalToday} ${t("common.total", { fallback: "total" })}`} icon={<CheckCircle2 className="h-4 w-4" />} />
        <Kpi accent="gold" label={t("owner.overview.completion", { fallback: "Today Completion" })} value={`${kpis.completionRate}%`} sub={t("owner.overview.across_buildings", { fallback: "Across all buildings" })} icon={<TrendingUp className="h-4 w-4" />} />
        <Kpi label={t("owner.overview.active_labour", { fallback: "Active Labour" })} value={usage.labourUsersUsed} icon={<Users className="h-4 w-4" />} sub={`Limit: ${formatLimit(usage.labourLimit)}`} />
        <Kpi label={t("owner.overview.pending_tasks", { fallback: "Pending Tasks" })} value={kpis.pendingTasks} icon={<Clock className="h-4 w-4" />} sub={t("owner.overview.across_buildings", { fallback: "Across all buildings" })} tone={kpis.pendingTasks > 0 ? "down" : "up"} />
        <Kpi label="Next Billing" value={subscription?.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString() : "Pending"} sub={subscription?.status || "pending"} icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <Card>
        <SectionTitle
          title={t("owner.overview.building_status", { fallback: "Building Status" })}
          action={<Link to="/dashboard/owner/buildings" className="text-xs text-accent hover:underline flex items-center gap-1">{t("common.view_all", { fallback: "View all" })} <ArrowRight className="h-3 w-3" /></Link>}
        />
        {buildings.length === 0 ? (
          <EmptyState icon={<Building2 className="h-6 w-6" />} title="No buildings yet" body="Add your first building to start tracking daily work." />
        ) : (
          <div className="space-y-3">
            {buildings.slice(0, 5).map((building) => (
              <div key={building.id} className="flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-secondary/30 transition">
                <img src={building.cover} alt={building.name} className="h-14 w-20 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm">{building.name}</div>
                  <div className="text-xs text-muted-foreground">{building.city || building.address || "No location set"}</div>
                  <div className="mt-2">
                    <ProgressBar
                      value={building.doneTasksToday}
                      max={building.totalTasksToday || 1}
                      color={building.completionToday >= 80 ? "emerald" : building.completionToday >= 50 ? "amber" : "rose"}
                    />
                  </div>
                </div>
                <div className="shrink-0 text-end space-y-1">
                  <div className="font-display text-lg font-semibold">{building.completionToday}%</div>
                  <div className="text-xs text-muted-foreground">{building.doneTasksToday}/{building.totalTasksToday} {t("common.tasks", { fallback: "tasks" })}</div>
                  <StatusPill status={building.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle
            title={t("owner.overview.labour_activity", { fallback: "Labour Activity" })}
            action={<Link to="/dashboard/owner/labour" className="text-xs text-accent hover:underline flex items-center gap-1">{t("common.manage", { fallback: "Manage" })} <ArrowRight className="h-3 w-3" /></Link>}
          />
          {labour.length === 0 ? (
            <EmptyState icon={<Users className="h-6 w-6" />} title="No labour accounts" body="Create a labour login and assign it to a building." />
          ) : (
            <div className="space-y-3">
              {labour.slice(0, 5).map((worker) => (
                <div key={worker.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy/10 text-sm font-bold text-navy">
                    {worker.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm">{worker.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{worker.buildingName}</div>
                  </div>
                  <div className="shrink-0 text-end">
                    <StatusPill status={worker.todayStatus} />
                    <div className="mt-1 text-xs text-muted-foreground">{worker.completedTasksToday}/{worker.totalTasksToday}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle
            title={t("dashboard.owner.nav.reports", { fallback: "Today's Reports" })}
            action={<Link to="/dashboard/owner/reports" className="text-xs text-accent hover:underline flex items-center gap-1">{t("common.view_all", { fallback: "View all" })} <ArrowRight className="h-3 w-3" /></Link>}
          />
          {todayReports.length === 0 ? (
            <EmptyState icon={<Clock className="h-6 w-6" />} title="No reports today" body="Submitted labour reports will appear here immediately." />
          ) : (
            <div className="space-y-3">
              {todayReports.slice(0, 5).map((report) => (
                <div key={report.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-sm">{report.buildingName}</div>
                    <StatusPill status={report.status} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{report.labourName} - {new Date(report.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                  <div className="mt-2">
                    <ProgressBar value={report.completedTasks} max={report.totalTasks || 1} color={report.completedTasks === report.totalTasks ? "emerald" : "amber"} />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{report.completedTasks}/{report.totalTasks} {t("common.tasks", { fallback: "tasks" })}</span>
                    {report.pendingTasks > 0 && <span className="text-amber-600 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{report.pendingTasks} {t("common.pending", { fallback: "pending" })}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

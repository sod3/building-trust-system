import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Users, CheckCircle2, Clock, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { Kpi, Card, SectionTitle, StatusPill, ProgressBar, AlertBanner } from "@/components/dashboard/ui";
import { useAuth } from "@/lib/auth-context";
import { mockOwners, mockBuildings, mockLabour, mockReports } from "@/lib/mock-data";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/owner/")({
  head: () => ({ meta: [{ title: "Owner Overview — FacilityOS Arabia" }] }),
  component: OwnerOverview,
});

function OwnerOverview() {
  const { user } = useAuth();
  const { t } = useLang();
  const owner = mockOwners.find(o => o.id === user?.ownerId) || mockOwners[0];

  // Filter data to this owner only
  const myBuildings = mockBuildings.filter(b => owner.buildingIds.includes(b.id));
  const myLabour = mockLabour.filter(l => l.ownerId === owner.id);
  const todayReports = mockReports.filter(r => r.ownerId === owner.id && r.date === "Jun 24, 2026");

  const tasksCompletedToday = myBuildings.reduce((sum, b) => sum + b.doneTasksToday, 0);
  const tasksTotalToday = myBuildings.reduce((sum, b) => sum + b.totalTasksToday, 0);
  const completionRate = tasksTotalToday > 0 ? Math.round((tasksCompletedToday / tasksTotalToday) * 100) : 0;
  const pendingCount = tasksTotalToday - tasksCompletedToday;
  const lastReport = todayReports.find(r => r.submittedAt !== "—")?.submittedAt || "No reports yet";

  const hasAlerts = myBuildings.some(b => b.status === "Attention Needed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("dashboard.owner.hub", { fallback: "Your Building Operations Hub" })}</div>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("dashboard.owner.gm", { fallback: "Good morning," })} {owner.name.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("owner.overview.desc", { fallback: "Assign daily work, track labour activity, and receive proof that your building tasks are completed." })}
        </p>
      </div>

      {/* Alerts */}
      {hasAlerts && (
        <AlertBanner
          message={t("owner.overview.alert", { fallback: "One or more buildings need attention. Check building status for details." })}
          type="warning"
        />
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Kpi accent="navy" label={t("dashboard.owner.nav.buildings", { fallback: "My Buildings" })} value={myBuildings.length} sub={`${owner.plan} ${t("common.plan", { fallback: "Plan" })}`} icon={<Building2 className="h-4 w-4" />} />
        <Kpi accent="emerald" label={t("owner.overview.tasks_done", { fallback: "Tasks Completed Today" })} value={tasksCompletedToday} sub={`${t("common.of", { fallback: "of" })} ${tasksTotalToday} ${t("common.total", { fallback: "total" })}`} icon={<CheckCircle2 className="h-4 w-4" />} />
        <Kpi accent="gold" label={t("owner.overview.completion", { fallback: "Today Completion" })} value={`${completionRate}%`} sub={t("owner.overview.across_buildings", { fallback: "Across all buildings" })} icon={<TrendingUp className="h-4 w-4" />} />
        <Kpi label={t("owner.overview.active_labour", { fallback: "Active Labour" })} value={myLabour.length} icon={<Users className="h-4 w-4" />} sub={t("owner.overview.assigned_to", { fallback: "Assigned to your buildings" })} />
        <Kpi label={t("owner.overview.pending_tasks", { fallback: "Pending Tasks" })} value={pendingCount} icon={<Clock className="h-4 w-4" />} sub={t("owner.overview.across_buildings", { fallback: "Across all buildings" })} delta={pendingCount > 0 ? `${pendingCount} ${t("common.remaining", { fallback: "remaining" })}` : t("common.all_done", { fallback: "All done!" })} tone={pendingCount > 0 ? "down" : "up"} />
        <Kpi label={t("owner.overview.last_report", { fallback: "Last Report" })} value={lastReport} sub={t("owner.overview.recent_sub", { fallback: "Most recent submission" })} icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      {/* Building Status Cards */}
      <Card>
        <SectionTitle
          title={t("owner.overview.building_status", { fallback: "Building Status" })}
          action={<Link to="/dashboard/owner/buildings" className="text-xs text-accent hover:underline flex items-center gap-1">{t("common.view_all", { fallback: "View all" })} <ArrowRight className="h-3 w-3" /></Link>}
        />
        <div className="space-y-3">
          {myBuildings.map(b => (
            <div key={b.id} className="flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-secondary/30 transition">
              <img src={b.cover} alt={b.name} className="h-14 w-20 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm">{b.name}</div>
                <div className="text-xs text-muted-foreground">{b.city}</div>
                <div className="mt-2">
                  <ProgressBar
                    value={b.doneTasksToday}
                    max={b.totalTasksToday}
                    color={b.completionToday >= 80 ? "emerald" : b.completionToday >= 50 ? "amber" : "rose"}
                  />
                </div>
              </div>
              <div className="shrink-0 text-end space-y-1">
                <div className="font-display text-lg font-semibold">{b.completionToday}%</div>
                <div className="text-xs text-muted-foreground">{b.doneTasksToday}/{b.totalTasksToday} {t("common.tasks", { fallback: "tasks" })}</div>
                <StatusPill status={b.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Labour Activity + Today's Reports */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle
            title={t("owner.overview.labour_activity", { fallback: "Labour Activity" })}
            action={<Link to="/dashboard/owner/labour" className="text-xs text-accent hover:underline flex items-center gap-1">{t("common.manage", { fallback: "Manage" })} <ArrowRight className="h-3 w-3" /></Link>}
          />
          <div className="space-y-3">
            {myLabour.map(l => (
              <div key={l.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy/10 text-sm font-bold text-navy">
                  {l.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm">{l.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{l.buildingName}</div>
                </div>
                <div className="shrink-0 text-end">
                  <StatusPill status={l.todayStatus} />
                  <div className="mt-1 text-xs text-muted-foreground">{l.completedTasksToday}/{l.totalTasksToday}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle
            title={t("dashboard.owner.nav.reports", { fallback: "Today's Reports" })}
            action={<Link to="/dashboard/owner/reports" className="text-xs text-accent hover:underline flex items-center gap-1">{t("common.view_all", { fallback: "View all" })} <ArrowRight className="h-3 w-3" /></Link>}
          />
          {todayReports.length === 0 ? (
            <div className="py-10 text-center">
              <Clock className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">{t("owner.overview.no_reports", { fallback: "No reports submitted yet today." })}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayReports.map(r => (
                <div key={r.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-sm">{r.buildingName}</div>
                    <StatusPill status={r.status} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{r.labourName} · {r.submittedAt}</div>
                  <div className="mt-2">
                    <ProgressBar value={r.completedTasks} max={r.totalTasks} color={r.completedTasks === r.totalTasks ? "emerald" : "amber"} />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{r.completedTasks}/{r.totalTasks} {t("common.tasks", { fallback: "tasks" })}</span>
                    {r.pendingTasks > 0 && <span className="text-amber-600 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{r.pendingTasks} {t("common.pending", { fallback: "pending" })}</span>}
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

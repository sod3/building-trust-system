import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Card, StatusPill, ProgressBar } from "@/components/dashboard/ui";
import { useAuth } from "@/lib/auth-context";
import { mockOwners, mockReports, mockBuildings, mockLabour } from "@/lib/mock-data";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/owner/history")({
  head: () => ({ meta: [{ title: "Report History — Owner Dashboard" }] }),
  component: OwnerHistory,
});

function OwnerHistory() {
  const { user } = useAuth();
  const { t } = useLang();
  const owner = mockOwners.find(o => o.id === user?.ownerId) || mockOwners[0];
  const myBuildings = mockBuildings.filter(b => owner.buildingIds.includes(b.id));
  const allReports = mockReports.filter(r => r.ownerId === owner.id);

  const [filterBuilding, setFilterBuilding] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = allReports.filter(r => {
    const matchB = filterBuilding === "All" || r.buildingId === filterBuilding;
    const matchS = filterStatus === "All" || r.status === filterStatus;
    return matchB && matchS;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.owner.nav.history", { fallback: "Report History" })}
        subtitle={t("owner.history.subtitle", { fallback: "All past daily reports from your buildings and labour." })}
      />

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">{t("common.building", { fallback: "Building" })}</label>
            <select
              value={filterBuilding}
              onChange={e => setFilterBuilding(e.target.value)}
              className="h-9 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent transition"
            >
              <option value="All">{t("owner.history.all_buildings", { fallback: "All Buildings" })}</option>
              {myBuildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">{t("common.status", { fallback: "Status" })}</label>
            <div className="flex items-center gap-2">
              {["All", "Submitted", "Approved", "Pending", "Missed"].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${filterStatus === s ? "bg-navy text-white" : "border border-border text-muted-foreground hover:bg-secondary"}`}
                >
                  {s === "All" ? t("common.all", { fallback: "All" }) : t(`owner.reports.${s.toLowerCase()}`, { fallback: s })}
                </button>
              ))}
            </div>
          </div>
          <div className="ml-auto text-xs text-muted-foreground self-end pb-0.5">{filtered.length} {t("common.records", { fallback: "records" })}</div>
        </div>
      </Card>

      {/* Table */}
      {filtered.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-muted-foreground">
            {t("owner.history.no_match", { fallback: "No reports match your filters." })}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-start text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="pb-3">{t("common.date", { fallback: "Date" })}</th>
                  <th className="pb-3">{t("common.building", { fallback: "Building" })}</th>
                  <th className="pb-3">{t("dashboard.owner.nav.labour", { fallback: "Labour" })}</th>
                  <th className="pb-3">{t("common.tasks", { fallback: "Tasks" })}</th>
                  <th className="pb-3">{t("owner.reports.task_completion", { fallback: "Completion" })}</th>
                  <th className="pb-3">{t("owner.reports.submitted_at", { fallback: "Submitted At" })}</th>
                  <th className="pb-3">{t("common.status", { fallback: "Status" })}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-secondary/30 transition">
                    <td className="py-3 text-xs text-muted-foreground whitespace-nowrap">{r.date}</td>
                    <td className="py-3 font-medium">{r.buildingName}</td>
                    <td className="py-3 text-muted-foreground">{r.labourName}</td>
                    <td className="py-3">
                      <span className="text-emerald-700 font-semibold">{r.completedTasks}</span>
                      <span className="text-muted-foreground">/{r.totalTasks}</span>
                    </td>
                    <td className="py-3 min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <ProgressBar
                            value={r.completedTasks}
                            max={r.totalTasks}
                            color={r.completedTasks === r.totalTasks ? "emerald" : r.completedTasks > 0 ? "amber" : "rose"}
                          />
                        </div>
                        <span className="text-xs font-medium">{Math.round((r.completedTasks / r.totalTasks) * 100)}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-muted-foreground whitespace-nowrap">{r.submittedAt}</td>
                    <td className="py-3"><StatusPill status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, Card, StatusPill, ProgressBar, EmptyState } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api-client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/owner/history")({
  head: () => ({ meta: [{ title: "Report History - Owner Dashboard" }] }),
  component: OwnerHistory,
});

function OwnerHistory() {
  const { t } = useLang();
  const [reports, setReports] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [filterBuilding, setFilterBuilding] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    apiFetch<{ reports: any[] }>("/api/daily-reports/history")
      .then((result) => setReports(result.reports || []))
      .catch(() => setReports([]));
    apiFetch<{ buildings: any[] }>("/api/buildings")
      .then((result) => setBuildings(result.buildings || []))
      .catch(() => setBuildings([]));
  }, []);

  const filtered = reports.filter((report) => {
    const matchBuilding = filterBuilding === "All" || report.buildingId === filterBuilding;
    const matchStatus = filterStatus === "All" || report.status === filterStatus;
    return matchBuilding && matchStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.owner.nav.history", { fallback: "Report History" })}
        subtitle={t("owner.history.subtitle", {
          fallback: "All past daily reports from your buildings and labour.",
        })}
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">
              {t("common.building", { fallback: "Building" })}
            </label>
            <select
              value={filterBuilding}
              onChange={(event) => setFilterBuilding(event.target.value)}
              className="h-9 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
            >
              <option value="All">
                {t("owner.history.all_buildings", { fallback: "All Buildings" })}
              </option>
              {buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">
              {t("common.status", { fallback: "Status" })}
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {["All", "Submitted", "Approved", "Pending", "Missed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${filterStatus === status ? "bg-navy text-white" : "border border-border text-muted-foreground hover:bg-secondary"}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className="ml-auto self-end pb-0.5 text-xs text-muted-foreground">
            {filtered.length} {t("common.records", { fallback: "records" })}
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            title={t("owner.history.no_match", { fallback: "No reports match your filters." })}
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-start text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="pb-3">{t("common.date", { fallback: "Date" })}</th>
                  <th className="pb-3">{t("common.building", { fallback: "Building" })}</th>
                  <th className="pb-3">
                    {t("dashboard.owner.nav.labour", { fallback: "Labour" })}
                  </th>
                  <th className="pb-3">{t("common.tasks", { fallback: "Tasks" })}</th>
                  <th className="pb-3">
                    {t("owner.reports.task_completion", { fallback: "Completion" })}
                  </th>
                  <th className="pb-3">
                    {t("owner.reports.submitted_at", { fallback: "Submitted At" })}
                  </th>
                  <th className="pb-3">{t("common.status", { fallback: "Status" })}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((report) => (
                  <tr key={report.id} className="transition hover:bg-secondary/30">
                    <td className="whitespace-nowrap py-3 text-xs text-muted-foreground">
                      {report.date}
                    </td>
                    <td className="py-3 font-medium">{report.buildingName}</td>
                    <td className="py-3 text-muted-foreground">{report.labourName}</td>
                    <td className="py-3">
                      <span className="font-semibold text-emerald-700">
                        {report.completedTasks}
                      </span>
                      <span className="text-muted-foreground">/{report.totalTasks}</span>
                    </td>
                    <td className="min-w-[120px] py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <ProgressBar
                            value={report.completedTasks}
                            max={report.totalTasks || 1}
                            color={
                              report.completedTasks === report.totalTasks
                                ? "emerald"
                                : report.completedTasks > 0
                                  ? "amber"
                                  : "rose"
                            }
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {report.totalTasks
                            ? Math.round((report.completedTasks / report.totalTasks) * 100)
                            : 0}
                          %
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-3 text-xs text-muted-foreground">
                      {report.submittedAt ? new Date(report.submittedAt).toLocaleString() : "-"}
                    </td>
                    <td className="py-3">
                      <StatusPill status={report.status} />
                    </td>
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

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { PageHeader, Card, StatusPill, ProgressBar, EmptyState } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api-client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/admin/reports")({
  head: () => ({ meta: [{ title: "Reports - Admin Dashboard" }] }),
  component: AdminReports,
});

function AdminReports() {
  const { t } = useLang();
  const [reports, setReports] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    apiFetch<{ reports: any[] }>("/api/daily-reports/history")
      .then((result) => setReports(result.reports || []))
      .catch(() => setReports([]));
  }, []);

  const filtered = reports.filter((report) => {
    const haystack = [report.buildingName, report.labourName, report.date, report.status]
      .join(" ")
      .toLowerCase();
    return (
      haystack.includes(search.toLowerCase()) && (status === "All" || report.status === status)
    );
  });

  const counts = {
    total: reports.length,
    submitted: reports.filter(
      (report) => report.status === "Submitted" || report.status === "Approved",
    ).length,
    pending: reports.filter((report) => report.status === "Pending").length,
    missed: reports.filter((report) => report.status === "Missed").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.admin.nav.reports", { fallback: "Reports" })}
        subtitle="All submitted daily reports across the platform."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: t("admin.reports.total", { fallback: "Total Reports" }),
            value: counts.total,
            icon: <CheckCircle2 className="h-4 w-4" />,
            color: "bg-sky-50 text-sky-700",
          },
          {
            label: t("admin.reports.submitted", { fallback: "Submitted" }),
            value: counts.submitted,
            icon: <CheckCircle2 className="h-4 w-4" />,
            color: "bg-emerald-50 text-emerald-700",
          },
          {
            label: t("admin.reports.pending", { fallback: "Pending" }),
            value: counts.pending,
            icon: <Clock className="h-4 w-4" />,
            color: "bg-amber-50 text-amber-700",
          },
          {
            label: t("admin.reports.missed", { fallback: "Missed" }),
            value: counts.missed,
            icon: <AlertTriangle className="h-4 w-4" />,
            color: "bg-rose-50 text-rose-700",
          },
        ].map((item) => (
          <div key={item.label} className={`flex items-center gap-3 rounded-2xl p-4 ${item.color}`}>
            {item.icon}
            <div>
              <div className="font-display text-2xl font-semibold">{item.value}</div>
              <div className="text-xs font-medium">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-48 flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search reports..."
              className="h-9 w-full rounded-xl border border-border bg-background px-9 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div className="flex gap-2">
            {["All", "Submitted", "Pending", "Missed"].map((item) => (
              <button
                key={item}
                onClick={() => setStatus(item)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${status === item ? "bg-navy text-white" : "border border-border text-muted-foreground hover:bg-secondary"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            title="No reports found"
            body="Reports will appear after labour users submit daily checklists."
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-start text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Building</th>
                  <th className="pb-3">Labour</th>
                  <th className="pb-3">Tasks</th>
                  <th className="pb-3">Completion</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((report) => (
                  <tr key={report.id} className="transition hover:bg-secondary/30">
                    <td className="py-3 text-xs text-muted-foreground">{report.date}</td>
                    <td className="py-3 font-medium">{report.buildingName}</td>
                    <td className="py-3 text-muted-foreground">{report.labourName}</td>
                    <td className="py-3">
                      {report.completedTasks}/{report.totalTasks}
                    </td>
                    <td className="min-w-[120px] py-3">
                      <ProgressBar
                        value={report.completedTasks}
                        max={report.totalTasks || 1}
                        color={report.completedTasks === report.totalTasks ? "emerald" : "amber"}
                      />
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

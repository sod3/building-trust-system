import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  PageHeader,
  Card,
  StatusPill,
  ProgressBar,
  Modal,
  Btn,
  EmptyState,
} from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api-client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/owner/reports")({
  head: () => ({ meta: [{ title: "Today's Reports - Owner Dashboard" }] }),
  component: OwnerReports,
});

function OwnerReports() {
  const { t } = useLang();
  const [reports, setReports] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ reports: any[] }>("/api/daily-reports/today")
      .then((result) => setReports(result.reports || []))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load reports."));
  }, []);

  const statusCounts = {
    submitted: reports.filter((report) => report.status === "Submitted").length,
    approved: reports.filter((report) => report.status === "Approved").length,
    pending: reports.filter((report) => report.status === "Pending").length,
    missed: reports.filter((report) => report.status === "Missed").length,
  };

  const statusBorder: Record<string, string> = {
    Submitted: "border-sky-300 bg-sky-50/50",
    Approved: "border-emerald-300 bg-emerald-50/50",
    Pending: "border-amber-300 bg-amber-50/50",
    Missed: "border-rose-300 bg-rose-50/50",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.owner.nav.reports", { fallback: "Today's Reports" })}
        subtitle={`${t("owner.reports.subtitle", { fallback: "Daily report status for all your buildings -" })} ${new Date().toLocaleDateString(t("common.locale", { fallback: "en-GB" }), { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`}
      />

      {error && <Card className="border-rose-200 bg-rose-50 text-sm text-rose-700">{error}</Card>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: t("owner.reports.submitted", { fallback: "Submitted" }),
            value: statusCounts.submitted,
            icon: <CheckCircle2 className="h-4 w-4" />,
            cls: "text-sky-700 bg-sky-50 border-sky-200",
          },
          {
            label: t("owner.reports.approved", { fallback: "Approved" }),
            value: statusCounts.approved,
            icon: <CheckCircle2 className="h-4 w-4" />,
            cls: "text-emerald-700 bg-emerald-50 border-emerald-200",
          },
          {
            label: t("common.pending", { fallback: "Pending" }),
            value: statusCounts.pending,
            icon: <Clock className="h-4 w-4" />,
            cls: "text-amber-700 bg-amber-50 border-amber-200",
          },
          {
            label: t("owner.reports.missed", { fallback: "Missed" }),
            value: statusCounts.missed,
            icon: <AlertTriangle className="h-4 w-4" />,
            cls: "text-rose-700 bg-rose-50 border-rose-200",
          },
        ].map((status) => (
          <div
            key={status.label}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${status.cls}`}
          >
            {status.icon}
            <div>
              <div className="font-display text-2xl font-semibold">{status.value}</div>
              <div className="text-xs font-medium">{status.label}</div>
            </div>
          </div>
        ))}
      </div>

      {reports.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Clock className="h-6 w-6" />}
            title="No reports submitted yet today"
            body="Reports will appear as soon as labour users submit their checklist."
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className={`rounded-2xl border-2 bg-card p-5 transition-all hover:shadow-elevated ${statusBorder[report.status] || "border-border"}`}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold">{report.buildingName}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{report.labourName}</div>
                </div>
                <StatusPill status={report.status} />
              </div>

              <div className="mb-3">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {t("owner.reports.task_completion", { fallback: "Task completion" })}
                  </span>
                  <span className="font-bold">
                    {report.totalTasks
                      ? Math.round((report.completedTasks / report.totalTasks) * 100)
                      : 0}
                    %
                  </span>
                </div>
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

              <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-secondary px-2.5 py-2">
                  <div className="text-muted-foreground">Completed</div>
                  <div className="font-bold text-emerald-700">{report.completedTasks} tasks</div>
                </div>
                <div className="rounded-lg bg-secondary px-2.5 py-2">
                  <div className="text-muted-foreground">Pending</div>
                  <div
                    className={`font-bold ${report.pendingTasks > 0 ? "text-amber-700" : "text-muted-foreground"}`}
                  >
                    {report.pendingTasks} tasks
                  </div>
                </div>
              </div>

              <div className="mb-4 text-xs text-muted-foreground">
                Submitted:{" "}
                <span className="font-medium text-foreground">
                  {report.submittedAt ? new Date(report.submittedAt).toLocaleString() : "Pending"}
                </span>
              </div>

              <Btn
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => setSelected(report)}
              >
                <Eye className="h-3.5 w-3.5" />{" "}
                {t("owner.reports.view_full", { fallback: "View Full Report" })}
              </Btn>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Report - ${selected?.buildingName || ""}`}
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-secondary px-3 py-2.5">
                <div className="text-xs text-muted-foreground">Labour</div>
                <div className="font-medium">{selected.labourName}</div>
              </div>
              <div className="rounded-xl bg-secondary px-3 py-2.5">
                <div className="text-xs text-muted-foreground">Submitted At</div>
                <div className="font-medium">
                  {selected.submittedAt
                    ? new Date(selected.submittedAt).toLocaleString()
                    : "Pending"}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border p-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">
                  {t("owner.reports.task_completion", { fallback: "Task completion" })}
                </span>
                <StatusPill status={selected.status} />
              </div>
              <ProgressBar
                value={selected.completedTasks}
                max={selected.totalTasks || 1}
                color="emerald"
              />
              <div className="mt-1 text-end text-xs text-muted-foreground">
                {selected.completedTasks}/{selected.totalTasks} tasks
              </div>
            </div>

            <div className="space-y-2">
              {(selected.items || []).map((item: any, index: number) => (
                <div
                  key={`${item.title}-${index}`}
                  className="rounded-xl border border-border px-3 py-2 text-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{item.title}</span>
                    <StatusPill
                      status={
                        item.status === "done"
                          ? "Done"
                          : item.status === "issue"
                            ? "Issue"
                            : "Not Done"
                      }
                    />
                  </div>
                  {item.note && (
                    <div className="mt-1 text-xs text-muted-foreground">{item.note}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Btn variant="secondary" onClick={() => setSelected(null)}>
                {t("common.close", { fallback: "Close" })}
              </Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

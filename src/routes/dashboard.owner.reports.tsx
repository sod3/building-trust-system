import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PageHeader, Card, StatusPill, ProgressBar, Modal, Btn } from "@/components/dashboard/ui";
import { useAuth } from "@/lib/auth-context";
import { mockOwners, mockReports, type MockReport } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/owner/reports")({
  head: () => ({ meta: [{ title: "Today's Reports — Owner Dashboard" }] }),
  component: OwnerReports,
});

function OwnerReports() {
  const { user } = useAuth();
  const owner = mockOwners.find(o => o.id === user?.ownerId) || mockOwners[0];
  const todayReports = mockReports.filter(r => r.ownerId === owner.id && r.date === "Jun 24, 2026");
  const [selected, setSelected] = useState<MockReport | null>(null);

  const completedTasks = ["Clean Entrance", "Check Elevator", "Remove Garbage", "Check Water Tank", "Check Lights", "Clean Stairs"];
  const pendingTasks = ["Check Parking", "Security Gate Check"];

  const statusCounts = {
    submitted: todayReports.filter(r => r.status === "Submitted").length,
    approved: todayReports.filter(r => r.status === "Approved").length,
    pending: todayReports.filter(r => r.status === "Pending").length,
    missed: todayReports.filter(r => r.status === "Missed").length,
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
        title="Today's Reports"
        subtitle={`Daily report status for all your buildings — ${new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`}
      />

      {/* Quick status row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Submitted", value: statusCounts.submitted, icon: <CheckCircle2 className="h-4 w-4" />, cls: "text-sky-700 bg-sky-50 border-sky-200" },
          { label: "Approved", value: statusCounts.approved, icon: <CheckCircle2 className="h-4 w-4" />, cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
          { label: "Pending", value: statusCounts.pending, icon: <Clock className="h-4 w-4" />, cls: "text-amber-700 bg-amber-50 border-amber-200" },
          { label: "Missed", value: statusCounts.missed, icon: <AlertTriangle className="h-4 w-4" />, cls: "text-rose-700 bg-rose-50 border-rose-200" },
        ].map(s => (
          <div key={s.label} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${s.cls}`}>
            {s.icon}
            <div>
              <div className="font-display text-2xl font-semibold">{s.value}</div>
              <div className="text-xs font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Report cards */}
      {todayReports.length === 0 ? (
        <Card>
          <div className="py-16 text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="font-display text-lg font-semibold">No reports submitted yet today.</h3>
            <p className="mt-2 text-sm text-muted-foreground">Reports will appear here when your labour submits their daily work.</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {todayReports.map(r => (
            <div
              key={r.id}
              className={`rounded-2xl border-2 bg-card p-5 hover:shadow-elevated transition-all ${statusBorder[r.status] || "border-border"}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="font-semibold">{r.buildingName}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.labourName}</div>
                </div>
                <StatusPill status={r.status} />
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Task completion</span>
                  <span className="font-bold">{Math.round((r.completedTasks / r.totalTasks) * 100)}%</span>
                </div>
                <ProgressBar
                  value={r.completedTasks}
                  max={r.totalTasks}
                  color={r.completedTasks === r.totalTasks ? "emerald" : r.completedTasks > 0 ? "amber" : "rose"}
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="rounded-lg bg-secondary px-2.5 py-2">
                  <div className="text-muted-foreground">Completed</div>
                  <div className="font-bold text-emerald-700">{r.completedTasks} tasks</div>
                </div>
                <div className="rounded-lg bg-secondary px-2.5 py-2">
                  <div className="text-muted-foreground">Pending</div>
                  <div className={`font-bold ${r.pendingTasks > 0 ? "text-amber-700" : "text-muted-foreground"}`}>{r.pendingTasks} tasks</div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground mb-4">
                Submitted: <span className="text-foreground font-medium">{r.submittedAt}</span>
              </div>

              <Btn size="sm" variant="outline" className="w-full" onClick={() => setSelected(r)}>
                <Eye className="h-3.5 w-3.5" /> View Full Report
              </Btn>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Report — ${selected?.buildingName}`}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-secondary px-3 py-2.5">
                <div className="text-xs text-muted-foreground">Labour</div>
                <div className="font-medium">{selected.labourName}</div>
              </div>
              <div className="rounded-xl bg-secondary px-3 py-2.5">
                <div className="text-xs text-muted-foreground">Submitted At</div>
                <div className="font-medium">{selected.submittedAt}</div>
              </div>
            </div>

            <div className="rounded-xl border border-border p-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">Task Completion</span>
                <StatusPill status={selected.status} />
              </div>
              <ProgressBar value={selected.completedTasks} max={selected.totalTasks} color="emerald" />
              <div className="mt-1 text-xs text-muted-foreground text-right">{selected.completedTasks}/{selected.totalTasks} tasks</div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">✅ Completed</div>
              <div className="space-y-1.5">
                {completedTasks.slice(0, selected.completedTasks).map(t => (
                  <div key={t} className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 shrink-0" /> {t}
                  </div>
                ))}
              </div>
            </div>

            {selected.pendingTasks > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">⏳ Pending</div>
                <div className="space-y-1.5">
                  {pendingTasks.slice(0, selected.pendingTasks).map(t => (
                    <div key={t} className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
                      <Clock className="h-4 w-4 shrink-0" /> {t}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Btn variant="secondary" onClick={() => setSelected(null)}>Close</Btn>
              <Btn onClick={() => setSelected(null)}>Approve Report</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

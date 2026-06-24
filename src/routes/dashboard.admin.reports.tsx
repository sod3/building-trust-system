import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Eye, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import {
  PageHeader, StatusPill, Card, Modal, Btn, EmptyState, ProgressBar,
} from "@/components/dashboard/ui";
import { mockReports, mockBuildings, mockOwners, type MockReport } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/admin/reports")({
  head: () => ({ meta: [{ title: "Daily Reports — Admin Dashboard" }] }),
  component: AdminReports,
});

function AdminReports() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState<MockReport | null>(null);

  const filtered = mockReports.filter(r => {
    const matchSearch =
      r.buildingName.toLowerCase().includes(search.toLowerCase()) ||
      r.labourName.toLowerCase().includes(search.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const completedTasks = [
    "Clean Entrance", "Check Elevator", "Remove Garbage",
    "Check Water Tank", "Check Lights", "Clean Stairs",
  ];
  const pendingTasks = ["Check Parking", "Security Gate Check"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Reports"
        subtitle="All submitted daily labour reports across the platform."
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total Reports", value: mockReports.length, icon: <CheckCircle2 className="h-4 w-4" />, color: "bg-sky-50 text-sky-700" },
          { label: "Submitted", value: mockReports.filter(r => r.status === "Submitted" || r.status === "Approved").length, icon: <CheckCircle2 className="h-4 w-4" />, color: "bg-emerald-50 text-emerald-700" },
          { label: "Pending", value: mockReports.filter(r => r.status === "Pending").length, icon: <Clock className="h-4 w-4" />, color: "bg-amber-50 text-amber-700" },
          { label: "Missed", value: mockReports.filter(r => r.status === "Missed").length, icon: <AlertTriangle className="h-4 w-4" />, color: "bg-rose-50 text-rose-700" },
        ].map(k => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-4">
            <div className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${k.color}`}>
              {k.icon} {k.label}
            </div>
            <div className="mt-2 font-display text-3xl font-semibold">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search by building, labour, or owner…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            {["All", "Submitted", "Approved", "Pending", "Missed"].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${filterStatus === s ? "bg-navy text-white" : "border border-border text-muted-foreground hover:bg-secondary"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Reports Table */}
      {filtered.length === 0 ? (
        <Card><EmptyState icon={<Search className="h-5 w-5" />} title="No reports found" body="Try adjusting your search or filter." /></Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Building</th>
                  <th className="pb-3">Labour</th>
                  <th className="pb-3">Owner</th>
                  <th className="pb-3">Tasks</th>
                  <th className="pb-3">Completion</th>
                  <th className="pb-3">Submitted At</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-secondary/30 transition">
                    <td className="py-3 text-xs text-muted-foreground whitespace-nowrap">{r.date}</td>
                    <td className="py-3 font-medium">{r.buildingName}</td>
                    <td className="py-3 text-muted-foreground">{r.labourName}</td>
                    <td className="py-3 text-muted-foreground">{r.ownerName}</td>
                    <td className="py-3">
                      <span className="text-emerald-700 font-semibold">{r.completedTasks}</span>
                      <span className="text-muted-foreground">/{r.totalTasks}</span>
                    </td>
                    <td className="py-3 min-w-[100px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <ProgressBar value={r.completedTasks} max={r.totalTasks}
                            color={r.completedTasks === r.totalTasks ? "emerald" : r.completedTasks > 0 ? "amber" : "rose"}
                          />
                        </div>
                        <span className="text-xs font-medium">{Math.round((r.completedTasks / r.totalTasks) * 100)}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-muted-foreground whitespace-nowrap">{r.submittedAt}</td>
                    <td className="py-3"><StatusPill status={r.status} /></td>
                    <td className="py-3">
                      <Btn size="sm" variant="ghost" onClick={() => setSelected(r)}>
                        <Eye className="h-3.5 w-3.5" /> View
                      </Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Report Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Report — ${selected?.buildingName}`}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-secondary px-3 py-2.5">
                <div className="text-xs text-muted-foreground">Date</div>
                <div className="font-medium">{selected.date}</div>
              </div>
              <div className="rounded-xl bg-secondary px-3 py-2.5">
                <div className="text-xs text-muted-foreground">Submitted At</div>
                <div className="font-medium">{selected.submittedAt}</div>
              </div>
              <div className="rounded-xl bg-secondary px-3 py-2.5">
                <div className="text-xs text-muted-foreground">Labour</div>
                <div className="font-medium">{selected.labourName}</div>
              </div>
              <div className="rounded-xl bg-secondary px-3 py-2.5">
                <div className="text-xs text-muted-foreground">Status</div>
                <StatusPill status={selected.status} />
              </div>
            </div>

            <div className="rounded-xl border border-border p-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">Task Completion</span>
                <span className="text-muted-foreground">{selected.completedTasks}/{selected.totalTasks} tasks</span>
              </div>
              <ProgressBar value={selected.completedTasks} max={selected.totalTasks} color="emerald" />
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">✅ Completed Tasks</div>
              <div className="space-y-1.5">
                {completedTasks.slice(0, selected.completedTasks).map(task => (
                  <div key={task} className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {task}
                  </div>
                ))}
              </div>
            </div>

            {selected.pendingTasks > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">⏳ Pending Tasks</div>
                <div className="space-y-1.5">
                  {pendingTasks.slice(0, selected.pendingTasks).map(task => (
                    <div key={task} className="flex items-center gap-2.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
                      <Clock className="h-4 w-4 shrink-0" />
                      {task}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo proof placeholders */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">📸 Photo Proof</div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square rounded-xl bg-secondary border border-border flex items-center justify-center text-xs text-muted-foreground">
                    Photo {i}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Btn variant="secondary" onClick={() => setSelected(null)}>Close</Btn>
              <Btn onClick={() => setSelected(null)}>Approve Report</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

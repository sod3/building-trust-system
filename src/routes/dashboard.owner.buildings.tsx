import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, StatusPill, ProgressBar, SectionTitle } from "@/components/dashboard/ui";
import { useAuth } from "@/lib/auth-context";
import { mockOwners, mockBuildings, mockLabour, mockReports } from "@/lib/mock-data";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/owner/buildings")({
  head: () => ({ meta: [{ title: "My Buildings — Owner Dashboard" }] }),
  component: OwnerBuildings,
});

function OwnerBuildings() {
  const { user } = useAuth();
  const { t } = useLang();
  const owner = mockOwners.find(o => o.id === user?.ownerId) || mockOwners[0];
  const myBuildings = mockBuildings.filter(b => owner.buildingIds.includes(b.id));
  const [selected, setSelected] = useState<string | null>(null);

  const selectedBuilding = myBuildings.find(b => b.id === selected);
  const buildingLabour = selectedBuilding
    ? mockLabour.filter(l => selectedBuilding.assignedLabourIds.includes(l.id))
    : [];
  const buildingReports = selectedBuilding
    ? mockReports.filter(r => r.buildingId === selectedBuilding.id).slice(0, 3)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t("dashboard.owner.nav.buildings", { fallback: "My Buildings" })}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("owner.buildings.subtitle", { count: myBuildings.length, fallback: `${myBuildings.length} buildings under your management.` })}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {myBuildings.map(b => {
          const labour = mockLabour.filter(l => b.assignedLabourIds.includes(l.id));
          const isSelected = selected === b.id;
          return (
            <div
              key={b.id}
              onClick={() => setSelected(isSelected ? null : b.id)}
              className={`rounded-2xl border-2 bg-card overflow-hidden cursor-pointer transition-all hover:shadow-elevated ${
                isSelected ? "border-accent shadow-elevated" : "border-border hover:border-accent/30"
              }`}
            >
              <div className="relative">
                <img src={b.cover} alt={b.name} className="h-40 w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="font-display text-white font-semibold">{b.name}</div>
                  <div className="text-xs text-white/80">{b.city} · {b.address}</div>
                </div>
                <div className="absolute top-3 right-3">
                  <StatusPill status={b.status} />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground font-medium">{t("owner.buildings.today_completion", { fallback: "Today's completion" })}</span>
                  <span className="font-bold text-sm">{b.completionToday}%</span>
                </div>
                <ProgressBar
                  value={b.doneTasksToday}
                  max={b.totalTasksToday}
                  color={b.completionToday >= 80 ? "emerald" : b.completionToday >= 50 ? "amber" : "rose"}
                />

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {labour.length > 0 ? labour.map(l => l.name.split(" ")[0]).join(", ") : t("owner.buildings.no_labour", { fallback: "No labour" })}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground justify-end">
                    <Clock className="h-3.5 w-3.5" />
                    {b.lastReportTime}
                  </div>
                </div>

                <div className="mt-2 text-xs text-center text-accent font-medium">
                  {isSelected ? t("owner.buildings.hide_details", { fallback: "▲ Hide details" }) : t("owner.buildings.view_details", { fallback: "▼ View details" })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Building Detail Panel */}
      {selectedBuilding && (
        <div className="grid gap-4 lg:grid-cols-2 animate-in slide-in-from-bottom-2 duration-300">
          <Card>
            <SectionTitle title={`${t("dashboard.owner.nav.labour", { fallback: "Labour" })} — ${selectedBuilding.name}`} />
            {buildingLabour.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">{t("owner.buildings.no_labour_assigned", { fallback: "No labour assigned to this building." })}</div>
            ) : (
              <div className="space-y-3">
                {buildingLabour.map(l => (
                  <div key={l.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-navy/10 text-sm font-bold text-navy">
                      {l.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{l.name}</div>
                      <div className="text-xs text-muted-foreground">{l.phone}</div>
                    </div>
                    <div className="text-end">
                      <StatusPill status={l.todayStatus} />
                      <div className="text-xs text-muted-foreground mt-1">{l.completedTasksToday}/{l.totalTasksToday} {t("common.tasks", { fallback: "tasks" })}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <SectionTitle title={`${t("owner.buildings.recent_reports", { fallback: "Recent Reports" })} — ${selectedBuilding.name}`} />
            {buildingReports.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">{t("owner.buildings.no_reports", { fallback: "No reports for this building yet." })}</div>
            ) : (
              <div className="space-y-3">
                {buildingReports.map(r => (
                  <div key={r.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{r.date}</div>
                      <StatusPill status={r.status} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.labourName} · {r.submittedAt}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <ProgressBar value={r.completedTasks} max={r.totalTasks} color={r.completedTasks === r.totalTasks ? "emerald" : "amber"} />
                      <span className="text-xs font-medium shrink-0">{r.completedTasks}/{r.totalTasks}</span>
                    </div>
                    {r.pendingTasks > 0 && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                        <AlertTriangle className="h-3 w-3" /> {r.pendingTasks} {t("owner.buildings.tasks_pending", { fallback: "tasks pending" })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

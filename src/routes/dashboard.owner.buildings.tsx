import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Users, Clock, AlertTriangle, Building2 } from "lucide-react";
import { PageHeader, Card, StatusPill, ProgressBar, SectionTitle, Modal, FormInput, FormSelect, Btn, Toast, EmptyState } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api-client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/owner/buildings")({
  head: () => ({ meta: [{ title: "My Buildings - Owner Dashboard" }] }),
  component: OwnerBuildings,
});

function OwnerBuildings() {
  const { t } = useLang();
  const [dashboard, setDashboard] = useState<any | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", city: "", address: "", buildingType: "residential" });
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function load() {
    setLoading(true);
    apiFetch<any>("/api/owner/overview")
      .then(setDashboard)
      .catch((error) => showToast(error instanceof Error ? error.message : "Could not load buildings.", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAdd() {
    try {
      await apiFetch("/api/buildings", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setShowAdd(false);
      setForm({ name: "", city: "", address: "", buildingType: "residential" });
      showToast("Building added successfully.");
      load();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not add building.", "error");
    }
  }

  if (loading && !dashboard) return <Card><div className="text-sm text-muted-foreground">Loading buildings...</div></Card>;

  const buildings = dashboard?.buildings || [];
  const labour = dashboard?.labour || [];
  const reports = dashboard?.reports || [];
  const usage = dashboard?.usage || {};
  const selectedBuilding = buildings.find((building: any) => building.id === selected);
  const buildingLabour = selectedBuilding ? labour.filter((worker: any) => selectedBuilding.assignedLabourIds.includes(worker.id)) : [];
  const buildingReports = selectedBuilding ? reports.filter((report: any) => report.buildingId === selectedBuilding.id).slice(0, 3) : [];
  const buildingLimitReached = usage.buildingLimit !== null && usage.buildingLimit !== undefined && usage.buildingsUsed >= usage.buildingLimit;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.owner.nav.buildings", { fallback: "My Buildings" })}
        subtitle={`${usage.buildingsUsed || 0} / ${usage.buildingLimit ?? "Unlimited"} buildings in your current plan.`}
        actions={
          <Btn onClick={() => setShowAdd(true)} disabled={buildingLimitReached}>
            <Plus className="h-4 w-4" /> {t("admin.buildings.add", { fallback: "Add Building" })}
          </Btn>
        }
      />

      {buildingLimitReached && (
        <Card className="border-amber-200 bg-amber-50 text-amber-900">
          <div className="flex items-start gap-3 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              {dashboard?.plan?.slug === "starter"
                ? "Your Starter plan includes 1 building. Upgrade to Professional to manage up to 5 buildings."
                : "Your Professional plan includes up to 5 buildings. Upgrade to Enterprise for multiple buildings."}
            </div>
          </div>
        </Card>
      )}

      {buildings.length === 0 ? (
        <Card>
          <EmptyState icon={<Building2 className="h-6 w-6" />} title="No buildings yet" body="Add your first building to start receiving daily labour reports." />
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {buildings.map((building: any) => {
            const isSelected = selected === building.id;
            const assigned = labour.filter((worker: any) => building.assignedLabourIds.includes(worker.id));
            return (
              <button
                key={building.id}
                onClick={() => setSelected(isSelected ? null : building.id)}
                className={`overflow-hidden rounded-2xl border-2 bg-card text-left transition-all hover:shadow-elevated ${
                  isSelected ? "border-accent shadow-elevated" : "border-border hover:border-accent/30"
                }`}
              >
                <div className="relative">
                  <img src={building.cover} alt={building.name} className="h-40 w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <div className="font-display font-semibold text-white">{building.name}</div>
                    <div className="text-xs text-white/80">{building.city || building.address || "No location set"}</div>
                  </div>
                  <div className="absolute right-3 top-3">
                    <StatusPill status={building.status} />
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-muted-foreground">{t("owner.buildings.today_completion", { fallback: "Today's completion" })}</span>
                    <span className="text-sm font-bold">{building.completionToday}%</span>
                  </div>
                  <ProgressBar
                    value={building.doneTasksToday}
                    max={building.totalTasksToday || 1}
                    color={building.completionToday >= 80 ? "emerald" : building.completionToday >= 50 ? "amber" : "rose"}
                  />

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {assigned.length ? assigned.map((worker: any) => worker.name.split(" ")[0]).join(", ") : t("owner.buildings.no_labour", { fallback: "No labour" })}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {building.lastReportTime}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selectedBuilding && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <SectionTitle title={`${t("dashboard.owner.nav.labour", { fallback: "Labour" })} - ${selectedBuilding.name}`} />
            {buildingLabour.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">{t("owner.buildings.no_labour_assigned", { fallback: "No labour assigned to this building." })}</div>
            ) : (
              <div className="space-y-3">
                {buildingLabour.map((worker: any) => (
                  <div key={worker.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-navy/10 text-sm font-bold text-navy">
                      {worker.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{worker.name}</div>
                      <div className="text-xs text-muted-foreground">{worker.phone}</div>
                    </div>
                    <StatusPill status={worker.todayStatus} />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <SectionTitle title={`${t("owner.buildings.recent_reports", { fallback: "Recent Reports" })} - ${selectedBuilding.name}`} />
            {buildingReports.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">{t("owner.buildings.no_reports", { fallback: "No reports for this building yet." })}</div>
            ) : (
              <div className="space-y-3">
                {buildingReports.map((report: any) => (
                  <div key={report.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{report.date}</div>
                      <StatusPill status={report.status} />
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{report.labourName}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <ProgressBar value={report.completedTasks} max={report.totalTasks || 1} color={report.completedTasks === report.totalTasks ? "emerald" : "amber"} />
                      <span className="shrink-0 text-xs font-medium">{report.completedTasks}/{report.totalTasks}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={t("admin.buildings.add", { fallback: "Add Building" })}>
        <div className="space-y-4">
          <FormInput label="Building Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} required />
          <FormInput label="City" value={form.city} onChange={(value) => setForm((current) => ({ ...current, city: value }))} />
          <FormInput label="Address" value={form.address} onChange={(value) => setForm((current) => ({ ...current, address: value }))} />
          <FormSelect
            label="Building Type"
            value={form.buildingType}
            onChange={(value) => setForm((current) => ({ ...current, buildingType: value }))}
            options={[
              { value: "residential", label: "Residential" },
              { value: "commercial", label: "Commercial" },
              { value: "mixed_use", label: "Mixed use" },
            ]}
          />
          <div className="flex justify-end gap-2">
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>{t("common.cancel", { fallback: "Cancel" })}</Btn>
            <Btn onClick={handleAdd} disabled={!form.name}>{t("admin.buildings.add", { fallback: "Add Building" })}</Btn>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

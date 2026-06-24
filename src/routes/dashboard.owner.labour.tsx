import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, UserX } from "lucide-react";
import { PageHeader, Card, StatusPill, ProgressBar, Modal, FormInput, FormSelect, Btn, Toast, EmptyState } from "@/components/dashboard/ui";
import { useAuth } from "@/lib/auth-context";
import { mockOwners, mockLabour, mockBuildings, type MockLabour } from "@/lib/mock-data";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/owner/labour")({
  head: () => ({ meta: [{ title: "Labour — Owner Dashboard" }] }),
  component: OwnerLabour,
});

function OwnerLabour() {
  const { user } = useAuth();
  const { t } = useLang();
  const owner = mockOwners.find(o => o.id === user?.ownerId) || mockOwners[0];
  const myBuildings = mockBuildings.filter(b => owner.buildingIds.includes(b.id));
  const [labour, setLabour] = useState<MockLabour[]>(mockLabour.filter(l => l.ownerId === owner.id));
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", buildingId: "" });

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleAdd() {
    if (!form.name || !form.phone) return;
    const building = myBuildings.find(b => b.id === form.buildingId);
    const newLabour: MockLabour = {
      id: `LAB-${Date.now()}`,
      name: form.name, phone: form.phone, email: form.email,
      buildingId: form.buildingId, buildingName: building?.name || "Unassigned",
      ownerId: owner.id, todayStatus: "Not Started",
      completedTasksToday: 0, totalTasksToday: 8,
      lastSubmission: "Never", performanceWeek: 0, joinedDate: "Jun 2026",
    };
    setLabour(prev => [newLabour, ...prev]);
    setShowAdd(false);
    setForm({ name: "", phone: "", email: "", buildingId: "" });
    showToast(`${form.name} added to your team`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.owner.nav.labour", { fallback: "My Labour" })}
        subtitle={t("owner.labour.subtitle", { count: labour.length, fallback: `${labour.length} workers assigned to your buildings.` })}
        actions={
          <Btn onClick={() => { setShowAdd(true); setForm({ name: "", phone: "", email: "", buildingId: "" }); }}>
            <Plus className="h-4 w-4" /> {t("admin.labour.add", { fallback: "Add Labour" })}
          </Btn>
        }
      />

      {labour.length === 0 ? (
        <Card>
          <EmptyState
            icon={<UserX className="h-6 w-6" />}
            title={t("owner.labour.empty_title", { fallback: "No labour assigned yet" })}
            body={t("owner.labour.empty_desc", { fallback: "Add labour workers to your buildings to start tracking daily tasks." })}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {labour.map(l => (
            <Card key={l.id} className="hover:shadow-elevated transition-all">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy/10 text-sm font-bold text-navy">
                  {l.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.phone}</div>
                  <div className="mt-1.5"><StatusPill status={l.todayStatus} /></div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("common.building", { fallback: "Building" })}</span>
                  <span className="font-medium">{l.buildingName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("admin.labour.tasks_today", { fallback: "Tasks today" })}</span>
                  <span className="font-semibold">{l.completedTasksToday}/{l.totalTasksToday}</span>
                </div>
                <ProgressBar
                  value={l.completedTasksToday}
                  max={l.totalTasksToday}
                  color={l.completedTasksToday === l.totalTasksToday ? "emerald" : l.completedTasksToday > 0 ? "amber" : "rose"}
                />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("owner.labour.last_active", { fallback: "Last active" })}</span>
                  <span>{l.lastSubmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("admin.labour.week_performance", { fallback: "Week performance" })}</span>
                  <span className="font-semibold text-emerald-700">{l.performanceWeek}%</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Btn size="sm" variant="outline" className="flex-1" onClick={() => showToast(`Viewing ${l.name}'s checklist (demo)`)}>
                  {t("admin.labour.view_checklist", { fallback: "View Checklist" })}
                </Btn>
                <Btn size="sm" variant="ghost" onClick={() => {
                  setLabour(prev => prev.filter(x => x.id !== l.id));
                  showToast(`${l.name} removed from your team`);
                }}>
                  <UserX className="h-3.5 w-3.5" />
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={t("admin.labour.add", { fallback: "Add Labour" })}>
        <div className="space-y-4">
          <FormInput label={t("common.full_name", { fallback: "Full Name" })} value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Ali Hassan" required />
          <FormInput label={t("common.phone", { fallback: "Phone" })} value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+966 53 000 0000" required />
          <FormInput label={t("common.email", { fallback: "Email" })} value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="ali@example.com" type="email" />
          <FormSelect label={t("admin.labour.assign_building", { fallback: "Assign to Building" })} value={form.buildingId} onChange={v => setForm(f => ({ ...f, buildingId: v }))}
            options={[{ value: "", label: "— Select Building —" }, ...myBuildings.map(b => ({ value: b.id, label: b.name }))]}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>{t("common.cancel", { fallback: "Cancel" })}</Btn>
            <Btn onClick={handleAdd} disabled={!form.name || !form.phone}>{t("admin.labour.add", { fallback: "Add Labour" })}</Btn>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

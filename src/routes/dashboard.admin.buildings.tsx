import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Edit, Users } from "lucide-react";
import {
  PageHeader, StatusPill, Card, Modal, FormInput, FormSelect, Btn, Toast, EmptyState, ProgressBar,
} from "@/components/dashboard/ui";
import { mockBuildings, mockOwners, mockLabour, type MockBuilding } from "@/lib/mock-data";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/admin/buildings")({
  head: () => ({ meta: [{ title: "Buildings — Admin Dashboard" }] }),
  component: AdminBuildings,
});

function AdminBuildings() {
  const { t } = useLang();
  const [buildings, setBuildings] = useState<MockBuilding[]>(mockBuildings);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editBuilding, setEditBuilding] = useState<MockBuilding | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ name: "", city: "", address: "", ownerId: "", status: "Healthy" as MockBuilding["status"] });

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const filtered = buildings.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.city.toLowerCase().includes(search.toLowerCase()) ||
    b.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd() {
    if (!form.name || !form.city) return;
    const owner = mockOwners.find(o => o.id === form.ownerId);
    const newBuilding: MockBuilding = {
      id: `BLD-${Date.now()}`,
      name: form.name,
      city: form.city,
      address: form.address,
      ownerId: form.ownerId,
      ownerName: owner?.name || "Unassigned",
      assignedLabourIds: [],
      completionToday: 0,
      totalTasksToday: 8,
      doneTasksToday: 0,
      lastReportTime: "No report yet",
      status: form.status,
      cover: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=70",
    };
    setBuildings(prev => [newBuilding, ...prev]);
    setShowAdd(false);
    setForm({ name: "", city: "", address: "", ownerId: "", status: "Healthy" });
    showToast(`Building ${form.name} added`);
  }

  function handleSaveEdit() {
    if (!editBuilding) return;
    const owner = mockOwners.find(o => o.id === form.ownerId);
    setBuildings(prev => prev.map(b => b.id === editBuilding.id ? {
      ...b, name: form.name, city: form.city, address: form.address,
      ownerId: form.ownerId, ownerName: owner?.name || b.ownerName, status: form.status,
    } : b));
    setEditBuilding(null);
    showToast("Building updated");
  }

  const statusColors: Record<string, string> = {
    "Healthy": "border-emerald-200 bg-emerald-50",
    "Pending": "border-amber-200 bg-amber-50",
    "Attention Needed": "border-rose-200 bg-rose-50",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("admin.buildings.title", { fallback: "Buildings" })}
        subtitle={t("admin.buildings.subtitle", { fallback: "All buildings across the platform." })}
        actions={
          <Btn onClick={() => { setShowAdd(true); setForm({ name: "", city: "", address: "", ownerId: "", status: "Healthy" }); }}>
            <Plus className="h-4 w-4" /> {t("admin.buildings.add", { fallback: "Add Building" })}
          </Btn>
        }
      />

      {/* Search */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder={t("admin.buildings.search", { fallback: "Search by building name, city, or owner…" })}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-background px-9 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
            />
          </div>
          <div className="text-xs text-muted-foreground">{filtered.length} {t("common.buildings", { fallback: "buildings" })}</div>
        </div>
      </Card>

      {/* Buildings grid */}
      {filtered.length === 0 ? (
        <Card><EmptyState icon={<Search className="h-5 w-5" />} title={t("admin.buildings.no_records", { fallback: "No buildings found" })} body={t("common.no_records_body", { fallback: "Try adjusting your search." })} /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(b => {
            const labour = mockLabour.filter(l => b.assignedLabourIds.includes(l.id));
            return (
              <div key={b.id} className={`rounded-2xl border-2 bg-card overflow-hidden shadow-sm hover:shadow-elevated transition-all ${statusColors[b.status] || "border-border"}`}>
                <img src={b.cover} alt={b.name} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-sm">{b.name}</div>
                      <div className="text-xs text-muted-foreground">{b.city}</div>
                    </div>
                    <StatusPill status={b.status} />
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">{t("admin.buildings.today_completion", { fallback: "Today's completion" })}</span>
                      <span className="font-semibold">{b.completionToday}%</span>
                    </div>
                    <ProgressBar value={b.completionToday} color={b.completionToday >= 80 ? "emerald" : b.completionToday >= 50 ? "amber" : "rose"} />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-secondary px-2.5 py-2">
                      <div className="text-muted-foreground">{t("common.owner", { fallback: "Owner" })}</div>
                      <div className="font-medium truncate">{b.ownerName}</div>
                    </div>
                    <div className="rounded-lg bg-secondary px-2.5 py-2">
                      <div className="text-muted-foreground">{t("common.labour", { fallback: "Labour" })}</div>
                      <div className="font-medium">{labour.length > 0 ? labour.map(l => l.name.split(" ")[0]).join(", ") : t("common.unassigned", { fallback: "Unassigned" })}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-muted-foreground">
                    {t("admin.buildings.last_report", { fallback: "Last report:" })} <span className="text-foreground font-medium">{b.lastReportTime}</span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Btn size="sm" variant="outline" className="flex-1" onClick={() => {
                      setEditBuilding(b);
                      setForm({ name: b.name, city: b.city, address: b.address, ownerId: b.ownerId, status: b.status });
                    }}>
                      <Edit className="h-3.5 w-3.5" /> {t("common.edit", { fallback: "Edit" })}
                    </Btn>
                    <Btn size="sm" variant="ghost" onClick={() => showToast(`Labour assigned to ${b.name} (demo)`)}>
                      <Users className="h-3.5 w-3.5" /> {t("admin.buildings.assign_labour", { fallback: "Assign Labour" })}
                    </Btn>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Building Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={t("admin.buildings.add", { fallback: "Add New Building" })}>
        <div className="space-y-4">
          <FormInput label={t("common.building_name", { fallback: "Building Name" })} value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Riyadh Tower A" required />
          <FormInput label={t("common.city", { fallback: "City" })} value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} placeholder="Riyadh" required />
          <FormInput label={t("common.address", { fallback: "Address" })} value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} placeholder="King Fahad Road, Riyadh" />
          <FormSelect label={t("admin.buildings.assign_owner", { fallback: "Assign to Owner" })} value={form.ownerId} onChange={v => setForm(f => ({ ...f, ownerId: v }))}
            options={[{ value: "", label: t("admin.buildings.select_owner", { fallback: "— Select Owner —" }) }, ...mockOwners.map(o => ({ value: o.id, label: o.name }))]}
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>{t("common.cancel", { fallback: "Cancel" })}</Btn>
            <Btn onClick={handleAdd} disabled={!form.name || !form.city}>{t("admin.buildings.add", { fallback: "Add Building" })}</Btn>
          </div>
        </div>
      </Modal>

      {/* Edit Building Modal */}
      <Modal open={!!editBuilding} onClose={() => setEditBuilding(null)} title={t("admin.buildings.edit", { fallback: "Edit Building" })}>
        <div className="space-y-4">
          <FormInput label={t("common.building_name", { fallback: "Building Name" })} value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
          <FormInput label={t("common.city", { fallback: "City" })} value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} required />
          <FormInput label={t("common.address", { fallback: "Address" })} value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} />
          <FormSelect label={t("common.owner", { fallback: "Owner" })} value={form.ownerId} onChange={v => setForm(f => ({ ...f, ownerId: v }))}
            options={[{ value: "", label: t("admin.buildings.select_owner", { fallback: "— Select Owner —" }) }, ...mockOwners.map(o => ({ value: o.id, label: o.name }))]}
          />
          <FormSelect label={t("common.status", { fallback: "Status" })} value={form.status} onChange={v => setForm(f => ({ ...f, status: v as MockBuilding["status"] }))}
            options={[
              { value: "Healthy", label: t("status.healthy", { fallback: "Healthy" }) },
              { value: "Pending", label: t("status.pending", { fallback: "Pending" }) },
              { value: "Attention Needed", label: t("status.attention", { fallback: "Attention Needed" }) }
            ]}
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setEditBuilding(null)}>{t("common.cancel", { fallback: "Cancel" })}</Btn>
            <Btn onClick={handleSaveEdit}>{t("common.save", { fallback: "Save Changes" })}</Btn>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

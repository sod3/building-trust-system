import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Search, Building2 } from "lucide-react";
import { PageHeader, Card, Modal, FormInput, FormSelect, Btn, Toast, EmptyState, StatusPill } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api-client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/admin/buildings")({
  head: () => ({ meta: [{ title: "Buildings - Admin Dashboard" }] }),
  component: AdminBuildings,
});

function AdminBuildings() {
  const { t } = useLang();
  const [buildings, setBuildings] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ orgId: "", name: "", city: "", address: "", buildingType: "residential" });

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function load() {
    apiFetch<{ buildings: any[] }>("/api/buildings")
      .then((result) => setBuildings(result.buildings || []))
      .catch((error) => showToast(error instanceof Error ? error.message : "Could not load buildings.", "error"));
    apiFetch<{ organizations: any[] }>("/api/admin/organizations")
      .then((result) => setOrganizations(result.organizations || []))
      .catch(() => setOrganizations([]));
  }

  useEffect(load, []);

  async function handleAdd() {
    try {
      await apiFetch("/api/buildings", { method: "POST", body: JSON.stringify(form) });
      setShowAdd(false);
      setForm({ orgId: "", name: "", city: "", address: "", buildingType: "residential" });
      showToast("Building added.");
      load();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not add building.", "error");
    }
  }

  const orgMap = new Map(organizations.map((org) => [org._id, org]));
  const filtered = buildings.filter((building) => {
    const orgName = orgMap.get(building.orgId)?.name || "";
    return [building.name, building.city, building.address, orgName].join(" ").toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("admin.buildings.title", { fallback: "Buildings" })}
        subtitle={t("admin.buildings.subtitle", { fallback: "All buildings across the platform." })}
        actions={<Btn onClick={() => setShowAdd(true)}><Plus className="h-4 w-4" /> {t("admin.buildings.add", { fallback: "Add Building" })}</Btn>}
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-48 flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder={t("admin.buildings.search", { fallback: "Search by building name, city, or owner..." })}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-background px-9 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div className="text-xs text-muted-foreground">{filtered.length} {t("common.buildings", { fallback: "buildings" })}</div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card><EmptyState icon={<Building2 className="h-5 w-5" />} title={t("admin.buildings.no_records", { fallback: "No buildings found" })} body={t("common.no_records_body", { fallback: "Try adjusting your search." })} /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((building) => (
            <Card key={building.id || building._id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-lg font-semibold">{building.name}</div>
                  <div className="text-xs text-muted-foreground">{building.city || "No city"} - {orgMap.get(building.orgId)?.name || building.orgId}</div>
                </div>
                <StatusPill status={building.status || "active"} />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div><span className="text-muted-foreground">Address:</span> {building.address || "Not set"}</div>
                <div><span className="text-muted-foreground">Type:</span> {building.buildingType || "residential"}</div>
                <div><span className="text-muted-foreground">Created:</span> {building.createdAt ? new Date(building.createdAt).toLocaleDateString() : "-"}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={t("admin.buildings.add", { fallback: "Add Building" })}>
        <div className="space-y-4">
          <FormSelect label="Organization" value={form.orgId} onChange={(value) => setForm((current) => ({ ...current, orgId: value }))} options={[{ value: "", label: "Select organization" }, ...organizations.map((org) => ({ value: org._id, label: org.name }))]} />
          <FormInput label="Building Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} required />
          <FormInput label="City" value={form.city} onChange={(value) => setForm((current) => ({ ...current, city: value }))} />
          <FormInput label="Address" value={form.address} onChange={(value) => setForm((current) => ({ ...current, address: value }))} />
          <FormSelect label="Building Type" value={form.buildingType} onChange={(value) => setForm((current) => ({ ...current, buildingType: value }))} options={[{ value: "residential", label: "Residential" }, { value: "commercial", label: "Commercial" }, { value: "mixed_use", label: "Mixed use" }]} />
          <div className="flex justify-end gap-2">
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>{t("common.cancel", { fallback: "Cancel" })}</Btn>
            <Btn onClick={handleAdd} disabled={!form.orgId || !form.name}>{t("admin.buildings.add", { fallback: "Add Building" })}</Btn>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

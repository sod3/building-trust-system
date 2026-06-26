import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import { PageHeader, Card, Modal, FormInput, FormSelect, Btn, Toast, EmptyState, StatusPill, ProgressBar } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api-client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/admin/labour")({
  head: () => ({ meta: [{ title: "Labour - Admin Dashboard" }] }),
  component: AdminLabour,
});

function AdminLabour() {
  const { t } = useLang();
  const [labour, setLabour] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ orgId: "", name: "", phone: "", email: "", password: "", buildingId: "" });

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function load() {
    apiFetch<{ labour: any[] }>("/api/labour")
      .then((result) => setLabour(result.labour || []))
      .catch((error) => showToast(error instanceof Error ? error.message : "Could not load labour.", "error"));
    apiFetch<{ buildings: any[] }>("/api/buildings")
      .then((result) => setBuildings(result.buildings || []))
      .catch(() => setBuildings([]));
  }

  useEffect(load, []);

  async function handleAdd() {
    try {
      const building = buildings.find((item) => item.id === form.buildingId);
      await apiFetch("/api/labour", {
        method: "POST",
        body: JSON.stringify({
          orgId: form.orgId || building?.orgId,
          name: form.name,
          phone: form.phone,
          email: form.email,
          password: form.password,
          assignedBuildingIds: form.buildingId ? [form.buildingId] : [],
        }),
      });
      setShowAdd(false);
      setForm({ orgId: "", name: "", phone: "", email: "", password: "", buildingId: "" });
      showToast("Labour account added.");
      load();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not add labour.", "error");
    }
  }

  const filtered = labour.filter((worker) =>
    [worker.name, worker.email, worker.phone, worker.buildingName].join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.admin.nav.labour", { fallback: "Labour" })}
        subtitle={t("admin.labour.subtitle", { fallback: "All labour workers and their daily activity across buildings." })}
        actions={<Btn onClick={() => setShowAdd(true)}><Plus className="h-4 w-4" /> {t("admin.labour.add", { fallback: "Add Labour" })}</Btn>}
      />

      <Card>
        <div className="relative min-w-48 flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search labour..." className="h-9 w-full rounded-xl border border-border bg-background px-9 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card><EmptyState icon={<Users className="h-6 w-6" />} title="No labour accounts" body="Create labour users from an owner account or from this admin page." /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((worker) => (
            <Card key={worker.id}>
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy/10 text-sm font-bold text-navy">
                  {worker.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{worker.name}</div>
                  <div className="text-xs text-muted-foreground">{worker.email || worker.phone}</div>
                  <div className="mt-1.5"><StatusPill status={worker.todayStatus || worker.status} /></div>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Building</span><span>{worker.buildingName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tasks today</span><span>{worker.completedTasksToday}/{worker.totalTasksToday}</span></div>
                <ProgressBar value={worker.completedTasksToday} max={worker.totalTasksToday || 1} color={worker.completedTasksToday ? "emerald" : "rose"} />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={t("admin.labour.add", { fallback: "Add Labour" })}>
        <div className="space-y-4">
          <FormSelect label="Assign to Building" value={form.buildingId} onChange={(value) => {
            const building = buildings.find((item) => item.id === value);
            setForm((current) => ({ ...current, buildingId: value, orgId: building?.orgId || current.orgId }));
          }} options={[{ value: "", label: "Select Building" }, ...buildings.map((building) => ({ value: building.id, label: `${building.name} (${building.city || "No city"})` }))]} />
          <FormInput label="Full Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} required />
          <FormInput label="Phone" value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} required />
          <FormInput label="Email" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} type="email" required />
          <FormInput label="Password" value={form.password} onChange={(value) => setForm((current) => ({ ...current, password: value }))} type="password" />
          <div className="flex justify-end gap-2">
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>{t("common.cancel", { fallback: "Cancel" })}</Btn>
            <Btn onClick={handleAdd} disabled={!form.name || !form.phone || !form.email}>{t("admin.labour.add", { fallback: "Add Labour" })}</Btn>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

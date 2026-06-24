import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import {
  PageHeader, StatusPill, Card, Modal, FormInput, FormSelect, Btn, Toast, EmptyState, ProgressBar,
} from "@/components/dashboard/ui";
import { mockLabour, mockBuildings, type MockLabour } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/admin/labour")({
  head: () => ({ meta: [{ title: "Labour — Admin Dashboard" }] }),
  component: AdminLabour,
});

function AdminLabour() {
  const [labour, setLabour] = useState<MockLabour[]>(mockLabour);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", buildingId: "" });

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const filtered = labour.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.buildingName.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search)
  );

  function handleAdd() {
    if (!form.name || !form.phone) return;
    const building = mockBuildings.find(b => b.id === form.buildingId);
    const newLabour: MockLabour = {
      id: `LAB-${Date.now()}`,
      name: form.name,
      phone: form.phone,
      email: form.email,
      buildingId: form.buildingId,
      buildingName: building?.name || "Unassigned",
      ownerId: building?.ownerId || "",
      todayStatus: "Not Started",
      completedTasksToday: 0,
      totalTasksToday: 8,
      lastSubmission: "Never",
      performanceWeek: 0,
      joinedDate: "Jun 2026",
    };
    setLabour(prev => [newLabour, ...prev]);
    setShowAdd(false);
    setForm({ name: "", phone: "", email: "", buildingId: "" });
    showToast(`Labour ${form.name} added`);
  }

  const statusColors: Record<string, string> = {
    "Submitted": "border-sky-200",
    "In Progress": "border-amber-200",
    "Not Started": "border-slate-200",
    "Missed": "border-rose-200",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Labour"
        subtitle="All labour workers and their daily activity across buildings."
        actions={
          <Btn onClick={() => { setShowAdd(true); setForm({ name: "", phone: "", email: "", buildingId: "" }); }}>
            <Plus className="h-4 w-4" /> Add Labour
          </Btn>
        }
      />

      {/* Search */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search by name, building, or phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
            />
          </div>
          <div className="text-xs text-muted-foreground">{filtered.length} workers</div>
        </div>
      </Card>

      {/* Labour cards */}
      {filtered.length === 0 ? (
        <Card><EmptyState icon={<Search className="h-5 w-5" />} title="No labour found" body="Try adjusting your search." /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(l => (
            <div key={l.id} className={`rounded-2xl border-2 bg-card p-5 hover:shadow-elevated transition-all ${statusColors[l.todayStatus] || "border-border"}`}>
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy/10 text-sm font-bold text-navy">
                  {l.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.phone}</div>
                  <div className="mt-1">
                    <StatusPill status={l.todayStatus} />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Building</span>
                  <span className="font-medium truncate ml-2">{l.buildingName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tasks today</span>
                  <span className="font-semibold">{l.completedTasksToday}/{l.totalTasksToday}</span>
                </div>
                <div className="mt-1">
                  <ProgressBar value={l.completedTasksToday} max={l.totalTasksToday} color={l.completedTasksToday === l.totalTasksToday ? "emerald" : l.completedTasksToday > 0 ? "amber" : "rose"} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last submission</span>
                  <span className="text-foreground">{l.lastSubmission}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Week performance</span>
                  <span className="font-semibold text-emerald-700">{l.performanceWeek}%</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <Btn size="sm" variant="outline" className="flex-1" onClick={() => showToast(`Viewing ${l.name}'s checklist (demo)`)}>
                  View Checklist
                </Btn>
                <Btn size="sm" variant="ghost" onClick={() => showToast(`Building assigned (demo)`)}>
                  Assign
                </Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Labour Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Labour">
        <div className="space-y-4">
          <FormInput label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Ali Hassan" required />
          <FormInput label="Phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+966 53 000 0000" required />
          <FormInput label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="ali@building.com" type="email" />
          <FormSelect label="Assign to Building" value={form.buildingId} onChange={v => setForm(f => ({ ...f, buildingId: v }))}
            options={[{ value: "", label: "— Select Building —" }, ...mockBuildings.map(b => ({ value: b.id, label: `${b.name} (${b.city})` }))]}
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn onClick={handleAdd} disabled={!form.name || !form.phone}>Add Labour</Btn>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

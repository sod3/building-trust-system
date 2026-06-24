import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Edit, Building2, Eye, RotateCcw } from "lucide-react";
import {
  PageHeader, StatusPill, Card, Modal, FormInput, FormSelect, Btn, Toast, EmptyState,
} from "@/components/dashboard/ui";
import { mockOwners, mockBuildings, pricingPlans, type MockOwner, type PlanType, type OwnerStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/admin/owners")({
  head: () => ({ meta: [{ title: "Owners — Admin Dashboard" }] }),
  component: AdminOwners,
});

function AdminOwners() {
  const [owners, setOwners] = useState<MockOwner[]>(mockOwners);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | OwnerStatus>("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editOwner, setEditOwner] = useState<MockOwner | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Form state
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", plan: "Starter" as PlanType, status: "Active" as OwnerStatus });

  const filtered = owners.filter(o => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleAdd() {
    if (!form.name || !form.email) return;
    const planPriceMap: Record<PlanType, number> = { Starter: 299, Professional: 899, Enterprise: 1999 };
    const newOwner: MockOwner = {
      id: `OWN-${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      plan: form.plan,
      status: form.status,
      buildingIds: [],
      monthlyPayment: planPriceMap[form.plan],
      joinedDate: "Jun 2026",
      nextBilling: "Jul 2026",
    };
    setOwners(prev => [newOwner, ...prev]);
    setShowAdd(false);
    setForm({ name: "", email: "", phone: "", company: "", plan: "Starter", status: "Active" });
    showToast(`Owner ${form.name} added successfully`);
  }

  function handleEdit(o: MockOwner) {
    setEditOwner(o);
    setForm({ name: o.name, email: o.email, phone: o.phone, company: o.company, plan: o.plan, status: o.status });
  }

  function handleSaveEdit() {
    if (!editOwner) return;
    const planPriceMap: Record<PlanType, number> = { Starter: 299, Professional: 899, Enterprise: 1999 };
    setOwners(prev => prev.map(o => o.id === editOwner.id ? {
      ...o, name: form.name, email: form.email, phone: form.phone,
      company: form.company, plan: form.plan, status: form.status,
      monthlyPayment: planPriceMap[form.plan],
    } : o));
    setEditOwner(null);
    showToast("Owner updated successfully");
  }

  const planColors: Record<PlanType, string> = {
    Starter: "bg-sky-50 text-sky-700 ring-sky-200",
    Professional: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    Enterprise: "bg-navy/10 text-navy ring-navy/20",
  };

  const ownerBuildings = (ownerId: string) => mockBuildings.filter(b => b.ownerId === ownerId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Owners"
        subtitle="Manage all building owner accounts and their subscriptions."
        actions={
          <Btn onClick={() => { setShowAdd(true); setForm({ name: "", email: "", phone: "", company: "", plan: "Starter", status: "Active" }); }}>
            <Plus className="h-4 w-4" /> Add Owner
          </Btn>
        }
      />

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search owners by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            {(["All", "Active", "Trial", "Suspended"] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${filterStatus === s ? "bg-navy text-white" : "border border-border text-muted-foreground hover:bg-secondary"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground ml-auto">{filtered.length} owners</div>
        </div>
      </Card>

      {/* Owners table */}
      {filtered.length === 0 ? (
        <Card><EmptyState icon={<Search className="h-5 w-5" />} title="No matching records found" body="Try adjusting your search or filter." /></Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="pb-3">Owner</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Plan</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Buildings</th>
                  <th className="pb-3">Monthly</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-secondary/30 transition">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy/10 text-xs font-bold text-navy">
                          {o.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold">{o.name}</div>
                          <div className="text-xs text-muted-foreground">{o.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-muted-foreground">{o.phone}</td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${planColors[o.plan]}`}>
                        {o.plan}
                      </span>
                    </td>
                    <td className="py-3.5"><StatusPill status={o.status} /></td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{ownerBuildings(o.id).length}</span>
                      </div>
                    </td>
                    <td className="py-3.5 font-semibold">SAR {o.monthlyPayment.toLocaleString()}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Btn size="sm" variant="outline" onClick={() => handleEdit(o)}>
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </Btn>
                        <Btn size="sm" variant="ghost" onClick={() => showToast("Password reset email sent (demo)")}>
                          <RotateCcw className="h-3.5 w-3.5" />
                        </Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Owner Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Owner">
        <div className="space-y-4">
          <FormInput label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Ahmed Al-Farsi" required />
          <FormInput label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="owner@example.com" type="email" required />
          <FormInput label="Phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+966 55 000 0000" />
          <FormInput label="Company" value={form.company} onChange={v => setForm(f => ({ ...f, company: v }))} placeholder="Tower Group Ltd" />
          <FormSelect label="Plan" value={form.plan} onChange={v => setForm(f => ({ ...f, plan: v as PlanType }))}
            options={[{ value: "Starter", label: "Starter — SAR 299/mo" }, { value: "Professional", label: "Professional — SAR 899/mo" }, { value: "Enterprise", label: "Enterprise — SAR 1,999/mo" }]}
          />
          <FormSelect label="Status" value={form.status} onChange={v => setForm(f => ({ ...f, status: v as OwnerStatus }))}
            options={[{ value: "Active", label: "Active" }, { value: "Trial", label: "Trial" }, { value: "Suspended", label: "Suspended" }]}
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn onClick={handleAdd} disabled={!form.name || !form.email}>Add Owner</Btn>
          </div>
        </div>
      </Modal>

      {/* Edit Owner Modal */}
      <Modal open={!!editOwner} onClose={() => setEditOwner(null)} title="Edit Owner">
        <div className="space-y-4">
          <FormInput label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
          <FormInput label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" required />
          <FormInput label="Phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
          <FormInput label="Company" value={form.company} onChange={v => setForm(f => ({ ...f, company: v }))} />
          <FormSelect label="Plan" value={form.plan} onChange={v => setForm(f => ({ ...f, plan: v as PlanType }))}
            options={[{ value: "Starter", label: "Starter — SAR 299/mo" }, { value: "Professional", label: "Professional — SAR 899/mo" }, { value: "Enterprise", label: "Enterprise — SAR 1,999/mo" }]}
          />
          <FormSelect label="Status" value={form.status} onChange={v => setForm(f => ({ ...f, status: v as OwnerStatus }))}
            options={[{ value: "Active", label: "Active" }, { value: "Trial", label: "Trial" }, { value: "Suspended", label: "Suspended" }]}
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setEditOwner(null)}>Cancel</Btn>
            <Btn onClick={handleSaveEdit}>Save Changes</Btn>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

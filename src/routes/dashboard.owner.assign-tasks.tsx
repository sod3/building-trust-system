import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, ClipboardList, AlertTriangle } from "lucide-react";
import { Card, Btn, Toast, StatusPill, PageHeader, FormInput, FormSelect, EmptyState } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api-client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/owner/assign-tasks")({
  head: () => ({ meta: [{ title: "Checklist Templates - Owner Dashboard" }] }),
  component: OwnerAssignTasks,
});

function OwnerAssignTasks() {
  const { t } = useLang();
  const [dashboard, setDashboard] = useState<any | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ name: "", buildingId: "" });
  const [items, setItems] = useState([{ title: "", icon: "CheckCircle2", required: true }]);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function load() {
    apiFetch<any>("/api/owner/overview")
      .then((result) => {
        setDashboard(result);
        setTemplates(result.templates || []);
      })
      .catch((error) => showToast(error instanceof Error ? error.message : "Could not load templates.", "error"));
  }

  useEffect(load, []);

  async function handleCreateTemplate() {
    try {
      await apiFetch("/api/checklist-templates", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          buildingId: form.buildingId || undefined,
          items: items.map((item, order) => ({ ...item, order })).filter((item) => item.title.trim()),
        }),
      });
      setForm({ name: "", buildingId: "" });
      setItems([{ title: "", icon: "CheckCircle2", required: true }]);
      showToast("Checklist template saved.");
      load();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not save template.", "error");
    }
  }

  const plan = dashboard?.plan;
  const buildings = dashboard?.buildings || [];
  const featureLocked = plan && !plan.checklistTemplates;

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title={t("owner.assign.title", { fallback: "Checklist Templates" })}
        subtitle="Create reusable checklist templates for labour daily reports."
      />

      {featureLocked && (
        <Card className="border-amber-200 bg-amber-50 text-amber-900">
          <div className="flex items-start gap-3 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Checklist template creation is not included in Starter. Upgrade to Professional to create reusable templates.</span>
          </div>
        </Card>
      )}

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-navy" />
          <h3 className="font-display font-semibold">Create Template</h3>
        </div>
        <div className="space-y-4">
          <FormInput label="Template Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} required />
          <FormSelect
            label="Building"
            value={form.buildingId}
            onChange={(value) => setForm((current) => ({ ...current, buildingId: value }))}
            options={[{ value: "", label: "All buildings" }, ...buildings.map((building: any) => ({ value: building.id, label: building.name }))]}
          />

          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={item.title}
                  onChange={(event) => setItems((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, title: event.target.value } : row))}
                  disabled={featureLocked}
                  placeholder={`Task ${index + 1}`}
                  className="h-10 flex-1 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                <Btn variant="ghost" onClick={() => setItems((current) => current.filter((_, rowIndex) => rowIndex !== index))} disabled={items.length === 1 || featureLocked}>
                  <Trash2 className="h-4 w-4" />
                </Btn>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Btn variant="secondary" onClick={() => setItems((current) => [...current, { title: "", icon: "CheckCircle2", required: true }])} disabled={featureLocked}>
              <Plus className="h-4 w-4" /> Add Task
            </Btn>
            <Btn onClick={handleCreateTemplate} disabled={featureLocked || !form.name || !items.some((item) => item.title.trim())}>
              Save Template
            </Btn>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-display font-semibold">Existing Templates</h3>
        {templates.length === 0 ? (
          <EmptyState title="No templates yet" body="Create your first template to guide labour daily reports." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {templates.map((template) => (
              <div key={template._id} className="rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{template.name}</div>
                    <div className="text-xs text-muted-foreground">{template.buildingId ? buildings.find((building: any) => building.id === template.buildingId)?.name || "Specific building" : "All buildings"}</div>
                  </div>
                  <StatusPill status={`${template.items?.length || 0} tasks`} />
                </div>
                <div className="mt-3 space-y-1.5">
                  {(template.items || []).slice(0, 6).map((item: any) => (
                    <div key={`${template._id}-${item.order}-${item.title}`} className="rounded-xl bg-secondary px-3 py-2 text-sm">{item.title}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

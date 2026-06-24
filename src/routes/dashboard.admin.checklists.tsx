import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, ClipboardList, ChevronDown, ChevronUp, Copy, Building2, Trash2 } from "lucide-react";
import {
  PageHeader, Card, Modal, FormInput, FormSelect, Btn, Toast, StatusPill,
} from "@/components/dashboard/ui";
import { mockChecklistTemplates, type ChecklistTemplate } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/admin/checklists")({
  head: () => ({ meta: [{ title: "Checklist Templates — Admin Dashboard" }] }),
  component: AdminChecklists,
});

function AdminChecklists() {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>(mockChecklistTemplates);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskCat, setNewTaskCat] = useState("Cleaning");
  const [newTaskFreq, setNewTaskFreq] = useState("Daily");
  const [newTaskPriority, setNewTaskPriority] = useState<"Normal" | "Important">("Normal");
  const [tempTasks, setTempTasks] = useState<ChecklistTemplate["tasks"]>([]);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function addTaskToForm() {
    if (!newTaskName.trim()) return;
    setTempTasks(prev => [...prev, { name: newTaskName, category: newTaskCat, frequency: newTaskFreq, priority: newTaskPriority, photoRequired: false }]);
    setNewTaskName("");
  }

  function handleCreateTemplate() {
    if (!form.name.trim() || tempTasks.length === 0) return;
    const newTemplate: ChecklistTemplate = {
      id: `TPL-${Date.now()}`,
      name: form.name,
      description: form.description,
      tasks: tempTasks,
      assignedBuildings: [],
      createdAt: "Jun 24, 2026",
    };
    setTemplates(prev => [newTemplate, ...prev]);
    setShowAdd(false);
    setForm({ name: "", description: "" });
    setTempTasks([]);
    showToast(`Template "${form.name}" created`);
  }

  function handleDuplicate(t: ChecklistTemplate) {
    const copy: ChecklistTemplate = { ...t, id: `TPL-${Date.now()}`, name: `${t.name} (Copy)`, assignedBuildings: [] };
    setTemplates(prev => [copy, ...prev]);
    showToast(`Template duplicated`);
  }

  const categories = ["Cleaning", "Elevator", "Waste", "Water", "Lighting", "Parking", "Security", "Safety", "AC", "Generator"];
  const iconMap: Record<string, string> = {
    Cleaning: "🧹", Elevator: "🛗", Waste: "🗑️", Water: "💧", Lighting: "💡",
    Parking: "🚗", Security: "🛡️", Safety: "🔥", AC: "❄️", Generator: "⚡",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Checklist Templates"
        subtitle="Create and manage daily task templates for buildings and labour."
        actions={
          <Btn onClick={() => { setShowAdd(true); setForm({ name: "", description: "" }); setTempTasks([]); }}>
            <Plus className="h-4 w-4" /> Create Template
          </Btn>
        }
      />

      <div className="space-y-4">
        {templates.map(t => (
          <Card key={t.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-navy/10">
                  <ClipboardList className="h-5 w-5 text-navy" />
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{t.tasks.length} tasks</span>
                    <span>·</span>
                    <span>Created {t.createdAt}</span>
                    {t.assignedBuildings.length > 0 && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{t.assignedBuildings.length} buildings</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Btn size="sm" variant="ghost" onClick={() => handleDuplicate(t)}>
                  <Copy className="h-3.5 w-3.5" /> Duplicate
                </Btn>
                <Btn size="sm" variant="outline" onClick={() => showToast("Building assigned (demo)")}>
                  <Building2 className="h-3.5 w-3.5" /> Assign
                </Btn>
                <button
                  onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                  className="grid h-8 w-8 place-items-center rounded-xl border border-border hover:bg-secondary transition text-muted-foreground"
                >
                  {expanded === t.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {expanded === t.id && (
              <div className="mt-4 border-t border-border pt-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  {t.tasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-3">
                      <span className="text-lg">{iconMap[task.category] || "📋"}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{task.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-muted-foreground">{task.category}</span>
                          <span className="text-[11px] text-muted-foreground">·</span>
                          <span className="text-[11px] text-muted-foreground">{task.frequency}</span>
                          <StatusPill status={task.priority} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Create Template Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create Checklist Template">
        <div className="space-y-4">
          <FormInput label="Template Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Daily Cleaning Checklist" required />
          <FormInput label="Description" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Brief description..." />

          <div>
            <div className="text-sm font-medium text-foreground mb-3">Add Tasks</div>
            <div className="space-y-3 rounded-xl border border-border p-3 bg-secondary/30">
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={newTaskName}
                  onChange={e => setNewTaskName(e.target.value)}
                  placeholder="Task name..."
                  className="h-9 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent transition col-span-2"
                />
                <select value={newTaskCat} onChange={e => setNewTaskCat(e.target.value)} className="h-9 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent transition">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={newTaskFreq} onChange={e => setNewTaskFreq(e.target.value)} className="h-9 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent transition">
                  {["Daily", "Weekly", "Monthly"].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value as "Normal" | "Important")} className="h-8 flex-1 rounded-xl border border-border bg-background px-3 text-xs outline-none focus:border-accent transition">
                  <option value="Normal">Normal Priority</option>
                  <option value="Important">Important Priority</option>
                </select>
                <Btn size="sm" onClick={addTaskToForm} disabled={!newTaskName.trim()}>+ Add Task</Btn>
              </div>
            </div>
          </div>

          {tempTasks.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{tempTasks.length} task(s) added</div>
              {tempTasks.map((task, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm">
                  <span>{iconMap[task.category] || "📋"}</span>
                  <span className="flex-1">{task.name}</span>
                  <span className="text-xs text-muted-foreground">{task.category}</span>
                  <button onClick={() => setTempTasks(prev => prev.filter((_, idx) => idx !== i))} className="text-rose-500 hover:text-rose-700">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn onClick={handleCreateTemplate} disabled={!form.name.trim() || tempTasks.length === 0}>
              Create Template
            </Btn>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

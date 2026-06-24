import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronRight, CheckCircle2, Plus, Trash2, Building2, User, ClipboardList,
  Brush, Square, Trash, Droplets, Lightbulb, ArrowUp, Car, Shield, Snowflake, Zap,
} from "lucide-react";
import { Card, Btn, Toast, StatusPill } from "@/components/dashboard/ui";
import { useAuth } from "@/lib/auth-context";
import { mockOwners, mockBuildings, mockLabour, mockChecklistTemplates } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/owner/assign-tasks")({
  head: () => ({ meta: [{ title: "Assign Tasks — Owner Dashboard" }] }),
  component: OwnerAssignTasks,
});

const categoryIcons: Record<string, React.ReactNode> = {
  Cleaning: <Brush className="h-5 w-5" />,
  Elevator: <Square className="h-5 w-5" />,
  Waste: <Trash className="h-5 w-5" />,
  Water: <Droplets className="h-5 w-5" />,
  Lighting: <Lightbulb className="h-5 w-5" />,
  Parking: <Car className="h-5 w-5" />,
  Security: <Shield className="h-5 w-5" />,
  Safety: <Shield className="h-5 w-5" />,
  AC: <Snowflake className="h-5 w-5" />,
  Generator: <Zap className="h-5 w-5" />,
};

const categoryColors: Record<string, string> = {
  Cleaning: "bg-blue-50 text-blue-700",
  Elevator: "bg-purple-50 text-purple-700",
  Waste: "bg-slate-50 text-slate-700",
  Water: "bg-cyan-50 text-cyan-700",
  Lighting: "bg-amber-50 text-amber-700",
  Parking: "bg-orange-50 text-orange-700",
  Security: "bg-navy/10 text-navy",
  Safety: "bg-rose-50 text-rose-700",
  AC: "bg-sky-50 text-sky-700",
  Generator: "bg-yellow-50 text-yellow-700",
};

const categories = ["Cleaning", "Elevator", "Waste", "Water", "Lighting", "Parking", "Security", "AC", "Generator"];

function OwnerAssignTasks() {
  const { user } = useAuth();
  const owner = mockOwners.find(o => o.id === user?.ownerId) || mockOwners[0];
  const myBuildings = mockBuildings.filter(b => owner.buildingIds.includes(b.id));
  const myLabour = mockLabour.filter(l => l.ownerId === owner.id);

  const [step, setStep] = useState(1);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedLabour, setSelectedLabour] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customTasks, setCustomTasks] = useState<{ name: string; category: string; priority: "Normal" | "Important" }[]>([]);
  const [newTask, setNewTask] = useState({ name: "", category: "Cleaning", priority: "Normal" as "Normal" | "Important" });
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function addTask() {
    if (!newTask.name.trim()) return;
    setCustomTasks(prev => [...prev, { ...newTask }]);
    setNewTask({ name: "", category: "Cleaning", priority: "Normal" });
  }

  function handleSaveAssignment() {
    const totalTasks = selectedTemplate
      ? mockChecklistTemplates.find(t => t.id === selectedTemplate)?.tasks.length || 0
      : customTasks.length;
    if (totalTasks === 0) { showToast("Please add at least one task", "error"); return; }
    setSubmitted(true);
    showToast("Tasks assigned successfully!");
  }

  const building = myBuildings.find(b => b.id === selectedBuilding);
  const labour = myLabour.find(l => l.id === selectedLabour);
  const template = mockChecklistTemplates.find(t => t.id === selectedTemplate);

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-emerald-100 mb-4">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="font-display text-2xl font-semibold">Tasks Assigned!</h2>
        <p className="mt-2 text-muted-foreground max-w-sm">
          Daily checklist has been assigned to <strong>{labour?.name}</strong> for <strong>{building?.name}</strong>.
          Labour will see the tasks in their dashboard.
        </p>
        <div className="mt-6 flex gap-3">
          <Btn onClick={() => { setSubmitted(false); setStep(1); setSelectedBuilding(""); setSelectedLabour(""); setSelectedTemplate(""); setCustomTasks([]); }}>
            Assign More Tasks
          </Btn>
          <Btn variant="secondary" onClick={() => window.history.back()}>Back to Dashboard</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-semibold">Assign Daily Tasks</h1>
        <p className="mt-1 text-sm text-muted-foreground">Select a building, assign labour, and choose or create a checklist.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[
          { n: 1, label: "Building" },
          { n: 2, label: "Labour" },
          { n: 3, label: "Checklist" },
          { n: 4, label: "Review" },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <button
              onClick={() => step > s.n && setStep(s.n)}
              className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                step === s.n ? "bg-navy text-white" :
                step > s.n ? "bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200" :
                "bg-secondary text-muted-foreground"
              }`}
            >
              <span className={`grid h-5 w-5 place-items-center rounded-full text-xs font-bold ${step === s.n ? "bg-white/20" : ""}`}>{s.n}</span>
              {s.label}
            </button>
            {i < 3 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {/* Step 1: Building */}
      {step === 1 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-navy" />
            <h3 className="font-display font-semibold">Select Building</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {myBuildings.map(b => (
              <button
                key={b.id}
                onClick={() => { setSelectedBuilding(b.id); setStep(2); }}
                className={`rounded-xl border-2 p-4 text-left transition-all hover:shadow-md active:scale-[0.99] ${
                  selectedBuilding === b.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"
                }`}
              >
                <img src={b.cover} alt={b.name} className="h-20 w-full rounded-lg object-cover mb-3" />
                <div className="font-semibold">{b.name}</div>
                <div className="text-xs text-muted-foreground">{b.city}</div>
                <div className="mt-2"><StatusPill status={b.status} /></div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Step 2: Labour */}
      {step === 2 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-navy" />
            <h3 className="font-display font-semibold">Select Labour for {building?.name}</h3>
          </div>
          <div className="space-y-3">
            {myLabour.filter(l => l.buildingId === selectedBuilding || !l.buildingId).map(l => (
              <button
                key={l.id}
                onClick={() => { setSelectedLabour(l.id); setStep(3); }}
                className={`w-full flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${
                  selectedLabour === l.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"
                }`}
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-navy/10 text-sm font-bold text-navy">
                  {l.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.phone}</div>
                  <div className="text-xs text-muted-foreground">{l.buildingName}</div>
                </div>
                <div>
                  <StatusPill status={l.todayStatus} />
                  <div className="text-xs text-muted-foreground mt-1">{l.performanceWeek}% this week</div>
                </div>
              </button>
            ))}
            {myLabour.filter(l => l.buildingId === selectedBuilding).length === 0 && (
              <div className="text-center py-6 text-sm text-muted-foreground">No labour directly assigned to this building. Showing all your workers.</div>
            )}
          </div>
          <div className="mt-4">
            <Btn variant="secondary" onClick={() => setStep(1)}>← Back</Btn>
          </div>
        </Card>
      )}

      {/* Step 3: Checklist */}
      {step === 3 && (
        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-5 w-5 text-navy" />
              <h3 className="font-display font-semibold">Choose Checklist Template</h3>
            </div>
            <div className="space-y-2">
              {mockChecklistTemplates.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedTemplate(t.id); setCustomTasks([]); }}
                  className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                    selectedTemplate === t.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{t.name}</div>
                    <span className="text-xs text-muted-foreground">{t.tasks.length} tasks</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Or build custom */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Plus className="h-5 w-5 text-navy" />
              <h3 className="font-display font-semibold">Or Create Custom Tasks</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <input
                  value={newTask.name}
                  onChange={e => setNewTask(n => ({ ...n, name: e.target.value }))}
                  placeholder="Task name..."
                  className="h-9 flex-1 min-w-32 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent transition"
                />
                <select value={newTask.category} onChange={e => setNewTask(n => ({ ...n, category: e.target.value }))}
                  className="h-9 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent transition">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={newTask.priority} onChange={e => setNewTask(n => ({ ...n, priority: e.target.value as "Normal" | "Important" }))}
                  className="h-9 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent transition">
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                </select>
                <Btn size="sm" onClick={addTask} disabled={!newTask.name.trim()}>+ Add</Btn>
              </div>

              {customTasks.length > 0 && (
                <div className="space-y-1.5 mt-2">
                  {customTasks.map((t, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-secondary px-3 py-2">
                      <span className={`grid h-7 w-7 place-items-center rounded-lg text-xs ${categoryColors[t.category] || "bg-secondary text-muted-foreground"}`}>
                        {categoryIcons[t.category] || "📋"}
                      </span>
                      <span className="flex-1 text-sm">{t.name}</span>
                      <StatusPill status={t.priority} />
                      <button onClick={() => setCustomTasks(prev => prev.filter((_, idx) => idx !== i))} className="text-rose-400 hover:text-rose-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <div className="flex gap-2">
            <Btn variant="secondary" onClick={() => setStep(2)}>← Back</Btn>
            <Btn onClick={() => { if (selectedTemplate || customTasks.length > 0) setStep(4); else showToast("Select a template or add tasks", "error"); }}>
              Review Assignment →
            </Btn>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <Card>
          <h3 className="font-display font-semibold mb-4">Review & Save Assignment</h3>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
              <Building2 className="h-5 w-5 text-navy shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">Building</div>
                <div className="font-semibold">{building?.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
              <User className="h-5 w-5 text-navy shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">Labour</div>
                <div className="font-semibold">{labour?.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
              <ClipboardList className="h-5 w-5 text-navy shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">Checklist</div>
                <div className="font-semibold">
                  {template ? template.name : `${customTasks.length} custom tasks`}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Task Preview</div>
            <div className="space-y-1.5">
              {(template ? template.tasks : customTasks).map((t, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-xl border border-border px-3 py-2">
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs ${categoryColors[t.category] || "bg-secondary"}`}>
                    {categoryIcons[t.category]}
                  </span>
                  <span className="flex-1 text-sm">{t.name}</span>
                  <StatusPill status={t.priority} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Btn variant="secondary" onClick={() => setStep(3)}>← Back</Btn>
            <Btn onClick={handleSaveAssignment}>
              <CheckCircle2 className="h-4 w-4" /> Save Assignment
            </Btn>
          </div>
        </Card>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

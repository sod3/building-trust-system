import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, PageHeader, StatusPill } from "@/components/dashboard/ui";
import { tasks, buildings, type TaskStatus } from "@/lib/mock-data";
import { Plus, Search, X, Camera } from "lucide-react";

export const Route = createFileRoute("/dashboard/tasks")({
  component: TasksPage,
});

const statuses: ("All"|TaskStatus)[] = ["All","pending","submitted","approved","rejected","overdue"];

function TasksPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<typeof statuses[number]>("All");
  const [bld, setBld] = useState("All");
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");

  const filtered = tasks.filter(t =>
    (tab === "All" || t.status === tab) &&
    (bld === "All" || t.building === bld) &&
    (q === "" || t.name.toLowerCase().includes(q.toLowerCase()) || t.id.toLowerCase().includes(q.toLowerCase()))
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    setToast("Task created and scheduled.");
    setTimeout(()=>setToast(""), 2500);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        subtitle="Schedule recurring building tasks. Every task ends with a verified photo and a supervisor decision."
        actions={
          <button onClick={()=>setOpen(true)} className="inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-navy/90">
            <Plus className="h-4 w-4" /> New task
          </button>
        }
      />

      <Card className="!p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1 rounded-lg bg-secondary p-1">
            {statuses.map(s => (
              <button key={s} onClick={()=>setTab(s)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${tab === s ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or ID" className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
          <select value={bld} onChange={e=>setBld(e.target.value)} className="h-9 rounded-md border border-border bg-background px-3 text-sm">
            <option>All</option>
            {buildings.map(b => <option key={b.id}>{b.name}</option>)}
          </select>
        </div>
      </Card>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Building</th>
                <th className="px-4 py-3">Labor</th>
                <th className="px-4 py-3">Supervisor</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{t.name}</div>
                    <div className="text-[11px] text-muted-foreground">{t.id} · {t.category} · {t.frequency}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{t.building}<div className="text-[11px]">{t.area}</div></td>
                  <td className="px-4 py-3 text-muted-foreground">{t.labor}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.supervisor}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.due}</td>
                  <td className="px-4 py-3"><StatusPill status={t.priority} /></td>
                  <td className="px-4 py-3">
                    {t.proof
                      ? <img src={t.proof} alt="" className="h-9 w-9 rounded-md object-cover ring-1 ring-border" />
                      : <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Camera className="h-3 w-3" /> -</span>}
                  </td>
                  <td className="px-4 py-3"><StatusPill status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40 p-4 backdrop-blur-sm">
          <form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-elevated">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-accent">Create task</div>
                <h3 className="font-display text-lg font-semibold">Schedule a building task</h3>
              </div>
              <button type="button" onClick={()=>setOpen(false)} className="rounded-md p-1 hover:bg-secondary"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Task name" full><input className="field" defaultValue="Clean main entrance" /></Field>
              <Field label="Category"><select className="field"><option>Cleaning</option><option>Elevator</option><option>Water</option><option>Lighting</option></select></Field>
              <Field label="Building"><select className="field">{buildings.map(b => <option key={b.id}>{b.name}</option>)}</select></Field>
              <Field label="Floor / area"><input className="field" defaultValue="Floor 1" /></Field>
              <Field label="Frequency"><select className="field"><option>Daily</option><option>Weekly</option><option>Monthly</option></select></Field>
              <Field label="Due time"><input className="field" defaultValue="09:00" /></Field>
              <Field label="Priority"><select className="field"><option>Medium</option><option>High</option><option>Low</option></select></Field>
              <Field label="Photo required"><label className="mt-1 inline-flex items-center gap-2 text-xs"><input type="checkbox" defaultChecked /> Yes - mandatory photo</label></Field>
              <Field label="Notes" full><textarea className="field h-20" placeholder="Optional instructions for the labor team" /></Field>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={()=>setOpen(false)} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary">Cancel</button>
              <button className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-navy/90">Create task</button>
            </div>
          </form>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-navy px-4 py-3 text-sm font-medium text-primary-foreground shadow-elevated">{toast}</div>
      )}

      <style>{`.field{height:36px;width:100%;border-radius:8px;border:1px solid var(--border);background:var(--background);padding:0 10px;font-size:13px;outline:none}.field:focus{box-shadow:0 0 0 2px oklch(0.55 0.11 245 / 0.25)}textarea.field{height:auto;padding:8px 10px}`}</style>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "col-span-2" : ""}`}>
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

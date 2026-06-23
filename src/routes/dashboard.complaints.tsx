import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, PageHeader, StatusPill } from "@/components/dashboard/ui";
import { complaints, type Complaint } from "@/lib/mock-data";
import { Search, X, MessageSquareWarning } from "lucide-react";

export const Route = createFileRoute("/dashboard/complaints")({
  component: ComplaintsPage,
});

const tabs = ["All","open","in-progress","resolved","closed"] as const;

function ComplaintsPage() {
  const [tab, setTab] = useState<typeof tabs[number]>("All");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Complaint | null>(null);

  const filtered = complaints.filter(c =>
    (tab === "All" || c.status === tab) &&
    (q === "" || c.description.toLowerCase().includes(q.toLowerCase()) || c.id.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Complaints" subtitle="Every complaint is a ticket - with status, SLA, and an owner-visible audit trail." />

      <Card className="!p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1 rounded-lg bg-secondary p-1">
            {tabs.map(t => (
              <button key={t} onClick={()=>setTab(t)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {t.replace("-"," ")}
              </button>
            ))}
          </div>
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by ticket # or description" className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
        </div>
      </Card>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Ticket</th>
                <th className="px-4 py-3">Building / Unit</th>
                <th className="px-4 py-3">Tenant</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Assigned</th>
                <th className="px-4 py-3">SLA</th>
                <th className="px-4 py-3">Status</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3"><div className="font-medium text-foreground">{c.id}</div><div className="max-w-[220px] truncate text-[11px] text-muted-foreground">{c.description}</div></td>
                  <td className="px-4 py-3 text-muted-foreground">{c.building}<div className="text-[11px]">{c.unit}</div></td>
                  <td className="px-4 py-3 text-muted-foreground">{c.tenant}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.category}</td>
                  <td className="px-4 py-3"><StatusPill status={c.priority} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{c.assigned}</td>
                  <td className="px-4 py-3"><StatusPill status={c.sla} /></td>
                  <td className="px-4 py-3"><StatusPill status={c.status} /></td>
                  <td className="px-4 py-3 text-right"><button onClick={()=>setActive(c)} className="rounded-md border border-border px-2.5 py-1 text-[11px] hover:bg-secondary">Open</button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-muted-foreground">No complaints match.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {active && (
        <div className="fixed inset-0 z-50 flex justify-end bg-navy/40 backdrop-blur-sm" onClick={()=>setActive(null)}>
          <div className="h-full w-full max-w-md overflow-y-auto bg-card p-6 shadow-elevated" onClick={e=>e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-accent">{active.id}</div>
                <h3 className="font-display text-lg font-semibold">{active.category} complaint</h3>
              </div>
              <button onClick={()=>setActive(null)} className="rounded-md p-1 hover:bg-secondary"><X className="h-4 w-4" /></button>
            </div>
            {active.photo && <img src={active.photo} alt="" className="mt-4 h-44 w-full rounded-xl object-cover" />}
            <div className="mt-4 space-y-3 text-sm">
              <Info label="Description">{active.description}</Info>
              <div className="grid grid-cols-2 gap-3">
                <Info label="Building">{active.building}</Info>
                <Info label="Unit">{active.unit}</Info>
                <Info label="Tenant">{active.tenant}</Info>
                <Info label="Assigned">{active.assigned}</Info>
                <Info label="Created">{active.created}</Info>
                <Info label="SLA"><StatusPill status={active.sla} /></Info>
              </div>
              <div>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Timeline</div>
                <ol className="relative ml-2 space-y-3 border-l border-border pl-4">
                  <Step time="Received" desc="Tenant scanned QR & submitted" done />
                  <Step time="Assigned" desc={`Routed to ${active.assigned}`} done />
                  <Step time="In progress" desc="Labor dispatched on site" done={active.status !== "open"} />
                  <Step time="Resolved" desc="Complaint closed" done={active.status === "resolved" || active.status === "closed"} />
                </ol>
              </div>
              <textarea placeholder="Add internal note…" className="h-20 w-full rounded-md border border-border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
              <div className="flex gap-2">
                <button className="flex-1 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">Mark resolved</button>
                <button className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary">Reassign</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-secondary/30 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm text-foreground">{children}</div>
    </div>
  );
}
function Step({ time, desc, done }: { time: string; desc: string; done?: boolean }) {
  return (
    <li className="relative">
      <span className={`absolute -left-[22px] top-1 grid h-3 w-3 place-items-center rounded-full ring-4 ring-card ${done ? "bg-emerald-500" : "bg-border"}`} />
      <div className="text-xs font-semibold">{time}</div>
      <div className="text-[11px] text-muted-foreground">{desc}</div>
    </li>
  );
}

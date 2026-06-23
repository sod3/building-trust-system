import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, PageHeader, StatusPill, Kpi } from "@/components/dashboard/ui";
import { buildings } from "@/lib/mock-data";
import { Search, Filter, Plus, Building2, ListChecks, MessageSquareWarning } from "lucide-react";

export const Route = createFileRoute("/dashboard/buildings")({
  component: BuildingsPage,
});

function BuildingsPage() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("All");
  const [status, setStatus] = useState("All");
  const cities = ["All", ...Array.from(new Set(buildings.map(b => b.city)))];
  const statuses = ["All","excellent","good","attention","critical"];
  const filtered = buildings.filter(b =>
    (q === "" || b.name.toLowerCase().includes(q.toLowerCase()) || b.city.toLowerCase().includes(q.toLowerCase())) &&
    (city === "All" || b.city === city) &&
    (status === "All" || b.status === status)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Buildings"
        subtitle="Manage every building in your portfolio - health, tasks, complaints, owners."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-navy/90">
            <Plus className="h-4 w-4" /> Add building
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Total buildings" value={buildings.length} icon={<Building2 className="h-4 w-4" />} />
        <Kpi label="Avg health" value={`${Math.round(buildings.reduce((s,b)=>s+b.health,0)/buildings.length)}%`} />
        <Kpi label="Tasks today" value={buildings.reduce((s,b)=>s+b.tasksToday.done,0)} icon={<ListChecks className="h-4 w-4" />} />
        <Kpi label="Open complaints" value={buildings.reduce((s,b)=>s+b.openComplaints,0)} icon={<MessageSquareWarning className="h-4 w-4" />} />
      </div>

      <Card className="!p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search buildings…" className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none ring-ring/30 focus:ring-2" />
          </div>
          <select value={city} onChange={e=>setCity(e.target.value)} className="h-9 rounded-md border border-border bg-background px-3 text-sm">
            {cities.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={status} onChange={e=>setStatus(e.target.value)} className="h-9 rounded-md border border-border bg-background px-3 text-sm capitalize">
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-secondary">
            <Filter className="h-4 w-4" /> More filters
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(b => (
          <div key={b.id} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-elevated">
            <div className="relative h-36 overflow-hidden">
              <img src={b.cover} alt={b.name} className="h-full w-full object-cover transition group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-navy/90 to-transparent p-3 text-white">
                <div>
                  <div className="text-xs opacity-80">{b.id} · {b.city}</div>
                  <div className="font-display text-base font-semibold">{b.name}</div>
                </div>
                <StatusPill status={b.status} />
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <Stat label="Floors" value={b.floors} />
                <Stat label="Units" value={b.units} />
                <Stat label="Labor" value={b.laborCount} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Owner: <span className="text-foreground">{b.owner}</span></span>
                <span>Supervisor: <span className="text-foreground">{b.supervisor}</span></span>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Building health</span>
                  <span className="font-semibold text-foreground">{b.health}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full ${b.health >= 90 ? "bg-emerald-500" : b.health >= 80 ? "bg-sky-500" : b.health >= 70 ? "bg-amber-500" : "bg-rose-500"}`}
                    style={{ width: `${b.health}%` }}
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Tasks today: <span className="font-medium text-foreground">{b.tasksToday.done}/{b.tasksToday.total}</span></span>
                <span className="text-muted-foreground">Complaints: <span className="font-medium text-foreground">{b.openComplaints}</span></span>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-md bg-navy px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-navy/90">Open</button>
                <button className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary">Tasks</button>
                <button className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary">Report</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-secondary/60 py-2">
      <div className="font-display text-lg font-semibold text-foreground">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

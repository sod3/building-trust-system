import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, StatusPill, Kpi, SectionTitle } from "@/components/dashboard/ui";
import { users, buildings } from "@/lib/mock-data";
import { Users, Search, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/staff")({
  component: StaffPage,
});

function StaffPage() {
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");
  const tabs = ["All","Property admin","Supervisor","Labor"];
  const map: Record<string,string> = { "Property admin": "property-admin", Supervisor: "supervisor", Labor: "labor" };
  const filtered = users.filter(u =>
    (tab === "All" || u.role === map[tab]) &&
    (u.role !== "owner" && u.role !== "tenant" && u.role !== "super-admin") &&
    (q === "" || u.name.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Staff" subtitle="Property admins, supervisors and labor workers across your portfolio."
        actions={<button className="inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-navy/90"><Plus className="h-4 w-4" />Add staff</button>} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Total staff" value={users.filter(u=>["supervisor","labor","property-admin"].includes(u.role)).length} icon={<Users className="h-4 w-4" />} />
        <Kpi label="Active labor" value={users.filter(u=>u.role==="labor"&&u.status==="active").length} />
        <Kpi label="Supervisors" value={users.filter(u=>u.role==="supervisor").length} />
        <Kpi label="Avg approval %" value={`${Math.round(users.filter(u=>u.role==="labor").reduce((s,u)=>s+(u.approvalRate||0),0)/users.filter(u=>u.role==="labor").length)}%`} />
      </div>

      <Card className="!p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1 rounded-lg bg-secondary p-1">
            {tabs.map(t => (
              <button key={t} onClick={()=>setTab(t)} className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${tab===t?"bg-background text-foreground shadow-sm":"text-muted-foreground hover:text-foreground"}`}>{t}</button>
            ))}
          </div>
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search staff" className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
        </div>
      </Card>

      <Card className="!p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Buildings</th><th className="px-4 py-3">Tasks</th><th className="px-4 py-3">Approval</th><th className="px-4 py-3">Last active</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-navy text-[11px] font-semibold text-primary-foreground">{u.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</span><div className="font-medium">{u.name}</div></div>
                </td>
                <td className="px-4 py-3 text-muted-foreground capitalize">{u.role.replace("-"," ")}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.buildings.map(id => buildings.find(b=>b.id===id)?.name.split(" ").slice(0,2).join(" ")).filter(Boolean).join(", ")}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.tasksDone ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.approvalRate ? `${u.approvalRate}%` : "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.lastActive}</td>
                <td className="px-4 py-3"><StatusPill status={u.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

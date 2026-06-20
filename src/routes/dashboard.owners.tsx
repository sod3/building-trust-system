import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, StatusPill, Kpi } from "@/components/dashboard/ui";
import { users, buildings } from "@/lib/mock-data";
import { Crown, Building2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/owners")({
  component: OwnersPage,
});

function OwnersPage() {
  const owners = users.filter(u => u.role === "owner");
  return (
    <div className="space-y-6">
      <PageHeader title="Owners" subtitle="Property owners with read-only dashboards scoped to their assigned buildings." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Owners" value={owners.length} icon={<Crown className="h-4 w-4" />} />
        <Kpi label="Buildings owned" value={owners.reduce((s,o)=>s+o.buildings.length,0)} icon={<Building2 className="h-4 w-4" />} />
        <Kpi label="Reports ready" value={owners.length} sub="June 2026" />
        <Kpi label="Dashboard access" value="All active" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {owners.map(o => (
          <Card key={o.id}>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-navy text-primary-foreground">{o.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</span>
              <div className="min-w-0">
                <div className="truncate font-display font-semibold">{o.name}</div>
                <div className="truncate text-xs text-muted-foreground">{o.email}</div>
              </div>
              <StatusPill status={o.status} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-md bg-secondary/60 py-2"><div className="font-semibold">{o.buildings.length}</div><div className="text-muted-foreground">Buildings</div></div>
              <div className="rounded-md bg-secondary/60 py-2"><div className="font-semibold">Read-only</div><div className="text-muted-foreground">Access</div></div>
              <div className="rounded-md bg-secondary/60 py-2"><div className="font-semibold">Monthly</div><div className="text-muted-foreground">Report</div></div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">Buildings: {o.buildings.map(id => buildings.find(b=>b.id===id)?.name).filter(Boolean).join(", ")}</div>
            <div className="mt-3 text-[11px] text-muted-foreground">Last login: <span className="text-foreground">{o.lastActive}</span></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

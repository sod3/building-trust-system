import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, StatusPill, Kpi } from "@/components/dashboard/ui";
import { maintenance } from "@/lib/mock-data";
import { Wrench, Plus, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/dashboard/maintenance")({
  component: MaintenancePage,
});

function MaintenancePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Maintenance" subtitle="Track elevator, HVAC, plumbing, fire safety and structural issues with vendors and costs."
        actions={<button className="inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-navy/90"><Plus className="h-4 w-4" />Report issue</button>} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Open issues" value={maintenance.filter(m=>m.status==="open").length} icon={<AlertTriangle className="h-4 w-4" />} accent="rose" />
        <Kpi label="In progress" value={maintenance.filter(m=>m.status==="in-progress").length} icon={<Clock className="h-4 w-4" />} accent="gold" />
        <Kpi label="Completed (mo)" value={maintenance.filter(m=>m.status==="completed").length} icon={<CheckCircle2 className="h-4 w-4" />} accent="teal" />
        <Kpi label="Est. cost (open)" value={`${maintenance.filter(m=>m.status!=="completed").reduce((s,m)=>s+m.estCost,0).toLocaleString()} SAR`} icon={<Wrench className="h-4 w-4" />} />
      </div>

      <Card className="!p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Issue</th><th className="px-4 py-3">Building / Area</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Reported by</th><th className="px-4 py-3">Assigned</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Est. cost</th><th className="px-4 py-3">ETA</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {maintenance.map(m => (
              <tr key={m.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3"><div className="font-medium">{m.description}</div><div className="text-[11px] text-muted-foreground">{m.id}</div></td>
                <td className="px-4 py-3 text-muted-foreground">{m.building}<div className="text-[11px]">{m.area}</div></td>
                <td className="px-4 py-3 text-muted-foreground">{m.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.reportedBy}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.assigned}</td>
                <td className="px-4 py-3"><StatusPill status={m.priority} /></td>
                <td className="px-4 py-3 text-muted-foreground">{m.estCost.toLocaleString()} SAR</td>
                <td className="px-4 py-3 text-muted-foreground">{m.completion}</td>
                <td className="px-4 py-3"><StatusPill status={m.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

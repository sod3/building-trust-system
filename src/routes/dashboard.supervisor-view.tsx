import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, Kpi, PageHeader, SectionTitle, StatusPill } from "@/components/dashboard/ui";
import { tasks, users, laborPerformance } from "@/lib/mock-data";
import { ClipboardCheck, AlertTriangle, Clock, XCircle, Users, HeartPulse } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/dashboard/supervisor-view")({
  component: SupervisorView,
});

function SupervisorView() {
  const pending = tasks.filter(t => t.status === "submitted");
  const rejected = tasks.filter(t => t.status === "rejected");
  const overdue = tasks.filter(t => t.status === "overdue");
  const labor = users.filter(u => u.role === "labor");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supervisor Panel"
        subtitle="Khalid Al-Otaibi · 3 buildings · review and approve daily labor submissions."
        actions={<Link to="/dashboard/approvals" className="rounded-md bg-navy px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-navy/90">Open approval queue</Link>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        <Kpi accent="navy" label="Submitted today" value={pending.length + 18} icon={<ClipboardCheck className="h-4 w-4" />} />
        <Kpi accent="gold" label="Pending approval" value={pending.length} icon={<Clock className="h-4 w-4" />} />
        <Kpi accent="rose" label="Rejected" value={rejected.length} icon={<XCircle className="h-4 w-4" />} />
        <Kpi accent="rose" label="Overdue" value={overdue.length} icon={<AlertTriangle className="h-4 w-4" />} />
        <Kpi label="Labor active" value={labor.filter(l=>l.status==="active").length} icon={<Users className="h-4 w-4" />} />
        <Kpi label="Building health" value="88%" icon={<HeartPulse className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle title="Pending labor submissions" action={<Link to="/dashboard/approvals" className="text-xs text-accent hover:underline">Review all</Link>} />
          <div className="space-y-3">
            {pending.slice(0,5).map(t => (
              <div key={t.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                {t.proof && <img src={t.proof} alt="" className="h-14 w-14 rounded-lg object-cover" />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="truncate text-sm font-medium">{t.name}</div>
                    <StatusPill status={t.priority} />
                  </div>
                  <div className="text-[11px] text-muted-foreground">{t.building} · {t.labor} · {t.submittedAt}</div>
                </div>
                <div className="flex gap-1">
                  <button className="rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-emerald-700">Approve</button>
                  <button className="rounded-md bg-rose-50 px-2 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-100">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Labor performance" />
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={laborPerformance} layout="vertical" margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} domain={[0,100]} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={60} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="approval" fill="#0e7c66" radius={[0,6,6,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Labor team" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="pb-2">Name</th><th className="pb-2">Buildings</th><th className="pb-2">Tasks done</th><th className="pb-2">Approval %</th><th className="pb-2">Last active</th><th className="pb-2">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {labor.map(l => (
                <tr key={l.id}>
                  <td className="py-3 font-medium">{l.name}</td>
                  <td className="py-3 text-muted-foreground">{l.buildings.length}</td>
                  <td className="py-3 text-muted-foreground">{l.tasksDone}</td>
                  <td className="py-3"><div className="flex items-center gap-2"><div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-emerald-500" style={{width: `${l.approvalRate}%`}} /></div><span className="text-xs font-medium">{l.approvalRate}%</span></div></td>
                  <td className="py-3 text-muted-foreground">{l.lastActive}</td>
                  <td className="py-3"><StatusPill status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

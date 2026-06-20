import { createFileRoute } from "@tanstack/react-router";
import { Kpi, Card, SectionTitle, StatusPill } from "@/components/dashboard/ui";
import {
  Building2, Users, ListChecks, AlertTriangle, MessageSquareWarning,
  ShieldCheck, HeartPulse, Images, FileBarChart2, Clock,
} from "lucide-react";
import {
  overviewKpis, tasks, complaints, taskTrend, complaintCategories,
  buildingHealthCompare, complaintResolutionTrend, openVsResolved, buildings,
} from "@/lib/mock-data";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { useRole } from "@/lib/role-context";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

function DashboardOverview() {
  const { role } = useRole();
  if (role === "owner") return <OwnerRedirect />;
  if (role === "supervisor") return <SupervisorRedirect />;
  if (role === "labor") return <LaborRedirect />;
  if (role === "tenant") return <TenantRedirect />;

  const k = overviewKpis;
  const recentTasks = tasks.slice(0, 5);
  const recentComplaints = complaints.slice(0, 5);
  const pending = tasks.filter(t => t.status === "submitted").slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Operations overview</div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Good morning, Omar — your portfolio is performing at <span className="text-emerald-600">92%</span>.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{k.totalBuildings} buildings · {k.activeLabor} active labor · {k.pendingApprovals} approvals waiting on supervisors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi accent="navy" label="Building Health" value={`${k.healthScore}%`} sub="Portfolio average" icon={<HeartPulse className="h-4 w-4" />} delta="+3 this week" tone="up" />
        <Kpi accent="teal" label="Tasks completed today" value={`${k.tasksDoneToday}/${k.tasksTotal}`} sub={`${Math.round(k.tasksDoneToday/k.tasksTotal*100)}% completion`} icon={<ListChecks className="h-4 w-4" />} delta="+12 vs yesterday" tone="up" />
        <Kpi accent="rose" label="Open complaints" value={k.openComplaints} sub={`${k.resolvedRate}% resolved this month`} icon={<MessageSquareWarning className="h-4 w-4" />} delta="-4 vs last week" tone="down" />
        <Kpi accent="gold" label="Pending approvals" value={k.pendingApprovals} sub="Supervisor queue" icon={<ShieldCheck className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <Kpi label="Buildings" value={k.totalBuildings} icon={<Building2 className="h-4 w-4" />} />
        <Kpi label="Active labor" value={k.activeLabor} icon={<Users className="h-4 w-4" />} />
        <Kpi label="Pending tasks" value={k.pendingTasks} icon={<Clock className="h-4 w-4" />} />
        <Kpi label="Overdue tasks" value={k.overdueTasks} icon={<AlertTriangle className="h-4 w-4" />} />
        <Kpi label="Verified photos" value="1.2K" sub="this week" icon={<Images className="h-4 w-4" />} />
        <Kpi label="Owner report" value="Ready" sub="June 2026" icon={<FileBarChart2 className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle title="Task completion trend (last 7 days)" action={<span className="text-xs text-muted-foreground">Done vs missed</span>} />
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={taskTrend} margin={{ left: -10, right: 4, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0e7c66" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#0e7c66" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e85d3a" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#e85d3a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="done" stroke="#0e7c66" strokeWidth={2.5} fill="url(#g1)" />
                <Area type="monotone" dataKey="missed" stroke="#e85d3a" strokeWidth={2.5} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionTitle title="Complaints by category" />
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={complaintCategories} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {complaintCategories.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px]">
            {complaintCategories.map(c => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                <span className="text-muted-foreground">{c.name}</span>
                <span className="ml-auto font-medium">{c.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <SectionTitle title="Building health comparison" />
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={buildingHealthCompare} margin={{ left: -20, right: 4, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} interval={0} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={[60,100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="score" fill="#3b6fa0" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <SectionTitle title="Complaint resolution time" action={<span className="text-xs text-emerald-600">↓ improving</span>} />
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={complaintResolutionTrend} margin={{ left: -20, right: 4, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Line type="monotone" dataKey="hours" stroke="#c9a84c" strokeWidth={3} dot={{ r: 4, fill: "#c9a84c" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <SectionTitle title="Open vs resolved (6 months)" />
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={openVsResolved} margin={{ left: -20, right: 4, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="open" fill="#e85d3a" radius={[4,4,0,0]} />
                <Bar dataKey="resolved" fill="#0e7c66" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle title="Recent tasks" action={<Link to="/dashboard/tasks" className="text-xs text-accent hover:underline">View all</Link>} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="pb-2">Task</th><th className="pb-2">Building</th><th className="pb-2">Labor</th><th className="pb-2">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentTasks.map(t => (
                  <tr key={t.id}>
                    <td className="py-3"><div className="font-medium">{t.name}</div><div className="text-[11px] text-muted-foreground">{t.id} · {t.category}</div></td>
                    <td className="py-3 text-muted-foreground">{t.building}</td>
                    <td className="py-3 text-muted-foreground">{t.labor}</td>
                    <td className="py-3"><StatusPill status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <SectionTitle title="Pending approvals" action={<Link to="/dashboard/approvals" className="text-xs text-accent hover:underline">Open queue</Link>} />
          <div className="space-y-3">
            {pending.map(t => (
              <div key={t.id} className="flex gap-3 rounded-xl border border-border p-2.5">
                {t.proof && <img src={t.proof} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{t.name}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{t.building} · {t.labor}</div>
                  <div className="mt-1 flex gap-1">
                    <button className="rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-emerald-700">Approve</button>
                    <button className="rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 hover:bg-rose-100">Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Building performance" action={<Link to="/dashboard/buildings" className="text-xs text-accent hover:underline">All buildings</Link>} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="pb-2">Building</th><th className="pb-2">City</th>
                <th className="pb-2">Tasks today</th><th className="pb-2">Open complaints</th>
                <th className="pb-2">Health</th><th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {buildings.map(b => (
                <tr key={b.id}>
                  <td className="py-3 font-medium">{b.name}</td>
                  <td className="py-3 text-muted-foreground">{b.city}</td>
                  <td className="py-3 text-muted-foreground">{b.tasksToday.done} / {b.tasksToday.total}</td>
                  <td className="py-3 text-muted-foreground">{b.openComplaints}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600" style={{ width: `${b.health}%` }} />
                      </div>
                      <span className="text-xs font-medium">{b.health}</span>
                    </div>
                  </td>
                  <td className="py-3"><StatusPill status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <SectionTitle title="Recent verified photo proof" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {recentComplaints.map((c, i) => (
            <div key={c.id} className="group relative overflow-hidden rounded-xl border border-border">
              <img src={c.photo || `https://picsum.photos/seed/${i}/300/200`} className="h-28 w-full object-cover transition group-hover:scale-105" alt="" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 to-transparent p-2 text-[10px] text-white">
                <div className="font-semibold truncate">{c.building}</div>
                <div className="opacity-80 truncate">{c.assigned}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function OwnerRedirect() {
  return <RedirectNote title="Switched to Owner view" body="The owner dashboard is a read-only premium view." to="/dashboard/owner-view" cta="Open Owner view" />;
}
function SupervisorRedirect() {
  return <RedirectNote title="Switched to Supervisor view" body="Approval queue and labor performance live here." to="/dashboard/supervisor-view" cta="Open Supervisor panel" />;
}
function LaborRedirect() {
  return <RedirectNote title="Switched to Labor app" body="Mobile-first task workflow for housemasters." to="/dashboard/mobile-labor" cta="Open Labor app" />;
}
function TenantRedirect() {
  return <RedirectNote title="Switched to Tenant portal" body="QR-friendly complaint submission and tracking." to="/dashboard/tenant-portal" cta="Open Tenant portal" />;
}
function RedirectNote({ title, body, to, cta }: { title: string; body: string; to: string; cta: string }) {
  return (
    <Card className="mx-auto max-w-xl text-center">
      <div className="text-xs font-semibold uppercase tracking-wider text-accent">Role preview</div>
      <h2 className="mt-2 font-display text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      <Link to={to} className="mt-4 inline-flex rounded-md bg-navy px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-navy/90">{cta}</Link>
    </Card>
  );
}

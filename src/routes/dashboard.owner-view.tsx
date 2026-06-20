import { createFileRoute } from "@tanstack/react-router";
import { Card, Kpi, PageHeader, SectionTitle, StatusPill } from "@/components/dashboard/ui";
import { buildings, complaintResolutionTrend, complaints, overviewKpis } from "@/lib/mock-data";
import { Crown, HeartPulse, ListChecks, MessageSquareWarning, FileBarChart2, Download, CheckCircle2 } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

export const Route = createFileRoute("/dashboard/owner-view")({
  component: OwnerView,
});

const ownerBuildings = buildings.slice(0, 4);

function OwnerView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Owner Dashboard"
        subtitle="Read-only premium view for property owners. Verified work, complaint resolution, monthly PDF reports."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-navy/90">
            <Download className="h-4 w-4" /> Download June report (PDF)
          </button>
        }
      />

      <div className="rounded-3xl bg-navy-gradient p-6 text-white shadow-elevated">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/60">
              <Crown className="h-3.5 w-3.5 text-gold" /> Owner — Abdulrahman Al-Saud
            </div>
            <h2 className="mt-1 font-display text-3xl font-semibold">Your portfolio is at <span className="text-gold">88%</span> health.</h2>
            <p className="mt-1 text-sm text-white/70">4 buildings · 348 units · {ownerBuildings.reduce((s,b)=>s+b.openComplaints,0)} open complaints · monthly report ready.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Mini label="Today completion" value="94%" />
            <Mini label="Open complaints" value={ownerBuildings.reduce((s,b)=>s+b.openComplaints,0).toString()} />
            <Mini label="Resolved (mo)" value={`${overviewKpis.resolvedRate}%`} />
            <Mini label="Report" value="Ready" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Portfolio Health" value="88%" sub="↑ 2 vs last month" icon={<HeartPulse className="h-4 w-4" />} delta="+2" tone="up" />
        <Kpi label="Tasks completion" value="94%" icon={<ListChecks className="h-4 w-4" />} />
        <Kpi label="Open complaints" value="10" icon={<MessageSquareWarning className="h-4 w-4" />} />
        <Kpi label="Verified photos" value="412" sub="this month" icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle title="My buildings" />
          <div className="space-y-3">
            {ownerBuildings.map(b => (
              <div key={b.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <img src={b.cover} alt="" className="h-14 w-20 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="truncate font-medium">{b.name}</div>
                    <StatusPill status={b.status} />
                  </div>
                  <div className="mt-1 grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
                    <div>Cleaning: <span className="font-medium text-emerald-600">Done</span></div>
                    <div>Elevator: <span className="font-medium text-foreground">Working</span></div>
                    <div>Water: <span className="font-medium text-foreground">Normal</span></div>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600" style={{ width: `${b.health}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Complaint resolution time (weeks)" action={<span className="text-xs text-emerald-600">↓ improving</span>} />
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={complaintResolutionTrend}>
                <defs>
                  <linearGradient id="gO" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c9a84c" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#c9a84c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="hours" stroke="#c9a84c" strokeWidth={2.5} fill="url(#gO)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Recent verified work" action={<span className="text-xs text-muted-foreground">Photo proof, approved by supervisor</span>} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {complaints.slice(0,6).map((c,i)=>(
            <div key={i} className="overflow-hidden rounded-xl border border-border">
              <img src={c.photo || `https://picsum.photos/seed/${i+10}/300/200`} className="h-28 w-full object-cover" alt="" />
              <div className="p-2">
                <div className="truncate text-[11px] font-semibold">{c.building}</div>
                <div className="truncate text-[10px] text-muted-foreground">Approved by {c.assigned}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle title="Building health comparison" />
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={ownerBuildings.map(b=>({ name: b.name.split(" ").slice(0,2).join(" "), score: b.health }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[60,100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Bar dataKey="score" fill="#0e7c66" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="border-accent/40 bg-accent/5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-navy text-primary-foreground"><FileBarChart2 className="h-6 w-6" /></div>
            <div>
              <div className="font-display text-base font-semibold">June 2026 Owner Report is ready</div>
              <div className="text-xs text-muted-foreground">Includes building health, complaint resolution, verified photos, recommendations.</div>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-navy/90"><Download className="h-4 w-4" />Download PDF</button>
        </div>
      </Card>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur">
      <div className="text-[10px] uppercase tracking-wider text-white/60">{label}</div>
      <div className="font-display text-lg font-semibold">{value}</div>
    </div>
  );
}

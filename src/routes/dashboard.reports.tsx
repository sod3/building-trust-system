import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, SectionTitle } from "@/components/dashboard/ui";
import { buildings, overviewKpis } from "@/lib/mock-data";
import { FileBarChart2, Download, HeartPulse, ListChecks, MessageSquareWarning, Users, ShieldCheck, Wrench, Timer } from "lucide-react";

export const Route = createFileRoute("/dashboard/reports")({
  component: ReportsPage,
});

const reports = [
  { title: "Monthly Owner Report", icon: FileBarChart2, accent: "bg-navy text-white" },
  { title: "Building Health Report", icon: HeartPulse, accent: "bg-emerald-50 text-emerald-700" },
  { title: "Task Completion Report", icon: ListChecks, accent: "bg-sky-50 text-sky-700" },
  { title: "Complaint Resolution Report", icon: MessageSquareWarning, accent: "bg-rose-50 text-rose-700" },
  { title: "Labor Performance Report", icon: Users, accent: "bg-amber-50 text-amber-700" },
  { title: "Supervisor Approval Report", icon: ShieldCheck, accent: "bg-indigo-50 text-indigo-700" },
  { title: "Maintenance Cost Report", icon: Wrench, accent: "bg-stone-100 text-stone-700" },
  { title: "SLA Report", icon: Timer, accent: "bg-fuchsia-50 text-fuchsia-700" },
];

function ReportsPage() {
  const b = buildings[0];
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" subtitle="Generate owner-ready PDF reports in one click. Every report is backed by verified photo proof." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {reports.map(r => {
          const Icon = r.icon;
          return (
            <Card key={r.title} className="group cursor-pointer transition hover:shadow-elevated">
              <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${r.accent}`}><Icon className="h-5 w-5" /></div>
              <div className="font-display text-sm font-semibold">{r.title}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">Last generated: 1 Jun 2026</div>
              <button className="mt-3 inline-flex items-center gap-1 text-xs text-accent group-hover:underline"><Download className="h-3 w-3" />Download PDF</button>
            </Card>
          );
        })}
      </div>

      <Card>
        <SectionTitle title="Owner report preview - Riyadh Tower A · June 2026" action={<button className="inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-navy/90"><Download className="h-3 w-3" />Download PDF</button>} />
        <div className="overflow-hidden rounded-2xl border border-border bg-surface-2/40 p-6">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">FacilityOS Arabia · Owner Report</div>
              <h2 className="font-display text-2xl font-semibold">{b.name}</h2>
              <p className="text-sm text-muted-foreground">{b.city} · {b.floors} floors · {b.units} units</p>
            </div>
            <div className="text-right text-xs text-muted-foreground"><div>Report period</div><div className="font-medium text-foreground">01 - 30 June 2026</div></div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Building Health" value={`${b.health}%`} accent />
            <Stat label="Task completion" value={`${Math.round(b.tasksToday.done/b.tasksToday.total*100)}%`} />
            <Stat label="Complaint resolution" value={`${overviewKpis.resolvedRate}%`} />
            <Stat label="Verified photos" value="412" />
          </div>

          <div className="mt-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Top issues this month</div>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center justify-between rounded-lg bg-background p-2 ring-1 ring-border"><span>Elevator B intermittent stop</span><span className="text-muted-foreground">Resolved · 18 hrs</span></li>
              <li className="flex items-center justify-between rounded-lg bg-background p-2 ring-1 ring-border"><span>Basement plumbing leak</span><span className="text-muted-foreground">Resolved · 36 hrs</span></li>
              <li className="flex items-center justify-between rounded-lg bg-background p-2 ring-1 ring-border"><span>Corridor light F8</span><span className="text-muted-foreground">Resolved · 4 hrs</span></li>
            </ul>
          </div>

          <div className="mt-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recommendations</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
              <li>Schedule preventive elevator maintenance every 2 months.</li>
              <li>Add cleaning round to staircase floors 14–18 (high traffic).</li>
              <li>Replace lobby door rubber seals - small budget item.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-3 ring-1 ring-border ${accent ? "bg-navy text-white ring-navy" : "bg-background"}`}>
      <div className={`text-[10px] uppercase tracking-wider ${accent ? "text-white/60" : "text-muted-foreground"}`}>{label}</div>
      <div className="font-display text-xl font-semibold">{value}</div>
    </div>
  );
}

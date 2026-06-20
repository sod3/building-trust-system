import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function Kpi({
  label, value, sub, icon, accent, delta, tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  icon?: ReactNode;
  accent?: "navy" | "teal" | "gold" | "rose" | "indigo";
  delta?: string;
  tone?: "up" | "down" | "neutral";
}) {
  const accentMap = {
    navy:   "from-navy/95 to-navy text-white",
    teal:   "from-emerald-600/95 to-emerald-700 text-white",
    gold:   "from-amber-500/95 to-amber-600 text-white",
    rose:   "from-rose-500/95 to-rose-600 text-white",
    indigo: "from-indigo-600/95 to-indigo-700 text-white",
  };
  if (accent) {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 shadow-elevated", accentMap[accent])}>
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        <div className="flex items-start justify-between">
          <div className="text-xs font-medium uppercase tracking-wider text-white/70">{label}</div>
          {icon && <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 text-white">{icon}</div>}
        </div>
        <div className="mt-3 font-display text-3xl font-semibold">{value}</div>
        {sub && <div className="mt-1 text-xs text-white/70">{sub}</div>}
        {delta && (
          <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/90">
            {tone === "up" ? <ArrowUpRight className="h-3 w-3" /> : tone === "down" ? <ArrowDownRight className="h-3 w-3" /> : null}
            {delta}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition hover:shadow-elevated">
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        {icon && <div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-navy">{icon}</div>}
      </div>
      <div className="mt-3 font-display text-3xl font-semibold text-foreground">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
      {delta && (
        <div className={cn(
          "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
          tone === "up" ? "bg-emerald-50 text-emerald-700" : tone === "down" ? "bg-rose-50 text-rose-700" : "bg-secondary text-muted-foreground",
        )}>
          {tone === "up" ? <ArrowUpRight className="h-3 w-3" /> : tone === "down" ? <ArrowDownRight className="h-3 w-3" /> : null}
          {delta}
        </div>
      )}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    excellent: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    good: "bg-sky-50 text-sky-700 ring-sky-200",
    attention: "bg-amber-50 text-amber-700 ring-amber-200",
    critical: "bg-rose-50 text-rose-700 ring-rose-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    submitted: "bg-sky-50 text-sky-700 ring-sky-200",
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    rejected: "bg-rose-50 text-rose-700 ring-rose-200",
    overdue: "bg-rose-50 text-rose-700 ring-rose-200",
    open: "bg-rose-50 text-rose-700 ring-rose-200",
    "in-progress": "bg-amber-50 text-amber-700 ring-amber-200",
    resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    closed: "bg-slate-100 text-slate-700 ring-slate-200",
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "on-track": "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "at-risk": "bg-amber-50 text-amber-700 ring-amber-200",
    breached: "bg-rose-50 text-rose-700 ring-rose-200",
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    inactive: "bg-slate-100 text-slate-600 ring-slate-200",
    high: "bg-rose-50 text-rose-700 ring-rose-200",
    medium: "bg-amber-50 text-amber-700 ring-amber-200",
    low: "bg-sky-50 text-sky-700 ring-sky-200",
    Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    failed: "bg-rose-50 text-rose-700 ring-rose-200",
  };
  const cls = map[status] || "bg-secondary text-foreground ring-border";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset capitalize", cls)}>
      {status.replace(/-/g, " ")}
    </span>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-border bg-card p-5", className)}>{children}</div>;
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
      {action}
    </div>
  );
}

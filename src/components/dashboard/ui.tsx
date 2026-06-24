// FacilityOS — Shared Dashboard UI Components
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, X, AlertTriangle } from "lucide-react";
import { useLang } from "@/lib/i18n";

// ─── KPI CARD ─────────────────────────────────────────────────
export function Kpi({
  label, value, sub, icon, accent, delta, tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  icon?: ReactNode;
  accent?: "navy" | "teal" | "gold" | "rose" | "indigo" | "emerald";
  delta?: string;
  tone?: "up" | "down" | "neutral";
}) {
  const accentMap = {
    navy:    "from-navy/95 to-navy text-white",
    teal:    "from-teal-600/95 to-teal-700 text-white",
    gold:    "from-amber-500/95 to-amber-600 text-white",
    rose:    "from-rose-500/95 to-rose-600 text-white",
    indigo:  "from-indigo-600/95 to-indigo-700 text-white",
    emerald: "from-emerald-600/95 to-emerald-700 text-white",
  };
  if (accent) {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 shadow-elevated", accentMap[accent])}>
        <div className="absolute -end-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
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

// ─── PAGE HEADER ──────────────────────────────────────────────
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

// ─── STATUS PILL ──────────────────────────────────────────────
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
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    inactive: "bg-slate-100 text-slate-600 ring-slate-200",
    Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Trial: "bg-amber-50 text-amber-700 ring-amber-200",
    Suspended: "bg-rose-50 text-rose-700 ring-rose-200",
    Healthy: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    "Attention Needed": "bg-rose-50 text-rose-700 ring-rose-200",
    Submitted: "bg-sky-50 text-sky-700 ring-sky-200",
    Approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Missed: "bg-rose-50 text-rose-700 ring-rose-200",
    "In Progress": "bg-amber-50 text-amber-700 ring-amber-200",
    "Not Started": "bg-slate-100 text-slate-600 ring-slate-200",
    Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    high: "bg-rose-50 text-rose-700 ring-rose-200",
    medium: "bg-amber-50 text-amber-700 ring-amber-200",
    low: "bg-sky-50 text-sky-700 ring-sky-200",
    Normal: "bg-slate-100 text-slate-600 ring-slate-200",
    Important: "bg-amber-50 text-amber-700 ring-amber-200",
  };
  const cls = map[status] || "bg-secondary text-foreground ring-border";
  const { t } = useLang();
  const displayStatus = t(`status.${status.toLowerCase().replace(/ /g, '_')}`, { fallback: status });
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset", cls)}>
      {displayStatus}
    </span>
  );
}

// ─── CARD ─────────────────────────────────────────────────────
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-border bg-card p-5", className)}>{children}</div>;
}

// ─── SECTION TITLE ────────────────────────────────────────────
export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
      {action}
    </div>
  );
}

// ─── SEARCH INPUT ─────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const { t } = useLang();
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder || t("common.search")}
      className="h-9 w-full max-w-xs rounded-xl border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
    />
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────
export function EmptyState({ icon, title, body }: { icon?: ReactNode; title: string; body?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-muted-foreground">{icon}</div>}
      <div className="font-display text-base font-semibold text-foreground">{title}</div>
      {body && <p className="mt-1 text-sm text-muted-foreground max-w-xs">{body}</p>}
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-background border border-border shadow-elevated max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-secondary transition text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── BUTTON ───────────────────────────────────────────────────
export function Btn({ children, onClick, variant = "primary", size = "md", disabled, type = "button", className }: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-60";
  const sizes = { sm: "h-8 px-3 text-xs", md: "h-9 px-4 text-sm", lg: "h-11 px-6 text-sm" };
  const variants = {
    primary: "bg-navy text-white hover:bg-navy/90",
    secondary: "bg-secondary text-foreground hover:bg-secondary/80",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
    outline: "border border-border text-foreground hover:bg-secondary",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn(base, sizes[size], variants[variant], className)}>
      {children}
    </button>
  );
}

// ─── FORM INPUT ───────────────────────────────────────────────
export function FormInput({ label, value, onChange, placeholder, type = "text", required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}{required && <span className="text-rose-500 ms-1">*</span>}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
      />
    </div>
  );
}

// ─── FORM SELECT ──────────────────────────────────────────────
export function FormSelect({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}{required && <span className="text-rose-500 ms-1">*</span>}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── TOAST NOTIFICATION ───────────────────────────────────────
export function Toast({ message, type = "success", onClose }: { message: string; type?: "success" | "error" | "warning"; onClose: () => void }) {
  const styles = {
    success: "bg-emerald-600 text-white",
    error: "bg-rose-600 text-white",
    warning: "bg-amber-500 text-white",
  };
  return (
    <div className={cn("fixed bottom-4 end-4 z-50 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-elevated", styles[type])}>
      {message}
      <button onClick={onClose} className="text-white/70 hover:text-white"><X className="h-4 w-4" /></button>
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = "emerald" }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  const colorMap: Record<string, string> = {
    emerald: "from-emerald-500 to-emerald-600",
    blue: "from-blue-500 to-blue-600",
    amber: "from-amber-500 to-amber-600",
    rose: "from-rose-500 to-rose-600",
  };
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", colorMap[color] || colorMap.emerald)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── ALERT BANNER ─────────────────────────────────────────────
export function AlertBanner({ message, type = "warning" }: { message: string; type?: "warning" | "info" | "error" }) {
  const styles = {
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    info: "bg-sky-50 border-sky-200 text-sky-800",
    error: "bg-rose-50 border-rose-200 text-rose-800",
  };
  return (
    <div className={cn("flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm", styles[type])}>
      <AlertTriangle className="h-4 w-4 shrink-0" />
      {message}
    </div>
  );
}

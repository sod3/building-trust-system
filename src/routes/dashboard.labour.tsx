import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Brush, Square, Trash2, Droplets, Lightbulb, ArrowUp, Car, Shield,
  CheckCircle2, AlertTriangle, LogOut, Building2, CheckCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { mockLabour, defaultChecklist } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/labour")({
  head: () => ({ meta: [{ title: "Today's Work — FacilityOS Arabia" }] }),
  component: LabourDashboard,
});

// Icon map for checklist tasks
const taskIconMap: Record<string, React.ReactNode> = {
  Brush: <Brush className="h-8 w-8" />,
  Square: <Square className="h-8 w-8" />,
  Trash2: <Trash2 className="h-8 w-8" />,
  Droplets: <Droplets className="h-8 w-8" />,
  Lightbulb: <Lightbulb className="h-8 w-8" />,
  ArrowUp: <ArrowUp className="h-8 w-8" />,
  Car: <Car className="h-8 w-8" />,
  Shield: <Shield className="h-8 w-8" />,
};

const taskColors = [
  { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600", done: "bg-blue-600" },
  { bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-600", done: "bg-purple-600" },
  { bg: "bg-slate-50", border: "border-slate-200", icon: "text-slate-600", done: "bg-slate-600" },
  { bg: "bg-cyan-50", border: "border-cyan-200", icon: "text-cyan-600", done: "bg-cyan-600" },
  { bg: "bg-amber-50", border: "border-amber-200", icon: "text-amber-600", done: "bg-amber-600" },
  { bg: "bg-emerald-50", border: "border-emerald-200", icon: "text-emerald-600", done: "bg-emerald-600" },
  { bg: "bg-orange-50", border: "border-orange-200", icon: "text-orange-600", done: "bg-orange-600" },
  { bg: "bg-navy/5", border: "border-navy/20", icon: "text-navy", done: "bg-navy" },
];

function LabourDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, lang, setLang } = useLang();
  const labour = mockLabour.find(l => l.id === user?.labourId) || mockLabour[0];

  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState("");

  const tasks = defaultChecklist;
  const completedCount = completedIds.size;
  const totalCount = tasks.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const today = new Date().toLocaleDateString(t("common.locale", { fallback: "en-GB" }), {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  function toggleTask(id: string) {
    if (submitted) return;
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit() {
    if (completedCount < totalCount) {
      setShowConfirm(true);
    } else {
      doSubmit();
    }
  }

  function doSubmit() {
    const now = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setSubmittedAt(now);
    setSubmitted(true);
    setShowConfirm(false);
  }

  // ─── SUCCESS SCREEN ─────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center justify-center px-4 py-12">
        {/* Success icon */}
        <div className="relative mb-6">
          <div className="grid h-28 w-28 place-items-center rounded-full bg-emerald-100 shadow-[0_0_0_16px_oklch(0.95_0.05_160/0.3)]">
            <CheckCheck className="h-14 w-14 text-emerald-600" />
          </div>
        </div>

        <h1 className="font-display text-3xl font-semibold text-center text-foreground">{t("labour.dashboard.submitted", { fallback: "Work Submitted!" })}</h1>
        <p className="mt-3 text-center text-muted-foreground max-w-sm text-lg">
          {t("labour.dashboard.submitted_desc_1", { fallback: "Today's work submitted successfully." })}<br />
          {t("labour.dashboard.submitted_desc_2", { fallback: "Report sent to Admin and Owner." })}
        </p>

        {/* Summary card */}
        <div className="mt-8 w-full max-w-sm rounded-3xl border-2 border-emerald-200 bg-white p-6 shadow-elevated">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">{t("labour.dashboard.summary", { fallback: "Today's Summary" })}</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-center">
              <div className="font-display text-2xl font-bold text-emerald-700">{completedCount}</div>
              <div className="text-xs text-emerald-600 mt-0.5 font-medium">{t("common.done", { fallback: "Done" })}</div>
            </div>
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-center">
              <div className="font-display text-2xl font-bold text-amber-700">{totalCount - completedCount}</div>
              <div className="text-xs text-amber-600 mt-0.5 font-medium">{t("common.pending", { fallback: "Pending" })}</div>
            </div>
            <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3 text-center">
              <div className="font-display text-2xl font-bold text-sky-700">{submittedAt}</div>
              <div className="text-xs text-sky-600 mt-0.5 font-medium">{t("common.time", { fallback: "Time" })}</div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            {t("common.building", { fallback: "Building" })}: <strong>{labour.buildingName}</strong>
          </div>
        </div>

        <button
          onClick={() => { setSubmitted(false); setCompletedIds(new Set()); }}
          className="mt-8 flex items-center gap-2 rounded-2xl bg-navy px-8 py-3.5 text-white font-semibold text-base hover:bg-navy/90 transition active:scale-[0.98]"
        >
          {t("labour.dashboard.back_checklist", { fallback: "Back to Today's Checklist" })}
        </button>

        <Link to="/" className="mt-4 text-sm text-muted-foreground hover:text-foreground transition">
          {t("labour.dashboard.back_website", { fallback: "← Back to website" })}
        </Link>
      </div>
    );
  }

  // ─── MAIN CHECKLIST SCREEN ──────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Top header */}
      <header className="sticky top-0 z-20 bg-white border-b border-border shadow-sm">
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-navy">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-display text-sm font-semibold text-foreground">FacilityOS Arabia</div>
              <div className="text-xs text-muted-foreground">{labour.buildingName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition"
            >
              {lang === "en" ? "العربية" : "English"}
            </button>
            <button
              onClick={() => { logout(); navigate({ to: "/login" }); }}
            className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition"
          >
              <LogOut className="h-3.5 w-3.5" /> {t("dashboard.owner.nav.logout", { fallback: "Sign Out" })}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Greeting */}
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{t("labour.dashboard.todays_work", { fallback: "Today's Work" })}</div>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            {t("labour.dashboard.greeting", { name: labour.name.split(" ")[0], fallback: `Good Morning, ${labour.name.split(" ")[0]} 👋` })}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{today}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{t("labour.dashboard.instruction", { fallback: "Tick each task when completed, then submit your daily work." })}</p>
        </div>

        {/* Progress */}
        <div className="mb-6 rounded-3xl bg-navy-gradient text-white p-5 shadow-elevated">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-white/60 uppercase tracking-wider">{t("labour.dashboard.progress", { fallback: "Progress" })}</div>
              <div className="font-display text-2xl font-semibold mt-0.5">{completedCount} / {totalCount} {t("common.tasks", { fallback: "Tasks" })}</div>
            </div>
            <div className="relative grid h-16 w-16 place-items-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="oklch(1 0 0 / 0.15)" strokeWidth="6" />
                <circle
                  cx="32" cy="32" r="28" fill="none" stroke="oklch(0.78 0.13 80)"
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPct / 100)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="font-display text-lg font-bold">{progressPct}%</div>
            </div>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-gold transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {completedCount === totalCount && (
            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-white/90">
              <CheckCheck className="h-4 w-4 text-gold" />
              {t("labour.dashboard.all_completed", { fallback: "All tasks completed! Ready to submit." })}
            </div>
          )}
        </div>

        {/* Checklist Cards */}
        <div className="space-y-3 mb-8">
          {tasks.map((task, i) => {
            const done = completedIds.has(task.id);
            const colors = taskColors[i % taskColors.length];
            return (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-start transition-all duration-300 active:scale-[0.99] hover:shadow-md",
                  done
                    ? "border-emerald-400 bg-emerald-50 shadow-md"
                    : `${colors.border} ${colors.bg} hover:shadow-md`
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "grid h-16 w-16 shrink-0 place-items-center rounded-2xl transition-all duration-300",
                  done ? "bg-emerald-600 text-white shadow-[0_4px_12px_oklch(0.55_0.18_160/0.4)]" : `bg-white ${colors.icon} shadow-sm border border-border`
                )}>
                  {done ? <CheckCircle2 className="h-8 w-8" /> : taskIconMap[task.icon]}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-display text-lg font-semibold transition-all",
                    done ? "text-emerald-800 line-through decoration-2 decoration-emerald-500/40" : "text-foreground"
                  )}>
                    {task.title}
                  </div>
                  <div className={cn("text-sm mt-0.5", done ? "text-emerald-600" : "text-muted-foreground")}>
                    {done ? t("common.completed", { fallback: "✓ Completed" }) : task.instruction}
                  </div>
                  {task.priority === "Important" && !done && (
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                      {t("common.important", { fallback: "⚡ Important" })}
                    </span>
                  )}
                </div>

                {/* Check indicator */}
                <div className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition-all duration-300",
                  done
                    ? "bg-emerald-500 border-emerald-500 shadow-[0_0_0_4px_oklch(0.55_0.18_160/0.15)]"
                    : "border-border bg-white"
                )}>
                  {done && <CheckCircle2 className="h-5 w-5 text-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-4">
          <button
            onClick={handleSubmit}
            className={cn(
              "w-full rounded-2xl py-5 text-lg font-bold transition-all duration-300 shadow-elevated active:scale-[0.99]",
              completedCount === totalCount
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_8px_24px_oklch(0.55_0.18_160/0.4)]"
                : "bg-navy text-white hover:bg-navy/90 shadow-[0_8px_24px_oklch(0.22_0.08_265/0.3)]"
            )}
          >
            {completedCount === totalCount ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCheck className="h-6 w-6" /> {t("labour.dashboard.submit", { fallback: "Submit Today's Work" })}
              </span>
            ) : (
              <span>{t("labour.dashboard.submit_progress", { done: completedCount, total: totalCount, fallback: `Submit Today's Work (${completedCount}/${totalCount} done)` })}</span>
            )}
          </button>
        </div>
      </div>

      {/* Pending confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 shadow-elevated">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 mx-auto mb-4">
              <AlertTriangle className="h-7 w-7 text-amber-600" />
            </div>
            <h3 className="font-display text-xl font-semibold text-center">{t("labour.dashboard.pending_tasks", { fallback: "Pending Tasks" })}</h3>
            <p className="mt-2 text-center text-muted-foreground text-sm">
              <strong>{totalCount - completedCount} {t("common.tasks", { fallback: "tasks" })}</strong> {t("labour.dashboard.pending_desc", { fallback: "are still pending. Do you want to submit anyway?" })}
            </p>
            <div className="mt-6 space-y-2">
              <button
                onClick={doSubmit}
                className="w-full rounded-2xl bg-amber-500 py-3.5 text-base font-bold text-white hover:bg-amber-600 transition active:scale-[0.98]"
              >
                {t("labour.dashboard.submit_anyway", { fallback: "Yes, Submit Anyway" })}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full rounded-2xl border-2 border-border py-3.5 text-base font-semibold text-foreground hover:bg-secondary transition"
              >
                {t("labour.dashboard.go_back", { fallback: "Go Back & Complete Tasks" })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

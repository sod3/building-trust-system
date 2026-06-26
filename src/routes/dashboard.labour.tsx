import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Brush, Square, Trash2, Droplets, Lightbulb, ArrowUp, Car, Shield,
  CheckCircle2, AlertTriangle, LogOut, Building2, CheckCheck, MinusCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/labour")({
  head: () => ({ meta: [{ title: "Today's Work - FacilityOS Arabia" }] }),
  component: LabourDashboard,
});

const defaultChecklist = [
  { id: "T-001", title: "Clean Entrance", icon: "Brush", required: true },
  { id: "T-002", title: "Check Elevator", icon: "Square", required: true },
  { id: "T-003", title: "Remove Garbage", icon: "Trash2", required: true },
  { id: "T-004", title: "Check Water Tank", icon: "Droplets", required: true },
  { id: "T-005", title: "Check Lights", icon: "Lightbulb", required: true },
  { id: "T-006", title: "Clean Stairs", icon: "ArrowUp", required: true },
  { id: "T-007", title: "Check Parking", icon: "Car", required: true },
  { id: "T-008", title: "Security Gate Check", icon: "Shield", required: true },
];

const taskIconMap: Record<string, React.ReactNode> = {
  Brush: <Brush className="h-7 w-7" />,
  Square: <Square className="h-7 w-7" />,
  Trash2: <Trash2 className="h-7 w-7" />,
  Droplets: <Droplets className="h-7 w-7" />,
  Lightbulb: <Lightbulb className="h-7 w-7" />,
  ArrowUp: <ArrowUp className="h-7 w-7" />,
  Car: <Car className="h-7 w-7" />,
  Shield: <Shield className="h-7 w-7" />,
};

type TaskState = Record<string, { status: "done" | "issue" | "not_done"; note: string }>;

function LabourDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t, lang, setLang } = useLang();
  const [labour, setLabour] = useState<any | null>(null);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [taskState, setTaskState] = useState<TaskState>({});
  const [submitted, setSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ labour: any[] }>("/api/labour")
      .then((result) => setLabour(result.labour?.[0] || null))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load labour profile."));
    apiFetch<{ buildings: any[] }>("/api/buildings")
      .then((result) => setBuildings(result.buildings || []))
      .catch(() => setBuildings([]));
    apiFetch<{ templates: any[] }>("/api/checklist-templates")
      .then((result) => setTemplates(result.templates || []))
      .catch(() => setTemplates([]));
  }, []);

  const building = buildings.find((item) => labour?.assignedBuildingIds?.includes(item.id)) || buildings[0];
  const template = templates.find((item) => !item.buildingId || item.buildingId === building?.id);
  const tasks = useMemo(
    () => (template?.items?.length ? template.items : defaultChecklist).map((item: any, index: number) => ({
      id: item.id || `${item.title}-${index}`,
      title: item.title,
      icon: item.icon || "CheckCircle2",
      required: item.required !== false,
      order: item.order ?? index,
    })),
    [template],
  );

  const completedCount = tasks.filter((task: any) => taskState[task.id]?.status === "done").length;
  const totalCount = tasks.length;
  const progressPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  function setTaskStatus(id: string, status: "done" | "issue" | "not_done") {
    setTaskState((current) => ({ ...current, [id]: { status, note: current[id]?.note || "" } }));
  }

  function setNote(id: string, note: string) {
    setTaskState((current) => ({ ...current, [id]: { status: current[id]?.status || "not_done", note } }));
  }

  async function handleSubmit() {
    if (!building?.id) {
      setError("No assigned building found for this labour account.");
      return;
    }

    try {
      const items = tasks.map((task: any) => ({
        title: task.title,
        status: taskState[task.id]?.status || "not_done",
        note: taskState[task.id]?.note || "",
      }));
      const result = await apiFetch<{ report: any }>("/api/daily-reports", {
        method: "POST",
        body: JSON.stringify({ buildingId: building.id, items }),
      });
      setSubmittedAt(new Date(result.report.submittedAt || Date.now()).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit report.");
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4 py-12 text-center">
        <div className="mb-6 grid h-28 w-28 place-items-center rounded-full bg-emerald-100 shadow-[0_0_0_16px_oklch(0.95_0.05_160/0.3)]">
          <CheckCheck className="h-14 w-14 text-emerald-600" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-foreground">{t("labour.dashboard.submitted", { fallback: "Work Submitted!" })}</h1>
        <p className="mt-3 max-w-sm text-lg text-muted-foreground">
          {t("labour.dashboard.submitted_desc_1", { fallback: "Today's work submitted successfully." })}<br />
          {t("labour.dashboard.submitted_desc_2", { fallback: "Report sent to Admin and Owner." })}
        </p>
        <div className="mt-8 w-full max-w-sm rounded-3xl border-2 border-emerald-200 bg-white p-6 shadow-elevated">
          <div className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t("labour.dashboard.summary", { fallback: "Today's Summary" })}</div>
          <div className="grid grid-cols-3 gap-3">
            <SummaryTile label={t("common.done", { fallback: "Done" })} value={completedCount} className="bg-emerald-50 text-emerald-700 border-emerald-200" />
            <SummaryTile label={t("common.pending", { fallback: "Pending" })} value={totalCount - completedCount} className="bg-amber-50 text-amber-700 border-amber-200" />
            <SummaryTile label={t("common.time", { fallback: "Time" })} value={submittedAt} className="bg-sky-50 text-sky-700 border-sky-200" />
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {t("common.building", { fallback: "Building" })}: <strong>{building?.name || labour?.buildingName}</strong>
          </div>
        </div>
        <button onClick={() => { setSubmitted(false); setTaskState({}); }} className="mt-8 rounded-2xl bg-navy px-8 py-3.5 text-base font-semibold text-white transition hover:bg-navy/90">
          {t("labour.dashboard.back_checklist", { fallback: "Back to Today's Checklist" })}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-20 border-b border-border bg-white shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-navy">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-display text-sm font-semibold text-foreground">FacilityOS Arabia</div>
              <div className="text-xs text-muted-foreground">{building?.name || labour?.buildingName || "Assigned building"}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground">
              {lang === "en" ? "العربية" : "English"}
            </button>
            <button onClick={() => { logout(); navigate({ to: "/login" }); }} className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground">
              <LogOut className="h-3.5 w-3.5" /> {t("dashboard.owner.nav.logout", { fallback: "Sign Out" })}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6">
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t("labour.dashboard.todays_work", { fallback: "Today's Work" })}</div>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            {t("labour.dashboard.greeting", { name: labour?.name?.split(" ")[0] || "Worker", fallback: `Good Morning, ${labour?.name?.split(" ")[0] || "Worker"}` })}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date().toLocaleDateString(t("common.locale", { fallback: "en-GB" }), { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {error && <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

        <div className="mb-6 rounded-3xl bg-navy-gradient p-5 text-white shadow-elevated">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/60">{t("labour.dashboard.progress", { fallback: "Progress" })}</div>
              <div className="font-display mt-0.5 text-2xl font-semibold">{completedCount} / {totalCount} {t("common.tasks", { fallback: "Tasks" })}</div>
            </div>
            <div className="font-display text-3xl font-bold">{progressPct}%</div>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-gold transition-all duration-700" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <div className="mb-8 space-y-3">
          {tasks.map((task: any, index: number) => {
            const current = taskState[task.id]?.status || "not_done";
            return (
              <div key={task.id} className="rounded-2xl border-2 border-border bg-white p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className={cn("grid h-14 w-14 shrink-0 place-items-center rounded-2xl border", current === "done" ? "border-emerald-200 bg-emerald-50 text-emerald-600" : current === "issue" ? "border-amber-200 bg-amber-50 text-amber-600" : "border-slate-200 bg-slate-50 text-slate-600")}>
                    {taskIconMap[task.icon] || <CheckCircle2 className="h-7 w-7" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-lg font-semibold text-foreground">{task.title}</div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <StatusButton active={current === "done"} onClick={() => setTaskStatus(task.id, "done")} icon={<CheckCircle2 className="h-4 w-4" />} label="Done" tone="emerald" />
                      <StatusButton active={current === "issue"} onClick={() => setTaskStatus(task.id, "issue")} icon={<AlertTriangle className="h-4 w-4" />} label="Issue" tone="amber" />
                      <StatusButton active={current === "not_done"} onClick={() => setTaskStatus(task.id, "not_done")} icon={<MinusCircle className="h-4 w-4" />} label="Not done" tone="slate" />
                    </div>
                    <textarea
                      value={taskState[task.id]?.note || ""}
                      onChange={(event) => setNote(task.id, event.target.value)}
                      placeholder="Note (optional)"
                      className="mt-3 min-h-16 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </div>
                <div className="mt-2 text-right text-[10px] text-muted-foreground">Task {index + 1}</div>
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-4">
          <button onClick={handleSubmit} className="w-full rounded-2xl bg-navy py-5 text-lg font-bold text-white shadow-elevated transition hover:bg-navy/90">
            <span className="flex items-center justify-center gap-2">
              <CheckCheck className="h-6 w-6" /> {t("labour.dashboard.submit", { fallback: "Submit Today's Work" })}
            </span>
          </button>
        </div>

        <Link to="/" className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground">
          {t("labour.dashboard.back_website", { fallback: "Back to website" })}
        </Link>
      </div>
    </div>
  );
}

function SummaryTile({ label, value, className }: { label: string; value: string | number; className: string }) {
  return (
    <div className={`rounded-2xl border p-3 text-center ${className}`}>
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="mt-0.5 text-xs font-medium">{label}</div>
    </div>
  );
}

function StatusButton({ active, onClick, icon, label, tone }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; tone: "emerald" | "amber" | "slate" }) {
  const activeClass = tone === "emerald" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : tone === "amber" ? "border-amber-500 bg-amber-50 text-amber-700" : "border-slate-500 bg-slate-50 text-slate-700";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("flex min-h-10 items-center justify-center gap-1 rounded-xl border px-2 text-xs font-semibold transition", active ? activeClass : "border-border bg-background text-muted-foreground hover:bg-secondary")}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

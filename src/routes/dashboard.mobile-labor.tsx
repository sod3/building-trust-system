import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Check, X, Wifi, WifiOff, ChevronRight, MapPin, Clock, Building2, Languages } from "lucide-react";
import { Card, PageHeader } from "@/components/dashboard/ui";

export const Route = createFileRoute("/dashboard/mobile-labor")({
  component: MobileLabor,
});

const todaysTasks = [
  { id: "TSK-2601", name: "Clean main entrance",     building: "Riyadh Tower A", due: "07:00", status: "done" },
  { id: "TSK-2604", name: "Inspect parking area",    building: "Riyadh Tower A", due: "08:30", status: "done" },
  { id: "TSK-2608", name: "Check water tank level",  building: "Riyadh Tower A", due: "10:00", status: "done" },
  { id: "TSK-2615", name: "Clean staircase floors 1-6", building: "Riyadh Tower A", due: "11:30", status: "pending" },
  { id: "TSK-2618", name: "Clean lobby glass doors", building: "Riyadh Tower A", due: "14:00", status: "pending" },
];

function MobileLabor() {
  const [active, setActive] = useState<typeof todaysTasks[number] | null>(null);
  const [online, setOnline] = useState(true);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [toast, setToast] = useState("");
  const [tasks, setTasks] = useState(todaysTasks);

  function complete(id: string, done: boolean) {
    setTasks(t => t.map(x => x.id === id ? { ...x, status: done ? "done" : "skipped" } : x));
    setActive(null);
    setPhotoUploaded(false);
    setToast(done ? "✓ Task submitted to supervisor" : "Task marked not done");
    setTimeout(()=>setToast(""), 2500);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Labor Mobile App" subtitle="Mobile-first PWA for housemasters & technicians. Two big buttons, mandatory photo, offline-capable." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        {/* Phone frame */}
        <div className="mx-auto">
          <div className="relative h-[760px] w-[380px] rounded-[2.5rem] border-[10px] border-navy bg-navy p-2 shadow-elevated">
            <div className="absolute left-1/2 top-3 z-10 h-5 w-32 -translate-x-1/2 rounded-b-2xl bg-navy" />
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-surface-2/60">
              {/* status bar */}
              <div className="flex items-center justify-between bg-white/80 px-5 pt-7 pb-1.5 text-[11px] font-semibold text-navy backdrop-blur">
                <span>9:42</span>
                <span className="flex items-center gap-1">{online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />} <span>{online ? "Synced" : "Offline · 2 queued"}</span></span>
              </div>

              {!active ? (
                <div className="space-y-3 p-4">
                  <div className="rounded-2xl bg-navy-gradient p-4 text-white">
                    <div className="flex items-center justify-between text-[11px] opacity-80">
                      <span>Good morning</span>
                      <button onClick={()=>setOnline(!online)} className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] backdrop-blur">{online ? "Online" : "Offline"}</button>
                    </div>
                    <div className="mt-1 font-display text-lg font-semibold">Ahmed Khan</div>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] opacity-80"><Building2 className="h-3 w-3" />Riyadh Tower A</div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <Bubble n={tasks.filter(t=>t.status==="done").length} label="Done" />
                      <Bubble n={tasks.filter(t=>t.status==="pending").length} label="Pending" />
                      <Bubble n={tasks.length} label="Today" />
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">Today's tasks</div>
                  {tasks.map(t => (
                    <button key={t.id} onClick={()=>setActive(t)} className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition active:scale-[0.98]">
                      <div className={`grid h-10 w-10 place-items-center rounded-xl ${t.status === "done" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {t.status === "done" ? <Check className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{t.name}</div>
                        <div className="truncate text-[11px] text-muted-foreground">{t.due} · Photo required</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                  <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2 text-[11px] text-muted-foreground"><Languages className="h-3 w-3" />English / العربية</button>
                </div>
              ) : (
                <div className="flex h-full flex-col p-4">
                  <button onClick={()=>setActive(null)} className="text-[11px] text-muted-foreground">← Back to today</button>
                  <div className="mt-2">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{active.id}</div>
                    <div className="font-display text-lg font-semibold">{active.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{active.building}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />Due {active.due}</span>
                    </div>
                  </div>

                  <button onClick={()=>setPhotoUploaded(true)} className={`mt-4 grid h-44 w-full place-items-center rounded-2xl border-2 border-dashed transition ${photoUploaded ? "border-emerald-400 bg-emerald-50/60" : "border-border bg-surface-2/50"}`}>
                    {photoUploaded ? (
                      <div className="text-center">
                        <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=60" alt="" className="mx-auto h-24 w-32 rounded-md object-cover" />
                        <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700"><Check className="h-3 w-3" /> Photo captured</div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Camera className="mx-auto h-8 w-8" />
                        <div className="mt-2 text-xs">Tap to capture proof photo</div>
                      </div>
                    )}
                  </button>

                  <textarea placeholder="Optional comment…" className="mt-3 h-16 w-full rounded-xl border border-border bg-card p-3 text-xs outline-none focus:ring-2 focus:ring-ring/30" />

                  <div className="mt-auto space-y-2 pt-4">
                    <button onClick={()=>complete(active.id, true)} disabled={!photoUploaded}
                      className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 font-display text-lg font-semibold text-white shadow-elevated transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-emerald-300">
                      <Check className="h-6 w-6" /> DONE
                    </button>
                    <button onClick={()=>complete(active.id, false)} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 text-sm font-semibold text-rose-700 active:scale-[0.98]">
                      <X className="h-5 w-5" /> NOT DONE
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {toast && <div className="mt-4 rounded-xl bg-navy px-4 py-2 text-center text-xs font-medium text-primary-foreground shadow-elevated">{toast}</div>}
        </div>

        <div className="space-y-4">
          <Card>
            <div className="font-display text-base font-semibold">Designed for housemasters.</div>
            <p className="mt-1 text-sm text-muted-foreground">No menus. No training. Just two big buttons and a mandatory photo. Auto-captures timestamp, user ID, building ID, and GPS.</p>
            <ul className="mt-3 space-y-2 text-sm">
              <Bullet>Big <b>DONE</b> & <b>NOT DONE</b> buttons</Bullet>
              <Bullet>Mandatory photo before submit</Bullet>
              <Bullet>Works offline — syncs when online</Bullet>
              <Bullet>Auto-captured: timestamp, user, building, GPS</Bullet>
              <Bullet>Arabic / English toggle</Bullet>
            </ul>
          </Card>
          <Card>
            <div className="font-display text-base font-semibold">Sync status</div>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-secondary/40 p-3">
              <div>
                <div className="text-xs font-semibold">Network</div>
                <div className="text-[11px] text-muted-foreground">{online ? "Connected — auto-sync active" : "Offline — tasks queued locally"}</div>
              </div>
              <button onClick={()=>setOnline(!online)} className="rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:bg-secondary">
                Simulate {online ? "offline" : "online"}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Bubble({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-xl bg-white/10 py-2">
      <div className="font-display text-lg font-semibold text-white">{n}</div>
      <div className="text-[10px] uppercase tracking-wider text-white/60">{label}</div>
    </div>
  );
}
function Bullet({ children }: { children: React.ReactNode }) {
  return <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /><span>{children}</span></li>;
}

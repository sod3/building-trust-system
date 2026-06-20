import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, PageHeader, StatusPill } from "@/components/dashboard/ui";
import { tasks } from "@/lib/mock-data";
import { Check, X as XIcon, RefreshCw, AlertTriangle, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/dashboard/approvals")({
  component: ApprovalsPage,
});

function ApprovalsPage() {
  const initial = tasks.filter(t => t.status === "submitted");
  const [queue, setQueue] = useState(initial);
  const [rejectFor, setRejectFor] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [toast, setToast] = useState("");

  function show(t: string) { setToast(t); setTimeout(()=>setToast(""), 2500); }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supervisor approvals"
        subtitle="Review labor submissions, approve verified work, reject blurry photos, or escalate to property admin."
        actions={<span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">{queue.length} pending</span>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {queue.map(t => (
          <Card key={t.id} className="!p-0 overflow-hidden">
            <div className="flex gap-4">
              <img src={t.proof} alt="" className="h-48 w-44 shrink-0 object-cover" />
              <div className="min-w-0 flex-1 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{t.id} · {t.category}</div>
                    <div className="font-display text-base font-semibold">{t.name}</div>
                  </div>
                  <StatusPill status={t.priority} />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{t.building}</div>
                  <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" />Due {t.due}</div>
                  <div>Labor: <span className="text-foreground">{t.labor}</span></div>
                  <div>Submitted: <span className="text-foreground">{t.submittedAt}</span></div>
                </div>
                <div className="mt-2 rounded-md bg-secondary/60 p-2 text-[11px] text-muted-foreground">
                  ✓ GPS confirmed · ✓ Mandatory photo · ✓ Timestamp matched (±2 min)
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={()=>{ setQueue(q=>q.filter(x=>x.id!==t.id)); show(`Approved ${t.id}`); }} className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"><Check className="h-3 w-3" /> Approve</button>
                  <button onClick={()=>setRejectFor(t.id)} className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100"><XIcon className="h-3 w-3" /> Reject</button>
                  <button onClick={()=>show(`New photo requested from ${t.labor}`)} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary"><RefreshCw className="h-3 w-3" /> Request new photo</button>
                  <button onClick={()=>show(`Escalated ${t.id} to admin`)} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary"><AlertTriangle className="h-3 w-3" /> Escalate</button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {queue.length === 0 && (
          <Card className="lg:col-span-2 text-center">
            <div className="font-display text-lg font-semibold">Queue clear</div>
            <p className="mt-1 text-sm text-muted-foreground">All submissions reviewed. Great work.</p>
          </Card>
        )}
      </div>

      {rejectFor && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-elevated">
            <h3 className="font-display text-lg font-semibold">Reject submission</h3>
            <p className="mt-1 text-sm text-muted-foreground">Give the labor team a clear reason. They will re-submit on their mobile app.</p>
            <textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder="Photo blurry — please retake from a wider angle"
              className="mt-3 h-24 w-full rounded-md border border-border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setRejectFor(null)} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary">Cancel</button>
              <button onClick={()=>{ setQueue(q=>q.filter(x=>x.id!==rejectFor)); show(`Rejected ${rejectFor}`); setRejectFor(null); setReason(""); }}
                className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">Send back to labor</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-navy px-4 py-3 text-sm font-medium text-primary-foreground shadow-elevated">{toast}</div>}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, StatusPill } from "@/components/dashboard/ui";
import { tasks } from "@/lib/mock-data";
import { MapPin, Wifi } from "lucide-react";

export const Route = createFileRoute("/dashboard/submissions")({
  component: SubmissionsPage,
});

function SubmissionsPage() {
  const subs = tasks.filter(t => t.status !== "pending");
  return (
    <div className="space-y-6">
      <PageHeader title="Submissions" subtitle="Every photo proof submitted by labor, with GPS, sync and supervisor decision." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {subs.map(t => (
          <Card key={t.id} className="!p-0 overflow-hidden">
            {t.proof && <img src={t.proof} alt="" className="h-40 w-full object-cover" />}
            <div className="p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{t.id}</div>
              <div className="truncate font-semibold">{t.name}</div>
              <div className="mt-1 truncate text-[11px] text-muted-foreground">{t.building} · {t.labor}</div>
              <div className="mt-2 flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />GPS ✓</span>
                <span className="inline-flex items-center gap-1"><Wifi className="h-3 w-3" />Synced</span>
                <span>· {t.submittedAt}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <StatusPill status={t.status} />
                <span className="text-[11px] text-muted-foreground">{t.supervisor}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

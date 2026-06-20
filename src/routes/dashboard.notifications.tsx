import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, StatusPill } from "@/components/dashboard/ui";
import { notifications } from "@/lib/mock-data";
import { Bell, MessageSquareWarning, AlertTriangle, ShieldCheck, FileBarChart2, Wrench } from "lucide-react";

const iconMap: Record<string, any> = { overdue: AlertTriangle, complaint: MessageSquareWarning, approval: ShieldCheck, report: FileBarChart2, maintenance: Wrench };

export const Route = createFileRoute("/dashboard/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" subtitle="Operational alerts, complaint updates and owner summaries — in one feed." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="!p-0 overflow-hidden">
          <div className="divide-y divide-border">
            {notifications.map(n => {
              const Icon = iconMap[n.type] || Bell;
              return (
                <div key={n.id} className="flex gap-3 p-4 hover:bg-secondary/30">
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${n.type === "overdue" || n.type === "complaint" ? "bg-rose-50 text-rose-700" : n.type === "approval" ? "bg-amber-50 text-amber-700" : "bg-sky-50 text-sky-700"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-medium">{n.title}</div>
                      {n.unread && <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">New</span>}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{n.body}</div>
                    <div className="mt-1 text-[10px] text-muted-foreground">{n.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="font-display text-sm font-semibold">Notification settings</div>
          <p className="mt-1 text-xs text-muted-foreground">Choose where each role receives alerts.</p>
          <div className="mt-4 space-y-3 text-sm">
            {["Email","WhatsApp","In-app","Owner weekly summary","Supervisor alerts","Tenant updates"].map((s,i)=>(
              <label key={s} className="flex items-center justify-between rounded-lg border border-border p-2">
                <span>{s}</span>
                <input type="checkbox" defaultChecked={i!==2} className="h-4 w-4 accent-[oklch(0.55_0.11_245)]" />
              </label>
            ))}
          </div>
          <button className="mt-4 w-full rounded-md bg-navy py-2 text-sm font-medium text-primary-foreground hover:bg-navy/90">Save settings</button>
          <div className="mt-3 text-[11px] text-muted-foreground">WhatsApp delivery is an <StatusPill status="active" /> add-on on Business+.</div>
        </Card>
      </div>
    </div>
  );
}

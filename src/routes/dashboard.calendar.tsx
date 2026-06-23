import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/dashboard/ui";
import { tasks } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/calendar")({
  component: CalendarPage,
});

const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const timeslots = ["07:00","09:00","11:00","13:00","16:00","18:00"];

function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Task Calendar" subtitle="Weekly view of every scheduled task - daily, weekly and monthly recurrences."
        actions={
          <div className="flex items-center gap-2">
            <button className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-secondary"><ChevronLeft className="h-4 w-4" /></button>
            <span className="text-sm font-medium">Week of 16 Jun 2026</span>
            <button className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-secondary"><ChevronRight className="h-4 w-4" /></button>
          </div>
        } />
      <Card className="!p-0 overflow-x-auto">
        <div className="grid min-w-[900px] grid-cols-8 border-b border-border bg-secondary/40 text-[11px] uppercase tracking-wider text-muted-foreground">
          <div className="px-3 py-3">Time</div>
          {days.map(d => <div key={d} className="px-3 py-3">{d}</div>)}
        </div>
        {timeslots.map((time, i) => (
          <div key={time} className="grid min-w-[900px] grid-cols-8 border-b border-border last:border-0">
            <div className="px-3 py-3 text-xs font-medium text-muted-foreground">{time}</div>
            {days.map((d, di) => {
              const list = tasks.filter(t => t.due === time).slice(di*1, di*1+2);
              return (
                <div key={d} className="border-l border-border px-2 py-2 min-h-[80px] space-y-1">
                  {list.map((t,k)=>{
                    const color = t.status === "approved" ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : t.status === "rejected" || t.status === "overdue" ? "bg-rose-50 text-rose-700 ring-rose-200"
                      : t.status === "submitted" ? "bg-sky-50 text-sky-700 ring-sky-200"
                      : "bg-amber-50 text-amber-700 ring-amber-200";
                    return (
                      <div key={k} className={`truncate rounded-md px-2 py-1 text-[10px] font-medium ring-1 ring-inset ${color}`}>{t.name}</div>
                    );
                  })}
                  {i === 2 && di === 3 && <div className="rounded-md bg-rose-100 px-2 py-1 text-[10px] font-medium text-rose-700">⚠ 2 overdue</div>}
                </div>
              );
            })}
          </div>
        ))}
      </Card>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Approved</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-500" /> Submitted</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Pending</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Overdue / Rejected</span>
      </div>
    </div>
  );
}

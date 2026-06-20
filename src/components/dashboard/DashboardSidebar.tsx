import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Building2, Layers, Users, Crown, UserSquare2,
  ListChecks, CalendarDays, Images, ShieldCheck, MessageSquareWarning,
  Wrench, FileBarChart2, Bell, CreditCard, Settings, Smartphone, QrCode,
  Eye, ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/lib/role-context";

const groups = [
  {
    label: "Overview",
    items: [{ to: "/dashboard", icon: LayoutDashboard, label: "Overview" }],
  },
  {
    label: "Portfolio",
    items: [
      { to: "/dashboard/buildings", icon: Building2, label: "Buildings" },
      { to: "/dashboard/units", icon: Layers, label: "Floors & Units" },
      { to: "/dashboard/staff", icon: Users, label: "Staff" },
      { to: "/dashboard/owners", icon: Crown, label: "Owners" },
      { to: "/dashboard/tenants", icon: UserSquare2, label: "Tenants" },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/dashboard/tasks", icon: ListChecks, label: "Tasks" },
      { to: "/dashboard/calendar", icon: CalendarDays, label: "Task Calendar" },
      { to: "/dashboard/submissions", icon: Images, label: "Submissions" },
      { to: "/dashboard/approvals", icon: ShieldCheck, label: "Approvals" },
      { to: "/dashboard/complaints", icon: MessageSquareWarning, label: "Complaints" },
      { to: "/dashboard/maintenance", icon: Wrench, label: "Maintenance" },
    ],
  },
  {
    label: "Insights",
    items: [
      { to: "/dashboard/reports", icon: FileBarChart2, label: "Reports" },
      { to: "/dashboard/notifications", icon: Bell, label: "Notifications" },
    ],
  },
  {
    label: "Role views",
    items: [
      { to: "/dashboard/owner-view", icon: Eye, label: "Owner View" },
      { to: "/dashboard/supervisor-view", icon: ClipboardCheck, label: "Supervisor Panel" },
      { to: "/dashboard/mobile-labor", icon: Smartphone, label: "Labor App" },
      { to: "/dashboard/tenant-portal", icon: QrCode, label: "Tenant Portal" },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/dashboard/billing", icon: CreditCard, label: "Billing" },
      { to: "/dashboard/settings", icon: Settings, label: "Settings" },
    ],
  },
] as const;

export function DashboardSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { role } = useRole();

  // Filter for non-admin roles
  const filteredGroups = groups.map(g => {
    if (role === "owner") {
      const allowed = ["/dashboard","/dashboard/buildings","/dashboard/complaints","/dashboard/reports","/dashboard/notifications","/dashboard/owner-view"];
      return { ...g, items: g.items.filter(i => allowed.includes(i.to)) };
    }
    if (role === "supervisor") {
      const allowed = ["/dashboard","/dashboard/tasks","/dashboard/approvals","/dashboard/submissions","/dashboard/complaints","/dashboard/maintenance","/dashboard/supervisor-view"];
      return { ...g, items: g.items.filter(i => allowed.includes(i.to)) };
    }
    if (role === "labor") {
      const allowed = ["/dashboard/mobile-labor"];
      return { ...g, items: g.items.filter(i => allowed.includes(i.to)) };
    }
    if (role === "tenant") {
      const allowed = ["/dashboard/tenant-portal"];
      return { ...g, items: g.items.filter(i => allowed.includes(i.to)) };
    }
    return g;
  }).filter(g => g.items.length > 0);

  return (
    <aside className="hidden h-[100dvh] w-64 shrink-0 flex-col border-r border-border bg-navy-gradient text-white lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 backdrop-blur">
          <Building2 className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <div className="font-display text-sm font-semibold">Riyadh OS</div>
          <div className="text-[10px] uppercase tracking-wider text-white/50">Building OS · Demo</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {filteredGroups.map((g) => (
          <div key={g.label} className="mb-5">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
              {g.label}
            </div>
            <div className="space-y-0.5">
              {g.items.map((i) => {
                const Icon = i.icon;
                const active = pathname === i.to || (i.to !== "/dashboard" && pathname.startsWith(i.to));
                return (
                  <Link
                    key={i.to}
                    to={i.to}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                      active
                        ? "bg-white/15 text-white shadow-[inset_0_1px_0_0_oklch(1_0_0/0.1)]"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", active ? "text-gold" : "text-white/50 group-hover:text-white/80")} />
                    <span className="truncate">{i.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
          <div className="text-xs font-semibold text-white">Demo workspace</div>
          <div className="mt-1 text-[11px] text-white/60">All data is dummy. No backend connected.</div>
        </div>
      </div>
    </aside>
  );
}

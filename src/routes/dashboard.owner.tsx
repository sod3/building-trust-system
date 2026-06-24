import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";
import {
  Building2, LayoutDashboard, Users, ClipboardList, FileBarChart2,
  History, CreditCard, Settings, Bell, LogOut, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { mockOwners } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/owner")({
  head: () => ({ meta: [{ title: "Owner Dashboard — FacilityOS Arabia" }] }),
  component: OwnerLayout,
});

const navItems = [
  { to: "/dashboard/owner", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/owner/buildings", label: "My Buildings", icon: Building2 },
  { to: "/dashboard/owner/labour", label: "Labour", icon: Users },
  { to: "/dashboard/owner/assign-tasks", label: "Assign Tasks", icon: ClipboardList },
  { to: "/dashboard/owner/reports", label: "Today's Reports", icon: FileBarChart2 },
  { to: "/dashboard/owner/history", label: "Report History", icon: History },
  { to: "/dashboard/owner/subscription", label: "Subscription", icon: CreditCard },
  { to: "/dashboard/owner/settings", label: "Settings", icon: Settings },
];

function OwnerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: s => s.location.pathname });

  // Find owner data
  const ownerData = mockOwners.find(o => o.id === user?.ownerId) || mockOwners[0];

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  return (
    <div className="flex h-[100dvh] w-full bg-surface-2/40">
      {/* Sidebar */}
      <aside className="hidden h-[100dvh] w-64 shrink-0 flex-col border-r border-border bg-navy-gradient text-white lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 backdrop-blur border border-white/15">
            <Building2 className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold">FacilityOS Arabia</div>
            <div className="text-[10px] uppercase tracking-wider text-white/50">Owner Dashboard</div>
          </div>
        </div>

        {/* Owner info */}
        <div className="mx-3 mt-3 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
          <div className="text-[11px] text-white/50 uppercase tracking-wider mb-1">Your Building Operations Hub</div>
          <div className="font-semibold text-sm text-white">{ownerData.company}</div>
          <div className="text-xs text-white/60 mt-0.5">{ownerData.plan} Plan · {ownerData.buildingIds.length} Buildings</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-0.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                    active
                      ? "bg-white/15 text-white shadow-[inset_0_1px_0_0_oklch(1_0_0/0.1)]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", active ? "text-gold" : "text-white/50 group-hover:text-white/80")} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User / Logout */}
        <div className="border-t border-white/10 p-4 space-y-2">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-xs font-bold text-white">
              {ownerData.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-white">{ownerData.name}</div>
              <div className="text-[10px] text-white/50">{ownerData.plan} Owner</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <div className="relative hidden flex-1 max-w-sm md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search buildings, labour, reports…"
              className="h-9 w-full rounded-xl border border-border bg-surface-2/40 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:bg-background focus:ring-2 focus:ring-accent/20 transition"
            />
          </div>
          <div className="flex-1" />
          <Link to="/" className="hidden items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition sm:flex">
            View Website
          </Link>
          <button className="relative grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
          </button>
          <div className="flex items-center gap-2 rounded-full border border-border bg-surface-2/50 py-1 pl-1 pr-3">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-accent text-[11px] font-semibold text-white">
              {ownerData.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <span className="hidden text-xs font-medium md:inline">{ownerData.name}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

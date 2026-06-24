import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";
import {
  Building2, Users, LayoutDashboard, ClipboardCheck, FileBarChart2,
  CreditCard, Settings, Bell, LogOut, ChevronDown, Search, Wallet, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — FacilityOS Arabia" }] }),
  component: AdminLayout,
});

const navItems = [
  { to: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/admin/owners", label: "Owners", icon: Users },
  { to: "/dashboard/admin/buildings", label: "Buildings", icon: Building2 },
  { to: "/dashboard/admin/labour", label: "Labour", icon: Users },
  { to: "/dashboard/admin/checklists", label: "Checklist Templates", icon: ClipboardCheck },
  { to: "/dashboard/admin/reports", label: "Daily Reports", icon: FileBarChart2 },
  { to: "/dashboard/admin/earnings", label: "Earnings", icon: Wallet },
  { to: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: s => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

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
            <div className="text-[10px] uppercase tracking-wider text-white/50">Admin Control Center</div>
          </div>
        </div>

        {/* Admin badge */}
        <div className="mx-3 mt-3 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-gold" />
            <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">Admin Access Only</span>
          </div>
          <p className="mt-0.5 text-[10px] text-white/50">Restricted to platform management</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-0.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to) && !(item.exact && pathname !== item.to);
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

        {/* User section */}
        <div className="border-t border-white/10 p-4 space-y-2">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-xs font-bold text-white">
              {user?.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-white">{user?.name}</div>
              <div className="text-[10px] text-white/50">Platform Admin</div>
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

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <div className="relative hidden flex-1 max-w-sm md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search owners, buildings, labour…"
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
            <div className="grid h-7 w-7 place-items-center rounded-full bg-navy text-[11px] font-semibold text-white">
              {user?.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <span className="hidden text-xs font-medium md:inline">{user?.name}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

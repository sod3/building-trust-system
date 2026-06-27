import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";
import {
  Building2,
  Users,
  LayoutDashboard,
  ClipboardCheck,
  FileBarChart2,
  CreditCard,
  Settings,
  Bell,
  LogOut,
  ChevronDown,
  Search,
  Wallet,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — FacilityOS Arabia" }] }),
  component: AdminLayout,
});

const navItems = [
  {
    to: "/dashboard/admin",
    labelKey: "dashboard.admin.nav.overview",
    icon: LayoutDashboard,
    exact: true,
  },
  { to: "/dashboard/admin/owners", labelKey: "dashboard.admin.nav.owners", icon: Users },
  { to: "/dashboard/admin/buildings", labelKey: "dashboard.admin.nav.buildings", icon: Building2 },
  { to: "/dashboard/admin/reports", labelKey: "dashboard.admin.nav.reports", icon: FileBarChart2 },
  { to: "/dashboard/admin/labour", labelKey: "dashboard.admin.nav.labour", icon: Users },
  {
    to: "/dashboard/admin/checklists",
    labelKey: "dashboard.admin.nav.templates",
    icon: ClipboardCheck,
  },
  { to: "/dashboard/admin/earnings", labelKey: "dashboard.admin.nav.earnings", icon: Wallet },
  { to: "/dashboard/admin/settings", labelKey: "dashboard.admin.nav.settings", icon: Settings },
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  // Close more menu on route change
  useEffect(() => {
    setMobileMoreOpen(false);
  }, [pathname]);

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  const mainMobileNav = navItems.slice(0, 4);
  const moreMobileNav = navItems.slice(4);

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
            <div className="text-[10px] uppercase tracking-wider text-white/50">
              {t("dashboard.admin.center")}
            </div>
          </div>
        </div>

        {/* Admin badge */}
        <div className="mx-3 mt-3 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-gold" />
            <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">
              {t("role.admin")}
            </span>
          </div>
          <p className="mt-0.5 text-[10px] text-white/50">
            {t("login.admin_notice", { fallback: "Restricted to platform management" })}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? pathname === item.to
                : pathname.startsWith(item.to) && !(item.exact && pathname !== item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                    active
                      ? "bg-white/15 text-white shadow-[inset_0_1px_0_0_oklch(1_0_0/0.1)]"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active ? "text-gold" : "text-white/50 group-hover:text-white/80",
                    )}
                  />
                  <span className="truncate">{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="border-t border-white/10 p-4 space-y-2">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-xs font-bold text-white">
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-white">{user?.name}</div>
              <div className="text-[10px] text-white/50">{t("role.admin")}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <LogOut className={`h-4 w-4 ${lang === "ar" ? "rotate-180" : ""}`} />
            {t("common.logout")}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col relative">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder={t("common.search")}
              className="h-9 w-full rounded-xl border border-border bg-surface-2/40 px-9 text-sm outline-none placeholder:text-muted-foreground/70 focus:bg-background focus:ring-2 focus:ring-accent/20 transition"
            />
          </div>
          <div className="flex-1" />
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="flex items-center gap-2 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition"
          >
            {lang === "en" ? "العربية" : "English"}
          </button>
          <button className="relative grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition">
            <Bell className="h-4 w-4" />
            <span
              className={`absolute top-1.5 h-2 w-2 rounded-full bg-rose-500 ${lang === "ar" ? "left-1.5" : "right-1.5"}`}
            />
          </button>
          <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-surface-2/50 py-1 pl-1 pr-3">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-navy text-[11px] font-semibold text-white">
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <span className="text-xs font-medium">{user?.name}</span>
          </div>
        </header>

        {/* Padding bottom is needed for mobile nav */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-[calc(80px+env(safe-area-inset-bottom))] lg:pb-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-around px-2 py-2">
            {mainMobileNav.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? pathname === item.to
                : pathname.startsWith(item.to) && !(item.exact && pathname !== item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center justify-center w-16 h-12 gap-1 rounded-xl transition-colors",
                    active
                      ? "text-navy"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Icon className={cn("h-5 w-5", active && "text-gold")} />
                  <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
                </Link>
              );
            })}
            <button
              onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-12 gap-1 rounded-xl transition-colors",
                mobileMoreOpen
                  ? "text-navy bg-secondary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Menu className="h-5 w-5" />
              <span className="text-[10px] font-medium">
                {t("common.more", { fallback: "More" })}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile "More" Menu Overlay */}
        {mobileMoreOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMoreOpen(false)}
            />
            <div className="relative bg-background rounded-t-3xl border-t border-border p-6 pb-[calc(24px+env(safe-area-inset-bottom))] animate-in slide-in-from-bottom-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-semibold text-lg">
                  {t("common.more", { fallback: "More Options" })}
                </h3>
                <button
                  onClick={() => setMobileMoreOpen(false)}
                  className="p-2 rounded-full bg-secondary hover:bg-secondary/80"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2 mb-6">
                {moreMobileNav.map((item) => {
                  const Icon = item.icon;
                  const active = pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl transition-colors",
                        active
                          ? "bg-secondary text-navy"
                          : "hover:bg-secondary/50 text-muted-foreground",
                      )}
                    >
                      <Icon className={cn("h-5 w-5", active && "text-gold")} />
                      <span className="font-medium">{t(item.labelKey)}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-4 p-4 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className={`h-5 w-5 ${lang === "ar" ? "rotate-180" : ""}`} />
                  <span className="font-medium">{t("common.logout")}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

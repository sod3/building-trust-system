import { useState } from "react";
import { Bell, Search, Languages, ChevronDown, Calendar, ArrowLeftRight, Home } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { useRole, roleLabel } from "@/lib/role-context";
import type { Role } from "@/lib/mock-data";

const roles: Role[] = ["super-admin","property-admin","owner","supervisor","labor","tenant"];

export function DashboardTopbar() {
  const { lang, setLang } = useLang();
  const { role, setRole } = useRole();
  const [openRole, setOpenRole] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <Link to="/" className="hidden items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground sm:flex">
        <Home className="h-3.5 w-3.5" />
        Site
      </Link>
      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search buildings, tasks, complaints, tenants…"
          className="h-9 w-full rounded-lg border border-border bg-surface-2/40 pl-9 pr-3 text-sm outline-none ring-ring/30 placeholder:text-muted-foreground/70 focus:bg-background focus:ring-2"
        />
      </div>
      <div className="flex-1 md:flex-none" />
      <button className="hidden items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition hover:bg-secondary md:flex">
        <Calendar className="h-3.5 w-3.5" />
        Last 7 days
      </button>
      <button
        onClick={() => setLang(lang === "en" ? "ar" : "en")}
        className="hidden items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition hover:bg-secondary sm:flex"
      >
        <Languages className="h-3.5 w-3.5" />
        {lang === "en" ? "العربية" : "English"}
      </button>
      <div className="relative">
        <button
          onClick={() => setOpenRole(!openRole)}
          className="flex items-center gap-2 rounded-md border border-border bg-navy px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:bg-navy/90"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          <span>{roleLabel[role]}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </button>
        {openRole && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-popover p-1 shadow-elevated">
            <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Preview as
            </div>
            {roles.map(r => (
              <button
                key={r}
                onClick={() => { setRole(r); setOpenRole(false); }}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${role === r ? "bg-secondary text-foreground" : "hover:bg-secondary/60"}`}
              >
                <span>{roleLabel[r]}</span>
                {role === r && <span className="h-2 w-2 rounded-full bg-accent" />}
              </button>
            ))}
          </div>
        )}
      </div>
      <button className="relative grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition hover:bg-secondary hover:text-foreground">
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
      </button>
      <div className="flex items-center gap-2 rounded-full border border-border bg-surface-2/50 py-1 pl-1 pr-3">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-navy text-[11px] font-semibold text-primary-foreground">OA</span>
        <span className="hidden text-xs font-medium md:inline">Omar Al-Fahad</span>
      </div>
    </header>
  );
}

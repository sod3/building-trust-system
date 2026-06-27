import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Building2, Languages } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/product", key: "nav.product" },
  { to: "/solutions", key: "nav.solutions" },
  { to: "/pricing", key: "nav.pricing" },
  { to: "/about", key: "nav.about" },
  { to: "/security", key: "nav.security" },
] as const;

export function Header() {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            FacilityOS<span className="text-accent"> Arabia</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {t(n.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="hidden items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary sm:flex"
            aria-label="Toggle language"
          >
            <Languages className="h-3.5 w-3.5" />
            {lang === "en" ? "العربية" : "English"}
          </button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="hidden border-border md:inline-flex"
          >
            <Link to="/login">{t("nav.signin")}</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="hidden bg-navy text-primary-foreground hover:bg-navy/90 md:inline-flex"
          >
            <Link to="/login">{t("pricing.btn.get_owner")}</Link>
          </Button>
          <button
            className="grid h-9 w-9 place-items-center rounded-md border border-border md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary"
              >
                {t(n.key)}
              </Link>
            ))}
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="mt-2 flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
            >
              <Languages className="h-4 w-4" />
              {lang === "en" ? "العربية" : "English"}
            </button>
            <Button asChild variant="outline" className="mt-2 border-border">
              <Link to="/login" onClick={() => setOpen(false)}>
                {t("nav.signin")}
              </Link>
            </Button>
            <Button asChild className="mt-2 bg-navy text-primary-foreground hover:bg-navy/90">
              <Link to="/login" onClick={() => setOpen(false)}>
                {t("pricing.btn.get_owner")}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

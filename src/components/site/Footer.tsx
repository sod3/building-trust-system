import { Link } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold">FacilityOS Arabia</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t("footer.tag")}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">{t("footer.product")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/product" className="hover:text-foreground">{t("nav.product")}</Link></li>
            <li><Link to="/solutions" className="hover:text-foreground">{t("nav.solutions")}</Link></li>
            <li><Link to="/pricing" className="hover:text-foreground">{t("nav.pricing")}</Link></li>
            <li><Link to="/security" className="hover:text-foreground">{t("nav.security")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">{t("footer.company")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">{t("nav.about")}</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">{t("footer.legal")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/security" className="hover:text-foreground">PDPL</Link></li>
            <li><Link to="/security" className="hover:text-foreground">{t("footer.privacy", { fallback: "Privacy" })}</Link></li>
            <li><Link to="/security" className="hover:text-foreground">{t("footer.terms", { fallback: "Terms" })}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} FacilityOS Arabia. {t("footer.rights")}</span>
          <span>{t("footer.cities", { fallback: "Riyadh · Dubai · Doha" })}</span>
        </div>
      </div>
    </footer>
  );
}

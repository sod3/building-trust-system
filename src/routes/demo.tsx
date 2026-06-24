import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, Crown, ClipboardCheck, Smartphone, QrCode } from "lucide-react";

import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Platform Demo - FacilityOS Arabia" },
      { name: "description", content: "Explore the FacilityOS Arabia dashboard with dummy data: admin, owner, and labour app." },
    ],
  }),
  component: DemoPage,
});

function DemoPage() {
  const { t, lang } = useLang();

  const previews = [
    { to: "/admin",  title: t("product.admin.title", { fallback: "Admin Dashboard" }), body: t("dashboard.admin.desc"), icon: LayoutDashboard, tag: lang === "ar" ? "الإدارة" : "Platform Admin" },
    { to: "/owner",  title: t("product.owner.title", { fallback: "Owner Dashboard" }), body: t("dashboard.owner.desc"), icon: Crown, tag: lang === "ar" ? "للملاك" : "For Owners" },
    { to: "/labour", title: t("product.labour.title", { fallback: "Labour Dashboard" }), body: t("dashboard.labour.desc", { fallback: "Simple visual checklist for workers to mark daily tasks as done." }), icon: Smartphone, tag: lang === "ar" ? "للعمال" : "Mobile-first" },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative overflow-hidden bg-navy-gradient bg-mesh py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-gold">{t("demo.kicker", { fallback: "Live platform preview" })}</div>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {t("demo.title", { fallback: "See every dashboard, every role, every screen - with dummy data." })}
            </h1>
            <p className="mt-4 text-lg text-white/70">{t("demo.sub", { fallback: "No signup. Experience the Admin, Owner, and Labour views inside the dashboard." })}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-white text-navy hover:bg-white/90"><Link to="/login">{t("demo.launch", { fallback: "Launch Interactive Demo" })} <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/0 text-white hover:bg-white/10 hover:text-white"><Link to="/contact">{t("cta.demo", { fallback: "Book live walk-through" })}</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {previews.map(p => {
            const Icon = p.icon;
            return (
              <Link key={p.to} to={p.to} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition hover:shadow-elevated">
                <div className={`absolute top-4 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground ${lang === 'ar' ? 'left-4' : 'right-4'}`}>{p.tag}</div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-navy text-primary-foreground"><Icon className="h-6 w-6" /></div>
                <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  {t("demo.open", { fallback: "Open preview" })} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}

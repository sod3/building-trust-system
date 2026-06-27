import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Camera,
  ShieldCheck,
  MessageSquare,
  BarChart3,
  WifiOff,
  Activity,
  Languages,
  Building,
  Users,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  LayoutDashboard,
  ClipboardCheck,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-building1.png";
import laborImg from "@/assets/labor-app1.png";
import ownerImg from "@/assets/owner-dashboard1.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FacilityOS Arabia - Smart Building Operations Platform" },
      {
        name: "description",
        content:
          "Simple Daily Building Operations, Verified by Labour Checklists. Built for Saudi & Gulf.",
      },
      { property: "og:title", content: "FacilityOS Arabia - Smart Building Operations Platform" },
      {
        property: "og:description",
        content: "One platform for facility teams across Saudi Arabia and the Gulf.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { t, lang } = useLang();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section
        className="relative min-h-[100dvh] flex items-center overflow-hidden bg-navy-gradient text-primary-foreground"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-mesh opacity-30 mix-blend-overlay" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-28">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              {t("badge.kingdom")}
            </span>

            <h1 className="mt-8 text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tighter sm:text-6xl lg:text-7xl drop-shadow-2xl">
              {t("home.hero.title", {
                fallback: "Simple Daily Building Operations, Verified by Labour Checklists",
              })}
            </h1>

            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-white/90 drop-shadow-md">
              {t("home.hero.subtitle", {
                fallback:
                  "Give building owners a clear dashboard to assign daily tasks, track labour work, and receive daily proof that cleaning, maintenance, elevator, water, lights, and security checks are completed.",
              })}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-white text-navy hover:bg-white/95 active:scale-[0.985] transition-all duration-200 shadow-xl shadow-black/30 font-semibold"
              >
                <Link to="/pricing">
                  {t("pricing.btn.get_owner")}
                  <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/30 bg-white/10 text-white hover:bg-white/15 hover:border-white/50 backdrop-blur-md transition-all duration-200"
              >
                <Link to="/login">{t("product.btn.demo")}</Link>
              </Button>
            </div>

            <div className="mt-12">
              <p className="text-xs uppercase tracking-[3px] text-white/60 mb-3">
                {t("hero.trust")}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
                <span>Riyadh</span>
                <span>·</span>
                <span>Jeddah</span>
                <span>·</span>
                <span>Dammam</span>
                <span>·</span>
                <span>Dubai</span>
                <span>·</span>
                <span>Doha</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 hidden lg:block" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            {t("home.workflow.kicker", { fallback: "Simple Workflow" })}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("product.how_it_works")}
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { n: "1", t: "Subscribe", b: "Choose a plan and get instant access." },
              { n: "2", t: "Access Owner Dashboard", b: "Log in to your private owner portal." },
              { n: "3", t: "Add Buildings and Labour", b: "Set up your properties and workers." },
              {
                n: "4",
                t: "Assign Daily Tasks",
                b: "Create checklists for cleaning, safety, etc.",
              },
              {
                n: "5",
                t: "Labour Submits Checklist",
                b: "Workers use a simple mobile dashboard to mark tasks as done.",
              },
              {
                n: "6",
                t: "View Daily Reports",
                b: "Receive proof of work in your dashboard daily.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="relative rounded-2xl border border-border bg-background p-6 shadow-sm flex flex-col gap-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white font-bold">
                  {s.n}
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold">{s.t}</h3>
                <p className="text-sm text-muted-foreground">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARDS SECTION */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {t("home.platform.kicker", { fallback: "Platform" })}
            </p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("product.hero.title")}
            </h2>
          </div>
          <Link
            to="/product"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-navy"
          >
            {t("home.platform.explore", { fallback: "Explore the platform" })}{" "}
            <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Admin */}
          <BentoCard className="bg-navy text-primary-foreground border-transparent flex flex-col">
            <BentoHeader
              icon={<LayoutDashboard />}
              title={t("product.admin.title")}
              body={t("dashboard.admin.desc")}
              dark
            />
          </BentoCard>

          {/* Owner */}
          <BentoCard className="bg-surface-2 border-border flex flex-col">
            <BentoHeader
              icon={<BarChart3 />}
              title={t("product.owner.title")}
              body={t("dashboard.owner.desc")}
            />
          </BentoCard>

          {/* Labour */}
          <BentoCard className="bg-accent text-accent-foreground border-transparent flex flex-col">
            <BentoHeader
              icon={<ClipboardCheck />}
              title={t("product.labour.title")}
              body={t("dashboard.labour.desc", {
                fallback:
                  "Simple visual checklist for workers to mark daily tasks as done and submit work.",
              })}
              dark
            />
          </BentoCard>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="border-t border-border mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {t("sec.pricing.kicker")}
            </p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("sec.pricing.title")}
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">{t("sec.pricing.body")}</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/pricing">
              {lang === "ar" ? "كل الباقات" : "See all plans"}{" "}
              <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
        <PricingMini />
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-navy bg-mesh p-10 text-primary-foreground sm:p-16">
          <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("sec.cta.title")}
          </h2>
          <p className="mt-3 max-w-xl text-white/75">{t("sec.cta.body")}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-white text-navy hover:bg-white/90"
            >
              <Link to="/login">
                {t("home.cta.start", { fallback: "Start Building Management" })}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white/25 text-black hover:bg-white/10 hover:text-white"
            >
              <Link to="/pricing">
                {t("home.cta.subscribe", { fallback: "Subscribe to Access" })}
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-4 text-sm text-white/70 sm:grid-cols-3">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" /> +966 55 125 4121
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold" /> info@saturnlynk.sa
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" /> Jeddah, Saudi Arabia
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function BentoCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border p-6 transition-all hover:shadow-elevated ${className}`}>
      {children}
    </div>
  );
}

function BentoHeader({
  icon,
  title,
  body,
  dark = false,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  dark?: boolean;
}) {
  return (
    <div>
      <span
        className={`grid h-12 w-12 place-items-center rounded-xl ${dark ? "bg-white/10 text-white" : "bg-secondary text-navy"}`}
      >
        <span className="[&>svg]:h-6 [&>svg]:w-6">{icon}</span>
      </span>
      <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
      <p
        className={`mt-3 text-[15px] leading-relaxed ${dark ? "text-white/70" : "text-muted-foreground"}`}
      >
        {body}
      </p>
    </div>
  );
}

function PricingMini() {
  const { t } = useLang();
  const plans = [
    {
      name: t("pricing.plan.starter"),
      price: 299,
      scope: t("pricing.desc.starter"),
      features: [
        t("pricing.feat.1building"),
        t("pricing.feat.owner_access"),
        t("pricing.feat.labour_access"),
        t("pricing.feat.daily_reports"),
        t("pricing.feat.email_support"),
      ],
      query: "starter",
    },
    {
      name: t("pricing.plan.professional"),
      price: 899,
      scope: t("pricing.desc.professional"),
      features: [
        t("pricing.feat.up_to_5"),
        t("pricing.feat.multiple_labour"),
        t("pricing.feat.templates"),
        t("pricing.feat.today_reports"),
        t("pricing.feat.priority_support"),
      ],
      popular: true,
      query: "professional",
    },
    {
      name: t("pricing.plan.enterprise"),
      price: 1999,
      scope: t("pricing.desc.enterprise"),
      features: [
        t("pricing.feat.multiple_buildings"),
        t("pricing.feat.advanced_history"),
        t("pricing.feat.custom_setup"),
        t("pricing.feat.dedicated_support"),
      ],
      query: "enterprise",
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {plans.map((p) => (
        <div
          key={p.name}
          className={`relative flex flex-col rounded-2xl border p-6 ${p.popular ? "border-accent bg-accent/5 shadow-elevated" : "border-border bg-background"}`}
        >
          {p.popular && (
            <span className="absolute -top-3 start-6 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
              {t("pricing.popular")}
            </span>
          )}
          <h3 className="font-display text-lg font-semibold">{p.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{p.scope}</p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="font-display text-3xl font-semibold">{p.price.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">{t("pricing.sar_mo")}</span>
          </div>
          <ul className="mt-6 flex-1 space-y-2">
            {p.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            to="/checkout"
            search={{ plan: p.query }}
            className={`mt-6 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition w-full ${p.popular ? "bg-accent text-white hover:bg-accent/90" : "border border-border hover:bg-secondary"}`}
          >
            {t("pricing.btn.get_owner")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      ))}
    </div>
  );
}

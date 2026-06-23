import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, CheckCircle2, Camera, ShieldCheck, MessageSquare, BarChart3, WifiOff, Activity, Languages, Building, Users, Sparkles, Phone, Mail, MapPin } from "lucide-react";
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
      { name: "description", content: "Arabic-first smart building ops: tasks, photo proof, supervisor approvals, tenant complaints, owner reports. Built for Saudi & Gulf." },
      { property: "og:title", content: "FacilityOS Arabia - Smart Building Operations Platform" },
      { property: "og:description", content: "One platform for facility teams across Saudi Arabia and the Gulf." },
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
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark overlay for text readability + depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/40" />
        
        {/* Subtle mesh/grid overlay for premium tech feel */}
        <div className="absolute inset-0 bg-mesh opacity-30 mix-blend-overlay" />
        
        {/* Top accent glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-28">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              {t("badge.kingdom")}
            </span>
            
            <h1 className="mt-8 text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tighter sm:text-6xl lg:text-7xl drop-shadow-2xl">
              {t("hero.title")}
            </h1>
            
            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-white/90 drop-shadow-md">
              {t("hero.sub")}
            </p>
            
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-navy hover:bg-white/95 active:scale-[0.985] transition-all duration-200 shadow-xl shadow-black/30 font-semibold"
              >
                <Link to="/contact">
                  {t("cta.demo")}
                  <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-white/30 bg-white/10 text-white hover:bg-white/15 hover:border-white/50 backdrop-blur-md transition-all duration-200"
              >
                <Link to="/product">{t("cta.view")}</Link>
              </Button>
            </div>

            <div className="mt-12">
              <p className="text-xs uppercase tracking-[3px] text-white/60 mb-3">{t("hero.trust")}</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
                <span>Riyadh</span><span>·</span><span>Jeddah</span><span>·</span><span>Dammam</span><span>·</span><span>Dubai</span><span>·</span><span>Doha</span>
              </div>
            </div>
          </div>

          {/* Empty right column - image is now full background */}
          <div className="lg:col-span-5 hidden lg:block" />
        </div>

        {/* Bottom fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* PROBLEM */}
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t("sec.problem.kicker")}</p>
          <h2 className="mt-3 max-w-3xl text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("sec.problem.title")}
          </h2>
          <p className="mt-4 max-w-2xl text-balance text-muted-foreground">{t("sec.problem.body")}</p>
        </div>
      </section>

      {/* BENTO FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Platform</p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {lang === "ar" ? "كل ما يحتاجه فريق التشغيل، في مكان واحد." : "Everything your operations team needs, in one place."}
            </h2>
          </div>
          <Link to="/product" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-navy">
            {lang === "ar" ? "استكشف المنصة" : "Explore the platform"} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:grid-rows-[auto_auto_auto]">
          {/* Large: Labor proof */}
          <BentoCard className="lg:col-span-3 lg:row-span-2 bg-navy text-primary-foreground border-transparent">
            <BentoHeader icon={<Camera />} title={t("bento.proof.title")} body={t("bento.proof.body")} dark />
            <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
              <img src={laborImg} alt="Labor app" width={1024} height={1024} loading="lazy" className="h-auto w-full object-cover" />
            </div>
          </BentoCard>

          <BentoCard className="lg:col-span-3">
            <BentoHeader icon={<CheckCircle2 />} title={t("bento.tasks.title")} body={t("bento.tasks.body")} />
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
              {["Daily", "Weekly", "Monthly"].map((p) => (
                <div key={p} className="rounded-lg border border-border bg-secondary/50 py-3 font-medium">{p}</div>
              ))}
            </div>
          </BentoCard>

          <BentoCard className="lg:col-span-2">
            <BentoHeader icon={<ShieldCheck />} title={t("bento.approve.title")} body={t("bento.approve.body")} />
          </BentoCard>

          <BentoCard className="lg:col-span-1 bg-accent text-accent-foreground border-transparent">
            <BentoHeader icon={<Activity />} title={t("bento.health.title")} body={t("bento.health.body")} dark />
            <div className="mt-4 text-3xl font-display font-semibold">94<span className="text-xl opacity-70">/100</span></div>
          </BentoCard>

          <BentoCard className="lg:col-span-2">
            <BentoHeader icon={<MessageSquare />} title={t("bento.complaint.title")} body={t("bento.complaint.body")} />
            <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-secondary px-2.5 py-1 font-mono text-xs">CMP-2026-0042 · Open</div>
          </BentoCard>

          <BentoCard className="lg:col-span-4 bg-surface-2 border-transparent">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <BentoHeader icon={<BarChart3 />} title={t("bento.owner.title")} body={t("bento.owner.body")} />
              </div>
              <div className="overflow-hidden rounded-xl ring-hairline">
                <img src={ownerImg} alt="Owner dashboard" width={1400} height={1000} loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          </BentoCard>

          <BentoCard className="lg:col-span-2">
            <BentoHeader icon={<WifiOff />} title={t("bento.offline.title")} body={t("bento.offline.body")} />
          </BentoCard>

          <BentoCard className="lg:col-span-4 bg-gradient-to-br from-navy to-navy-soft text-primary-foreground border-transparent">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-md">
                <BentoHeader icon={<Languages />} title={t("bento.rtl.title")} body={t("bento.rtl.body")} dark />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-end">عربية</div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">English</div>
              </div>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t("sec.how.kicker")}</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t("sec.how.title")}</h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "01", t: t("sec.how.s1.t"), b: t("sec.how.s1.b") },
              { n: "02", t: t("sec.how.s2.t"), b: t("sec.how.s2.b") },
              { n: "03", t: t("sec.how.s3.t"), b: t("sec.how.s3.b") },
              { n: "04", t: t("sec.how.s4.t"), b: t("sec.how.s4.b") },
            ].map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-border bg-background p-6 shadow-sm">
                <span className="font-mono text-xs text-accent">{s.n}</span>
                <h3 className="mt-2 font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t("sec.usecase.kicker")}</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t("sec.usecase.title")}</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { i: Building, k: "uc.fm" },
            { i: Building, k: "uc.dev" },
            { i: Users, k: "uc.owners" },
            { i: Building, k: "uc.malls" },
            { i: Building, k: "uc.compounds" },
            { i: ShieldCheck, k: "uc.gov" },
          ].map(({ i: Icon, k }) => (
            <div key={k} className="group flex items-center gap-4 rounded-xl border border-border bg-background p-5 transition-colors hover:border-accent/40">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-secondary text-navy">
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-medium">{t(k)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* LOCALIZATION */}
      <section className="border-y border-border bg-navy text-primary-foreground bg-mesh">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">{t("sec.local.kicker")}</p>
            <h2 className="mt-3 max-w-md font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t("sec.local.title")}</h2>
          </div>
          <ul className="space-y-4">
            {["local.1", "local.2", "local.3", "local.4"].map((k) => (
              <li key={k} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span className="text-white/85">{t(k)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t("sec.pricing.kicker")}</p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t("sec.pricing.title")}</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">{t("sec.pricing.body")}</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/pricing">{lang === "ar" ? "كل الباقات" : "See all plans"} <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" /></Link>
          </Button>
        </div>
        <PricingMini />
      </section>

      {/* FAQ */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t("sec.faq.kicker")}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t("sec.faq.title")}</h2>
          <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-background">
            {[1, 2, 3, 4].map((i) => (
              <details key={i} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">
                  {t(`faq.q${i}`)}
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-secondary text-xs transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{t(`faq.a${i}`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-navy bg-mesh p-10 text-primary-foreground sm:p-16">
          <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t("sec.cta.title")}</h2>
          <p className="mt-3 max-w-xl text-white/75">{t("sec.cta.body")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-navy hover:bg-white/90">
              <Link to="/contact">{t("cta.demo")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10 hover:text-white">
              <Link to="/pricing">{lang === "ar" ? "شاهد الأسعار" : "See pricing"}</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-4 text-sm text-white/70 sm:grid-cols-3">
            <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> +966 11 000 0000</span>
            <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> hello@facilityos.sa</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> Riyadh, KSA</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function BentoCard({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border border-border bg-background p-6 transition-all hover:shadow-elevated ${className}`}>
      {children}
    </div>
  );
}

function BentoHeader({ icon, title, body, dark = false }: { icon: React.ReactNode; title: string; body: string; dark?: boolean }) {
  return (
    <div>
      <span className={`grid h-10 w-10 place-items-center rounded-lg ${dark ? "bg-white/10 text-white" : "bg-secondary text-navy"}`}>
        <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className={`mt-2 text-sm ${dark ? "text-white/70" : "text-muted-foreground"}`}>{body}</p>
    </div>
  );
}

function PricingMini() {
  const { t, lang } = useLang();
  const plans = [
    { name: "Pilot", price: 499, scope: lang === "ar" ? "مبنى واحد" : "1 building" },
    { name: "Starter", price: 999, scope: lang === "ar" ? "حتى 3 مبانٍ" : "Up to 3 buildings", popular: true },
    { name: "Growth", price: 2499, scope: lang === "ar" ? "حتى 10 مبانٍ" : "Up to 10 buildings" },
    { name: "Business", price: 5999, scope: lang === "ar" ? "حتى 25 مبنى" : "Up to 25 buildings" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {plans.map((p) => (
        <div key={p.name} className={`relative rounded-2xl border p-6 ${p.popular ? "border-accent bg-accent/5" : "border-border bg-background"}`}>
          {p.popular && <span className="absolute -top-3 start-6 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">Popular</span>}
          <h3 className="font-display text-lg font-semibold">{p.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{p.scope}</p>
          <div className="mt-5 flex items-baseline gap-1">
            <span className="font-display text-3xl font-semibold">{p.price.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">SAR{t("pricing.month")}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

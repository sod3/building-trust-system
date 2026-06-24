import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — FacilityOS Arabia" }] }),
  component: Pricing,
});

function Pricing() {
  const { t } = useLang();
  const plans = [
    {
      name: t("pricing.plan.starter"),
      price: 299,
      scope: t("pricing.desc.starter"),
      features: [t("pricing.feat.1building"), t("pricing.feat.owner_access"), t("pricing.feat.labour_access"), t("pricing.feat.daily_reports"), t("pricing.feat.basic_history"), t("pricing.feat.email_support")],
      query: "starter"
    },
    {
      name: t("pricing.plan.professional"),
      price: 899,
      scope: t("pricing.desc.professional"),
      features: [t("pricing.feat.up_to_5"), t("pricing.feat.multiple_labour"), t("pricing.feat.templates"), t("pricing.feat.today_reports"), t("pricing.feat.report_history"), t("pricing.feat.priority_support")],
      popular: true,
      query: "professional"
    },
    {
      name: t("pricing.plan.enterprise"),
      price: 1999,
      scope: t("pricing.desc.enterprise"),
      features: [t("pricing.feat.multiple_buildings"), t("pricing.feat.custom_setup"), t("pricing.feat.multiple_users"), t("pricing.feat.advanced_history"), t("pricing.feat.priority_support"), t("pricing.feat.dedicated_support")],
      query: "enterprise"
    },
  ];

  const faqs = [
    { q: t("faq.pricing.q1"), a: t("faq.pricing.a1") },
    { q: t("faq.pricing.q2"), a: t("faq.pricing.a2") },
    { q: t("faq.pricing.q3"), a: t("faq.pricing.a3") },
    { q: t("faq.pricing.q4"), a: t("faq.pricing.a4") },
    { q: t("faq.pricing.q5"), a: t("faq.pricing.a5") },
    { q: t("faq.pricing.q6"), a: t("faq.pricing.a6") },
    { q: t("faq.pricing.q7"), a: t("faq.pricing.a7") },
    { q: t("faq.pricing.q8"), a: t("faq.pricing.a8") },
    { q: t("faq.pricing.q9"), a: t("faq.pricing.a9") },
    { q: t("faq.pricing.q10"), a: t("faq.pricing.a10") },
    { q: t("faq.pricing.q11"), a: t("faq.pricing.a11") },
    { q: t("faq.pricing.q12"), a: t("faq.pricing.a12") },
    { q: t("faq.pricing.q13"), a: t("faq.pricing.a13") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="bg-navy-gradient py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 text-primary-foreground">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("pricing.hero.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            {t("pricing.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="-mt-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid gap-8 sm:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`relative flex flex-col rounded-3xl border p-8 ${p.popular ? "border-accent bg-background shadow-2xl scale-105 z-10" : "border-border bg-background shadow-lg mt-8 sm:mt-0"}`}>
              {p.popular && <span className="absolute -top-4 start-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-sm font-semibold text-white">{t("pricing.popular")}</span>}
              <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground min-h-[40px]">{p.scope}</p>
              <div className="mt-6 flex items-baseline gap-1 border-b border-border pb-6">
                <span className="font-display text-5xl font-bold">{p.price}</span>
                <span className="text-sm font-medium text-muted-foreground">{t("pricing.sar_mo")}</span>
              </div>
              <ul className="mt-8 flex-1 space-y-4">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                    <span className="leading-tight">{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className={`mt-8 w-full h-12 text-base ${p.popular ? "bg-accent text-white hover:bg-accent/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                <Link to="/checkout" search={{ plan: p.query }}>
                  {t("pricing.btn.get_owner")}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-secondary/30 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">{t("sec.faq.title")}</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-border bg-background p-6 [&_summary::-webkit-details-marker]:hidden shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-lg">
                  {faq.q}
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-lg transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

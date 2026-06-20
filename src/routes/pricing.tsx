import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — FacilityOS Arabia" },
      { name: "description", content: "Simple SAR pricing per portfolio. Pilot from 499 SAR/mo. Enterprise plans for facility management companies." },
      { property: "og:title", content: "Pricing — FacilityOS Arabia" },
      { property: "og:description", content: "From 499 SAR/mo to enterprise. WhatsApp, white-label and API add-ons available." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const { t, lang } = useLang();

  const features = (en: string[], ar: string[]) => (lang === "ar" ? ar : en);

  const plans = [
    {
      name: "Pilot", price: 499, scope: lang === "ar" ? "مبنى واحد" : "1 building",
      features: features(
        ["1 building, up to 30 units", "5 labor users", "1 supervisor", "Photo proof", "Tenant QR portal"],
        ["مبنى واحد حتى 30 وحدة", "5 عمال", "مشرف واحد", "إثبات بالصور", "بوابة QR للمستأجرين"]
      ),
    },
    {
      name: "Starter", price: 999, scope: lang === "ar" ? "حتى 3 مبانٍ" : "Up to 3 buildings",
      features: features(
        ["Up to 3 buildings", "15 labor users", "3 supervisors", "All Pilot features", "Email + WhatsApp alerts"],
        ["حتى 3 مبانٍ", "15 عاملاً", "3 مشرفين", "كل ميزات Pilot", "إشعارات بريد + واتساب"]
      ),
      popular: true,
    },
    {
      name: "Growth", price: 2499, scope: lang === "ar" ? "حتى 10 مبانٍ" : "Up to 10 buildings",
      features: features(
        ["Up to 10 buildings", "50 labor users", "Owner dashboards", "Monthly PDF reports", "KSA hosting"],
        ["حتى 10 مبانٍ", "50 عاملاً", "لوحات الملاك", "تقارير PDF شهرية", "استضافة داخل المملكة"]
      ),
    },
    {
      name: "Business", price: 5999, scope: lang === "ar" ? "حتى 25 مبنى" : "Up to 25 buildings",
      features: features(
        ["Up to 25 buildings", "Unlimited labor", "Custom roles", "Advanced analytics", "Priority support"],
        ["حتى 25 مبنى", "عمّال غير محدودين", "صلاحيات مخصّصة", "تحليلات متقدّمة", "دعم ذو أولوية"]
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="bg-navy bg-mesh py-20 text-primary-foreground sm:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mx-auto max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">{t("pricing.title")}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-white/75">{t("pricing.sub")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-4">
          {plans.map((p) => (
            <div key={p.name} className={`relative flex flex-col rounded-2xl border p-6 ${p.popular ? "border-accent bg-accent/5 shadow-elevated" : "border-border bg-background"}`}>
              {p.popular && <span className="absolute -top-3 start-6 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">{lang === "ar" ? "الأكثر طلباً" : "Most popular"}</span>}
              <h3 className="font-display text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.scope}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold">{p.price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">SAR{t("pricing.month")}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {f}</li>
                ))}
              </ul>
              <Button asChild className={`mt-6 ${p.popular ? "bg-navy text-primary-foreground hover:bg-navy/90" : ""}`} variant={p.popular ? "default" : "outline"}>
                <Link to="/contact">{t("pricing.choose")}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Enterprise */}
        <div className="mt-6 rounded-2xl border border-border bg-gradient-to-br from-navy to-navy-soft p-8 text-primary-foreground sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-display text-2xl font-semibold">Enterprise</h3>
              <p className="mt-2 max-w-xl text-white/75">{lang === "ar" ? "لشركات إدارة المرافق والمطوّرين الكبار. تكامل ZATCA، علامة بيضاء، API، IoT/CCTV، اتفاقية SLA." : "For FM companies and large developers. ZATCA integration, white-label, API, IoT/CCTV, SLA."}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-display text-3xl font-semibold">{t("pricing.custom")}</span>
              <Button asChild size="lg" className="bg-white text-navy hover:bg-white/90"><Link to="/contact">{t("pricing.contact")}</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{t("pricing.addons")}</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [lang === "ar" ? "إشعارات واتساب" : "WhatsApp notifications", "199 SAR/mo"],
              [lang === "ar" ? "تخزين إضافي" : "Extra storage", "99 SAR / 50GB"],
              [lang === "ar" ? "تقارير مخصّصة" : "Custom reports", "299 SAR/mo"],
              [lang === "ar" ? "علامة بيضاء" : "White-label branding", "899 SAR/mo"],
              [lang === "ar" ? "وصول API" : "API access", "499 SAR/mo"],
              [lang === "ar" ? "تكامل IoT / CCTV" : "IoT / CCTV integration", lang === "ar" ? "مخصّص" : "Custom"],
            ].map(([name, price]) => (
              <div key={name} className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
                <span className="font-medium">{name}</span>
                <span className="text-sm text-muted-foreground">{price}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{lang === "ar" ? "رسوم إعداد لمرة واحدة قد تنطبق على بعض الباقات والإضافات." : "One-time setup fees may apply on some plans and add-ons."}</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

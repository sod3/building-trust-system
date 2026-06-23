import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { Building2, Landmark, Store, Home, ShieldCheck, Briefcase } from "lucide-react";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions - FacilityOS Arabia" },
      { name: "description", content: "Tailored solutions for facility management companies, developers, owners, malls, compounds and government assets." },
      { property: "og:title", content: "Solutions - FacilityOS Arabia" },
      { property: "og:description", content: "From three towers to three hundred - FacilityOS Arabia adapts." },
    ],
  }),
  component: SolutionsPage,
});

function SolutionsPage() {
  const { t, lang } = useLang();
  const items = [
    { i: Briefcase, n: lang === "ar" ? "شركات إدارة المرافق" : "Facility Management Companies", b: lang === "ar" ? "إدارة عمليات متعددة العملاء بمستوى مؤسسي." : "Multi-client, multi-portfolio operations at enterprise scale." },
    { i: Building2, n: lang === "ar" ? "المطوّرون العقاريون" : "Real Estate Developers", b: lang === "ar" ? "تسليم المبنى مع منصة تشغيل جاهزة للمالك." : "Hand over each building with operations already running." },
    { i: Home, n: lang === "ar" ? "الملاك والمستثمرون" : "Owners & Investors", b: lang === "ar" ? "تحقّق مستقل من أن الأموال تُصرف صحيحاً." : "Independent verification that operating budgets are spent right." },
    { i: Store, n: lang === "ar" ? "المولات والأبراج" : "Malls & Towers", b: lang === "ar" ? "تنسيق فرق متعددة عبر طوابق ومناطق متنوعة." : "Coordinate dozens of teams across floors and zones." },
    { i: Building2, n: lang === "ar" ? "المجمعات السكنية" : "Residential Compounds", b: lang === "ar" ? "نظافة، صيانة، أمن وشكاوى من واجهة واحدة." : "Cleaning, MEP, security and complaints from one surface." },
    { i: ShieldCheck, n: lang === "ar" ? "أصول حكومية" : "Government Assets", b: lang === "ar" ? "تقارير قابلة للتدقيق وامتثال نظام البيانات." : "Audit-grade reports and PDPL-aware data handling." },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="bg-navy bg-mesh py-20 text-primary-foreground sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">{t("sol.title")}</h1>
          <p className="mt-5 max-w-2xl text-white/75">{t("sol.sub")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.n} className="rounded-2xl border border-border bg-background p-6 hover:shadow-elevated transition-shadow">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-accent/10 text-accent"><it.i className="h-5 w-5" /></span>
              <h3 className="mt-4 font-display text-lg font-semibold">{it.n}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-navy bg-mesh p-10 text-primary-foreground sm:p-14">
          <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">{lang === "ar" ? "لنخصّص حلاً لمحفظتك." : "Let's tailor a solution for your portfolio."}</h2>
          <Button asChild size="lg" className="mt-6 bg-white text-navy hover:bg-white/90"><Link to="/contact">{t("cta.demo")}</Link></Button>
        </div>
      </section>
      <Footer />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About - FacilityOS Arabia" },
      { name: "description", content: "Built by operators who have run facility teams across Saudi Arabia and the Gulf." },
      { property: "og:title", content: "About - FacilityOS Arabia" },
      { property: "og:description", content: "Built by operators, for operators." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t, lang } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="bg-navy bg-mesh py-20 text-primary-foreground sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{t("about.title")}</h1>
          <p className="mt-6 text-lg text-white/80">{t("about.body")}</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { n: "120+", l: lang === "ar" ? "مبنى تحت الإدارة" : "buildings under management" },
            { n: "8", l: lang === "ar" ? "مدن في الخليج" : "Gulf cities" },
            { n: "99.9%", l: lang === "ar" ? "توفّر المنصة" : "platform uptime" },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-background p-6">
              <div className="font-display text-4xl font-semibold text-navy">{s.n}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

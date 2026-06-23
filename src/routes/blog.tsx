import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useLang } from "@/lib/i18n";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Resources - FacilityOS Arabia" },
      { name: "description", content: "Playbooks and field notes for Saudi & Gulf facility management teams." },
      { property: "og:title", content: "Resources - FacilityOS Arabia" },
      { property: "og:description", content: "Playbooks for facility teams." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { t, lang } = useLang();
  const posts = [
    {
      tag: lang === "ar" ? "دليل" : "Playbook",
      title: lang === "ar" ? "كيف توقف فوضى الواتساب في إدارة المباني" : "How to stop the WhatsApp chaos in building operations",
      excerpt: lang === "ar" ? "خمس خطوات لنقل فريق التشغيل من المجموعات إلى نظام محاسبة موثّق." : "Five steps to move your ops team from groups to accountable workflows.",
    },
    {
      tag: lang === "ar" ? "حالة" : "Case study",
      title: lang === "ar" ? "برج سكني في الرياض رفع الإنجاز اليومي 38%" : "A Riyadh residential tower lifted daily completion by 38%",
      excerpt: lang === "ar" ? "كيف ساعد إثبات الصور المشرفين على إغلاق المهام المتأخرة." : "How photo proof helped supervisors close out overdue tasks.",
    },
    {
      tag: lang === "ar" ? "مرجع" : "Reference",
      title: lang === "ar" ? "قائمة مؤشرات صحة المبنى الواحد" : "A single-building health-score checklist",
      excerpt: lang === "ar" ? "العوامل التي تشكّل الرقم الذي يراه المالك." : "The factors that make up the number an owner actually sees.",
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="bg-navy bg-mesh py-20 text-primary-foreground sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{lang === "ar" ? "مصادر لفرق التشغيل" : "Resources for ops teams"}</h1>
          <p className="mt-4 text-white/75">{lang === "ar" ? "أدلة ميدانية وقصص نجاح من السعودية والخليج." : "Field playbooks and case studies from Saudi & the Gulf."}</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.title} className="group flex flex-col rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-0.5 hover:shadow-elevated">
              <span className="inline-flex w-fit rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-navy">{p.tag}</span>
              <h2 className="mt-4 font-display text-lg font-semibold leading-snug">{p.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">{lang === "ar" ? "اقرأ" : "Read"} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
            </article>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted-foreground">{t("nav.blog")} · {lang === "ar" ? "محتوى جديد قريباً." : "More content coming soon."}</p>
      </section>
      <Footer />
    </div>
  );
}

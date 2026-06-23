import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useLang } from "@/lib/i18n";
import { Lock, Shield, FileCheck, Database, KeyRound, Activity, ServerCog, ScrollText } from "lucide-react";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security & Compliance - FacilityOS Arabia" },
      { name: "description", content: "How FacilityOS Arabia protects your buildings, photos and tenants. RBAC, audit logs, encrypted storage, PDPL-aware." },
      { property: "og:title", content: "Security & Compliance - FacilityOS Arabia" },
      { property: "og:description", content: "Enterprise security from day one." },
    ],
  }),
  component: SecurityPage,
});

function SecurityPage() {
  const { t, lang } = useLang();
  const controls = [
    { i: KeyRound, n: lang === "ar" ? "صلاحيات حسب الدور" : "Role-based access control", b: lang === "ar" ? "كل دور يرى ما يحتاجه فقط - لا أكثر." : "Each role sees only what they need - nothing more." },
    { i: Lock, n: lang === "ar" ? "تشفير عند التخزين والنقل" : "Encryption at rest and in transit", b: lang === "ar" ? "TLS 1.3 وتشفير بمستوى الكائن في التخزين." : "TLS 1.3 and object-level encryption in storage." },
    { i: Shield, n: lang === "ar" ? "مصادقة آمنة" : "Secure authentication", b: lang === "ar" ? "JWT / جلسات آمنة وكلمات مرور مجزّأة." : "JWT / secure sessions and hashed passwords." },
    { i: Activity, n: lang === "ar" ? "سجلات التدقيق" : "Audit logs", b: lang === "ar" ? "كل إجراء مهم مسجّل وقابل للتصدير." : "Every meaningful action logged and exportable." },
    { i: Database, n: lang === "ar" ? "استضافة داخل المملكة" : "KSA region hosting", b: lang === "ar" ? "متاحة على باقات النمو وأعلى." : "Available on Growth and above." },
    { i: FileCheck, n: lang === "ar" ? "متوافق مع PDPL" : "PDPL-aware", b: lang === "ar" ? "ضوابط معالجة وحدود احتفاظ بالبيانات." : "Processing controls and data retention limits." },
    { i: ServerCog, n: lang === "ar" ? "نسخ احتياطية" : "Backups & recovery", b: lang === "ar" ? "نسخ يومية ونقاط استعادة محددة." : "Daily backups with defined recovery points." },
    { i: ScrollText, n: lang === "ar" ? "حدود معدّل وحماية الرفع" : "Rate limiting & upload guards", b: lang === "ar" ? "حماية API ورفع صور آمن مع فحص نوع/حجم." : "API protection and safe image uploads with type/size checks." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="bg-navy bg-mesh py-20 text-primary-foreground sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{t("sec.page.title")}</h1>
          <p className="mt-4 text-white/75">{t("sec.page.sub")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {controls.map((c) => (
            <div key={c.n} className="rounded-2xl border border-border bg-background p-6">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-navy"><c.i className="h-5 w-5" /></span>
              <h3 className="mt-4 font-display text-lg font-semibold">{c.n}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.b}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-xs text-muted-foreground">
          {lang === "ar"
            ? "هذه الصفحة يديرها فريق FacilityOS Arabia لشرح الضوابط المفعّلة والممارسات الحالية. ليست شهادة مستقلة. شروط ومسؤوليات الاستخدام تخضع لاتفاقية العميل."
            : "This page is maintained by the FacilityOS Arabia team to describe enabled controls and current practices. It is not an independent certification. Use is governed by the customer agreement."}
        </p>
      </section>
      <Footer />
    </div>
  );
}

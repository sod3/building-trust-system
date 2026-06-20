import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { Shield, Users, Wrench, Eye, ClipboardCheck, Smartphone, MessageSquare, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [
      { title: "Product — FacilityOS Arabia" },
      { name: "description", content: "Every role on FacilityOS Arabia: Admin, Owner, Supervisor, Labor and Tenant — one platform, six tailored experiences." },
      { property: "og:title", content: "Product — FacilityOS Arabia" },
      { property: "og:description", content: "Six tailored experiences in one Arabic-first facility platform." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { t, lang } = useLang();
  const roles = [
    { icon: Shield, name: lang === "ar" ? "المسؤول الأعلى" : "Super Admin", body: lang === "ar" ? "إدارة كل الشركات والمباني والباقات والإعدادات." : "Manage all companies, buildings, plans and platform settings." },
    { icon: ClipboardCheck, name: lang === "ar" ? "مدير العقار" : "Property Admin", body: lang === "ar" ? "يدير المباني والوحدات والمهام والإشعارات والشكاوى." : "Manages buildings, units, tasks, notifications and complaints." },
    { icon: Eye, name: lang === "ar" ? "المالك" : "Owner", body: lang === "ar" ? "عرض قراءة فقط لمبانيه: صحة المبنى، التقارير، الصور المعتمدة." : "Strict read-only view: building health, reports, verified photos." },
    { icon: Wrench, name: lang === "ar" ? "المشرف" : "Supervisor", body: lang === "ar" ? "اعتماد المهام، مراجعة الصور، تصعيد المشكلات." : "Approve task submissions, review photos, escalate issues." },
    { icon: Smartphone, name: lang === "ar" ? "العامل / الهاوس ماستر" : "Labor / Housemaster", body: lang === "ar" ? "تطبيق بسيط للجوال: تم / لم يتم + صورة + مزامنة دون اتصال." : "Simple mobile app: Done / Not Done + photo + offline sync." },
    { icon: MessageSquare, name: lang === "ar" ? "المستأجر" : "Tenant", body: lang === "ar" ? "يمسح QR، يقدّم شكوى ويتتبّع رقم التذكرة." : "Scan QR, file complaint, track ticket number." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="bg-navy bg-mesh py-20 text-primary-foreground sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">{t("product.title")}</h1>
          <p className="mt-5 max-w-2xl text-white/75">{t("product.sub")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <div key={r.name} className="rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-elevated">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-navy"><r.icon className="h-5 w-5" /></span>
              <h3 className="mt-4 font-display text-lg font-semibold">{r.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{lang === "ar" ? "الوحدات الأساسية" : "Core modules"}</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              lang === "ar" ? "إدارة المباني والوحدات" : "Buildings & units",
              lang === "ar" ? "إدارة الموظفين والعمال" : "Staff & labor management",
              lang === "ar" ? "إدارة الملاك" : "Owner management",
              lang === "ar" ? "إدارة المستأجرين" : "Tenant management",
              lang === "ar" ? "المهام اليومية والمتكررة" : "Daily & recurring tasks",
              lang === "ar" ? "تسليم العمال بالصور" : "Labor photo submissions",
              lang === "ar" ? "اعتماد المشرفين" : "Supervisor approvals",
              lang === "ar" ? "تذاكر شكاوى المستأجرين" : "Tenant complaint tickets",
              lang === "ar" ? "تقارير وتحليلات" : "Reports & analytics",
              lang === "ar" ? "إشعارات وواتساب" : "Notifications & WhatsApp",
              lang === "ar" ? "الفوترة والاشتراكات" : "Billing & subscriptions",
              lang === "ar" ? "مزامنة دون اتصال" : "Offline sync",
            ].map((m) => (
              <div key={m} className="rounded-xl border border-border bg-background p-4 text-sm font-medium">
                <BarChart3 className="mb-2 h-4 w-4 text-accent" />{m}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}

function CTA() {
  const { t } = useLang();
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-navy bg-mesh p-10 text-primary-foreground sm:p-14">
        <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t("sec.cta.title")}</h2>
        <p className="mt-3 max-w-xl text-white/75">{t("sec.cta.body")}</p>
        <Button asChild size="lg" className="mt-6 bg-white text-navy hover:bg-white/90">
          <Link to="/contact">{t("cta.demo")}</Link>
        </Button>
      </div>
    </section>
  );
}

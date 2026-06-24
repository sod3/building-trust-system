import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  Globe2,
  ListChecks,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About - FacilityOS Arabia" },
      {
        name: "description",
        content:
          "FacilityOS Arabia helps building owners assign daily tasks, track labour checklists, and receive verified daily reports through simple Admin, Owner, and Labour dashboards.",
      },
      { property: "og:title", content: "About - FacilityOS Arabia" },
      {
        property: "og:description",
        content:
          "A simple building operations platform built for daily checklist verification across Saudi Arabia and the Gulf.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { lang } = useLang();

  const isAr = lang === "ar";

  const copy = {
    badge: isAr ? "عن فاسيليتي أو إس عربيا" : "About FacilityOS Arabia",
    title: isAr
      ? "منصة بسيطة لإثبات إنجاز أعمال المباني اليومية."
      : "A simpler way to prove daily building work is done.",
    body: isAr
      ? "فاسيليتي أو إس عربيا تساعد ملاك المباني على إدارة العمال، تعيين المهام اليومية، ومتابعة تقارير الإنجاز من لوحة تحكم واضحة وسهلة."
      : "FacilityOS Arabia helps building owners assign daily work, track labour checklists, and receive clear reports that show what was completed today.",
    primaryCta: isAr ? "احصل على لوحة المالك" : "Get Owner Dashboard Access",
    secondaryCta: isAr ? "شاهد طريقة العمل" : "See How It Works",
  };

  const stats = [
    {
      value: "3",
      label: isAr ? "لوحات تحكم أساسية" : "core dashboards",
      desc: isAr ? "مشرف المنصة، المالك، والعامل" : "Admin, Owner, and Labour",
    },
    {
      value: "Daily",
      label: isAr ? "تقارير إنجاز" : "work reports",
      desc: isAr ? "متابعة يومية واضحة للمهام" : "Clear checklist reports every day",
    },
    {
      value: "Mobile",
      label: isAr ? "مناسب للعمال" : "labour-first",
      desc: isAr ? "بطاقات كبيرة وسهلة الاستخدام" : "Large visual cards workers can understand",
    },
  ];

  const problems = [
    {
      icon: Clock3,
      title: isAr ? "ضياع الوقت في المتابعة" : "Too much manual follow-up",
      text: isAr
        ? "الملاك لا يريدون الاتصال طوال اليوم للتأكد من التنظيف والصيانة."
        : "Owners should not need to call repeatedly just to confirm cleaning and maintenance were completed.",
    },
    {
      icon: FileCheck2,
      title: isAr ? "لا يوجد إثبات واضح" : "No clear proof of work",
      text: isAr
        ? "بدون تقرير يومي، يصعب معرفة ما تم إنجازه وما لم يتم."
        : "Without a daily report, it is hard to know which work was completed and which tasks were missed.",
    },
    {
      icon: Users,
      title: isAr ? "العمال يحتاجون واجهة بسيطة" : "Workers need a simple interface",
      text: isAr
        ? "العامل يحتاج شاشة سهلة بالصور والاختيارات الواضحة، وليس لوحة معقدة."
        : "Labour users need big visual task cards, not complex tables, charts, or hidden menus.",
    },
  ];

  const dashboards = [
    {
      icon: ShieldCheck,
      title: isAr ? "لوحة الإدارة" : "Admin Dashboard",
      tag: isAr ? "للعميل وصاحب المنصة" : "For the platform owner",
      text: isAr
        ? "إدارة الملاك، المباني، العمال، الاشتراكات، القوالب، والتقارير من مكان واحد."
        : "Manage owners, buildings, labour accounts, subscriptions, checklist templates, reports, and earnings from one control center.",
      features: isAr
        ? ["إدارة الملاك", "إدارة المباني", "إدارة العمال", "تقارير يومية", "الأرباح والاشتراكات"]
        : ["Owner management", "Building management", "Labour management", "Daily reports", "Earnings and subscriptions"],
    },
    {
      icon: Building2,
      title: isAr ? "لوحة المالك" : "Owner Dashboard",
      tag: isAr ? "لمالك المبنى" : "For building owners",
      text: isAr
        ? "المالك يستطيع إدارة مبانيه، إضافة العمال، تعيين المهام، ومتابعة تقارير الإنجاز."
        : "Owners can manage their buildings, assign labour, create daily checklists, and view submitted work reports.",
      features: isAr
        ? ["مباني المالك", "إضافة العمال", "تعيين المهام", "تقارير اليوم", "سجل التقارير"]
        : ["My buildings", "Labour accounts", "Assign tasks", "Today’s reports", "Report history"],
    },
    {
      icon: Smartphone,
      title: isAr ? "لوحة العامل" : "Labour Dashboard",
      tag: isAr ? "بسيطة وسهلة" : "Simple and visual",
      text: isAr
        ? "واجهة سهلة جداً تحتوي على بطاقات مرئية، زر إنجاز، وزر إرسال التقرير اليومي."
        : "A very simple mobile-first checklist screen with large visual cards, mark-done buttons, and one submit button.",
      features: isAr
        ? ["بطاقات مرئية", "زر تم", "تقدم المهام", "إرسال التقرير", "مناسب للجوال"]
        : ["Visual task cards", "Mark Done button", "Task progress", "Submit report", "Mobile-first layout"],
    },
  ];

  const workflow = [
    {
      icon: WalletCards,
      title: isAr ? "المالك يشترك" : "Owner subscribes",
      text: isAr
        ? "صاحب المبنى يختار الخطة المناسبة ويحصل على وصول للوحة المالك."
        : "The building owner chooses a plan and gets access to the Owner Dashboard.",
    },
    {
      icon: Building2,
      title: isAr ? "إضافة المباني" : "Add buildings",
      text: isAr
        ? "المالك يضيف مبنى واحد أو عدة مبانٍ داخل حسابه."
        : "The owner adds one or multiple buildings inside the dashboard.",
    },
    {
      icon: Users,
      title: isAr ? "إضافة العمال" : "Add labour",
      text: isAr
        ? "المالك يضيف العمال ويربط كل عامل بالمبنى المناسب."
        : "The owner adds labour accounts and assigns each worker to the correct building.",
    },
    {
      icon: ListChecks,
      title: isAr ? "تعيين المهام" : "Assign checklists",
      text: isAr
        ? "يتم تعيين مهام يومية مثل التنظيف، المصعد، المياه، الإضاءة، والأمن."
        : "Daily tasks are assigned, such as cleaning, elevator checks, water, lights, parking, and security.",
    },
    {
      icon: CheckCircle2,
      title: isAr ? "العامل ينجز" : "Labour completes work",
      text: isAr
        ? "العامل يفتح لوحة بسيطة، يضغط تم على المهام، ثم يرسل التقرير."
        : "Labour opens a simple checklist, marks tasks as done, and submits today’s work.",
    },
    {
      icon: BarChart3,
      title: isAr ? "التقرير يصل للمالك" : "Reports are visible",
      text: isAr
        ? "الإدارة والمالك يستطيعان رؤية تقرير اليوم ونسبة الإنجاز."
        : "Admin and owner can view the daily report, completion rate, and pending tasks.",
    },
  ];

  const features = [
    {
      icon: ClipboardCheck,
      title: isAr ? "قوائم مهام يومية" : "Daily checklist system",
      text: isAr
        ? "أنشئ مهام يومية متكررة لكل مبنى ولكل عامل."
        : "Create repeatable daily tasks for each building and labour account.",
    },
    {
      icon: Sparkles,
      title: isAr ? "واجهة مرئية للعامل" : "Visual labour experience",
      text: isAr
        ? "بطاقات كبيرة بالرموز تساعد العامل على فهم المهمة بسرعة."
        : "Large icon-based cards help workers understand tasks quickly.",
    },
    {
      icon: FileCheck2,
      title: isAr ? "تقارير إنجاز واضحة" : "Clear work reports",
      text: isAr
        ? "تقرير يومي يوضح المهام المنجزة والمتبقية ووقت الإرسال."
        : "Daily reports show completed tasks, pending tasks, and submission time.",
    },
    {
      icon: BadgeCheck,
      title: isAr ? "إثبات ومتابعة" : "Accountability and proof",
      text: isAr
        ? "يعرف المالك ما حدث اليوم بدون رسائل واتساب كثيرة."
        : "Owners know what happened today without endless WhatsApp follow-ups.",
    },
    {
      icon: Globe2,
      title: isAr ? "مناسب للسوق الخليجي" : "Built for Gulf operations",
      text: isAr
        ? "مصمم لاحتياجات المباني السكنية والتجارية في السعودية والخليج."
        : "Designed for residential and commercial building operations in Saudi Arabia and the Gulf.",
    },
    {
      icon: ShieldCheck,
      title: isAr ? "بداية بسيطة قابلة للتوسع" : "Simple MVP, ready to grow",
      text: isAr
        ? "ابدأ بالأساسيات الآن، ثم أضف ميزات متقدمة لاحقاً."
        : "Start with the essential workflow now, then add advanced features later.",
    },
  ];

  const roadmap = isAr
    ? ["إثبات بالصور", "تنبيهات واتساب", "دعم عربي كامل", "موافقات المالك", "تطبيق جوال مستقبلي", "تقارير PDF شهرية"]
    : ["Photo proof", "WhatsApp alerts", "Full Arabic support", "Owner approvals", "Future mobile app", "Monthly PDF reports"];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background" dir={isAr ? "rtl" : "ltr"}>
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy py-20 text-primary-foreground sm:py-28 lg:py-32">
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
                <Sparkles className="h-4 w-4" />
                {copy.badge}
              </div>

              <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {copy.title}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
                {copy.body}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="group">
                  <Link to="/pricing">
                    {copy.primaryCta}
                    <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180" : ""}`} />
                  </Link>
                </Button>

                <Button asChild size="lg" variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                  <a href="#how-it-works">{copy.secondaryCta}</a>
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur">
              <div className="rounded-2xl bg-background p-5 text-foreground">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {isAr ? "تقرير اليوم" : "Today’s Report"}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-semibold text-navy">
                      {isAr ? "برج الرياض A" : "Riyadh Tower A"}
                    </h3>
                  </div>
                  <div className="rounded-2xl bg-green-500/10 px-3 py-2 text-sm font-medium text-green-700">
                    87% {isAr ? "مكتمل" : "Complete"}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    isAr ? "تنظيف المدخل" : "Entrance cleaning",
                    isAr ? "فحص المصعد" : "Elevator check",
                    isAr ? "إزالة النفايات" : "Garbage removal",
                    isAr ? "فحص الإضاءة" : "Lights check",
                  ].map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-2xl border border-border bg-muted/40 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-700">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{item}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{isAr ? "تم" : "Done"}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-navy p-4 text-primary-foreground">
                  <p className="text-sm text-white/70">
                    {isAr ? "تم إرسال التقرير إلى الإدارة والمالك" : "Report sent to Admin and Owner"}
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {isAr ? "اليوم، 5:14 مساءً" : "Today, 5:14 PM"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.value} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="font-display text-4xl font-semibold text-navy">{s.value}</div>
              <p className="mt-2 font-medium">{s.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {isAr ? "المشكلة" : "The problem"}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              {isAr ? "إدارة العمل اليومي لا يجب أن تعتمد على التخمين." : "Daily building work should not depend on guessing."}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {isAr
                ? "الكثير من المباني تعتمد على مكالمات ورسائل واتساب وصور غير منظمة. فاسيليتي أو إس يجعل المتابعة اليومية واضحة وبسيطة."
                : "Many buildings still depend on calls, WhatsApp messages, and scattered photos. FacilityOS makes daily tracking clear, simple, and report-based."}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {problems.map((item) => (
              <div key={item.title} className="rounded-3xl border border-border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-navy">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARDS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {isAr ? "المنصة" : "The platform"}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            {isAr ? "ثلاث لوحات تحكم فقط. بدون تعقيد." : "Only three dashboards. No unnecessary complexity."}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {isAr
              ? "تم تصميم النسخة الأولى لتكون واضحة وسهلة: إدارة، مالك، وعامل."
              : "The first version is designed to stay focused: Admin, Owner, and Labour."}
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {dashboards.map((dash) => (
            <div key={dash.title} className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-primary-foreground">
                <dash.icon className="h-7 w-7" />
              </div>

              <p className="mt-5 text-sm font-medium text-primary">{dash.tag}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-navy">{dash.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{dash.text}</p>

              <div className="mt-6 space-y-3">
                {dash.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-navy py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
              {isAr ? "طريقة العمل" : "How it works"}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {isAr ? "من الاشتراك إلى تقرير الإنجاز اليومي." : "From subscription to daily work report."}
            </h2>
            <p className="mt-4 text-white/70">
              {isAr
                ? "كل خطوة مصممة لتكون بسيطة وواضحة للمالك والعامل."
                : "Every step is designed to be simple for the owner and easy for the labour team."}
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {workflow.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-navy">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className="font-display text-3xl font-semibold text-white/20">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {isAr ? "المميزات" : "Core features"}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              {isAr ? "كل ما تحتاجه النسخة الأولى." : "Everything needed for the first version."}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {isAr
                ? "الهدف ليس بناء نظام معقد من البداية. الهدف هو إطلاق نسخة سهلة تساعد المالك على رؤية العمل اليومي بوضوح."
                : "The goal is not to launch a complicated system from day one. The goal is to launch a focused MVP that helps owners see daily work clearly."}
            </p>

            <div className="mt-8 rounded-3xl border border-border bg-muted/40 p-6">
              <h3 className="font-display text-xl font-semibold text-navy">
                {isAr ? "ميزات لاحقة يمكن إضافتها" : "Future features can be added later"}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {roadmap.map((item) => (
                  <span key={item} className="rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-navy">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST / MISSION */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-border bg-background p-8 shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-primary-foreground">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              {isAr ? "مهمتنا" : "Our mission"}
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              {isAr
                ? "مهمتنا هي مساعدة ملاك المباني في السعودية والخليج على إدارة العمل اليومي بطريقة أوضح وأسهل. نبدأ بالأساسيات: المهام، العمال، التقارير، والإثبات اليومي. ثم يمكن توسيع المنصة حسب احتياج العميل."
                : "Our mission is to help building owners across Saudi Arabia and the Gulf manage daily operations with more clarity and less manual follow-up. We start with the essentials: tasks, labour, reports, and daily proof of work. Then the platform can grow as the client’s needs grow."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                isAr ? "بسيطة للعمال" : "Simple for labour",
                isAr ? "واضحة للمالك" : "Clear for owners",
                isAr ? "قابلة للتوسع" : "Ready to scale",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-muted/50 p-4 text-sm font-medium text-navy">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-navy p-8 text-primary-foreground shadow-2xl sm:p-12">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
                {isAr ? "ابدأ الآن" : "Ready to start?"}
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {isAr
                  ? "امنح ملاك المباني رؤية أوضح للعمل اليومي."
                  : "Give building owners a clearer view of daily work."}
              </h2>
              <p className="mt-4 max-w-2xl text-white/70">
                {isAr
                  ? "ابدأ بلوحة المالك، قوائم العمال، وتقارير الإنجاز اليومية."
                  : "Start with owner access, labour checklists, and daily reports — the simple MVP your client needs."}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild size="lg" className="group bg-white text-navy hover:bg-white/90">
                <Link to="/pricing">
                  {copy.primaryCta}
                  <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180" : ""}`} />
                </Link>
              </Button>

              <Button asChild size="lg" variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                <Link to="/login">{isAr ? "شاهد العرض التجريبي" : "View Dashboard Demo"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
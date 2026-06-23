import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, { en: string; ar: string }>;

export const dict: Dict = {
  // Nav
  "nav.product": { en: "Product", ar: "المنتج" },
  "nav.solutions": { en: "Solutions", ar: "الحلول" },
  "nav.pricing": { en: "Pricing", ar: "الأسعار" },
  "nav.about": { en: "About", ar: "من نحن" },
  "nav.security": { en: "Security", ar: "الأمان" },
  "nav.blog": { en: "Resources", ar: "المصادر" },
  "nav.contact": { en: "Contact", ar: "تواصل" },
  "nav.demo": { en: "Book a Demo", ar: "احجز عرضاً" },
  "nav.signin": { en: "Sign in", ar: "تسجيل الدخول" },

  // Common
  "cta.demo": { en: "Book a Demo", ar: "احجز عرضاً توضيحياً" },
  "cta.view": { en: "View Platform", ar: "استكشف المنصة" },
  "cta.start": { en: "Get Started", ar: "ابدأ الآن" },
  "badge.kingdom": { en: "Built for Saudi Arabia & the Gulf", ar: "مصمّم للمملكة العربية السعودية والخليج" },

  // Hero
  "hero.title": {
    en: "Smart Building Operations for Saudi & Gulf Property Teams",
    ar: "إدارة تشغيل المباني الذكية لفرق العقارات في السعودية والخليج",
  },
  "hero.sub": {
    en: "Manage daily tasks, labor photo proof, supervisor approvals, tenant complaints, owner reports and building health - from one Arabic-first platform.",
    ar: "إدارة المهام اليومية، إثبات العمل بالصور، اعتماد المشرفين، شكاوى المستأجرين، تقارير الملاك وصحة المبنى - من منصة واحدة عربية أولاً.",
  },
  "hero.trust": {
    en: "Trusted by facility teams across Riyadh, Jeddah, Dammam, Dubai and Doha.",
    ar: "موثوقة من قبل فرق التشغيل في الرياض وجدة والدمام ودبي والدوحة.",
  },

  // Bento
  "bento.tasks.title": { en: "Daily tasks & recurring schedules", ar: "المهام اليومية والجداول المتكررة" },
  "bento.tasks.body": { en: "Plan cleaning, MEP rounds, inspections - daily, weekly or monthly with priorities.", ar: "خطّط لمهام النظافة والصيانة والتفتيش يومياً وأسبوعياً وشهرياً مع تحديد الأولويات." },
  "bento.proof.title": { en: "Photo proof from labor", ar: "إثبات العمل بالصور" },
  "bento.proof.body": { en: "Every task ends with a mandatory photo. No more guesswork.", ar: "كل مهمة تُختم بصورة إلزامية. لا مزيد من التخمين." },
  "bento.approve.title": { en: "Supervisor approvals", ar: "اعتماد المشرفين" },
  "bento.approve.body": { en: "Review, approve, reject or escalate from one queue.", ar: "راجع، اعتمد، ارفض أو صعّد المهام من قائمة واحدة." },
  "bento.complaint.title": { en: "Tenant complaint QR portal", ar: "بوابة شكاوى المستأجرين QR" },
  "bento.complaint.body": { en: "Tenants scan a QR, file a ticket, track status. No login required.", ar: "يمسح المستأجر رمز QR، يقدّم شكوى ويتابع حالتها. دون الحاجة لتسجيل دخول." },
  "bento.owner.title": { en: "Owner read-only dashboard", ar: "لوحة الملاك للقراءة فقط" },
  "bento.owner.body": { en: "Owners see building health, completion rate and monthly PDF reports.", ar: "يرى المالك صحة المبنى ومعدّل الإنجاز والتقارير الشهرية." },
  "bento.offline.title": { en: "Offline labor app", ar: "تطبيق العمال يعمل دون إنترنت" },
  "bento.offline.body": { en: "Workers submit tasks offline; sync runs the moment they're online again.", ar: "يُرسل العمّال المهام دون اتصال، وتتم المزامنة فور عودة الاتصال." },
  "bento.health.title": { en: "Building health score", ar: "مؤشّر صحة المبنى" },
  "bento.health.body": { en: "A single number combines cleaning, MEP, complaints and overdue tasks.", ar: "رقم واحد يجمع النظافة والكهروميكانيكا والشكاوى والمهام المتأخرة." },
  "bento.rtl.title": { en: "Arabic-first, RTL by default", ar: "عربية أولاً، RTL افتراضياً" },
  "bento.rtl.body": { en: "Designed in Arabic and English from day one - not translated.", ar: "صُمّم بالعربية والإنجليزية منذ اليوم الأول، وليس مترجماً." },

  // Sections
  "sec.problem.kicker": { en: "The problem", ar: "المشكلة" },
  "sec.problem.title": { en: "Buildings run on WhatsApp groups, paper logs and excuses.", ar: "تُدار المباني عبر مجموعات الواتساب والسجلّات الورقية والأعذار." },
  "sec.problem.body": { en: "Owners can't verify what was done. Supervisors chase labor. Tenants are ignored. Complaints get lost. Monthly reports are guesswork.", ar: "لا يستطيع الملّاك التحقق من إنجاز الأعمال، يطارد المشرفون العمّال، ويُهمَل المستأجرون، وتضيع الشكاوى، وتصبح التقارير الشهرية تخميناً." },

  "sec.how.kicker": { en: "How it works", ar: "كيف تعمل" },
  "sec.how.title": { en: "From task to proof in four steps.", ar: "من المهمة إلى الإثبات في أربع خطوات." },
  "sec.how.s1.t": { en: "Plan", ar: "خطّط" },
  "sec.how.s1.b": { en: "Admin schedules tasks per building, floor and labor.", ar: "يجدول المشرف المهام لكل مبنى ودور وعامل." },
  "sec.how.s2.t": { en: "Execute", ar: "نفّذ" },
  "sec.how.s2.b": { en: "Labor opens mobile app, marks done with a mandatory photo.", ar: "يفتح العامل التطبيق ويضع الصورة الإلزامية." },
  "sec.how.s3.t": { en: "Verify", ar: "تحقّق" },
  "sec.how.s3.b": { en: "Supervisor approves, rejects or escalates from a single queue.", ar: "يعتمد المشرف أو يرفض أو يصعّد من قائمة واحدة." },
  "sec.how.s4.t": { en: "Report", ar: "اعرض" },
  "sec.how.s4.b": { en: "Owner sees building health score and monthly PDF.", ar: "يرى المالك مؤشر الصحة والتقرير الشهري PDF." },

  "sec.usecase.kicker": { en: "Built for", ar: "مصمّم لـ" },
  "sec.usecase.title": { en: "Whoever runs the building.", ar: "كل من يدير المبنى." },
  "uc.fm": { en: "Facility management companies", ar: "شركات إدارة المرافق" },
  "uc.dev": { en: "Real estate developers", ar: "المطوّرون العقاريون" },
  "uc.owners": { en: "Property owners & investors", ar: "الملّاك والمستثمرون" },
  "uc.malls": { en: "Malls & mixed-use towers", ar: "المولات والأبراج متعددة الاستخدام" },
  "uc.compounds": { en: "Residential compounds", ar: "المجمعات السكنية" },
  "uc.gov": { en: "Government & semi-gov assets", ar: "أصول حكومية وشبه حكومية" },

  "sec.local.kicker": { en: "Saudi & Gulf ready", ar: "جاهز للسعودية والخليج" },
  "sec.local.title": { en: "Localized down to the workflow.", ar: "محلّي حتى مستوى سير العمل." },
  "local.1": { en: "Arabic-first UI, RTL by default, Hijri-aware reports.", ar: "واجهة عربية أولاً، RTL افتراضياً، تقارير تدعم التقويم الهجري." },
  "local.2": { en: "SAR pricing, ZATCA-ready invoicing structure.", ar: "تسعير بالريال السعودي وفواتير متوافقة مع هيكل ZATCA." },
  "local.3": { en: "WhatsApp notifications add-on for labor & tenants.", ar: "إضافة إشعارات الواتساب للعمال والمستأجرين." },
  "local.4": { en: "PDPL-aware data handling, KSA hosting on request.", ar: "معالجة بيانات وفق نظام حماية البيانات، استضافة داخل المملكة عند الطلب." },

  "sec.security.kicker": { en: "Security", ar: "الأمان" },
  "sec.security.title": { en: "Enterprise security from day one.", ar: "أمان مؤسسي منذ اليوم الأول." },
  "sec.security.body": { en: "Role-based access, audit logs, encrypted storage, JWT auth, rate limiting, secure photo uploads.", ar: "صلاحيات حسب الدور، سجلات تدقيق، تخزين مشفّر، مصادقة JWT، حدود معدّل، رفع آمن للصور." },

  "sec.pricing.kicker": { en: "Pricing", ar: "الأسعار" },
  "sec.pricing.title": { en: "Simple SAR pricing per portfolio.", ar: "تسعير بسيط بالريال لكل محفظة." },
  "sec.pricing.body": { en: "Start at 499 SAR for one building. Scale to enterprise.", ar: "ابدأ بـ 499 ريال لمبنى واحد. وصولاً إلى الباقات المؤسسية." },

  "sec.faq.kicker": { en: "FAQ", ar: "الأسئلة" },
  "sec.faq.title": { en: "Questions facility teams ask us.", ar: "أسئلة تطرحها فرق التشغيل." },
  "faq.q1": { en: "Do labor workers need to be tech-savvy?", ar: "هل يحتاج العمّال لخبرة تقنية؟" },
  "faq.a1": { en: "No. The labor app is two big buttons: Done and Not Done - with a mandatory photo.", ar: "لا. التطبيق عبارة عن زرّين كبيرين: تمّ ولم يتم، مع صورة إلزامية." },
  "faq.q2": { en: "Does it work offline on site?", ar: "هل يعمل دون إنترنت في الموقع؟" },
  "faq.a2": { en: "Yes. Tasks queue locally and sync the moment connection returns.", ar: "نعم. تُخزَّن المهام محلياً وتُزامَن فور عودة الاتصال." },
  "faq.q3": { en: "Can owners only see their buildings?", ar: "هل يرى المالك مبانيه فقط؟" },
  "faq.a3": { en: "Yes. Owners get a strict read-only view scoped to their assigned buildings.", ar: "نعم. يحصل المالك على عرض قراءة فقط محدود بمبانيه." },
  "faq.q4": { en: "Is the data hosted inside Saudi Arabia?", ar: "هل البيانات مستضافة داخل السعودية؟" },
  "faq.a4": { en: "KSA region hosting is available on Growth and above.", ar: "الاستضافة داخل المملكة متاحة في باقة النمو وأعلى." },

  "sec.cta.title": { en: "Stop guessing. Start verifying.", ar: "توقّف عن التخمين. ابدأ بالتحقّق." },
  "sec.cta.body": { en: "Run a 14-day pilot on one building. We'll set it up for you.", ar: "جرّب لمدة 14 يوماً على مبنى واحد. سنقوم بالإعداد لك." },

  // Footer
  "footer.tag": { en: "Smart Building Operations Platform", ar: "منصة تشغيل المباني الذكية" },
  "footer.product": { en: "Product", ar: "المنتج" },
  "footer.company": { en: "Company", ar: "الشركة" },
  "footer.legal": { en: "Legal", ar: "قانوني" },
  "footer.rights": { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },

  // Pricing page
  "pricing.title": { en: "Pricing that scales with your portfolio", ar: "أسعار تنمو مع محفظتك" },
  "pricing.sub": { en: "All plans include role-based access, photo proof, supervisor workflow and tenant QR portal.", ar: "كل الباقات تشمل الصلاحيات حسب الدور وإثبات الصور وسير عمل المشرف وبوابة QR للمستأجرين." },
  "pricing.month": { en: "/ month", ar: "/ شهرياً" },
  "pricing.custom": { en: "Custom", ar: "مخصّص" },
  "pricing.choose": { en: "Choose plan", ar: "اختر الباقة" },
  "pricing.contact": { en: "Contact sales", ar: "تواصل مع المبيعات" },
  "pricing.addons": { en: "Add-ons", ar: "إضافات" },

  // Product page
  "product.title": { en: "One platform. Every role.", ar: "منصة واحدة. كل الأدوار." },
  "product.sub": { en: "From Super Admin to housemaster - each role gets exactly the screen they need.", ar: "من المسؤول الأعلى إلى العامل - كل دور يحصل تماماً على الشاشة التي يحتاجها." },

  // Solutions page
  "sol.title": { en: "Solutions for every building portfolio", ar: "حلول لكل محفظة عقارية" },
  "sol.sub": { en: "Whether you run three towers or three hundred - FacilityOS Arabia adapts.", ar: "سواء تدير ثلاثة أبراج أو ثلاثمئة - تتكيّف فاسيليتي أو إس مع احتياجك." },

  // About
  "about.title": { en: "Built by operators, for operators.", ar: "صُمّمت من قبل المشغّلين للمشغّلين." },
  "about.body": { en: "FacilityOS Arabia is built by a team that has run facility operations across Riyadh and the Gulf. We've felt every WhatsApp group, every missing photo and every angry tenant. We built the tool we wished we had.", ar: "تأسّست فاسيليتي أو إس عربيا من قِبَل فريق أدار التشغيل في الرياض والخليج. عشنا كل مجموعة واتساب وكل صورة مفقودة وكل مستأجر غاضب، فبنينا الأداة التي تمنّيناها." },

  // Contact
  "contact.title": { en: "Book a demo", ar: "احجز عرضاً توضيحياً" },
  "contact.sub": { en: "Tell us about your portfolio. We'll respond within one business day.", ar: "أخبرنا عن محفظتك. سنرد خلال يوم عمل واحد." },
  "contact.name": { en: "Full name", ar: "الاسم الكامل" },
  "contact.email": { en: "Work email", ar: "البريد المهني" },
  "contact.company": { en: "Company", ar: "الشركة" },
  "contact.buildings": { en: "Number of buildings", ar: "عدد المباني" },
  "contact.message": { en: "How can we help?", ar: "كيف يمكننا المساعدة؟" },
  "contact.submit": { en: "Request demo", ar: "طلب العرض" },
  "contact.sent": { en: "Thanks - we'll be in touch shortly.", ar: "شكراً - سنتواصل معك قريباً." },

  // Security page
  "sec.page.title": { en: "Security & Compliance", ar: "الأمان والامتثال" },
  "sec.page.sub": { en: "How we protect your buildings, your photos and your tenants.", ar: "كيف نحمي مبانيك وصورك ومستأجريك." },
};

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict | string) => string;
  dir: "ltr" | "rtl";
}

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("fos-lang")) as Lang | null;
    if (stored === "en" || stored === "ar") {
      setLangState(stored);
      return;
    }
    const browser = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "en";
    setLangState(browser.startsWith("ar") ? "ar" : "en");
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("fos-lang", l);
  };

  const t = (key: string) => {
    const entry = dict[key as keyof typeof dict];
    if (!entry) return key;
    return entry[lang];
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, { en: string; ar: string }>;

export const dict: Dict = {
  // Nav & Header
  "nav.product": { en: "Product", ar: "المنتج" },
  "nav.solutions": { en: "Solutions", ar: "الحلول" },
  "nav.pricing": { en: "Pricing", ar: "الأسعار" },
  "nav.about": { en: "About", ar: "من نحن" },
  "nav.security": { en: "Security", ar: "الأمان" },
  "nav.contact": { en: "Contact", ar: "تواصل" },
  "nav.demo": { en: "Book a Demo", ar: "احجز عرضاً" },
  "nav.signin": { en: "Sign in", ar: "تسجيل الدخول" },

  // Common UI
  "common.search": { en: "Search", ar: "بحث" },
  "common.filter": { en: "Filter", ar: "تصفية" },
  "common.clear": { en: "Clear", ar: "مسح" },
  "common.save": { en: "Save", ar: "حفظ" },
  "common.cancel": { en: "Cancel", ar: "إلغاء" },
  "common.delete": { en: "Delete", ar: "حذف" },
  "common.edit": { en: "Edit", ar: "تعديل" },
  "common.add": { en: "Add", ar: "إضافة" },
  "common.create": { en: "Create", ar: "إنشاء" },
  "common.update": { en: "Update", ar: "تحديث" },
  "common.view": { en: "View", ar: "عرض" },
  "common.download": { en: "Download", ar: "تحميل" },
  "common.upload": { en: "Upload", ar: "رفع" },
  "common.submit": { en: "Submit", ar: "إرسال" },
  "common.continue": { en: "Continue", ar: "متابعة" },
  "common.back": { en: "Back", ar: "رجوع" },
  "common.next": { en: "Next", ar: "التالي" },
  "common.previous": { en: "Previous", ar: "السابق" },
  "common.close": { en: "Close", ar: "إغلاق" },
  "common.open": { en: "Open", ar: "فتح" },
  "common.status": { en: "Status", ar: "الحالة" },
  "common.date": { en: "Date", ar: "التاريخ" },
  "common.time": { en: "Time", ar: "الوقت" },
  "common.name": { en: "Name", ar: "الاسم" },
  "common.email": { en: "Email", ar: "البريد الإلكتروني" },
  "common.phone": { en: "Phone", ar: "رقم الجوال" },
  "common.city": { en: "City", ar: "المدينة" },
  "common.plan": { en: "Plan", ar: "الخطة" },
  "common.price": { en: "Price", ar: "السعر" },
  "common.more": { en: "More", ar: "المزيد" },
  "common.logout": { en: "Logout", ar: "تسجيل الخروج" },

  // Roles
  "role.admin": { en: "Admin", ar: "الإدارة" },
  "role.owner": { en: "Owner", ar: "المالك" },
  "role.labour": { en: "Labour", ar: "العامل" },

  // Extended Common
  "common.sign_out": { en: "Sign Out", ar: "تسجيل الخروج" },
  "common.owner": { en: "Owner", ar: "المالك" },
  "common.labour": { en: "Labour", ar: "العامل" },
  "common.building": { en: "Building", ar: "المبنى" },
  "common.buildings": { en: "Buildings", ar: "المباني" },
  "common.building_name": { en: "Building Name", ar: "اسم المبنى" },
  "common.address": { en: "Address", ar: "العنوان" },
  "common.company": { en: "Company", ar: "الشركة" },
  "common.full_name": { en: "Full Name", ar: "الاسم الكامل" },
  "common.submitted": { en: "Submitted", ar: "تاريخ الإرسال" },
  "common.monthly": { en: "Monthly", ar: "شهري" },
  "common.actions": { en: "Actions", ar: "إجراءات" },
  "common.owners": { en: "owners", ar: "ملاك" },
  "common.done": { en: "Done", ar: "تم" },
  "common.pending": { en: "Pending", ar: "معلق" },
  "common.important": { en: "⚡ Important", ar: "⚡ مهم" },
  "common.completed": { en: "✓ Completed", ar: "✓ مكتمل" },
  "common.no_records": { en: "No matching records found", ar: "لا توجد سجلات مطابقة" },
  "common.no_records_body": { en: "Try adjusting your search or filter.", ar: "جرب تعديل بحثك أو فلترتك." },
  "common.unassigned": { en: "Unassigned", ar: "غير معيّن" },
  "common.locale": { en: "en-GB", ar: "ar-SA" },

  // Statuses
  "status.active": { en: "Active", ar: "نشط" },
  "status.inactive": { en: "Inactive", ar: "غير نشط" },
  "status.healthy": { en: "Healthy", ar: "جيد" },
  "status.pending": { en: "Pending", ar: "معلق" },
  "status.attention": { en: "Attention Needed", ar: "يحتاج انتباه" },
  "status.trial": { en: "Trial", ar: "تجريبي" },
  "status.suspended": { en: "Suspended", ar: "موقوف" },
  "status.approved": { en: "Approved", ar: "معتمد" },
  "status.rejected": { en: "Rejected", ar: "مرفوض" },
  "status.submitted": { en: "Submitted", ar: "مرسل" },
  "status.missed": { en: "Missed", ar: "فائت" },
  "status.completed": { en: "Completed", ar: "مكتمل" },
  "status.done": { en: "Done", ar: "تم" },

  // Plans
  "plan.starter": { en: "Starter — SAR 299/mo", ar: "الباقة الأساسية — 299 ريال/شهر" },
  "plan.professional": { en: "Professional — SAR 899/mo", ar: "الباقة الاحترافية — 899 ريال/شهر" },
  "plan.enterprise": { en: "Enterprise — SAR 1,999/mo", ar: "الباقة المؤسسية — 1,999 ريال/شهر" },

  // Calls to Action
  "cta.demo": { en: "Book a Demo", ar: "احجز عرضاً توضيحياً" },
  "cta.view": { en: "View Platform", ar: "استكشف المنصة" },
  "cta.start": { en: "Get Started", ar: "ابدأ الآن" },
  "badge.kingdom": { en: "Built for Saudi Arabia & the Gulf", ar: "مصمّم للمملكة العربية السعودية والخليج" },

  // Hero Section
  "hero.title": { en: "Smart Building Operations for Saudi & Gulf Property Teams", ar: "إدارة تشغيل المباني الذكية لفرق العقارات في السعودية والخليج" },
  "hero.sub": { en: "Manage daily tasks, labor photo proof, supervisor approvals, tenant complaints, owner reports and building health - from one Arabic-first platform.", ar: "إدارة المهام اليومية، إثبات العمل بالصور، اعتماد المشرفين، شكاوى المستأجرين، تقارير الملاك وصحة المبنى - من منصة واحدة عربية أولاً." },
  "hero.trust": { en: "Trusted by facility teams across Riyadh, Jeddah, Dammam, Dubai and Doha.", ar: "موثوقة من قبل فرق التشغيل في الرياض وجدة والدمام ودبي والدوحة." },

  // Home Specific Additions
  "home.hero.title": { en: "Simple Daily Building Operations, Verified by Labour Checklists", ar: "عمليات تشغيل يومية للمباني ببساطة، مدعمة بقوائم تحقق العمال" },
  "home.hero.subtitle": { en: "Give building owners a clear dashboard to assign daily tasks, track labour work, and receive daily proof that cleaning, maintenance, elevator, water, lights, and security checks are completed.", ar: "امنح ملاك المباني لوحة تحكم واضحة لتعيين المهام اليومية وتتبع عمل العمال وتلقي إثبات يومي على اكتمال التنظيف والصيانة وفحص المصاعد والمياه والإضاءة والأمن." },
  "home.workflow.kicker": { en: "Simple Workflow", ar: "طريقة عمل بسيطة" },
  "home.platform.kicker": { en: "Platform", ar: "المنصة" },
  "home.platform.explore": { en: "Explore the platform", ar: "استكشف المنصة" },
  "home.cta.start": { en: "Start Building Management", ar: "ابدأ إدارة المباني" },
  "home.cta.subscribe": { en: "Subscribe to Access", ar: "اشترك للوصول" },

  // Info Sections
  "sec.problem.kicker": { en: "The problem", ar: "المشكلة" },
  "sec.problem.title": { en: "Buildings run on WhatsApp groups, paper logs and excuses.", ar: "تُدار المباني عبر مجموعات الواتساب والسجلّات الورقية والأعذار." },
  "sec.problem.body": { en: "Owners can't verify what was done. Supervisors chase labor. Tenants are ignored. Complaints get lost. Monthly reports are guesswork.", ar: "لا يستطيع الملّاك التحقق من إنجاز الأعمال، يطارد المشرفون العمّال، ويُهمَل المستأجرون، وتضيع الشكاوى، وتصبح التقارير الشهرية تخميناً." },
  "sec.how.kicker": { en: "How it works", ar: "كيف تعمل" },
  "sec.how.title": { en: "From task to proof in four steps.", ar: "من المهمة إلى الإثبات في أربع خطوات." },
  "sec.usecase.kicker": { en: "Built for", ar: "مصمّم لـ" },
  "sec.usecase.title": { en: "Whoever runs the building.", ar: "كل من يدير المبنى." },
  "sec.security.kicker": { en: "Security", ar: "الأمان" },
  "sec.security.title": { en: "Enterprise security from day one.", ar: "أمان مؤسسي منذ اليوم الأول." },
  "sec.pricing.kicker": { en: "Pricing", ar: "الأسعار" },
  "sec.pricing.title": { en: "Simple SAR pricing per portfolio.", ar: "تسعير بسيط بالريال لكل محفظة." },
  "sec.pricing.body": { en: "Start at 499 SAR for one building. Scale to enterprise.", ar: "ابدأ بـ 499 ريال لمبنى واحد. وصولاً إلى الباقات المؤسسية." },
  "sec.faq.kicker": { en: "FAQ", ar: "الأسئلة" },
  "sec.faq.title": { en: "Frequently Asked Questions", ar: "الأسئلة الشائعة" },
  "faq.pricing.q1": { en: "Can one owner manage multiple buildings?", ar: "هل يمكن لمالك واحد إدارة عدة مبانٍ؟" },
  "faq.pricing.a1": { en: "Yes, an owner account can be assigned multiple buildings depending on the plan.", ar: "نعم، يمكن تعيين عدة مبانٍ لحساب مالك واحد حسب الخطة." },
  "faq.pricing.q2": {
    en: "Who is FacilityOS Arabia built for?",
    ar: "لمن تم تصميم فاسيليتي أو إس عربيا؟"
  },
  "faq.pricing.a2": {
    en: "It is built for building owners, property managers, facility operators, and companies managing residential or commercial buildings.",
    ar: "تم تصميمها لملاك المباني، ومديري العقارات، ومشغلي المرافق، والشركات التي تدير المباني السكنية أو التجارية."
  },

  "faq.pricing.q3": {
    en: "How does the platform work?",
    ar: "كيف تعمل المنصة؟"
  },
  "faq.pricing.a3": {
    en: "The owner adds buildings and labour, assigns daily checklist tasks, and labour completes those tasks through a simple visual dashboard. After submission, the owner and admin can view the daily report.",
    ar: "يقوم المالك بإضافة المباني والعمال، ثم يعيّن المهام اليومية. يقوم العامل بإنجاز المهام من خلال لوحة بسيطة ومرئية، وبعد الإرسال يستطيع المالك والإدارة مشاهدة التقرير اليومي."
  },

  "faq.pricing.q4": {
    en: "Does labour need technical knowledge to use it?",
    ar: "هل يحتاج العامل إلى خبرة تقنية لاستخدامها؟"
  },
  "faq.pricing.a4": {
    en: "No. The labour dashboard is designed to be very simple, with large visual task cards, clear icons, and one submit button.",
    ar: "لا. لوحة العامل مصممة لتكون سهلة جداً، مع بطاقات مرئية كبيرة، رموز واضحة، وزر واحد لإرسال العمل."
  },

  "faq.pricing.q5": {
    en: "What kind of tasks can be assigned?",
    ar: "ما نوع المهام التي يمكن تعيينها؟"
  },
  "faq.pricing.a5": {
    en: "Owners can assign tasks such as entrance cleaning, elevator checks, garbage removal, water checks, lighting checks, parking area cleaning, staircase cleaning, and security gate checks.",
    ar: "يمكن تعيين مهام مثل تنظيف المدخل، فحص المصعد، إزالة النفايات، فحص المياه، فحص الإضاءة، تنظيف المواقف، تنظيف الدرج، وفحص بوابة الأمن."
  },

  "faq.pricing.q6": {
    en: "What happens after labour submits the checklist?",
    ar: "ماذا يحدث بعد إرسال العامل لقائمة المهام؟"
  },
  "faq.pricing.a6": {
    en: "A daily report is created showing completed tasks, pending tasks, submission time, building name, and labour details.",
    ar: "يتم إنشاء تقرير يومي يوضح المهام المكتملة، والمهام المعلقة، ووقت الإرسال، واسم المبنى، وبيانات العامل."
  },

  "faq.pricing.q7": {
    en: "Is payment active on the website right now?",
    ar: "هل الدفع مفعل حالياً على الموقع؟"
  },
  "faq.pricing.a7": {
    en: "Currently, the website uses a frontend demo checkout. Real payment integration can be added later.",
    ar: "حالياً يستخدم الموقع صفحة دفع تجريبية للواجهة فقط. يمكن إضافة الدفع الحقيقي لاحقاً."
  },

  "faq.pricing.q8": {
    en: "Is this a mobile app?",
    ar: "هل هذه المنصة تطبيق جوال؟"
  },
  "faq.pricing.a8": {
    en: "For now, it is a responsive web platform. The labour dashboard is mobile-friendly and works like a simple mobile app inside the browser.",
    ar: "حالياً هي منصة ويب متجاوبة. لوحة العامل مصممة لتعمل بشكل ممتاز على الجوال وكأنها تطبيق بسيط داخل المتصفح."
  },

  "faq.pricing.q9": {
    en: "Can the platform support Arabic and English?",
    ar: "هل تدعم المنصة العربية والإنجليزية؟"
  },
  "faq.pricing.a9": {
    en: "Yes. FacilityOS Arabia supports both English and Arabic, making it suitable for Saudi Arabia and Gulf markets.",
    ar: "نعم. تدعم فاسيليتي أو إس عربيا اللغتين العربية والإنجليزية، مما يجعلها مناسبة للسوق السعودي والخليجي."
  },

  "faq.pricing.q10": {
    en: "Can more features be added later?",
    ar: "هل يمكن إضافة ميزات أخرى لاحقاً؟"
  },
  "faq.pricing.a10": {
    en: "Yes. The platform is built as an MVP first. Features such as photo proof, WhatsApp alerts, tenant complaints, approvals, PDF reports, and mobile apps can be added later.",
    ar: "نعم. تم بناء المنصة كبداية بسيطة، ويمكن لاحقاً إضافة ميزات مثل إثبات بالصور، تنبيهات واتساب، شكاوى السكان، الموافقات، تقارير PDF، وتطبيقات الجوال."
  },

  "faq.pricing.q11": {
    en: "Why should building owners use FacilityOS Arabia?",
    ar: "لماذا يجب على ملاك المباني استخدام فاسيليتي أو إس عربيا؟"
  },
  "faq.pricing.a11": {
    en: "Because it gives owners a clear daily view of building operations, reduces manual follow-up, improves accountability, and helps ensure daily work is actually completed.",
    ar: "لأنها تمنح المالك رؤية يومية واضحة لتشغيل المبنى، وتقلل المتابعة اليدوية، وتزيد من المسؤولية، وتساعد على التأكد من إنجاز الأعمال اليومية فعلاً."
  },

  "faq.pricing.q12": {
    en: "Can an owner assign labour to different buildings?",
    ar: "هل يمكن للمالك تعيين العمال لمبانٍ مختلفة؟"
  },
  "faq.pricing.a12": {
    en: "Yes. Each labour account can be assigned to a specific building, and owners can manage labour based on their assigned buildings.",
    ar: "نعم. يمكن تعيين كل حساب عامل لمبنى محدد، ويستطيع المالك إدارة العمال حسب المباني التابعة له."
  },

  "faq.pricing.q13": {
    en: "Can owners create their own checklist tasks?",
    ar: "هل يستطيع الملاك إنشاء مهام خاصة بهم؟"
  },
  "faq.pricing.a13": {
    en: "Yes. Owners can create custom checklist tasks or use ready-made templates for common building operations.",
    ar: "نعم. يستطيع الملاك إنشاء مهام مخصصة أو استخدام قوالب جاهزة للعمليات اليومية الشائعة في المباني."
  },

  "sec.cta.title": { en: "Stop guessing. Start verifying.", ar: "توقّف عن التخمين. ابدأ بالتحقّق." },
  "sec.cta.body": { en: "Run a 14-day pilot on one building. We'll set it up for you.", ar: "جرّب لمدة 14 يوماً على مبنى واحد. سنقوم بالإعداد لك." },

  // Footer
  "footer.tag": { en: "Smart Building Operations Platform", ar: "منصة تشغيل المباني الذكية" },
  "footer.product": { en: "Product", ar: "المنتج" },
  "footer.company": { en: "Company", ar: "الشركة" },
  "footer.legal": { en: "Legal", ar: "قانوني" },
  "footer.rights": { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },

  // Pricing Page
  "pricing.hero.title": { en: "Simple Pricing for Building Owners", ar: "أسعار بسيطة لملاك المباني" },
  "pricing.hero.subtitle": { en: "Choose the plan that fits your property portfolio. No hidden fees.", ar: "اختر الخطة المناسبة لمحفظة مبانيك. بدون رسوم مخفية." },
  "pricing.plan.starter": { en: "Starter", ar: "البداية" },
  "pricing.plan.professional": { en: "Professional", ar: "الاحترافية" },
  "pricing.plan.enterprise": { en: "Enterprise", ar: "المؤسسات" },
  "pricing.popular": { en: "Most Popular", ar: "الأكثر طلباً" },
  "pricing.sar_mo": { en: "SAR/mo", ar: "ريال / شهرياً" },
  "pricing.desc.starter": { en: "Best for single building owners", ar: "مناسبة لملاك مبنى واحد" },
  "pricing.desc.professional": { en: "Best for growing building portfolios", ar: "مناسبة للملاك الذين يديرون عدة مبانٍ" },
  "pricing.desc.enterprise": { en: "Best for large property groups", ar: "مناسبة للمجموعات العقارية الكبيرة" },
  "pricing.feat.1building": { en: "1 building", ar: "مبنى واحد" },
  "pricing.feat.owner_access": { en: "Owner dashboard access", ar: "الوصول إلى لوحة المالك" },
  "pricing.feat.labour_access": { en: "Labour checklist dashboard", ar: "لوحة مهام العامل" },
  "pricing.feat.daily_reports": { en: "Daily reports", ar: "تقارير يومية" },
  "pricing.feat.basic_history": { en: "Basic report history", ar: "سجل تقارير أساسي" },
  "pricing.feat.email_support": { en: "Email support", ar: "دعم عبر البريد الإلكتروني" },
  "pricing.feat.up_to_5": { en: "Up to 5 buildings", ar: "حتى 5 مبانٍ" },
  "pricing.feat.multiple_labour": { en: "Multiple labour accounts", ar: "حسابات عمال متعددة" },
  "pricing.feat.templates": { en: "Checklist templates", ar: "قوالب قوائم المهام" },
  "pricing.feat.today_reports": { en: "Today's reports", ar: "تقارير اليوم" },
  "pricing.feat.report_history": { en: "Report history", ar: "سجل التقارير" },
  "pricing.feat.priority_support": { en: "Priority support", ar: "دعم ذو أولوية" },
  "pricing.feat.multiple_buildings": { en: "Multiple buildings", ar: "عدة مبانٍ" },
  "pricing.feat.custom_setup": { en: "Custom setup", ar: "إعداد مخصص" },
  "pricing.feat.multiple_users": { en: "Multiple owner/supervisor users later", ar: "مستخدمون متعددون لاحقاً" },
  "pricing.feat.advanced_history": { en: "Advanced report history", ar: "سجل تقارير متقدم" },
  "pricing.feat.priority_onboarding": { en: "Priority onboarding", ar: "تهيئة ذات أولوية" },
  "pricing.feat.dedicated_support": { en: "Dedicated support", ar: "دعم مخصص" },
  "pricing.btn.get_owner": { en: "Get Owner Access", ar: "احصل على لوحة المالك" },
  "pricing.btn.contact": { en: "Contact sales", ar: "تواصل مع المبيعات" },

  // Product Page
  "product.hero.overview": { en: "Platform Overview", ar: "نظرة عامة على المنصة" },
  "product.hero.title": { en: "One Simple Platform. Three Powerful Dashboards.", ar: "منصة بسيطة واحدة. ثلاث لوحات تحكم قوية." },
  "product.hero.subtitle": { en: "From Super Admin to housemaster - each role gets exactly the screen they need.", ar: "من المسؤول الأعلى إلى العامل - كل دور يحصل تماماً على الشاشة التي يحتاجها." },
  "product.admin.title": { en: "Admin Dashboard", ar: "لوحة الإدارة" },
  "product.owner.title": { en: "Owner Dashboard", ar: "لوحة المالك" },
  "product.labour.title": { en: "Labour Dashboard", ar: "لوحة العامل" },
  "product.how_it_works": { en: "How it works", ar: "طريقة العمل" },
  "product.built_for_proof": { en: "Built for daily proof of work", ar: "مصممة لإثبات إنجاز العمل اليومي" },
  "product.built_for_proof_desc": { en: "Building owners no longer need to call repeatedly or guess if work was completed. The platform is designed for one simple loop: Labour submits the daily checklist, and the owner instantly receives a verifiable daily report.", ar: "لم يعد ملاك المباني بحاجة إلى الاتصال المتكرر أو التخمين إذا كان العمل قد اكتمل. المنصة مصممة لحلقة واحدة بسيطة: العامل يرسل قائمة المهام اليومية، والمالك يتلقى فوراً تقريراً يومياً قابلاً للتحقق." },
  "product.btn.get_access": { en: "Get Owner Dashboard Access", ar: "احصل على لوحة المالك" },
  "product.btn.demo": { en: "View Dashboard Demo", ar: "شاهد العرض التجريبي" },

  // Login Page
  "login.title": { en: "Sign in", ar: "تسجيل الدخول" },
  "login.welcome": { en: "Welcome back", ar: "مرحباً بعودتك" },
  "login.choose_role": { en: "Choose role", ar: "اختر نوع الحساب" },
  "login.password": { en: "Password", ar: "كلمة المرور" },
  "login.remember": { en: "Remember me", ar: "تذكرني" },
  "login.forgot": { en: "Forgot password?", ar: "نسيت كلمة المرور؟" },
  "login.back_pricing": { en: "Back to pricing", ar: "العودة إلى الأسعار" },
  "login.back_home": { en: "Back to home", ar: "العودة للرئيسية" },
  "login.demo_creds": { en: "Demo credentials", ar: "بيانات الدخول التجريبية" },
  "login.sign_as_admin": { en: "Sign in as Admin", ar: "تسجيل الدخول كإدارة" },
  "login.sign_as_owner": { en: "Sign in as Owner", ar: "تسجيل الدخول كمالك" },
  "login.sign_as_labour": { en: "Sign in as Labour", ar: "تسجيل الدخول كعامل" },
  "login.invalid": { en: "Invalid email or password", ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
  "login.reset_msg": { en: "Password reset is not connected yet in demo mode. Please contact platform admin.", ar: "إعادة تعيين كلمة المرور غير متصلة حالياً في النسخة التجريبية. يرجى التواصل مع إدارة المنصة." },
  "login.owner_notice": { en: "Owner dashboard is available after subscription", ar: "لوحة المالك متاحة بعد الاشتراك" },
  "login.labour_notice": { en: "Labour users receive credentials from their building owner", ar: "يتلقى العمال بيانات الدخول من مالك المبنى" },
  "login.admin_notice": { en: "Admin access is restricted to platform management only", ar: "وصول الإدارة مقتصر على إدارة المنصة فقط" },

  // Checkout Page
  "checkout.title": { en: "Checkout", ar: "إتمام الاشتراك" },
  "checkout.complete_access": { en: "Complete your owner access", ar: "أكمل بيانات الوصول إلى لوحة المالك" },
  "checkout.selected_plan": { en: "Selected plan", ar: "الخطة المختارة" },
  "checkout.monthly_price": { en: "Monthly price", ar: "السعر الشهري" },
  "checkout.included": { en: "Included features", ar: "المميزات المشمولة" },
  "checkout.customer_info": { en: "Customer information", ar: "بيانات العميل" },
  "checkout.full_name": { en: "Full name", ar: "الاسم الكامل" },
  "checkout.work_email": { en: "Work email", ar: "البريد الإلكتروني للعمل" },
  "checkout.phone": { en: "Phone number", ar: "رقم الجوال" },
  "checkout.company": { en: "Company / building group name", ar: "اسم الشركة أو مجموعة المباني" },
  "checkout.num_buildings": { en: "Number of buildings", ar: "عدد المباني" },
  "checkout.payment_method": { en: "Payment method", ar: "طريقة الدفع" },
  "checkout.integration_soon": { en: "Payment integration coming soon", ar: "تكامل الدفع قادم قريباً" },
  "checkout.demo_notice": { en: "This is a frontend demo checkout", ar: "هذه صفحة دفع تجريبية للواجهة فقط" },
  "checkout.continue_demo": { en: "Continue to Owner Dashboard Demo", ar: "المتابعة إلى تجربة لوحة المالك" },
  "checkout.already_have": { en: "Already have access? Login", ar: "لديك وصول بالفعل؟ سجّل الدخول" },
  "checkout.success": { en: "Access created successfully", ar: "تم إنشاء الوصول بنجاح" },
  "checkout.redirecting": { en: "Redirecting to Owner Dashboard Demo", ar: "جاري التوجيه إلى تجربة لوحة المالك" },

  // Admin Dashboard
  "dashboard.admin.nav.overview": { en: "Overview", ar: "نظرة عامة" },
  "dashboard.admin.nav.owners": { en: "Owners", ar: "الملاك" },
  "dashboard.admin.nav.buildings": { en: "Buildings", ar: "المباني" },
  "dashboard.admin.nav.labour": { en: "Labour", ar: "العمال" },
  "dashboard.admin.nav.templates": { en: "Checklist Templates", ar: "قوالب قوائم المهام" },
  "dashboard.admin.nav.reports": { en: "Daily Reports", ar: "التقارير اليومية" },
  "dashboard.admin.nav.earnings": { en: "Earnings", ar: "الأرباح" },
  "dashboard.admin.nav.settings": { en: "Settings", ar: "الإعدادات" },

  "dashboard.admin.center": { en: "Platform Control Center", ar: "مركز التحكم بالمنصة" },
  "dashboard.admin.overview": { en: "Admin Overview", ar: "نظرة عامة للإدارة" },
  "dashboard.admin.desc": { en: "Manage owners, buildings, subscriptions, labour activity, and daily verification reports from one place", ar: "إدارة الملاك والمباني والاشتراكات ونشاط العمال وتقارير التحقق اليومية من مكان واحد" },

  "dashboard.admin.metric.buildings": { en: "Total Buildings", ar: "إجمالي المباني" },
  "dashboard.admin.metric.revenue": { en: "Monthly Revenue", ar: "الإيراد الشهري" },
  "dashboard.admin.metric.completion": { en: "Completion Rate", ar: "نسبة الإنجاز" },
  "dashboard.admin.metric.submitted": { en: "Today Submitted", ar: "تقارير اليوم المرسلة" },
  "dashboard.admin.metric.subscriptions": { en: "Active Subscriptions", ar: "الاشتراكات النشطة" },
  "dashboard.admin.metric.owners": { en: "Total Owners", ar: "إجمالي الملاك" },

  "dashboard.admin.action.add_owner": { en: "Add Owner", ar: "إضافة مالك" },
  "dashboard.admin.action.edit_owner": { en: "Edit Owner", ar: "تعديل المالك" },
  "dashboard.admin.action.assign_buildings": { en: "Assign Buildings", ar: "تعيين المباني" },
  "dashboard.admin.action.reset_password": { en: "Reset Password", ar: "إعادة تعيين كلمة المرور" },
  "dashboard.admin.action.add_building": { en: "Add Building", ar: "إضافة مبنى" },
  "dashboard.admin.action.assign_owner": { en: "Assign Owner", ar: "تعيين مالك" },
  "dashboard.admin.action.assign_labour": { en: "Assign Labour", ar: "تعيين عامل" },
  "dashboard.admin.action.add_labour": { en: "Add Labour", ar: "إضافة عامل" },
  "dashboard.admin.action.create_template": { en: "Create Template", ar: "إنشاء قالب" },
  "dashboard.admin.action.view_report": { en: "View Report", ar: "عرض التقرير" },
  "dashboard.admin.action.view_details": { en: "View Details", ar: "عرض التفاصيل" },

  "dashboard.admin.payments.recent": { en: "Recent Payments", ar: "آخر المدفوعات" },
  "dashboard.admin.payments.alerts": { en: "Failed Payment Alerts", ar: "تنبيهات الدفع الفاشلة" },
  "dashboard.admin.paying_customers": { en: "Paying customers", ar: "عملاء مشتركين" },
  "dashboard.admin.across_owners": { en: "Across all owners", ar: "عبر جميع الملاك" },
  "dashboard.admin.platform_average": { en: "Platform average today", ar: "متوسط المنصة اليوم" },

  // Owner Dashboard
  "dashboard.owner.nav.overview": { en: "Overview", ar: "نظرة عامة" },
  "dashboard.owner.nav.buildings": { en: "My Buildings", ar: "مبانيّ" },
  "dashboard.owner.nav.labour": { en: "Labour", ar: "العمال" },
  "dashboard.owner.nav.assign": { en: "Assign Tasks", ar: "تعيين المهام" },
  "dashboard.owner.nav.today": { en: "Today's Reports", ar: "تقارير اليوم" },
  "dashboard.owner.nav.history": { en: "Report History", ar: "سجل التقارير" },
  "dashboard.owner.nav.subscription": { en: "Subscription", ar: "الاشتراك" },
  "dashboard.owner.nav.settings": { en: "Settings", ar: "الإعدادات" },

  "dashboard.owner.hub": { en: "Your Building Operations Hub", ar: "مركز إدارة مبانيك" },
  "dashboard.owner.desc": { en: "Assign daily work, track labour activity, and receive proof that your building tasks are completed", ar: "عيّن الأعمال اليومية، تابع نشاط العمال، واستلم إثبات إنجاز مهام المبنى" },

  "dashboard.owner.metric.buildings": { en: "My Buildings", ar: "مبانيّ" },
  "dashboard.owner.metric.labour": { en: "Active Labour", ar: "العمال النشطون" },
  "dashboard.owner.metric.tasks": { en: "Tasks Completed Today", ar: "المهام المكتملة اليوم" },
  "dashboard.owner.metric.pending": { en: "Pending Tasks", ar: "المهام المعلقة" },
  "dashboard.owner.metric.rate": { en: "Today Completion Rate", ar: "نسبة إنجاز اليوم" },
  "dashboard.owner.metric.last": { en: "Last Submitted Report", ar: "آخر تقرير مرسل" },

  "owner.overview.tasks_done": { en: "Tasks Completed Today", ar: "المهام المكتملة اليوم" },
  "owner.overview.completion": { en: "Today Completion", ar: "إنجاز اليوم" },
  "owner.overview.active_labour": { en: "Active Labour", ar: "العمال النشطون" },
  "owner.overview.pending_tasks": { en: "Pending Tasks", ar: "المهام المعلقة" },
  "owner.overview.last_report": { en: "Last Report", ar: "آخر تقرير" },
  "owner.overview.across_buildings": { en: "Across all buildings", ar: "عبر جميع المباني" },
  "owner.overview.assigned_to": { en: "Assigned to your buildings", ar: "معينون لمبانيك" },
  "owner.overview.recent_sub": { en: "Most recent submission", ar: "أحدث إرسال" },
  "owner.overview.building_status": { en: "Building Status", ar: "حالة المباني" },
  "owner.overview.labour_activity": { en: "Labour Activity", ar: "نشاط العمال" },
  "owner.overview.no_reports": { en: "No reports submitted yet today.", ar: "لم يتم إرسال أي تقارير اليوم." },

  "dashboard.owner.gm": { en: "Good morning,", ar: "صباح الخير يا" },
  "owner.overview.desc": { en: "Assign daily work, track labour activity, and receive proof that your building tasks are completed.", ar: "عيّن الأعمال اليومية، تابع نشاط العمال، واستلم إثبات إنجاز مهام المبنى." },
  "owner.overview.alert": { en: "One or more buildings need attention. Check building status for details.", ar: "مبنى واحد أو أكثر يحتاج إلى انتباه. تحقق من حالة المباني للتفاصيل." },

  "common.of": { en: "of", ar: "من" },
  "common.total": { en: "total", ar: "الإجمالي" },
  "common.remaining": { en: "remaining", ar: "متبقي" },
  "common.all_done": { en: "All done!", ar: "تم الإنجاز!" },
  "common.tasks": { en: "tasks", ar: "مهام" },
  "common.view_all": { en: "View all", ar: "عرض الكل" },
  "common.manage": { en: "Manage", ar: "إدارة" },

  "dashboard.owner.action.add_labour": { en: "Add Labour", ar: "إضافة عامل" },
  "dashboard.owner.action.assign_building": { en: "Assign Building", ar: "تعيين مبنى" },
  "dashboard.owner.action.view_checklist": { en: "View Checklist", ar: "عرض قائمة المهام" },
  "dashboard.owner.action.remove_labour": { en: "Remove Labour", ar: "إزالة العامل" },
  "dashboard.owner.action.select_building": { en: "Select Building", ar: "اختر المبنى" },
  "dashboard.owner.action.select_labour": { en: "Select Labour", ar: "اختر العامل" },
  "dashboard.owner.action.select_template": { en: "Select Template", ar: "اختر القالب" },
  "dashboard.owner.action.create_custom": { en: "Create Custom Task", ar: "إنشاء مهمة مخصصة" },
  "dashboard.owner.action.save_assignment": { en: "Save Assignment", ar: "حفظ التعيين" },

  // Labour Dashboard
  "dashboard.labour.greeting": { en: "Good Morning", ar: "صباح الخير" },
  "dashboard.labour.today_work": { en: "Today's Work", ar: "عمل اليوم" },
  "dashboard.labour.today_tasks": { en: "Today's Tasks", ar: "مهام اليوم" },
  "dashboard.labour.building": { en: "Building", ar: "المبنى" },
  "dashboard.labour.progress": { en: "Progress", ar: "التقدم" },
  "dashboard.labour.tasks_done": { en: "tasks done", ar: "مهام مكتملة" },

  // Specific tasks
  "task.clean_entrance": { en: "Clean Entrance", ar: "تنظيف المدخل" },
  "task.clean_entrance.desc": { en: "Sweep and mop entrance area", ar: "كنس ومسح منطقة المدخل" },
  "task.elevator": { en: "Check Elevator", ar: "فحص المصعد" },
  "task.elevator.desc": { en: "Make sure elevator is working", ar: "تأكد من أن المصعد يعمل" },
  "task.garbage": { en: "Remove Garbage", ar: "إزالة النفايات" },
  "task.garbage.desc": { en: "Empty garbage bins", ar: "إفراغ صناديق النفايات" },
  "task.water": { en: "Check Water", ar: "فحص المياه" },
  "task.water.desc": { en: "Check water tank or pump", ar: "فحص خزان المياه أو المضخة" },
  "task.lights": { en: "Check Lights", ar: "فحص الإضاءة" },
  "task.lights.desc": { en: "Check lobby and corridor lights", ar: "فحص إضاءة اللوبي والممرات" },
  "task.stairs": { en: "Clean Stairs", ar: "تنظيف الدرج" },
  "task.stairs.desc": { en: "Clean staircase area", ar: "تنظيف منطقة الدرج" },
  "task.parking": { en: "Check Parking", ar: "فحص المواقف" },
  "task.parking.desc": { en: "Check parking area cleanliness", ar: "فحص نظافة منطقة المواقف" },
  "task.security": { en: "Security Gate", ar: "بوابة الأمن" },
  "task.security.desc": { en: "Check gate area", ar: "فحص منطقة البوابة" },

  "dashboard.labour.mark_done": { en: "Mark Done", ar: "تم الإنجاز" },
  "dashboard.labour.submit": { en: "Submit Today's Work", ar: "إرسال عمل اليوم" },
  "dashboard.labour.submit_warning": { en: "Some tasks are still pending. Submit anyway?", ar: "بعض المهام ما زالت قيد الانتظار. هل تريد الإرسال على أي حال؟" },
  "dashboard.labour.success": { en: "Work submitted successfully", ar: "تم إرسال العمل بنجاح" },
  "dashboard.labour.report_sent": { en: "Report sent to Admin and Owner", ar: "تم إرسال التقرير إلى الإدارة والمالك" },
  "dashboard.labour.back_today": { en: "Back to Today's Checklist", ar: "العودة إلى قائمة مهام اليوم" },
  "dashboard.labour.nav.today": { en: "Today", ar: "اليوم" },
  "dashboard.labour.nav.history": { en: "History", ar: "السجل" },
  "dashboard.labour.nav.help": { en: "Help", ar: "المساعدة" },

  // Labour Dashboard (extended)
  "labour.dashboard.submitted": { en: "Work Submitted!", ar: "تم إرسال عمل اليوم!" },
  "labour.dashboard.submitted_desc_1": { en: "Today's work submitted successfully.", ar: "تم إرسال عمل اليوم بنجاح." },
  "labour.dashboard.submitted_desc_2": { en: "Report sent to Admin and Owner.", ar: "أرسل التقرير إلى الإدارة والمالك." },
  "labour.dashboard.summary": { en: "Today's Summary", ar: "ملخص اليوم" },
  "labour.dashboard.back_checklist": { en: "Back to Today's Checklist", ar: "العودة إلى قائمة مهام اليوم" },
  "labour.dashboard.back_website": { en: "← Back to website", ar: "← العودة إلى الموقع" },
  "labour.dashboard.todays_work": { en: "Today's Work", ar: "عمل اليوم" },
  "labour.dashboard.greeting": { en: "Good Morning, {name} 👋", ar: "صباح الخير يا {name} 👋" },
  "labour.dashboard.instruction": { en: "Tick each task when completed, then submit your daily work.", ar: "ضع علامة على كل مهمة عند اكتمالها، ثم أرسل عملك اليومي." },
  "labour.dashboard.progress": { en: "Progress", ar: "التقدم" },
  "labour.dashboard.all_completed": { en: "All tasks completed! Ready to submit.", ar: "تم إنجاز جميع المهام! جاهز للإرسال." },
  "labour.dashboard.submit": { en: "Submit Today's Work", ar: "إرسال عمل اليوم" },
  "labour.dashboard.submit_progress": { en: "Submit Today's Work ({done}/{total} done)", ar: "إرسال عمل اليوم ({done}/{total} مكتمل)" },
  "labour.dashboard.pending_tasks": { en: "Pending Tasks", ar: "مهام معلقة" },
  "labour.dashboard.pending_desc": { en: "are still pending. Do you want to submit anyway?", ar: "ما زالت قيد الانتظار. هل تريد الإرسال على أي حال;" },
  "labour.dashboard.submit_anyway": { en: "Yes, Submit Anyway", ar: "نعم، أرسل على أي حال" },
  "labour.dashboard.go_back": { en: "Go Back & Complete Tasks", ar: "رجوع وإكمال المهام" },

  // Admin Buildings / Owners / Labour keys
  "admin.owners.title": { en: "Owners", ar: "الملاك" },
  "admin.owners.subtitle": { en: "Manage all building owner accounts and their subscriptions.", ar: "إدارة جميع حسابات ملاك المباني واشتراكاتهم." },
  "admin.owners.add": { en: "Add Owner", ar: "إضافة مالك" },
  "admin.owners.edit": { en: "Edit Owner", ar: "تعديل بيانات المالك" },
  "admin.owners.search": { en: "Search owners by name or email…", ar: "ابحث عن ملاك بالاسم أو البريد…" },
  "admin.owners.reset_sent": { en: "Password reset email sent", ar: "تم إرسال بريد إعادة تعيين كلمة المرور" },
  "admin.buildings.title": { en: "Buildings", ar: "المباني" },
  "admin.buildings.subtitle": { en: "All buildings across the platform.", ar: "جميع المباني عبر المنصة." },
  "admin.buildings.add": { en: "Add Building", ar: "إضافة مبنى" },
  "admin.buildings.edit": { en: "Edit Building", ar: "تعديل بيانات المبنى" },
  "admin.buildings.search": { en: "Search by building name, city, or owner…", ar: "ابحث باسم المبنى أو المدينة أو المالك…" },
  "admin.buildings.today_completion": { en: "Today's completion", ar: "إنجاز اليوم" },
  "admin.buildings.last_report": { en: "Last report:", ar: "آخر تقرير:" },
  "admin.buildings.assign_labour": { en: "Assign Labour", ar: "تعيين عامل" },
  "admin.buildings.assign_owner": { en: "Assign to Owner", ar: "تعيين لمالك" },
  "admin.buildings.select_owner": { en: "— Select Owner —", ar: "— اختر مالكاً —" },
  "admin.buildings.no_records": { en: "No buildings found", ar: "لا توجد مباني" },
  "admin.kpi.revenue": { en: "Monthly Revenue", ar: "الإيراد الشهري" },
  "admin.kpi.revenue.sub": { en: "3 active subscriptions", ar: "3 اشتراكات نشطة" },
  "admin.kpi.revenue.delta": { en: "+SAR 1,999 this month", ar: "+1,999 ريال هذا الشهر" },
  "admin.kpi.buildings": { en: "Total Buildings", ar: "إجمالي المباني" },
  "admin.kpi.buildings.sub": { en: "Across all owners", ar: "عبر جميع الملاك" },
  "admin.kpi.buildings.delta": { en: "+1 this month", ar: "+1 هذا الشهر" },
  "admin.kpi.today_submitted": { en: "Today Submitted", ar: "مرسل اليوم" },
  "admin.kpi.completion": { en: "Completion Rate", ar: "نسبة الإنجاز" },
  "admin.kpi.completion.sub": { en: "Platform average today", ar: "متوسط المنصة اليوم" },
  "admin.kpi.owners": { en: "Total Owners", ar: "إجمالي الملاك" },
  "admin.kpi.owners.sub": { en: "2 active, 1 trial", ar: "2 نشط، 1 تجريبي" },
  "admin.kpi.subs": { en: "Active Subscriptions", ar: "الاشتراكات النشطة" },
  "admin.kpi.subs.sub": { en: "Paying customers", ar: "عملاء مشتركون" },
  "admin.kpi.labour": { en: "Total Labour", ar: "إجمالي العمال" },
  "admin.kpi.labour.sub": { en: "Across 5 buildings", ar: "عبر 5 مباني" },
  "admin.kpi.missed": { en: "Missed Reports", ar: "تقارير فائتة" },
  "admin.kpi.missed.sub": { en: "Today, needs attention", ar: "اليوم، يحتاج انتباه" },
  "admin.kpi.missed.delta": { en: "1 building unassigned", ar: "1 مبنى غير معيّن" },
  "admin.chart.revenue": { en: "Monthly Revenue (SAR)", ar: "الإيراد الشهري (ريال)" },
  "admin.chart.last_6": { en: "Last 6 months", ar: "آخر 6 أشهر" },
  "admin.chart.completion": { en: "Daily Completion Rate %", ar: "نسبة الإنجاز اليومي %" },
  "admin.chart.improving": { en: "improving", ar: "في تحسن" },
  "admin.bstatus.title": { en: "Building Status Today", ar: "حالة المباني اليوم" },
  "admin.labour_activity": { en: "Labour Activity Today", ar: "نشاط العمال اليوم" },
  "admin.subs.title": { en: "Subscriptions", ar: "الاشتراكات" },
  "admin.subs.mrr": { en: "Total MRR", ar: "إجمالي الإيراد الشهري" },
  "admin.recent.reports": { en: "Recent Daily Reports", ar: "آخر التقارير اليومية" },
  "admin.recent.owners": { en: "Active Owners", ar: "الملاك النشطون" },

  // Owner-specific page strings
  "owner.buildings.title": { en: "My Buildings", ar: "مبانيّ" },
  "owner.buildings.subtitle": { en: "All buildings assigned to your account.", ar: "جميع المباني المعيّنة لحسابك." },
  "owner.labour.title": { en: "Labour Accounts", ar: "حسابات العمال" },
  "owner.labour.subtitle": { en: "Manage your labour workforce.", ar: "إدارة فريق عمالك." },
  "owner.assign.title": { en: "Assign Tasks", ar: "تعيين المهام" },
  "owner.assign.subtitle": { en: "Assign daily checklists to labour for each building.", ar: "تعيين قوائم مهام يومية للعمال لكل مبنى." },
  "owner.reports.title": { en: "Today's Reports", ar: "تقارير اليوم" },
  "owner.history.title": { en: "Report History", ar: "سجل التقارير" },
  "owner.subscription.title": { en: "Subscription", ar: "الاشتراك" },
  "owner.settings.title": { en: "Settings", ar: "الإعدادات" },
  "dashboard.owner.nav.logout": { en: "Sign Out", ar: "تسجيل الخروج" },
  "dashboard.owner.more_options": { en: "More Options", ar: "خيارات إضافية" },
  "dashboard.owner.subtitle": { en: "Owner Dashboard", ar: "لوحة المالك" },
  "dashboard.owner.nav.reports": { en: "Today's Reports", ar: "تقارير اليوم" },
  "dashboard.owner.nav.buildings_short": { en: "Buildings", ar: "المباني" },
  "dashboard.owner.nav.tasks_short": { en: "Tasks", ar: "المهام" },
  "dashboard.owner.nav.reports_short": { en: "Reports", ar: "التقارير" },
  "dashboard.labour.desc": { en: "Labour users get a very simple visual dashboard with large task cards, icons, check buttons, and one submit button. No complex menus or technical knowledge required.", ar: "يحصل العمال على لوحة تحكم بسيطة بصرياً ببطاقات مهام كبيرة وأيقونات وأزرار تحقق وزر إرسال واحد. لا توجد قوائم معقدة أو معرفة تقنية مطلوبة." },

  // Solutions & About & Security (Remaining simple ones)
  "sol.title": { en: "Solutions for every building portfolio", ar: "حلول لكل محفظة عقارية" },
  "sol.sub": { en: "Whether you run three towers or three hundred - FacilityOS Arabia adapts.", ar: "سواء تدير ثلاثة أبراج أو ثلاثمئة - تتكيّف فاسيليتي أو إس مع احتياجك." },
  "about.title": { en: "A simpler way to prove daily building work is done.", ar: "طريقة أبسط لإثبات إنجاز أعمال المباني اليومية." },
  "about.body": { en: "FacilityOS Arabia helps building owners assign daily work, track labour checklists, and receive clear reports that show what was completed today.", ar: "فاسيليتي أو إس عربيا تساعد ملاك المباني على تعيين المهام اليومية، متابعة قوائم العمال، واستلام تقارير واضحة توضّح ما تم إنجازه اليوم." },
  "contact.title": { en: "Book a demo", ar: "احجز عرضاً توضيحياً" },
  "contact.sub": { en: "Tell us about your portfolio. We'll respond within one business day.", ar: "أخبرنا عن محفظتك. سنرد خلال يوم عمل واحد." },
  "contact.name": { en: "Full name", ar: "الاسم الكامل" },
  "contact.email": { en: "Work email", ar: "البريد المهني" },
  "contact.company": { en: "Company", ar: "الشركة" },
  "contact.buildings": { en: "Number of buildings", ar: "عدد المباني" },
  "contact.message": { en: "How can we help?", ar: "كيف يمكننا المساعدة؟" },
  "contact.submit": { en: "Request demo", ar: "طلب العرض" },
  "contact.sent": { en: "Thanks - we'll be in touch shortly.", ar: "شكراً - سنتواصل معك قريباً." },
  "sec.page.title": { en: "Security & Compliance", ar: "الأمان والامتثال" },
  "sec.page.sub": { en: "How we protect your buildings, your photos and your tenants.", ar: "كيف نحمي مبانيك وصورك ومستأجريك." },
};

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, options?: { fallback?: string;[key: string]: any }) => string;
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

  const t = (key: string, options?: { fallback?: string;[key: string]: any }) => {
    const entry = dict[key];
    if (!entry) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[i18n] Missing translation key: ${key}`);
      }
      return options?.fallback || key;
    }

    let text = entry[lang];
    if (options) {
      Object.entries(options).forEach(([k, v]) => {
        if (k !== 'fallback' && typeof v === 'string') {
          text = text.replace(new RegExp(`{${k}}`, "g"), v);
        }
      });
    }

    return text;
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

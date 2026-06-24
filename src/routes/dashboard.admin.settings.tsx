import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, Bell, Globe, Monitor, Save } from "lucide-react";
import { PageHeader, Card, Btn, Toast } from "@/components/dashboard/ui";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Admin Dashboard" }] }),
  component: AdminSettings,
});

function AdminSettings() {
  const { t } = useLang();
  const [platformName, setPlatformName] = useState("FacilityOS Arabia");
  const [adminName, setAdminName] = useState("Platform Admin");
  const [adminEmail, setAdminEmail] = useState("admin@facilityos.com");
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState({ email: true, reports: true, payments: true, failures: true });
  const [toast, setToast] = useState<string | null>(null);

  function handleSave() {
    setToast("Settings saved successfully");
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title={t("admin.settings.title", { fallback: "Platform Settings" })} subtitle={t("admin.settings.subtitle", { fallback: "Configure the FacilityOS Arabia platform settings." })} />

      {/* Platform Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-navy/10"><Settings className="h-4 w-4 text-navy" /></div>
          <h3 className="font-display font-semibold">{t("admin.settings.config", { fallback: "Platform Configuration" })}</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t("admin.settings.platform_name", { fallback: "Platform Name" })}</label>
            <input value={platformName} onChange={e => setPlatformName(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
          </div>
          <div className="rounded-xl bg-secondary/50 border border-border px-4 py-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t("admin.settings.notice_title", { fallback: "Admin Access Notice" })}</div>
            <p className="text-sm text-muted-foreground">{t("admin.settings.notice_body", { fallback: "Admin access is restricted to platform management only. This dashboard is not visible to owners or labour users." })}</p>
          </div>
        </div>
      </Card>

      {/* Admin Profile */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-navy/10">
            <span className="text-sm font-bold text-navy">PA</span>
          </div>
          <h3 className="font-display font-semibold">{t("admin.settings.profile", { fallback: "Admin Profile" })}</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t("common.full_name", { fallback: "Full Name" })}</label>
            <input value={adminName} onChange={e => setAdminName(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t("common.email", { fallback: "Email Address" })}</label>
            <input value={adminEmail} onChange={e => setAdminEmail(e.target.value)} type="email"
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t("common.password", { fallback: "Password" })}</label>
            <input value="••••••••" readOnly
              className="h-10 w-full rounded-xl border border-border bg-secondary px-3 text-sm text-muted-foreground cursor-not-allowed" />
            <p className="mt-1 text-xs text-muted-foreground">Password changes are handled through the authentication provider.</p>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-navy/10"><Bell className="h-4 w-4 text-navy" /></div>
          <h3 className="font-display font-semibold">{t("admin.settings.notifications", { fallback: "Notification Preferences" })}</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: "email", label: t("admin.settings.email_notif", { fallback: "Email Notifications" }), desc: t("admin.settings.email_desc", { fallback: "Receive important platform alerts via email" }) },
            { key: "reports", label: t("admin.settings.report_alerts", { fallback: "Daily Report Alerts" }), desc: t("admin.settings.report_desc", { fallback: "Get notified when daily reports are submitted" }) },
            { key: "payments", label: t("admin.settings.payment_conf", { fallback: "Payment Confirmations" }), desc: t("admin.settings.payment_desc", { fallback: "Receive payment success notifications" }) },
            { key: "failures", label: t("admin.settings.failed_alerts", { fallback: "Failed Payment Alerts" }), desc: t("admin.settings.failed_desc", { fallback: "Immediate alert for failed or declined payments" }) },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? "bg-navy" : "bg-secondary border border-border"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${notifications[item.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Language */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-navy/10"><Globe className="h-4 w-4 text-navy" /></div>
          <h3 className="font-display font-semibold">{t("admin.settings.language", { fallback: "Language & Region" })}</h3>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t("admin.settings.interface_lang", { fallback: "Interface Language" })}</label>
          <select value={language} onChange={e => setLanguage(e.target.value)}
            className="h-10 w-full max-w-xs rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition">
            <option>English</option>
            <option>العربية (Arabic)</option>
          </select>
          <p className="mt-1.5 text-xs text-muted-foreground">Arabic (RTL) support is ready for future activation.</p>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Btn onClick={handleSave}>
          <Save className="h-4 w-4" /> {t("common.save", { fallback: "Save Settings" })}
        </Btn>
        <span className="text-xs text-muted-foreground">Frontend demo — changes are not persisted across sessions.</span>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-elevated">
          <Save className="h-4 w-4" /> {toast}
        </div>
      )}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Settings, Bell, Globe, Save } from "lucide-react";
import { PageHeader, Card, Btn, Toast } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api-client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/admin/settings")({
  head: () => ({ meta: [{ title: "Settings - Admin Dashboard" }] }),
  component: AdminSettings,
});

function AdminSettings() {
  const { t } = useLang();
  const [platformName, setPlatformName] = useState("FacilityOS Arabia");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState({
    email: true,
    reports: true,
    payments: true,
    failures: true,
  });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ user: any }>("/api/auth/me")
      .then((result) => {
        setAdminName(result.user?.name || "Platform Admin");
        setAdminEmail(result.user?.email || "");
      })
      .catch(() => {});
  }, []);

  function handleSave() {
    setToast("Settings saved");
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title={t("admin.settings.title", { fallback: "Platform Settings" })}
        subtitle={t("admin.settings.subtitle", {
          fallback: "Configure the FacilityOS Arabia platform settings.",
        })}
      />

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-navy/10">
            <Settings className="h-4 w-4 text-navy" />
          </div>
          <h3 className="font-display font-semibold">
            {t("admin.settings.config", { fallback: "Platform Configuration" })}
          </h3>
        </div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {t("admin.settings.platform_name", { fallback: "Platform Name" })}
        </label>
        <input
          value={platformName}
          onChange={(event) => setPlatformName(event.target.value)}
          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <div className="mt-4 rounded-xl border border-border bg-secondary/50 px-4 py-3">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("admin.settings.notice_title", { fallback: "Admin Access Notice" })}
          </div>
          <p className="text-sm text-muted-foreground">
            {t("admin.settings.notice_body", {
              fallback:
                "Admin access is restricted to platform management only. This dashboard is not visible to owners or labour users.",
            })}
          </p>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-navy/10">
            <span className="text-sm font-bold text-navy">
              {adminName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2) || "PA"}
            </span>
          </div>
          <h3 className="font-display font-semibold">
            {t("admin.settings.profile", { fallback: "Admin Profile" })}
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              {t("common.full_name", { fallback: "Full Name" })}
            </label>
            <input
              value={adminName}
              onChange={(event) => setAdminName(event.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              {t("common.email", { fallback: "Email Address" })}
            </label>
            <input
              value={adminEmail}
              onChange={(event) => setAdminEmail(event.target.value)}
              type="email"
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-navy/10">
            <Bell className="h-4 w-4 text-navy" />
          </div>
          <h3 className="font-display font-semibold">
            {t("admin.settings.notifications", { fallback: "Notification Preferences" })}
          </h3>
        </div>
        <div className="space-y-3">
          {[
            { key: "email", label: "Email Notifications" },
            { key: "reports", label: "Daily Report Alerts" },
            { key: "payments", label: "Payment Confirmations" },
            { key: "failures", label: "Failed Payment Alerts" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between border-b border-border py-2 last:border-0"
            >
              <div className="text-sm font-medium">{item.label}</div>
              <button
                onClick={() =>
                  setNotifications((current) => ({
                    ...current,
                    [item.key]: !current[item.key as keyof typeof current],
                  }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? "bg-navy" : "border border-border bg-secondary"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-navy/10">
            <Globe className="h-4 w-4 text-navy" />
          </div>
          <h3 className="font-display font-semibold">
            {t("admin.settings.language", { fallback: "Language & Region" })}
          </h3>
        </div>
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className="h-10 w-full max-w-xs rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          <option>English</option>
          <option>Arabic</option>
        </select>
      </Card>

      <div className="flex items-center gap-3">
        <Btn onClick={handleSave}>
          <Save className="h-4 w-4" /> {t("common.save", { fallback: "Save Settings" })}
        </Btn>
        <span className="text-xs text-muted-foreground">
          Persistence can be connected to a platform settings API when needed.
        </span>
      </div>

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
}

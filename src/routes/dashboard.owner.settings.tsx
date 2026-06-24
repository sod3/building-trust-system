import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, User, Bell, Globe } from "lucide-react";
import { PageHeader, Card } from "@/components/dashboard/ui";
import { useAuth } from "@/lib/auth-context";
import { mockOwners } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/owner/settings")({
  head: () => ({ meta: [{ title: "Settings — Owner Dashboard" }] }),
  component: OwnerSettings,
});

function OwnerSettings() {
  const { user } = useAuth();
  const owner = mockOwners.find(o => o.id === user?.ownerId) || mockOwners[0];
  const [name, setName] = useState(owner.name);
  const [company, setCompany] = useState(owner.company);
  const [phone, setPhone] = useState(owner.phone);
  const [email, setEmail] = useState(owner.email);
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState({ email: true, reports: true, overdue: true });
  const [toast, setToast] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your profile and preferences." />

      {/* Profile */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-white font-bold">
            {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div className="font-semibold">{name}</div>
            <div className="text-xs text-muted-foreground">{owner.plan} Owner</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Company Name</label>
              <input value={company} onChange={e => setCompany(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-navy/10"><Bell className="h-4 w-4 text-navy" /></div>
          <h3 className="font-display font-semibold">Notifications</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: "email", label: "Email Notifications", desc: "Receive daily summary emails" },
            { key: "reports", label: "Report Alerts", desc: "Get notified when labour submits reports" },
            { key: "overdue", label: "Overdue Task Alerts", desc: "Alert if tasks are not completed by EOD" },
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
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Language */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-navy/10"><Globe className="h-4 w-4 text-navy" /></div>
          <h3 className="font-display font-semibold">Language</h3>
        </div>
        <select value={language} onChange={e => setLanguage(e.target.value)}
          className="h-10 w-full max-w-xs rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition">
          <option>English</option>
          <option>العربية (Arabic)</option>
        </select>
      </Card>

      <div className="flex items-center gap-3">
        <button
          onClick={() => { setToast(true); setTimeout(() => setToast(false), 3000); }}
          className="flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy/90 transition"
        >
          <Save className="h-4 w-4" /> Save Changes
        </button>
        <span className="text-xs text-muted-foreground">Frontend demo — not persisted across sessions.</span>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-elevated">
          <Save className="h-4 w-4" /> Settings saved successfully
        </div>
      )}
    </div>
  );
}

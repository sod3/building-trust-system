import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, StatusPill } from "@/components/dashboard/ui";
import { auditLogs } from "@/lib/mock-data";
import { useState } from "react";

const tabs = ["Company","Roles & permissions","Language","Notifications","Reports","Data privacy","Branding","Audit logs"] as const;

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [tab, setTab] = useState<typeof tabs[number]>("Company");
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Workspace configuration, roles, language, branding and audit logs." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        <Card className="!p-2">
          <nav className="space-y-0.5">
            {tabs.map(t => (
              <button key={t} onClick={()=>setTab(t)} className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${tab===t?"bg-navy text-primary-foreground":"hover:bg-secondary"}`}>{t}</button>
            ))}
          </nav>
        </Card>
        <Card>
          {tab === "Company" && (
            <div className="space-y-4">
              <h3 className="font-display text-base font-semibold">Company settings</h3>
              <Row label="Company name"><input className="field" defaultValue="Riyadh OS Operations Co." /></Row>
              <Row label="Trade license"><input className="field" defaultValue="CR-1010234567" /></Row>
              <Row label="VAT number"><input className="field" defaultValue="300123456700003" /></Row>
              <Row label="HQ city"><input className="field" defaultValue="Riyadh" /></Row>
              <button className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-navy/90">Save changes</button>
            </div>
          )}
          {tab === "Roles & permissions" && (
            <div>
              <h3 className="font-display text-base font-semibold">Who can see what</h3>
              <table className="mt-4 w-full text-sm">
                <thead className="text-left text-[11px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-2">Role</th><th className="pb-2">Access</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["Super Admin","All platform data"],
                    ["Property Admin","Assigned company / buildings"],
                    ["Owner","Read-only assigned buildings"],
                    ["Supervisor","Assigned buildings + approvals"],
                    ["Labor","Only assigned tasks"],
                    ["Tenant","Only own complaint status"],
                  ].map(r=>(
                    <tr key={r[0]}><td className="py-2.5 font-medium">{r[0]}</td><td className="py-2.5 text-muted-foreground">{r[1]}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {tab === "Language" && (
            <div className="space-y-3">
              <h3 className="font-display text-base font-semibold">Language & locale</h3>
              <Row label="Default language"><select className="field"><option>English</option><option>العربية</option></select></Row>
              <Row label="Calendar"><select className="field"><option>Gregorian</option><option>Hijri</option><option>Both</option></select></Row>
              <Row label="Currency"><input className="field" defaultValue="SAR" /></Row>
            </div>
          )}
          {tab === "Notifications" && (
            <div className="space-y-3">
              <h3 className="font-display text-base font-semibold">Notification channels</h3>
              {["Owner weekly summary","Supervisor overdue alerts","Tenant complaint updates","WhatsApp notifications"].map(c=>(
                <label key={c} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                  <span>{c}</span><input defaultChecked type="checkbox" className="h-4 w-4 accent-[oklch(0.55_0.11_245)]" />
                </label>
              ))}
            </div>
          )}
          {tab === "Reports" && (
            <div className="space-y-3">
              <h3 className="font-display text-base font-semibold">Report scheduling</h3>
              <Row label="Owner monthly PDF"><select className="field"><option>1st of every month</option><option>Last day of month</option></select></Row>
              <Row label="Auto-email to owners"><label className="text-xs"><input type="checkbox" defaultChecked className="mr-2" />Enabled</label></Row>
              <Row label="Include photo proof"><label className="text-xs"><input type="checkbox" defaultChecked className="mr-2" />Yes (up to 20 photos)</label></Row>
            </div>
          )}
          {tab === "Data privacy" && (
            <div className="space-y-3 text-sm">
              <h3 className="font-display text-base font-semibold">Data privacy</h3>
              <p className="text-muted-foreground">Designed to support privacy-conscious and access-controlled operations.</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Role-based access control</li>
                <li>Encrypted storage of photos & PII</li>
                <li>Tenant data scoped to building team only</li>
                <li>Owners get read-only access - no PII downloads</li>
                <li>PDPL-aware data handling</li>
              </ul>
            </div>
          )}
          {tab === "Branding" && (
            <div className="space-y-3">
              <h3 className="font-display text-base font-semibold">Branding</h3>
              <Row label="Logo"><div className="grid h-20 w-32 place-items-center rounded-md border border-dashed border-border text-xs text-muted-foreground">Upload logo</div></Row>
              <Row label="Primary color"><input type="color" defaultValue="#0f1b3d" className="h-9 w-20 rounded-md border border-border" /></Row>
              <Row label="Report cover"><div className="grid h-20 w-full place-items-center rounded-md border border-dashed border-border text-xs text-muted-foreground">Upload owner report cover</div></Row>
            </div>
          )}
          {tab === "Audit logs" && (
            <div>
              <h3 className="font-display text-base font-semibold">Audit logs</h3>
              <table className="mt-4 w-full text-sm">
                <thead className="text-left text-[11px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-2">User</th><th className="pb-2">Action</th><th className="pb-2">Module</th><th className="pb-2">Time</th><th className="pb-2">IP</th><th className="pb-2">Status</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {auditLogs.map(l => (
                    <tr key={l.id}>
                      <td className="py-2.5 font-medium">{l.user}</td>
                      <td className="py-2.5 text-muted-foreground">{l.action}</td>
                      <td className="py-2.5 text-muted-foreground">{l.module}</td>
                      <td className="py-2.5 text-muted-foreground">{l.time}</td>
                      <td className="py-2.5 text-muted-foreground">{l.ip}</td>
                      <td className="py-2.5"><StatusPill status={l.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
      <style>{`.field{height:36px;width:100%;border-radius:8px;border:1px solid var(--border);background:var(--background);padding:0 10px;font-size:13px;outline:none}.field:focus{box-shadow:0 0 0 2px oklch(0.55 0.11 245 / 0.25)}`}</style>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-3">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div>{children}</div>
    </div>
  );
}

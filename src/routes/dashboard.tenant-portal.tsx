import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QrCode, Camera, Check, Building2 } from "lucide-react";
import { Card, PageHeader } from "@/components/dashboard/ui";

export const Route = createFileRoute("/dashboard/tenant-portal")({
  component: TenantPortal,
});

function TenantPortal() {
  const [submitted, setSubmitted] = useState(false);
  const ticket = "CMP-2026-0049";

  return (
    <div className="space-y-6">
      <PageHeader title="Tenant Complaint Portal" subtitle="Tenants scan a QR sticker in the lobby - no login required. Each complaint becomes a tracked ticket." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        {/* Phone-style portal */}
        <Card className="!p-0 overflow-hidden">
          <div className="bg-navy-gradient p-6 text-white">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/60">
              <QrCode className="h-3.5 w-3.5" /> Scanned via QR
            </div>
            <h2 className="mt-1 font-display text-2xl font-semibold">Riyadh Tower A</h2>
            <p className="mt-1 text-sm text-white/70">Submit a complaint. Building team will respond and you'll get a ticket number to track progress.</p>
          </div>

          {!submitted ? (
            <form onSubmit={e=>{ e.preventDefault(); setSubmitted(true); }} className="space-y-3 p-6">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Building"><input className="field" defaultValue="Riyadh Tower A" /></Field>
                <Field label="Unit number"><input className="field" defaultValue="412" /></Field>
                <Field label="Your name"><input className="field" placeholder="Ali Hassan" defaultValue="Ali Hassan" /></Field>
                <Field label="Phone"><input className="field" placeholder="+966 5..." defaultValue="+966 56 999 0001" /></Field>
                <Field label="Category">
                  <select className="field">
                    <option>Elevator</option><option>Plumbing</option><option>Electrical</option>
                    <option>Cleaning</option><option>Security</option><option>Parking</option><option>Water</option>
                  </select>
                </Field>
                <Field label="Priority">
                  <select className="field"><option>Medium</option><option>High</option><option>Low</option></select>
                </Field>
              </div>
              <Field label="Describe the issue">
                <textarea className="field h-24" defaultValue="Elevator A is making loud noises and stopping between floors 5 and 6." />
              </Field>
              <Field label="Add a photo (optional)">
                <div className="grid h-28 place-items-center rounded-xl border-2 border-dashed border-border bg-secondary/40 text-muted-foreground">
                  <div className="text-center text-xs"><Camera className="mx-auto h-5 w-5" /><div className="mt-1">Tap to upload</div></div>
                </div>
              </Field>
              <button className="mt-2 w-full rounded-xl bg-navy py-3 font-display text-base font-semibold text-primary-foreground hover:bg-navy/90">Submit complaint</button>
              <div className="text-center text-[11px] text-muted-foreground">No login. Your data is kept private.</div>
            </form>
          ) : (
            <div className="space-y-4 p-6">
              <div className="grid place-items-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-8 w-8" /></div>
                <div className="mt-3 font-display text-xl font-semibold">Complaint submitted</div>
                <div className="mt-1 text-sm text-muted-foreground">Building team has been notified. Save this ticket:</div>
                <div className="mt-2 rounded-xl bg-navy px-4 py-2 font-display text-lg font-semibold text-primary-foreground">{ticket}</div>
              </div>

              <div className="rounded-2xl border border-border p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status timeline</div>
                <ol className="mt-3 relative ml-2 space-y-3 border-l border-border pl-4">
                  <Step time="Received"   desc="11:42 - your complaint reached the building" done />
                  <Step time="Assigned"   desc="11:45 - routed to Supervisor Khalid Al-Otaibi" done />
                  <Step time="In progress" desc="Technician dispatched, ETA 15 min" />
                  <Step time="Resolved"   desc="You'll be notified by SMS / WhatsApp" />
                </ol>
              </div>

              <button onClick={()=>setSubmitted(false)} className="w-full rounded-xl border border-border py-2.5 text-sm hover:bg-secondary">Submit another</button>
            </div>
          )}
          <style>{`.field-wrap{display:block}.field{height:38px;width:100%;border-radius:10px;border:1px solid var(--border);background:var(--background);padding:0 12px;font-size:13px;outline:none}.field:focus{box-shadow:0 0 0 2px oklch(0.55 0.11 245 / 0.25)}textarea.field{height:auto;padding:10px 12px}`}</style>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-navy text-primary-foreground"><QrCode className="h-6 w-6" /></div>
              <div>
                <div className="font-display text-base font-semibold">QR-first</div>
                <div className="text-xs text-muted-foreground">Tenants scan a sticker → file complaint in 30 seconds. No app install, no login.</div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="font-display text-base font-semibold">Why this matters</div>
            <ul className="mt-3 space-y-2 text-sm">
              <Bullet>Every complaint becomes a tracked ticket with an audit trail</Bullet>
              <Bullet>Owner & supervisor see the same status the tenant sees</Bullet>
              <Bullet>SLA timers prevent complaints from sitting in WhatsApp</Bullet>
              <Bullet>Tenants get auto-updates by SMS / WhatsApp (add-on)</Bullet>
            </ul>
          </Card>
          <Card className="bg-navy-gradient !text-white">
            <div className="text-[10px] uppercase tracking-wider text-white/70">Print-ready</div>
            <div className="mt-1 font-display text-base font-semibold">Lobby sticker pack</div>
            <p className="mt-1 text-xs text-white/70">We ship A5 QR stickers in Arabic + English for every building.</p>
            <div className="mt-3 grid place-items-center rounded-xl bg-white p-4">
              <div className="grid h-24 w-24 place-items-center rounded-md bg-navy"><QrCode className="h-12 w-12 text-white" /></div>
              <div className="mt-2 text-[10px] font-semibold text-navy">SCAN TO REPORT ISSUE</div>
              <div className="text-[8px] text-navy/70 flex items-center gap-1"><Building2 className="h-2.5 w-2.5" />Riyadh Tower A</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
function Step({ time, desc, done }: { time: string; desc: string; done?: boolean }) {
  return (
    <li className="relative">
      <span className={`absolute -left-[22px] top-1 grid h-3 w-3 rounded-full ring-4 ring-card ${done ? "bg-emerald-500" : "bg-border"}`} />
      <div className="text-xs font-semibold">{time}</div>
      <div className="text-[11px] text-muted-foreground">{desc}</div>
    </li>
  );
}
function Bullet({ children }: { children: React.ReactNode }) {
  return <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /><span>{children}</span></li>;
}

import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, StatusPill } from "@/components/dashboard/ui";
import { billing } from "@/lib/mock-data";
import { CreditCard, Download, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/billing")({
  component: BillingPage,
});

function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Billing" subtitle="Manage your subscription, usage and invoices. All prices in SAR." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-navy-gradient !text-white">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-white/60">Current plan</div>
              <h2 className="font-display text-3xl font-semibold">{billing.plan} · <span className="text-gold">{billing.price}</span></h2>
              <p className="mt-1 text-sm text-white/70">Best for property management companies running multiple portfolios.</p>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-white/90">Upgrade plan <ArrowUpRight className="h-4 w-4" /></button>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Meter label="Buildings" used={billing.buildingsUsed} total={billing.buildingsLimit} />
            <Meter label="Users" used={billing.usersUsed} total={billing.usersLimit} />
            <Meter label="Storage (GB)" used={billing.storageUsed} total={billing.storageLimit} />
          </div>
        </Card>
        <Card>
          <div className="font-display text-sm font-semibold">Active add-ons</div>
          <ul className="mt-3 space-y-2 text-sm">
            {billing.addons.map(a => (
              <li key={a} className="flex items-center justify-between rounded-lg border border-border p-2">
                <span>{a}</span><StatusPill status="active" />
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full rounded-md border border-border py-2 text-sm hover:bg-secondary">Browse add-ons</button>
        </Card>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-accent" /><div className="font-display text-sm font-semibold">Invoice history</div></div>
          <button className="inline-flex items-center gap-1 text-xs text-accent hover:underline"><Download className="h-3 w-3" />Export all</button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-5 py-3">Invoice</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {billing.invoices.map(inv => (
              <tr key={inv.id}>
                <td className="px-5 py-3 font-medium">{inv.id}</td>
                <td className="px-5 py-3 text-muted-foreground">{inv.date}</td>
                <td className="px-5 py-3 text-muted-foreground">{inv.amount}</td>
                <td className="px-5 py-3"><StatusPill status={inv.status} /></td>
                <td className="px-5 py-3 text-right"><button className="text-xs text-accent hover:underline">Download</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Meter({ label, used, total }: { label: string; used: number; total: number }) {
  const pct = Math.round(used/total*100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-white/70"><span>{label}</span><span className="font-medium text-white">{used} / {total}</span></div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

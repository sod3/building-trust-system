import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, StatusPill } from "@/components/dashboard/ui";
import { users, complaints } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/tenants")({
  component: TenantsPage,
});

function TenantsPage() {
  const tenants = users.filter(u => u.role === "tenant");
  return (
    <div className="space-y-6">
      <PageHeader title="Tenants" subtitle="Tenants who have submitted complaints via the QR portal. No login required for them - only the building team sees this list." />
      <Card className="!p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Tenant</th><th className="px-4 py-3">Unit</th><th className="px-4 py-3">Building</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Complaints</th><th className="px-4 py-3">Open</th><th className="px-4 py-3">Last activity</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tenants.map(t => {
              const tc = complaints.filter(c=>c.tenant===t.name);
              return (
                <tr key={t.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{tc[0]?.unit || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{tc[0]?.building || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.phone}</td>
                  <td className="px-4 py-3 text-muted-foreground">{tc.length}</td>
                  <td className="px-4 py-3"><StatusPill status={tc.filter(c=>c.status==="open"||c.status==="in-progress").length ? "open" : "resolved"} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{t.lastActive}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

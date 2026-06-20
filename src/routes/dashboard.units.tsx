import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, StatusPill } from "@/components/dashboard/ui";
import { buildings } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/units")({
  component: UnitsPage,
});

const seedUnits = (b: typeof buildings[number]) =>
  Array.from({ length: Math.min(b.units, 8) }).map((_, i) => ({
    id: `${b.id}-U${(i+1).toString().padStart(3,"0")}`,
    floor: Math.floor(i/4)+1,
    tenant: ["Ali Hassan","Mariam Saleh","Abdullah Nasser","Vacant","Faisal Omar","Layla Ibrahim","Khaled Sami","Vacant"][i],
    occupancy: ["Occupied","Occupied","Occupied","Vacant","Occupied","Occupied","Occupied","Vacant"][i],
    complaints: (i*3) % 5,
    lastInspection: `${(i%9)+10} Jun 2026`,
    qr: i % 3 !== 0 ? "Active" : "Pending",
  }));

function UnitsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Floors & Units" subtitle="Drill into every unit — tenant assignment, complaints, last inspection, QR status." />
      <div className="space-y-6">
        {buildings.slice(0,3).map(b => {
          const units = seedUnits(b);
          return (
            <Card key={b.id}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{b.id}</div>
                  <h3 className="font-display text-base font-semibold">{b.name}</h3>
                </div>
                <div className="text-xs text-muted-foreground">{b.floors} floors · {b.units} units</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <tr><th className="pb-2">Unit</th><th className="pb-2">Floor</th><th className="pb-2">Tenant</th><th className="pb-2">Occupancy</th><th className="pb-2">Complaints</th><th className="pb-2">Last inspection</th><th className="pb-2">QR</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {units.map(u => (
                      <tr key={u.id}>
                        <td className="py-3 font-medium">{u.id}</td>
                        <td className="py-3 text-muted-foreground">{u.floor}</td>
                        <td className="py-3 text-muted-foreground">{u.tenant}</td>
                        <td className="py-3"><StatusPill status={u.occupancy === "Occupied" ? "active" : "inactive"} /></td>
                        <td className="py-3 text-muted-foreground">{u.complaints}</td>
                        <td className="py-3 text-muted-foreground">{u.lastInspection}</td>
                        <td className="py-3"><StatusPill status={u.qr === "Active" ? "approved" : "pending"} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

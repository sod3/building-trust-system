import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClipboardCheck, Search } from "lucide-react";
import { PageHeader, Card, EmptyState, StatusPill } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api-client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/admin/checklists")({
  head: () => ({ meta: [{ title: "Checklist Templates - Admin Dashboard" }] }),
  component: AdminChecklists,
});

function AdminChecklists() {
  const { t } = useLang();
  const [templates, setTemplates] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiFetch<{ templates: any[] }>("/api/checklist-templates")
      .then((result) => setTemplates(result.templates || []))
      .catch(() => setTemplates([]));
  }, []);

  const filtered = templates.filter((template) =>
    [template.name, template.orgId, template.buildingId].join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.admin.nav.templates", { fallback: "Checklist Templates" })}
        subtitle={t("admin.checklists.subtitle", { fallback: "Create and manage daily task templates for buildings and labour." })}
      />

      <Card>
        <div className="relative min-w-48 flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search templates..." className="h-9 w-full rounded-xl border border-border bg-background px-9 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card><EmptyState icon={<ClipboardCheck className="h-6 w-6" />} title="No templates yet" body="Professional and Enterprise owners can create checklist templates." /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <Card key={template._id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-lg font-semibold">{template.name}</div>
                  <div className="text-xs text-muted-foreground">Org: {template.orgId}</div>
                </div>
                <StatusPill status={`${template.items?.length || 0} tasks`} />
              </div>
              <div className="mt-4 space-y-2">
                {(template.items || []).slice(0, 6).map((item: any) => (
                  <div key={`${template._id}-${item.order}-${item.title}`} className="rounded-xl bg-secondary px-3 py-2 text-sm">
                    {item.title}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

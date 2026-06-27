import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, UserX, Users } from "lucide-react";
import {
  PageHeader,
  Card,
  StatusPill,
  ProgressBar,
  Modal,
  FormInput,
  FormSelect,
  Btn,
  Toast,
  EmptyState,
} from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api-client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/owner/labour")({
  head: () => ({ meta: [{ title: "Labour - Owner Dashboard" }] }),
  component: OwnerLabour,
});

function OwnerLabour() {
  const { t } = useLang();
  const [dashboard, setDashboard] = useState<any | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    buildingId: "",
  });

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  function load() {
    apiFetch<any>("/api/owner/overview")
      .then(setDashboard)
      .catch((error) =>
        showToast(error instanceof Error ? error.message : "Could not load labour.", "error"),
      );
  }

  useEffect(load, []);

  async function handleAdd() {
    try {
      const result = await apiFetch<{ labour: any; temporaryPassword?: string }>("/api/labour", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          password: form.password,
          assignedBuildingIds: form.buildingId ? [form.buildingId] : [],
        }),
      });
      setShowAdd(false);
      setForm({ name: "", phone: "", email: "", password: "", buildingId: "" });
      showToast(
        result.temporaryPassword
          ? `Labour added. Temporary password: ${result.temporaryPassword}`
          : "Labour added successfully.",
      );
      load();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not add labour.", "error");
    }
  }

  async function handleDelete(id: string, name: string) {
    try {
      await apiFetch(`/api/labour/${encodeURIComponent(id)}`, { method: "DELETE" });
      showToast(`${name} removed from your team.`);
      load();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not remove labour.", "error");
    }
  }

  const labour = dashboard?.labour || [];
  const buildings = dashboard?.buildings || [];
  const usage = dashboard?.usage || {};
  const labourLimitReached =
    usage.labourLimit !== null &&
    usage.labourLimit !== undefined &&
    usage.labourUsersUsed >= usage.labourLimit;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.owner.nav.labour", { fallback: "My Labour" })}
        subtitle={`${usage.labourUsersUsed || 0} / ${usage.labourLimit ?? "Unlimited"} labour accounts in your current plan.`}
        actions={
          <Btn onClick={() => setShowAdd(true)} disabled={labourLimitReached}>
            <Plus className="h-4 w-4" /> {t("admin.labour.add", { fallback: "Add Labour" })}
          </Btn>
        }
      />

      {labourLimitReached && (
        <Card className="border-amber-200 bg-amber-50 text-sm text-amber-900">
          {dashboard?.plan?.slug === "starter"
            ? "Your Starter plan includes 1 labour account. Upgrade to Professional for multiple labour accounts."
            : "Your plan labour limit has been reached. Upgrade to Enterprise for unlimited labour accounts."}
        </Card>
      )}

      {labour.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title={t("owner.labour.empty_title", { fallback: "No labour assigned yet" })}
            body={t("owner.labour.empty_desc", {
              fallback: "Add labour workers to your buildings to start tracking daily tasks.",
            })}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {labour.map((worker: any) => (
            <Card key={worker.id} className="hover:shadow-elevated transition-all">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy/10 text-sm font-bold text-navy">
                  {worker.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{worker.name}</div>
                  <div className="text-xs text-muted-foreground">{worker.phone}</div>
                  <div className="mt-1.5">
                    <StatusPill status={worker.todayStatus} />
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("common.building", { fallback: "Building" })}
                  </span>
                  <span className="font-medium">{worker.buildingName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {t("admin.labour.tasks_today", { fallback: "Tasks today" })}
                  </span>
                  <span className="font-semibold">
                    {worker.completedTasksToday}/{worker.totalTasksToday}
                  </span>
                </div>
                <ProgressBar
                  value={worker.completedTasksToday}
                  max={worker.totalTasksToday || 1}
                  color={
                    worker.completedTasksToday === worker.totalTasksToday && worker.totalTasksToday
                      ? "emerald"
                      : worker.completedTasksToday > 0
                        ? "amber"
                        : "rose"
                  }
                />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("owner.labour.last_active", { fallback: "Last active" })}
                  </span>
                  <span>
                    {worker.lastSubmission === "Never"
                      ? "Never"
                      : new Date(worker.lastSubmission).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Btn
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    showToast(`${worker.name}'s checklist data is loaded from daily reports.`)
                  }
                >
                  {t("admin.labour.view_checklist", { fallback: "View Checklist" })}
                </Btn>
                <Btn size="sm" variant="ghost" onClick={() => handleDelete(worker.id, worker.name)}>
                  <UserX className="h-3.5 w-3.5" />
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title={t("admin.labour.add", { fallback: "Add Labour" })}
      >
        <div className="space-y-4">
          <FormInput
            label={t("common.full_name", { fallback: "Full Name" })}
            value={form.name}
            onChange={(value) => setForm((current) => ({ ...current, name: value }))}
            placeholder="Ali Hassan"
            required
          />
          <FormInput
            label={t("common.phone", { fallback: "Phone" })}
            value={form.phone}
            onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
            placeholder="+966 53 000 0000"
            required
          />
          <FormInput
            label={t("common.email", { fallback: "Email" })}
            value={form.email}
            onChange={(value) => setForm((current) => ({ ...current, email: value }))}
            placeholder="ali@example.com"
            type="email"
            required
          />
          <FormInput
            label="Password"
            value={form.password}
            onChange={(value) => setForm((current) => ({ ...current, password: value }))}
            placeholder="Leave blank to generate"
            type="password"
          />
          <FormSelect
            label={t("admin.labour.assign_building", { fallback: "Assign to Building" })}
            value={form.buildingId}
            onChange={(value) => setForm((current) => ({ ...current, buildingId: value }))}
            options={[
              { value: "", label: "Select Building" },
              ...buildings.map((building: any) => ({ value: building.id, label: building.name })),
            ]}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>
              {t("common.cancel", { fallback: "Cancel" })}
            </Btn>
            <Btn onClick={handleAdd} disabled={!form.name || !form.phone || !form.email}>
              {t("admin.labour.add", { fallback: "Add Labour" })}
            </Btn>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

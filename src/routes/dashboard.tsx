import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { RoleProvider } from "@/lib/role-context";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Riyadh OS - Dashboard" }] }),
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <RoleProvider>
      <div className="flex h-[100dvh] w-full bg-surface-2/40">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </RoleProvider>
  );
}

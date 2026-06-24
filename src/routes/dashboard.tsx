import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — FacilityOS Arabia" }] }),
  component: DashboardLayout,
});

function DashboardLayout() {
  return <Outlet />;
}

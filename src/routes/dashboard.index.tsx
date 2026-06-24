import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Building2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate({ to: "/login" });
    } else if (user.role === "admin") {
      navigate({ to: "/dashboard/admin" });
    } else if (user.role === "owner") {
      navigate({ to: "/dashboard/owner" });
    } else {
      navigate({ to: "/dashboard/labour" });
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-navy">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div className="h-4 w-4 rounded-full border-2 border-navy/20 border-t-navy animate-spin" />
      </div>
    </div>
  );
}

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Role } from "./mock-data";

interface Ctx {
  role: Role;
  setRole: (r: Role) => void;
}
const RoleCtx = createContext<Ctx | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("super-admin");
  return <RoleCtx.Provider value={{ role, setRole }}>{children}</RoleCtx.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleCtx);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}

export const roleLabel: Record<Role, string> = {
  "super-admin": "Super Admin",
  "property-admin": "Property Admin",
  owner: "Owner",
  supervisor: "Supervisor",
  labor: "Labor",
  tenant: "Tenant",
};

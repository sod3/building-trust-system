// Simplified role context — now wraps AuthContext for backward compat
// The real auth state lives in AuthContext (auth-context.tsx)
import { useAuth } from "./auth-context";
export type { AppRole as Role } from "./mock-data";

export function useRole() {
  const { user } = useAuth();
  return {
    role: user?.role ?? "admin",
    setRole: (_r: string) => {}, // no-op in new system
  };
}

export const roleLabel: Record<string, string> = {
  admin: "Admin",
  owner: "Owner",
  labour: "Labour",
};

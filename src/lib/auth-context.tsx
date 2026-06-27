import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AUTH_USER_KEY, apiFetch, clearAuthSession, storeAuthSession } from "./api-client";

export type AppRole = "admin" | "owner" | "labour" | "supervisor";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  systemRole?: string;
  orgId?: string | null;
  ownerId?: string;
  labourId?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  login: (
    email: string,
    password: string,
    remember?: boolean,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      try {
        const stored = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY);
        if (stored && !cancelled) setUser(JSON.parse(stored));
      } catch {
        // Ignore invalid browser storage.
      }

      try {
        const result = await apiFetch<{ user: AuthUser }>("/api/auth/me");
        if (!cancelled) {
          setUser(result.user);
          storeAuthSession(result.user, undefined, true);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          clearAuthSession();
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(
    email: string,
    password: string,
    remember = false,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await apiFetch<{ token: string; user: AuthUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setUser(result.user);
      storeAuthSession(result.user, result.token, remember);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Invalid email or password. Please check your credentials.",
      };
    }
  }

  function logout() {
    setUser(null);
    clearAuthSession();
    apiFetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export const demoCredentials: Record<
  AppRole,
  { email: string; password: string; label: string; description: string }
> = {
  admin: {
    email: "admin@facilityos.com",
    password: "admin123",
    label: "Admin",
    description: "Platform control center",
  },
  owner: {
    email: "owner@building.com",
    password: "owner123",
    label: "Owner",
    description: "Paid owner account",
  },
  labour: {
    email: "labour@building.com",
    password: "labour123",
    label: "Labour",
    description: "Assigned building worker",
  },
  supervisor: {
    email: "supervisor@facilityos.com",
    password: "supervisor123",
    label: "Supervisor",
    description: "Coming soon",
  },
};

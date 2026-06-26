// FacilityOS Arabia — Authentication Context
// Frontend-only mock auth. No backend. No real auth library.
// Credentials are checked against mockAuthUsers in mock-data.ts

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { AppRole, MockAuthUser } from "./mock-data";
import { mockAuthUsers } from "./mock-data";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  apiFetch,
  clearAuthSession,
  storeAuthSession,
} from "./api-client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  ownerId?: string;
  labourId?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  login: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from browser storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string, remember = false): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await apiFetch<{ token: string; user: AuthUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setUser(result.user);
      storeAuthSession(result.user, result.token, remember);
      return { success: true };
    } catch {
      // Keep demo credentials available when backend env vars are not configured locally.
    }

    const found = mockAuthUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, error: "Invalid email or password. Please check your credentials." };
    }
    const authUser: AuthUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      ownerId: found.ownerId,
      labourId: found.labourId,
    };
    setUser(authUser);
    try {
      sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      // ignore
    }
    return { success: true };
  }

  function logout() {
    setUser(null);
    clearAuthSession();
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

// Helper to get demo credentials for quick login buttons
export const demoCredentials: Record<AppRole, { email: string; password: string; label: string; description: string }> = {
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
    description: "Ahmed Al-Farsi · 3 Buildings",
  },
  labour: {
    email: "labour@building.com",
    password: "labour123",
    label: "Labour",
    description: "Ali Hassan · Riyadh Tower A",
  },
};

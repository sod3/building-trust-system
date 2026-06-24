// FacilityOS Arabia — Authentication Context
// Frontend-only mock auth. No backend. No real auth library.
// Credentials are checked against mockAuthUsers in mock-data.ts

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { AppRole, MockAuthUser } from "./mock-data";
import { mockAuthUsers } from "./mock-data";

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
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

const SESSION_KEY = "facilityos_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  function login(email: string, password: string): { success: boolean; error?: string } {
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
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    } catch {
      // ignore
    }
    return { success: true };
  }

  function logout() {
    setUser(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
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

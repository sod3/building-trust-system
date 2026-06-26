import type { AuthUser } from "./auth-context";

export const AUTH_USER_KEY = "facilityos_auth_user";
export const AUTH_TOKEN_KEY = "facilityos_auth_token";

export type ApiResult<T> = T & {
  success: boolean;
  message?: string;
};

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function storeAuthSession(user: AuthUser, token?: string | null, remember = false) {
  if (typeof window === "undefined") return;
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  if (token) storage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(AUTH_USER_KEY);
    storage.removeItem(AUTH_TOKEN_KEY);
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  const token = getAuthToken();
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(path, { ...init, headers });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload;
}

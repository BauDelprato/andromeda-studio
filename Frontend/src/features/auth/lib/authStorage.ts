import type { AuthSession } from "../types/auth";

export const AUTH_STORAGE_KEY = "andromeda.auth";

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  return decodeURIComponent(
    Array.from(binary)
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("")
  );
}

/** Evita usar un token vencido (margen de 30 s para relojes desfasados). */
export function isTokenExpired(token: string): boolean {
  const payload = token.split(".")[1];
  if (!payload) return true;

  try {
    const { exp } = JSON.parse(decodeBase64Url(payload)) as { exp?: number };
    return typeof exp !== "number" || exp * 1000 <= Date.now() + 30_000;
  } catch {
    return true;
  }
}

export function readStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as Partial<AuthSession>;
    if (!session.token || !session.email || isTokenExpired(session.token)) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return {
      token: session.token,
      email: session.email,
      firstName: session.firstName ?? "",
      lastName: session.lastName ?? "",
      role: session.role ?? "",
    };
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const { token } = JSON.parse(raw) as { token?: string };
    return typeof token === "string" && token.length > 0 ? token : null;
  } catch {
    return null;
  }
}

export function writeStoredSession(session: AuthSession): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { UNAUTHORIZED_EVENT } from "@/api/client";
import {
  AUTH_STORAGE_KEY,
  clearStoredSession,
  readStoredSession,
  writeStoredSession,
} from "../lib/authStorage";
import type { AuthSession, LoginResponse } from "../types/auth";
import { AuthContext, type AuthContextValue } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() =>
    readStoredSession()
  );

  const signIn = useCallback((response: LoginResponse) => {
    const nextSession: AuthSession = {
      token: response.token,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.role,
    };

    writeStoredSession(nextSession);
    setSession(nextSession);
  }, []);

  const signOut = useCallback(() => {
    clearStoredSession();
    setSession(null);
    window.google?.accounts.id.disableAutoSelect();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearStoredSession();
      setSession(null);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === AUTH_STORAGE_KEY) {
        setSession(readStoredSession());
      }
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: session !== null,
      signIn,
      signOut,
    }),
    [session, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

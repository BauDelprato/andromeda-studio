import { createContext, useContext } from "react";
import type { AuthSession, LoginResponse } from "../types/auth";

export interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  signIn: (response: LoginResponse) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>.");
  }

  return context;
}

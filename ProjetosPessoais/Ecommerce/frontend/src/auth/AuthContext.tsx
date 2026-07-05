import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import * as store from "./tokenStore";

interface AuthState {
  subject: string | null;
  isAuthenticated: boolean;
  login: (token: string, subject: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [subject, setSubject] = useState<string | null>(store.getSubject());

  // Keep React state in sync with the store, including 401-triggered clears
  // that happen outside the React tree (in the axios interceptor).
  useEffect(() => store.subscribe(() => setSubject(store.getSubject())), []);

  const login = useCallback((token: string, subj: string) => {
    store.setToken(token, subj);
  }, []);

  const logout = useCallback(() => {
    store.clearToken();
  }, []);

  const value = useMemo<AuthState>(
    () => ({ subject, isAuthenticated: subject !== null, login, logout }),
    [subject, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

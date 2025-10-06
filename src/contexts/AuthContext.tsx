"use client";

import { createContext, useContext } from "react";
import type { AuthSession } from "@/lib/auth";

interface AuthContextType {
  session: AuthSession | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  session: AuthSession | null;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useCurrentUser() {
  const { session } = useAuth();
  return session?.clickupUser;
}

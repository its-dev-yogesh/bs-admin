"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  apiClient,
  REFRESH_KEY,
  TOKEN_KEY,
  USER_KEY,
} from "@/lib/api";

export type AdminUser = {
  _id: string;
  id?: string;
  username: string;
  phone: string;
  email?: string;
  role: "user" | "admin" | "super_admin";
  status: "active" | "banned" | "deleted";
  type: "user" | "agent";
  name?: string;
  avatarUrl?: string;
};

type AuthState =
  | { status: "loading"; user: null }
  | { status: "unauthenticated"; user: null }
  | { status: "authenticated"; user: AdminUser };

type AuthContextValue = AuthState & {
  startLogin: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<AdminUser>;
  resendOtp: (phone: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<AdminUser | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

function isAdmin(user: AdminUser | null): user is AdminUser {
  return !!user && (user.role === "admin" || user.role === "super_admin");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    status: "loading",
    user: null,
  });

  const refresh = useCallback(async () => {
    if (typeof window === "undefined") return null;
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setState({ status: "unauthenticated", user: null });
      return null;
    }
    try {
      const user = await apiClient.get<AdminUser>("/auth/me");
      if (!isAdmin(user)) {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(REFRESH_KEY);
        window.localStorage.removeItem(USER_KEY);
        setState({ status: "unauthenticated", user: null });
        return null;
      }
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
      setState({ status: "authenticated", user });
      return user;
    } catch {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_KEY);
      window.localStorage.removeItem(USER_KEY);
      setState({ status: "unauthenticated", user: null });
      return null;
    }
  }, []);

  useEffect(() => {
    const stored = readStoredUser();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ status: "authenticated", user: stored });
    }
    void refresh();
  }, [refresh]);

  const startLogin = useCallback(async (phone: string) => {
    await apiClient.post<{ phone: string; message: string }>("/auth/login", {
      phone,
    });
  }, []);

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    const res = await apiClient.post<{
      access_token: string;
      refresh_token: string;
      user: AdminUser;
    }>("/auth/verify-otp", { phone, otp_code: otp });
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOKEN_KEY, res.access_token);
      window.localStorage.setItem(REFRESH_KEY, res.refresh_token);
    }
    const me = await apiClient.get<AdminUser>("/auth/me");
    if (!isAdmin(me)) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(REFRESH_KEY);
        window.localStorage.removeItem(USER_KEY);
      }
      throw new Error(
        "This account does not have admin access. Please contact a super admin.",
      );
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(USER_KEY, JSON.stringify(me));
    }
    setState({ status: "authenticated", user: me });
    return me;
  }, []);

  const resendOtp = useCallback(async (phone: string) => {
    await apiClient.post("/auth/resend-otp", { phone });
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // ignore — client-side logout is the source of truth
    }
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_KEY);
      window.localStorage.removeItem(USER_KEY);
    }
    setState({ status: "unauthenticated", user: null });
    router.replace("/signin");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, startLogin, verifyOtp, resendOtp, logout, refresh }),
    [state, startLogin, verifyOtp, resendOtp, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

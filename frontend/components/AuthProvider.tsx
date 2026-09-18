"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "@/lib/auth";

import { apiRequest } from "@/lib/api";

import type {
  LoginData,
  LoginResponse,
  User,
} from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;

  login: (
    data: LoginData
  ) => Promise<User>;

  googleLogin: (
    credential: string
  ) => Promise<User>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  /**
   * Get the currently authenticated user
   * from the backend.
   */
  async function refreshUser() {
    try {
      const currentUser =
        await getCurrentUser();

      setUser(currentUser);
    } catch {
      setUser(null);
    }
  }

  /**
   * Normal email/password login.
   *
   * This calls the backend and then immediately
   * updates the global authentication state.
   */
  async function login(
    data: LoginData
  ): Promise<User> {
    const response =
      await loginUser(data);

    setUser(response.user);

    return response.user;
  }

  /**
   * Google login.
   *
   * The Google credential is sent to our backend.
   * The backend verifies it, creates our HomeServe
   * session cookie, and returns the HomeServe user.
   */
  async function googleLogin(
    credential: string
  ): Promise<User> {
    const response =
      await apiRequest<LoginResponse>(
        "/auth/google",
        {
          method: "POST",
          body: JSON.stringify({
            credential,
          }),
        }
      );

    setUser(response.user);

    return response.user;
  }

  /**
   * Logout.
   */
  async function logout() {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }

  /**
   * Restore authentication when the application
   * starts.
   */
  useEffect(() => {
    async function initializeAuth() {
      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        googleLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
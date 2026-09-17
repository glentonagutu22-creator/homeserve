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

import type {
  LoginData,
  User,
} from "@/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    data: LoginData
  ) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
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

  async function refreshUser() {
    try {
      const currentUser =
        await getCurrentUser();

      setUser(currentUser);
    } catch {
      setUser(null);
    }
  }

  async function login(
    data: LoginData
  ): Promise<User> {
    const response =
      await loginUser(data);

    setUser(response.user);

    return response.user;
  }

  async function logout() {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }

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
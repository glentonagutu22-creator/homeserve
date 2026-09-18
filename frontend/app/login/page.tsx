"use client";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import AuthLayout from "@/components/AuthLayout";
import GoogleButton from "@/components/GoogleButton";
import { useAuth } from "@/components/AuthProvider";

import type { LoginData } from "@/types/auth";

function getDashboardPath(
  role: "CUSTOMER" | "STAFF" | "ADMIN"
) {
  switch (role) {
    case "ADMIN":
      return "/admin";

    case "STAFF":
      return "/staff";

    default:
      return "/dashboard";
  }
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { login, googleLogin } = useAuth();

  const redirect =
    searchParams.get("redirect") ||
    "/dashboard";

  const [form, setForm] =
    useState<LoginData>({
      email: "",
      password: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      /*
       * IMPORTANT:
       *
       * Use AuthProvider.login() instead of
       * calling loginUser() directly.
       *
       * AuthProvider.login() performs the
       * backend login AND updates the global
       * authentication state.
       */
      const user = await login(form);

      const destination =
        redirect !== "/dashboard"
          ? redirect
          : getDashboardPath(user.role);

      router.push(destination);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(
    credential: string
  ) {
    setError("");
    setLoading(true);

    try {
      /*
       * Use AuthProvider.googleLogin()
       * so the global authentication state
       * is updated after Google authentication.
       */
      const user =
        await googleLogin(credential);

      const destination =
        redirect !== "/dashboard"
          ? redirect
          : getDashboardPath(user.role);

      router.push(destination);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Google login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleError() {
    setError(
      "Google login could not be initialized."
    );
  }

  return (
    <AuthLayout mode="login">

      {/* Error */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Email / Password Login */}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* Email */}

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-slate-200"
          >
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            autoComplete="email"
            required
            className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        {/* Password */}

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-200"
            >
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>

          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Signing in..."
            : "Sign in"}

          {!loading && (
            <span className="text-lg">
              →
            </span>
          )}
        </button>
      </form>

      {/* Divider */}

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-xs text-slate-400">
          OR
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Google Login */}

      <div className="flex justify-center">
        <GoogleButton
          onSuccess={
            handleGoogleSuccess
          }
          onError={handleGoogleError}
        />
      </div>

      {/* Register */}

      <p className="mt-6 text-center text-sm text-slate-500">
        New to HomeServe?{" "}

        <Link
          href={`/register?redirect=${encodeURIComponent(
            redirect
          )}`}
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Create an account
        </Link>
      </p>

    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#061F35]">
          <p className="text-white">
            Loading login...
          </p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
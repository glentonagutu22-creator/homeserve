"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import { registerUser } from "@/lib/auth";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect =
    searchParams.get("redirect") || "/dashboard";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      await registerUser(form);

      /*
       * Registration does not automatically log
       * the user in.
       *
       * Preserve the original destination so
       * the login page knows where to return
       * the user after authentication.
       */
      router.push(
        `/login?redirect=${encodeURIComponent(
          redirect
        )}`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout mode="register">

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-3"
      >

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-slate-200"
          >
            Full name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            autoComplete="name"
            required
            className="h-10.5 w-full rounded-lg border border-white/10 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
          />
        </div>

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
            className="h-10.5 w-full rounded-lg border border-white/10 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-slate-200"
          >
            Phone number
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="0712345678"
            autoComplete="tel"
            required
            className="h-10.5 w-full rounded-lg border border-white/10 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-slate-200"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a secure password"
            autoComplete="new-password"
            required
            className="h-10.5 w-full rounded-lg border border-white/10 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
          />

          <p className="mt-1.5 text-xs text-slate-400">
            Minimum 4 characters
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex h-10.5 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Creating account..."
            : "Create account"}

          {!loading && (
            <span className="text-lg">
              →
            </span>
          )}
        </button>

      </form>

      <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
        By creating an account, you agree to our{" "}
        <Link
          href="#"
          className="font-medium text-sky-300 hover:text-white"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="#"
          className="font-medium text-sky-300 hover:text-white"
        >
          Privacy Policy
        </Link>
        .
      </p>

    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#061F35]">
          <p className="text-white">Loading registration...</p>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
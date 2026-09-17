"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/components/AuthProvider";

import { getCurrentUser } from "@/lib/auth";
import { updateMyProfile } from "@/lib/users";

import type { User } from "@/types/auth";

export default function ProfilePage() {
  const { user: authUser } = useAuth();

  const [user, setUser] =
    useState<User | null>(authUser);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const currentUser =
          await getCurrentUser();

        setUser(currentUser);
        setName(currentUser.name || "");
        setEmail(currentUser.email || "");
        setPhone(currentUser.phone || "");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load your profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (phone.trim()) {
      const phonePattern =
        /^\+2547\d{8}$/;

      if (!phonePattern.test(phone.trim())) {
        setError(
          "Please enter a valid Kenyan phone number, e.g. +254712345678."
        );
        return;
      }
    }

    try {
      setSaving(true);

      const updatedUser =
        await updateMyProfile({
          name: name.trim(),
          phone: phone.trim()
            ? phone.trim()
            : null,
        });

      setUser(updatedUser);
      setName(updatedUser.name);
      setEmail(updatedUser.email);
      setPhone(updatedUser.phone || "");

      setSuccess(
        "Your profile has been updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[70vh] items-center justify-center bg-white">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading your profile...
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}

        <section className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to dashboard
          </Link>

          <p className="mt-6 text-sm font-semibold text-blue-600">
            Account
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Your Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your personal information and
            contact details.
          </p>
        </section>

        {/* Alerts */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Profile */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* Profile heading */}

          <div className="border-b border-slate-200 px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-xl font-bold text-blue-700">
                {user?.name
                  ?.charAt(0)
                  .toUpperCase() || "U"}
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Keep your contact details up to
                  date so HomeServe can reach you.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6"
          >

            {/* Name */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Your full name"
              />
            </div>

            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
              />

              <p className="mt-2 text-xs text-slate-400">
                Email address cannot be changed here.
              </p>
            </div>

            {/* Phone */}

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="+254712345678"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Use the international Kenyan format,
                for example +254712345678.
              </p>
            </div>

            {/* Save */}

            <div className="flex justify-end border-t border-slate-100 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Account information */}

<div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
  <h2 className="font-bold text-slate-900">
    Account Information
  </h2>

  <div className="mt-4 grid gap-4 sm:grid-cols-2">
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Account Type
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {user?.role || "CUSTOMER"}
      </p>
    </div>

    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Email
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-slate-900">
        {user?.email || "—"}
      </p>
    </div>
  </div>
</div>

      </div>
    </DashboardShell>
  );
}
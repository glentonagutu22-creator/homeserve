
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleUserRound,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/components/AuthProvider";

import { getCurrentUser } from "@/lib/auth";
import { updateMyProfile } from "@/lib/users";

import type { User } from "@/types/auth";

export default function ProfilePage() {
  const { user: authUser } = useAuth();

  const [user, setUser] = useState<User | null>(authUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const currentUser = await getCurrentUser();

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (phone.trim()) {
      const phonePattern = /^\+2547\d{8}$/;

      if (!phonePattern.test(phone.trim())) {
        setError(
          "Please enter a valid Kenyan phone number, e.g. +254712345678."
        );
        return;
      }
    }

    try {
      setSaving(true);

      const updatedUser = await updateMyProfile({
        name: name.trim(),
        phone: phone.trim() ? phone.trim() : null,
      });

      setUser(updatedUser);
      setName(updatedUser.name);
      setEmail(updatedUser.email);
      setPhone(updatedUser.phone || "");

      setSuccess("Your profile has been updated successfully.");
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
        <div className="flex min-h-[65vh] items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
            <p className="mt-3 text-sm text-slate-500">
              Loading your profile...
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "there";
  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

  return (
    <DashboardShell>
      <div className="mx-auto max-w-5xl space-y-5 px-3 py-4 pb-24 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8 lg:pb-8">

        {/* COMPACT WELCOME BANNER */}
        <section className="relative overflow-hidden border-l-4 border-blue-400 bg-[#061F35] px-4 py-3.5 shadow-sm sm:px-5">
          <div className="pointer-events-none absolute -right-6 -top-10 h-28 w-28 rounded-full border-[16px] border-white/[0.04]" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-300 sm:text-[10px]">
                Customer account
              </p>

              <h1 className="mt-1 text-lg font-extrabold tracking-tight text-white sm:text-xl">
                Hello, {firstName}!
              </h1>

              <p className="mt-1 text-[11px] text-slate-300 sm:text-xs">
                Manage your personal details and keep your account up to date.
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-blue-200">
              <CircleUserRound size={22} />
            </div>
          </div>
        </section>

        {/* BACK NAVIGATION */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-blue-700 sm:text-sm"
        >
          <ArrowLeft size={15} />
          Back to dashboard
        </Link>

        {/* ALERTS */}
        {error && (
          <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span className="mt-0.5 shrink-0">!</span>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* PROFILE IDENTITY */}
        <section className="overflow-hidden border border-blue-100 bg-blue-50 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-xl font-black text-white shadow-sm sm:h-[72px] sm:w-[72px] sm:text-2xl">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-600">
                Your HomeServe profile
              </p>

              <h2 className="mt-1 truncate text-lg font-extrabold text-slate-900 sm:text-xl">
                {user?.name || "Customer"}
              </h2>

              <p className="mt-1 truncate text-xs text-slate-600 sm:text-sm">
                {user?.email || "No email available"}
              </p>

              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-blue-800">
                <ShieldCheck size={11} />
                {user?.role || "CUSTOMER"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-blue-100 bg-blue-100/60 px-4 py-2.5 text-[10px] text-blue-900 sm:px-5 sm:text-xs">
            <CheckCircle2 size={13} />
            Keep your contact information current for a smoother service experience.
          </div>
        </section>

        {/* PERSONAL INFORMATION FORM */}
        <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4 sm:px-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <UserRound size={18} />
            </div>

            <div>
              <h2 className="text-sm font-extrabold text-slate-900 sm:text-base">
                Personal Information
              </h2>
              <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
                Update your name and contact details.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-5">

              {/* FULL NAME */}
              <div className="col-span-2">
                <label
                  htmlFor="name"
                  className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"
                >
                  <UserRound size={14} className="text-violet-600" />
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  placeholder="Your full name"
                  className="w-full border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                />
              </div>

              {/* EMAIL */}
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="email"
                  className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"
                >
                  <Mail size={14} className="text-blue-600" />
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="w-full cursor-not-allowed border border-blue-100 bg-blue-50 px-3 py-3 text-sm text-slate-500"
                />

                <p className="mt-2 text-[10px] text-slate-400">
                  Email cannot be changed here.
                </p>
              </div>

              {/* PHONE */}
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="phone"
                  className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"
                >
                  <Phone size={14} className="text-emerald-600" />
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel"
                  placeholder="+254712345678"
                  className="w-full border border-emerald-100 bg-emerald-50/60 px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />

                <p className="mt-2 text-[10px] text-slate-400">
                  Use the international Kenyan format.
                </p>
              </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] text-slate-400">
                Your information is used to manage your HomeServe account.
              </p>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 bg-[#061F35] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-36"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* ACCOUNT INFORMATION */}
        <section className="overflow-hidden border border-amber-100 bg-amber-50 shadow-sm">
          <div className="flex items-center gap-3 border-b border-amber-100 px-4 py-4 sm:px-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <ShieldCheck size={18} />
            </div>

            <div>
              <h2 className="text-sm font-extrabold text-amber-950 sm:text-base">
                Account Information
              </h2>
              <p className="mt-0.5 text-[10px] text-amber-800/70 sm:text-xs">
                Your account details at a glance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-5">
            <div className="min-w-0 border border-amber-100 bg-white/80 p-3 sm:p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-amber-700 sm:text-[10px]">
                Account Type
              </p>

              <p className="mt-2 truncate text-sm font-extrabold text-slate-900 sm:text-base">
                {user?.role || "CUSTOMER"}
              </p>
            </div>

            <div className="min-w-0 border border-amber-100 bg-white/80 p-3 sm:p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-amber-700 sm:text-[10px]">
                Account Email
              </p>

              <p className="mt-2 truncate text-xs font-bold text-slate-900 sm:text-sm">
                {user?.email || "—"}
              </p>
            </div>
          </div>
        </section>

        {/* QUICK NAVIGATION */}
        <Link
          href="/dashboard"
          className="group flex items-center justify-between border border-sky-100 bg-sky-50 p-4 transition hover:border-sky-200 hover:bg-sky-100"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <ArrowLeft size={18} />
            </div>

            <div>
              <p className="text-xs font-extrabold text-sky-950 sm:text-sm">
                Back to your dashboard
              </p>
              <p className="mt-1 text-[10px] text-sky-800/70 sm:text-xs">
                Continue managing your HomeServe services.
              </p>
            </div>
          </div>

          <ArrowRight
            size={17}
            className="shrink-0 text-sky-700 transition group-hover:translate-x-1"
          />
        </Link>
      </div>
    </DashboardShell>
  );
}

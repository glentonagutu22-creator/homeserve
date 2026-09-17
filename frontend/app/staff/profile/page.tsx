"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";

import {
  getMyStaffProfile,
  updateMyAvailability,
} from "@/lib/staff";

import type { Staff } from "@/types/staff";

export default function StaffProfilePage() {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyStaffProfile();

      setStaff(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleAvailabilityChange() {
    if (!staff) return;

    try {
      setUpdating(true);
      setError("");

      const updated = await updateMyAvailability(
        !staff.isAvailable
      );

      setStaff(updated);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update availability"
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            Loading profile...
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!staff) {
    return (
      <DashboardShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <UserRound className="h-6 w-6 text-red-600" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#061F35]">
              Profile unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-red-600">
              {error ||
                "Unable to load your staff profile."}
            </p>

            <Link
              href="/staff"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#061F35] px-5 text-sm font-semibold text-white transition hover:bg-[#082B49]"
            >
              Back to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page Header */}
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                Staff Workspace
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#061F35] sm:text-3xl">
                My Profile
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                View your staff information and manage
                your availability.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  staff.isAvailable
                    ? "bg-green-500"
                    : "bg-slate-400"
                }`}
              />

              <span className="text-xs font-semibold text-[#082B49]">
                {staff.isAvailable
                  ? "Available"
                  : "Unavailable"}
              </span>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Profile Overview */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
              <UserRound className="h-8 w-8 text-[#061F35]" />
            </div>

            <div className="min-w-0">
              <h2 className="text-xl font-bold text-[#061F35]">
                {staff.user.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {staff.staffType}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {staff.user.role}
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    staff.isAvailable
                      ? "border-green-100 bg-green-50 text-green-700"
                      : "border-slate-200 bg-slate-100 text-slate-600"
                  }`}
                >
                  {staff.isAvailable
                    ? "Available for assignments"
                    : "Not available"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <UserRound className="h-5 w-5 text-[#061F35]" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#061F35]">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your account and staff details.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-blue-600" />

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Full Name
                </p>
              </div>

              <p className="mt-2 text-sm font-semibold text-[#061F35]">
                {staff.user.name}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Email
                </p>
              </div>

              <p className="mt-2 break-all text-sm font-semibold text-[#061F35]">
                {staff.user.email}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Phone
                </p>
              </div>

              <p className="mt-2 text-sm font-semibold text-[#061F35]">
                {staff.user.phone || "Not provided"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4 text-blue-600" />

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Staff Type
                </p>
              </div>

              <p className="mt-2 text-sm font-semibold text-[#061F35]">
                {staff.staffType}
              </p>
            </div>
          </div>
        </section>

        {/* Availability */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <CheckCircle2 className="h-5 w-5 text-[#061F35]" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#061F35]">
                  Availability
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Let the HomeServe team know whether you
                  are currently available for new
                  assignments.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={updating}
              onClick={handleAvailabilityChange}
              className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                staff.isAvailable
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-[#061F35] hover:bg-[#082B49]"
              }`}
            >
              {updating && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {updating
                ? "Updating..."
                : staff.isAvailable
                ? "Available"
                : "Unavailable"}
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span
              className={`h-3 w-3 shrink-0 rounded-full ${
                staff.isAvailable
                  ? "bg-green-500"
                  : "bg-slate-400"
              }`}
            />

            <p className="text-sm font-medium text-[#082B49]">
              {staff.isAvailable
                ? "You are currently available for new assignments."
                : "You are currently unavailable for new assignments."}
            </p>
          </div>
        </section>

        {/* Account Information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <ShieldCheck className="h-5 w-5 text-[#061F35]" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#061F35]">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Staff account and membership details.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Account Role
              </p>

              <p className="mt-2 text-sm font-semibold text-[#061F35]">
                {staff.user.role}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Staff ID
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-[#061F35]">
                {staff.id}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Joined
              </p>

              <p className="mt-2 text-sm font-semibold text-[#061F35]">
                {new Date(
                  staff.createdAt
                ).toLocaleDateString("en-KE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/staff/bookings"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#061F35] shadow-sm transition hover:bg-slate-50"
          >
            View My Bookings
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/staff/schedule"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#061F35] px-5 text-sm font-semibold text-white transition hover:bg-[#082B49]"
          >
            View My Schedule
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </DashboardShell>
  );
}
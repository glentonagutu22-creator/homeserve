
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  CalendarCheck,
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
        <div className="flex min-h-[350px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-[#061F35]" />
            Loading profile...
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!staff) {
    return (
      <DashboardShell>
        <div className="flex min-h-[350px] items-center justify-center px-3">
          <div className="w-full max-w-md border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center bg-red-50">
              <UserRound className="h-6 w-6 text-red-600" />
            </div>

            <h1 className="mt-4 text-xl font-bold text-[#061F35]">
              Profile unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-red-600">
              {error || "Unable to load your staff profile."}
            </p>

            <button
              type="button"
              onClick={loadProfile}
              className="mt-5 inline-flex h-10 items-center justify-center bg-[#061F35] px-5 text-sm font-semibold text-white hover:bg-[#082B49]"
            >
              Try again
            </button>

            <Link
              href="/staff"
              className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#061F35]"
            >
              Back to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const joinedDate = new Date(staff.createdAt).toLocaleDateString(
    "en-KE",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <DashboardShell>
      <div className="space-y-5">
        {/* Compact page banner */}
        <section className="relative overflow-hidden bg-[#061F35] px-4 py-5 text-white sm:px-6 sm:py-6">
          <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full border-[20px] border-white/[0.04]" />

          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
              Staff Workspace
            </p>

            <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
              My Profile
            </h1>

            <p className="mt-1 max-w-xl text-xs leading-5 text-blue-100/80 sm:text-sm">
              View your personal details and manage your staff account.
            </p>
          </div>
        </section>

        {/* Error message */}
        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Main profile card */}
        <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="h-2 bg-gradient-to-r from-[#061F35] via-blue-700 to-blue-400" />

          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* Profile avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center border-4 border-blue-50 bg-[#061F35] text-white sm:h-24 sm:w-24">
                <UserRound className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>

              {/* Identity */}
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                  Staff Member
                </p>

                <h2 className="mt-1 break-words text-xl font-bold text-[#061F35] sm:text-2xl">
                  {staff.user.name}
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  {staff.staffType}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                    {staff.user.role}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-bold ${
                      staff.isAvailable
                        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        staff.isAvailable
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />
                    {staff.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile quick details */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Staff ID
                </p>
                <p className="mt-1 break-all text-xs font-semibold text-[#061F35] sm:text-sm">
                  {staff.id}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Member Since
                </p>
                <p className="mt-1 text-xs font-semibold text-[#061F35] sm:text-sm">
                  {joinedDate}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Personal details */}
        <section className="border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-sm font-bold text-[#061F35]">
                Personal Information
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Your registered contact and work details.
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center bg-blue-50">
              <UserRound className="h-4 w-4 text-blue-700" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-5">
            <ProfileDetail
              icon={UserRound}
              label="Full Name"
              value={staff.user.name}
            />

            <ProfileDetail
              icon={Mail}
              label="Email Address"
              value={staff.user.email}
            />

            <ProfileDetail
              icon={Phone}
              label="Phone Number"
              value={staff.user.phone || "Not provided"}
            />

            <ProfileDetail
              icon={BriefcaseBusiness}
              label="Staff Type"
              value={staff.staffType}
            />
          </div>
        </section>

        {/* Availability */}
        <section className="border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-sm font-bold text-[#061F35]">
                Work Availability
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Control whether you can receive new assignments.
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center bg-emerald-50">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div
              className={`flex flex-col gap-4 border p-4 sm:flex-row sm:items-center sm:justify-between ${
                staff.isAvailable
                  ? "border-emerald-100 bg-emerald-50/60"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center ${
                    staff.isAvailable ? "bg-emerald-100" : "bg-slate-200"
                  }`}
                >
                  <Clock3
                    className={`h-4 w-4 ${
                      staff.isAvailable
                        ? "text-emerald-700"
                        : "text-slate-600"
                    }`}
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#061F35]">
                    {staff.isAvailable
                      ? "You are available"
                      : "You are unavailable"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {staff.isAvailable
                      ? "Your profile is currently eligible for new work assignments."
                      : "You will not be available for new work assignments while this setting is off."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={updating}
                onClick={handleAvailabilityChange}
                className={`inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 px-4 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
                  staff.isAvailable
                    ? "bg-slate-700 hover:bg-slate-800"
                    : "bg-[#061F35] hover:bg-[#082B49]"
                }`}
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}

                {updating
                  ? "Updating..."
                  : staff.isAvailable
                    ? "Set unavailable"
                    : "Set available"}
              </button>
            </div>
          </div>
        </section>

        {/* Account details */}
        <section className="border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-sm font-bold text-[#061F35]">
                Account Information
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Your HomeServe account details.
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center bg-blue-50">
              <ShieldCheck className="h-4 w-4 text-blue-700" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-5">
            <ProfileDetail
              icon={ShieldCheck}
              label="Account Role"
              value={staff.user.role}
            />

            <ProfileDetail
              icon={BriefcaseBusiness}
              label="Staff ID"
              value={staff.id}
            />

            <div className="col-span-2 flex items-center gap-3 border border-slate-100 bg-slate-50 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-50">
                <CalendarDays className="h-4 w-4 text-blue-700" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Registration Date
                </p>
                <p className="mt-1 text-xs font-semibold text-[#061F35] sm:text-sm">
                  {joinedDate}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Staff navigation */}
        <section>
          <h2 className="mb-3 text-sm font-bold text-[#061F35]">
            Your Workspace
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/staff/bookings"
              className="group flex min-w-0 items-center justify-between gap-2 border border-slate-200 bg-white p-3 transition hover:border-blue-200 hover:bg-blue-50/40 sm:p-4"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-50">
                  <BriefcaseBusiness className="h-4 w-4 text-blue-700" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-[#061F35] sm:text-sm">
                    My Bookings
                  </p>
                  <p className="hidden text-[10px] text-slate-500 sm:block">
                    View assignments
                  </p>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/staff/schedule"
              className="group flex min-w-0 items-center justify-between gap-2 border border-slate-200 bg-white p-3 transition hover:border-blue-200 hover:bg-blue-50/40 sm:p-4"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-50">
                  <CalendarCheck className="h-4 w-4 text-blue-700" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-[#061F35] sm:text-sm">
                    My Schedule
                  </p>
                  <p className="hidden text-[10px] text-slate-500 sm:block">
                    View work schedule
                  </p>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function ProfileDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 border border-slate-100 bg-slate-50 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-white">
        <Icon className="h-4 w-4 text-blue-700" />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:text-[10px]">
          {label}
        </p>

        <p className="mt-1 break-words text-xs font-semibold text-[#061F35] sm:text-sm">
          {value}
        </p>
      </div>
    </div>
  );
}

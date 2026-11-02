
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Loader2,
  CalendarDays,
  MapPin,
  ArrowRight,
  UserRound,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";

import {
  getMyAssignments,
  getMyStaffProfile,
  updateMyAvailability,
} from "@/lib/staff";

import type {
  Staff,
  StaffAssignment,
} from "@/types/staff";

function staffTypeLabel(type: string) {
  switch (type) {
    case "CLEANER":
      return "Cleaner";
    case "MOVER":
      return "Mover";
    case "ELECTRICIAN":
      return "Electrician";
    case "SUPERVISOR":
      return "Supervisor";
    default:
      return type;
  }
}

function statusClass(status: string) {
  switch (status) {
    case "ASSIGNED":
      return "border-blue-100 bg-blue-50 text-blue-700";
    case "IN_PROGRESS":
      return "border-amber-100 bg-amber-50 text-amber-700";
    case "COMPLETED":
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    case "CANCELLED":
      return "border-red-100 bg-red-50 text-red-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-KE", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  color: "blue" | "amber" | "emerald";
}) {
  const colors = {
    blue: {
      border: "border-blue-100",
      icon: "bg-blue-50 text-blue-700",
      value: "text-blue-800",
      accent: "bg-blue-500",
    },
    amber: {
      border: "border-amber-100",
      icon: "bg-amber-50 text-amber-700",
      value: "text-amber-700",
      accent: "bg-amber-500",
    },
    emerald: {
      border: "border-emerald-100",
      icon: "bg-emerald-50 text-emerald-700",
      value: "text-emerald-700",
      accent: "bg-emerald-500",
    },
  };

  const theme = colors[color];

  return (
    <div
      className={`relative min-w-0 overflow-hidden border bg-white p-3 shadow-sm transition hover:shadow-md sm:p-5 ${theme.border}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
            {title}
          </p>

          <p className={`mt-2 text-2xl font-bold tabular-nums sm:text-3xl ${theme.value}`}>
            {value}
          </p>

          <p className="mt-1 text-[10px] leading-snug text-slate-400 sm:text-xs">
            {description}
          </p>
        </div>

        <div className={`flex h-8 w-8 shrink-0 items-center justify-center sm:h-10 sm:w-10 ${theme.icon}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 h-1 w-full ${theme.accent}`} />
    </div>
  );
}

export default function StaffDashboardPage() {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [assignments, setAssignments] = useState<StaffAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [staffResult, assignmentsResult] = await Promise.all([
        getMyStaffProfile(),
        getMyAssignments(),
      ]);

      setStaff(staffResult);
      setAssignments(assignmentsResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load staff dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleAvailability() {
    if (!staff) return;

    try {
      setUpdatingAvailability(true);
      setError("");

      const updated = await updateMyAvailability(!staff.isAvailable);
      setStaff(updated);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update availability"
      );
    } finally {
      setUpdatingAvailability(false);
    }
  }

  const activeAssignments = assignments.filter(
    (assignment) =>
      assignment.booking.status !== "COMPLETED" &&
      assignment.booking.status !== "CANCELLED"
  );

  const completedAssignments = assignments.filter(
    (assignment) => assignment.booking.status === "COMPLETED"
  );

  const upcomingAssignments = activeAssignments.slice(0, 5);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-[#061F35]" />
            Loading your workspace...
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!staff) {
    return (
      <DashboardShell>
        <div className="px-3 py-6 sm:px-6 lg:px-8">
          <div className="border border-red-200 bg-red-50 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-red-800">
              <ShieldCheck className="h-5 w-5" />
              <h1 className="font-bold">Staff profile unavailable</h1>
            </div>

            <p className="mt-2 text-sm text-red-700">
              {error || "We could not load your staff profile."}
            </p>

            <button
              type="button"
              onClick={loadDashboard}
              className="mt-4 inline-flex items-center gap-2 bg-[#061F35] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3556]"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="min-w-0 space-y-6 px-3 py-5 pb-24 sm:space-y-8 sm:px-6 sm:py-7 lg:px-8 lg:pb-8">

        {/* Page heading */}
        <section className="border-b border-slate-200 pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700 sm:text-xs">
                Staff workspace
              </p>

              <h1 className="mt-1 text-xl font-bold tracking-tight text-[#061F35] sm:text-2xl">
                Welcome back, {staff.user.name}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5" />
                  {staffTypeLabel(staff.staffType)}
                </span>

                <span className="text-slate-300">|</span>

                <span
                  className={`inline-flex items-center gap-1.5 font-semibold ${
                    staff.isAvailable ? "text-emerald-700" : "text-slate-500"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      staff.isAvailable ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {staff.isAvailable ? "Available for work" : "Unavailable"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAvailability}
              disabled={updatingAvailability}
              className={`inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 px-4 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-sm ${
                staff.isAvailable
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  : "bg-[#061F35] text-white hover:bg-[#0b3556]"
              }`}
            >
              {updatingAvailability ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      staff.isAvailable ? "bg-emerald-500" : "bg-white"
                    }`}
                  />
                  {staff.isAvailable ? "Set unavailable" : "Set available"}
                </>
              )}
            </button>
          </div>
        </section>

        {/* Error message */}
        {error && (
          <div className="flex items-start justify-between gap-3 border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 sm:text-sm">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 font-semibold hover:text-red-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Work overview */}
        <section>
          <div className="mb-3 flex items-end justify-between gap-3 sm:mb-4">
            <div>
              <h2 className="text-base font-bold text-[#061F35] sm:text-lg">
                Work overview
              </h2>
              <p className="mt-1 text-[11px] text-slate-500 sm:text-sm">
                Your assignment activity at a glance.
              </p>
            </div>

            <span className="text-[10px] font-medium text-slate-400 sm:text-xs">
              {assignments.length} total
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4">
            <StatCard
              title="Total assignments"
              value={assignments.length}
              description="All assigned jobs"
              icon={BriefcaseBusiness}
              color="blue"
            />

            <StatCard
              title="Active jobs"
              value={activeAssignments.length}
              description="Jobs requiring attention"
              icon={Clock3}
              color="amber"
            />

            <StatCard
              title="Completed"
              value={completedAssignments.length}
              description="Successfully completed"
              icon={CheckCircle2}
              color="emerald"
            />
          </div>
        </section>

        {/* Availability information */}
        <section className="flex items-start gap-3 border border-slate-200 bg-white p-3 sm:p-4">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center ${
              staff.isAvailable
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 sm:text-sm">
              {staff.isAvailable
                ? "Your availability is on"
                : "You are currently unavailable"}
            </p>

            <p className="mt-1 text-[10px] leading-relaxed text-slate-500 sm:text-xs">
              {staff.isAvailable
                ? "You can receive new job assignments while your availability is enabled."
                : "You may not receive new job assignments until you enable your availability."}
            </p>
          </div>
        </section>

        {/* Upcoming jobs */}
        <section className="min-w-0">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#061F35] sm:text-lg">
                Your assignments
              </h2>
              <p className="mt-1 text-[11px] text-slate-500 sm:text-sm">
                Jobs currently assigned to you.
              </p>
            </div>

            <Link
              href="/staff/bookings"
              className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 sm:text-sm"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {upcomingAssignments.length === 0 ? (
            <div className="border border-dashed border-slate-300 bg-white px-4 py-12 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center bg-slate-100 text-slate-500">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <h3 className="mt-3 text-sm font-bold text-slate-800">
                No active assignments
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                New assignments will appear here when they are assigned to you.
              </p>

              <Link
                href="/staff/bookings"
                className="mt-4 inline-flex items-center gap-2 bg-[#061F35] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0b3556]"
              >
                View assignments
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {upcomingAssignments.map((assignment) => (
                <article
                  key={assignment.id}
                  className="flex min-w-0 flex-col border border-slate-200 bg-white p-3 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-4"
                >
                  {/* Booking reference and status */}
                  <div className="flex min-w-0 flex-col items-start gap-2">
                    <p className="break-all text-[10px] font-bold text-[#061F35] sm:text-xs">
                      {assignment.booking.bookingNumber}
                    </p>

                    <span
                      className={`inline-flex max-w-full border px-2 py-1 text-[9px] font-bold sm:text-[10px] ${statusClass(
                        assignment.booking.status
                      )}`}
                    >
                      {assignment.booking.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Service */}
                  <div className="mt-3 min-h-[48px]">
                    <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400 sm:text-[10px]">
                      Service
                    </p>

                    <h3 className="mt-1 break-words text-xs font-bold leading-snug text-slate-800 sm:text-sm">
                      {assignment.booking.service.name}
                    </h3>
                  </div>

                  {/* Booking details */}
                  <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                    <div className="flex items-start gap-1.5">
                      <CalendarDays className="mt-0.5 h-3 w-3 shrink-0 text-blue-600" />
                      <p className="min-w-0 break-words text-[10px] leading-snug text-slate-600 sm:text-xs">
                        {formatDate(assignment.booking.scheduledDate)}
                      </p>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <Clock3 className="mt-0.5 h-3 w-3 shrink-0 text-blue-600" />
                      <p className="min-w-0 break-words text-[10px] text-slate-600 sm:text-xs">
                        {assignment.booking.scheduledTime}
                      </p>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-blue-600" />
                      <p className="min-w-0 break-words text-[10px] leading-snug text-slate-600 sm:text-xs">
                        {assignment.booking.address?.addressLine}
                        {assignment.booking.address?.city
                          ? `, ${assignment.booking.address.city}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  {/* Booking action */}
                  <Link
                    href={`/staff/bookings/${assignment.booking.id}`}
                    className="mt-4 inline-flex min-h-9 w-full items-center justify-center gap-1.5 bg-[#061F35] px-2 py-2 text-[10px] font-bold text-white transition hover:bg-[#0b3556] sm:text-xs"
                  >
                    View booking
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

      </div>
    </DashboardShell>
  );
}

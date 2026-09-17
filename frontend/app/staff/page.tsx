"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Loader2,
  CalendarDays,
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
      return "bg-blue-50 text-blue-700 border-blue-100";

    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 border-amber-100";

    case "COMPLETED":
      return "bg-green-50 text-green-700 border-green-100";

    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-100";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-KE",
    {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

export default function StaffDashboardPage() {
  const [staff, setStaff] =
    useState<Staff | null>(null);

  const [assignments, setAssignments] =
    useState<StaffAssignment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    updatingAvailability,
    setUpdatingAvailability,
  ] = useState(false);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [
        staffResult,
        assignmentsResult,
      ] = await Promise.all([
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

      const updated =
        await updateMyAvailability(
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
      setUpdatingAvailability(false);
    }
  }

  const activeAssignments =
    assignments.filter(
      (assignment) =>
        assignment.booking.status !==
          "COMPLETED" &&
        assignment.booking.status !==
          "CANCELLED"
    );

  const completedAssignments =
    assignments.filter(
      (assignment) =>
        assignment.booking.status ===
        "COMPLETED"
    );

  const upcomingAssignments =
    activeAssignments.slice(0, 5);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading dashboard...
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!staff) {
    return (
      <DashboardShell>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-bold text-red-900">
            Staff profile unavailable
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {error ||
              "We could not load your staff profile."}
          </p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="rounded-2xl bg-[#061F35] p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                HomeServe Staff
              </p>

              <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Welcome, {staff.user.name}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm text-slate-300">
                  {staffTypeLabel(
                    staff.staffType
                  )}
                </span>

                <span className="text-slate-500">
                  •
                </span>

                <span
                  className={`text-sm font-medium ${
                    staff.isAvailable
                      ? "text-green-300"
                      : "text-slate-400"
                  }`}
                >
                  {staff.isAvailable
                    ? "Currently available"
                    : "Currently unavailable"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAvailability}
              disabled={updatingAvailability}
              className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition ${
                staff.isAvailable
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {updatingAvailability ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : staff.isAvailable ? (
                "● Available"
              ) : (
                "○ Unavailable"
              )}
            </button>

          </div>
        </section>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* =====================================================
            WORK OVERVIEW
        ===================================================== */}

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#061F35]">
              Work Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              A summary of your current HomeServe workload.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">

            {/* Total */}
            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total Assignments
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#061F35]">
                    {assignments.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    All assigned jobs
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <BriefcaseBusiness className="h-5 w-5 text-blue-700" />
                </div>

              </div>
            </div>

            {/* Active */}
            <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Active Jobs
                  </p>

                  <p className="mt-2 text-3xl font-bold text-amber-700">
                    {activeAssignments.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Jobs requiring attention
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
                  <Clock3 className="h-5 w-5 text-amber-700" />
                </div>

              </div>
            </div>

            {/* Completed */}
            <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Completed Jobs
                  </p>

                  <p className="mt-2 text-3xl font-bold text-green-700">
                    {completedAssignments.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Successfully completed
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                  <CheckCircle2 className="h-5 w-5 text-green-700" />
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* =====================================================
            UPCOMING JOBS
        ===================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />

                <h2 className="text-lg font-bold text-slate-900">
                  Upcoming Jobs
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Your current assigned service bookings.
              </p>
            </div>

            <Link
              href="/staff/bookings"
              className="w-fit text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all →
            </Link>

          </div>

          {upcomingAssignments.length === 0 ? (
            <div className="px-6 py-14 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <BriefcaseBusiness className="h-5 w-5 text-slate-500" />
              </div>

              <p className="mt-4 font-semibold text-slate-900">
                No active jobs
              </p>

              <p className="mt-2 text-sm text-slate-500">
                New assignments will appear here.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {upcomingAssignments.map(
                (assignment) => (
                  <div
                    key={assignment.id}
                    className="p-5 sm:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      <div className="min-w-0">

                        {/* Booking + Status */}
                        <div className="flex flex-wrap items-center gap-2.5">

                          <p className="font-semibold text-slate-900">
                            {
                              assignment.booking
                                .bookingNumber
                            }
                          </p>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClass(
                              assignment.booking
                                .status
                            )}`}
                          >
                            {
                              assignment.booking
                                .status
                            }
                          </span>

                        </div>

                        {/* Service */}
                        <p className="mt-2 font-medium text-slate-700">
                          {
                            assignment.booking
                              .service.name
                          }
                        </p>

                        {/* Details */}
                        <div className="mt-4 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">

                          <p>
                            <span className="font-medium text-slate-700">
                              Date:
                            </span>{" "}
                            {formatDate(
                              assignment.booking
                                .scheduledDate
                            )}
                          </p>

                          <p>
                            <span className="font-medium text-slate-700">
                              Time:
                            </span>{" "}
                            {
                              assignment.booking
                                .scheduledTime
                            }
                          </p>

                          <p className="sm:col-span-2">
                            <span className="font-medium text-slate-700">
                              Location:
                            </span>{" "}
                            {
                              assignment.booking
                                .address
                                ?.addressLine
                            }
                            ,{" "}
                            {
                              assignment.booking
                                .address?.city
                            }
                          </p>

                        </div>

                      </div>

                      <Link
                        href={`/staff/bookings/${assignment.booking.id}`}
                        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#061F35] px-5 text-sm font-semibold text-white transition hover:bg-[#082B49] sm:w-fit"
                      >
                        View Booking
                      </Link>

                    </div>
                  </div>
                )
              )}

            </div>
          )}

        </section>

      </div>
    </DashboardShell>
  );
}
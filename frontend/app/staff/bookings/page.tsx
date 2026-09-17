"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  UserRound,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";

import {
  getMyAssignments,
  updateMyBookingStatus,
} from "@/lib/staff";

import type { StaffAssignment } from "@/types/staff";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-KE", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusLabel(status: string) {
  switch (status) {
    case "ASSIGNED":
      return "Assigned";

    case "IN_PROGRESS":
      return "In Progress";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status;
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

function getNextAction(status: string) {
  if (status === "ASSIGNED") {
    return {
      label: "Start Job",
      nextStatus: "IN_PROGRESS" as const,
    };
  }

  if (status === "IN_PROGRESS") {
    return {
      label: "Complete Job",
      nextStatus: "COMPLETED" as const,
    };
  }

  return null;
}

export default function StaffBookingsPage() {
  const [assignments, setAssignments] = useState<StaffAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(
    null
  );
  const [filter, setFilter] = useState("ALL");

  async function loadAssignments() {
    try {
      setLoading(true);
      setError("");

      const result = await getMyAssignments();

      setAssignments(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load your bookings"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssignments();
  }, []);

  async function handleStatusUpdate(
    bookingId: string,
    status: "IN_PROGRESS" | "COMPLETED"
  ) {
    try {
      setUpdatingBooking(bookingId);
      setError("");

      await updateMyBookingStatus(bookingId, status);

      await loadAssignments();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update booking"
      );
    } finally {
      setUpdatingBooking(null);
    }
  }

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === "ALL") {
      return true;
    }

    return assignment.booking.status === filter;
  });

  const totalAssignments = assignments.length;

  const activeAssignments = assignments.filter(
    (assignment) =>
      assignment.booking.status !== "COMPLETED" &&
      assignment.booking.status !== "CANCELLED"
  ).length;

  const completedAssignments = assignments.filter(
    (assignment) => assignment.booking.status === "COMPLETED"
  ).length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page Header */}
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                Staff Workspace
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#061F35] sm:text-3xl">
                My Bookings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                View and manage the service jobs assigned to you.
              </p>
            </div>

            <Link
              href="/staff"
              className="hidden text-sm font-semibold text-blue-600 hover:text-blue-700 sm:block"
            >
              Staff Dashboard →
            </Link>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Overview */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#061F35]">
              Booking Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              A quick summary of your assigned service jobs.
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
                    {totalAssignments}
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
                    {activeAssignments}
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
                    Completed
                  </p>

                  <p className="mt-2 text-3xl font-bold text-green-700">
                    {completedAssignments}
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

        {/* Filters */}
        <section>
          <div className="mb-3">
            <h2 className="text-lg font-bold text-[#061F35]">
              Filter Bookings
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              ["ALL", "All"],
              ["ASSIGNED", "Assigned"],
              ["IN_PROGRESS", "In Progress"],
              ["COMPLETED", "Completed"],
              ["CANCELLED", "Cancelled"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  filter === value
                    ? "bg-[#061F35] text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Bookings */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Assigned Jobs
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredAssignments.length} job
                  {filteredAssignments.length === 1 ? "" : "s"} shown
                </p>
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 sm:mt-0">
                <BriefcaseBusiness className="h-4 w-4" />
                Staff assignments
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center px-6 py-16">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading your bookings...
              </div>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <BriefcaseBusiness className="h-5 w-5 text-slate-500" />
              </div>

              <p className="mt-4 font-semibold text-slate-900">
                No bookings found
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {filter === "ALL"
                  ? "You don't have any assigned jobs yet."
                  : "There are no bookings with this status."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredAssignments.map((assignment) => {
                const booking = assignment.booking;
                const action = getNextAction(booking.status);

                return (
                  <article
                    key={assignment.id}
                    className="p-5 sm:p-6"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      {/* Booking Information */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="font-bold text-slate-900">
                            {booking.bookingNumber}
                          </h3>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClass(
                              booking.status
                            )}`}
                          >
                            {statusLabel(booking.status)}
                          </span>
                        </div>

                        <p className="mt-2 text-base font-semibold text-blue-600">
                          {booking.service.name}
                        </p>

                        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                          {/* Customer */}
                          <div className="rounded-xl bg-slate-50 p-4">
                            <div className="flex items-center gap-2">
                              <UserRound className="h-4 w-4 text-slate-400" />

                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Customer
                              </p>
                            </div>

                            <p className="mt-2 font-semibold text-slate-800">
                              {booking.user.name}
                            </p>

                            <p className="mt-1 break-words text-slate-500">
                              {booking.user.phone ||
                                booking.user.email}
                            </p>
                          </div>

                          {/* Schedule */}
                          <div className="rounded-xl bg-slate-50 p-4">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-slate-400" />

                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Schedule
                              </p>
                            </div>

                            <p className="mt-2 font-semibold text-slate-800">
                              {formatDate(booking.scheduledDate)}
                            </p>

                            <p className="mt-1 text-slate-500">
                              {booking.scheduledTime}
                            </p>
                          </div>

                          {/* Location */}
                          <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-slate-400" />

                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Location
                              </p>
                            </div>

                            <p className="mt-2 font-semibold text-slate-800">
                              {booking.address?.addressLine ||
                                "Address unavailable"}
                            </p>

                            <p className="mt-1 text-slate-500">
                              {booking.address?.city || ""}
                              {booking.address?.county
                                ? `, ${booking.address.county}`
                                : ""}
                            </p>
                          </div>
                        </div>

                        {/* Amount */}
                        {booking.totalAmount && (
                          <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Booking Amount
                            </p>

                            <p className="mt-1 font-bold text-slate-900">
                              KSh{" "}
                              {Number(
                                booking.totalAmount
                              ).toLocaleString("en-KE")}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 flex-col gap-3 lg:w-44">
                        <Link
                          href={`/staff/bookings/${booking.id}`}
                          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          View Details
                        </Link>

                        {action && (
                          <button
                            type="button"
                            disabled={
                              updatingBooking === booking.id
                            }
                            onClick={() =>
                              handleStatusUpdate(
                                booking.id,
                                action.nextStatus
                              )
                            }
                            className={`inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                              action.nextStatus === "COMPLETED"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            {updatingBooking === booking.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              action.label
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
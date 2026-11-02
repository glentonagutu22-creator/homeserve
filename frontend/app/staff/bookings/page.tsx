
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
  ArrowRight,
  ClipboardList,
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
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "IN_PROGRESS":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "COMPLETED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "CANCELLED":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
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

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
  color: "blue" | "amber" | "emerald";
}) {
  const styles = {
    blue: {
      icon: "bg-blue-50 text-blue-700",
      number: "text-[#061F35]",
      border: "border-blue-100",
    },
    amber: {
      icon: "bg-amber-50 text-amber-700",
      number: "text-amber-700",
      border: "border-amber-100",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-700",
      number: "text-emerald-700",
      border: "border-emerald-100",
    },
  };

  const style = styles[color];

  return (
    <div className={`min-w-0 border ${style.border} bg-white p-3.5 shadow-sm sm:p-5`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
            {label}
          </p>
          <p className={`mt-2 text-2xl font-bold tabular-nums sm:text-3xl ${style.number}`}>
            {value}
          </p>
          <p className="mt-1 text-[10px] leading-4 text-slate-400 sm:text-xs">
            {description}
          </p>
        </div>

        <div className={`flex h-9 w-9 shrink-0 items-center justify-center sm:h-11 sm:w-11 ${style.icon}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
    </div>
  );
}

export default function StaffBookingsPage() {
  const [assignments, setAssignments] = useState<StaffAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");

  async function loadAssignments() {
    try {
      setLoading(true);
      setError("");

      const result = await getMyAssignments();
      setAssignments(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load your bookings"
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
        err instanceof Error ? err.message : "Failed to update booking"
      );
    } finally {
      setUpdatingBooking(null);
    }
  }

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === "ALL") return true;
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

  const filters = [
    ["ALL", "All"],
    ["ASSIGNED", "Assigned"],
    ["IN_PROGRESS", "In Progress"],
    ["COMPLETED", "Completed"],
    ["CANCELLED", "Cancelled"],
  ];

  return (
    <DashboardShell>
      <div className="space-y-5 pb-3 sm:space-y-6">
        {/* Compact page heading */}
        <section className="bg-[#061F35] px-4 py-4 text-white sm:px-6 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
                Staff Workspace
              </p>
              <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                My Bookings
              </h1>
              <p className="mt-1 max-w-xl text-xs leading-5 text-blue-100/75 sm:text-sm">
                View and manage the service jobs assigned to you.
              </p>
            </div>

            <div className="hidden h-11 w-11 shrink-0 items-center justify-center border border-white/15 bg-white/10 sm:flex">
              <ClipboardList className="h-5 w-5 text-blue-100" />
            </div>
          </div>

          <Link
            href="/staff"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 transition hover:text-white sm:hidden"
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            Staff Dashboard
          </Link>
        </section>

        {/* Error */}
        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Overview */}
        <section>
          <div className="mb-3">
            <h2 className="text-base font-bold text-[#061F35] sm:text-lg">
              Booking Overview
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              A quick summary of your assigned service jobs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4">
            <SummaryCard
              label="Total Assignments"
              value={totalAssignments}
              description="All assigned jobs"
              icon={BriefcaseBusiness}
              color="blue"
            />

            <SummaryCard
              label="Active Jobs"
              value={activeAssignments}
              description="Jobs requiring attention"
              icon={Clock3}
              color="amber"
            />

            <div className="col-span-2 sm:col-span-1">
              <SummaryCard
                label="Completed"
                value={completedAssignments}
                description="Successfully completed"
                icon={CheckCircle2}
                color="emerald"
              />
            </div>
          </div>
        </section>

        {/* Filters */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#061F35] sm:text-lg">
                Filter Bookings
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Select a booking status.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {filteredAssignments.length} shown
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`shrink-0 border px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                  filter === value
                    ? "border-[#061F35] bg-[#061F35] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Assigned bookings */}
        <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 sm:px-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                Assigned Jobs
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
                {filteredAssignments.length} job
                {filteredAssignments.length === 1 ? "" : "s"} found
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center bg-blue-50 text-blue-700">
              <BriefcaseBusiness className="h-4 w-4" />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[240px] items-center justify-center px-5 py-12">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                Loading your bookings...
              </div>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center bg-slate-100 text-slate-500">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-bold text-slate-900">
                No bookings found
              </p>
              <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-500">
                {filter === "ALL"
                  ? "You don't have any assigned jobs yet."
                  : "There are no bookings with this status."}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile two-column cards */}
              <div className="grid grid-cols-2 gap-2.5 p-2.5 sm:hidden">
                {filteredAssignments.map((assignment) => {
                  const booking = assignment.booking;
                  const action = getNextAction(booking.status);

                  return (
                    <article
                      key={assignment.id}
                      className="flex min-w-0 flex-col border border-slate-200 bg-white p-2.5"
                    >
                      <div className="flex min-w-0 items-start justify-between gap-1">
                        <p className="break-all text-[10px] font-bold text-[#061F35]">
                          {booking.bookingNumber}
                        </p>
                        <span
                          className={`shrink-0 border px-1.5 py-0.5 text-[9px] font-bold ${statusClass(
                            booking.status
                          )}`}
                        >
                          {statusLabel(booking.status)}
                        </span>
                      </div>

                      <h3 className="mt-2 line-clamp-2 min-h-8 text-xs font-bold leading-4 text-blue-700">
                        {booking.service.name}
                      </h3>

                      <div className="mt-2 space-y-2 border-t border-slate-100 pt-2">
                        <div className="flex min-w-0 items-start gap-1.5">
                          <UserRound className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />
                          <p className="min-w-0 break-words text-[10px] leading-4 text-slate-600">
                            {booking.user.name}
                          </p>
                        </div>

                        <div className="flex min-w-0 items-start gap-1.5">
                          <CalendarDays className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />
                          <div className="min-w-0 text-[10px] leading-4 text-slate-600">
                            <p>{formatDate(booking.scheduledDate)}</p>
                            <p className="text-slate-400">
                              {booking.scheduledTime}
                            </p>
                          </div>
                        </div>

                        <div className="flex min-w-0 items-start gap-1.5">
                          <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />
                          <p className="min-w-0 break-words text-[10px] leading-4 text-slate-600">
                            {booking.address?.city ||
                              booking.address?.addressLine ||
                              "Address unavailable"}
                          </p>
                        </div>
                      </div>

                      {booking.totalAmount && (
                        <p className="mt-2 border-t border-slate-100 pt-2 text-[10px] font-bold text-slate-800">
                          KSh{" "}
                          {Number(booking.totalAmount).toLocaleString("en-KE")}
                        </p>
                      )}

                      <div className="mt-auto space-y-1.5 pt-3">
                        <Link
                          href={`/staff/bookings/${booking.id}`}
                          className="flex h-8 w-full items-center justify-center border border-slate-300 text-[10px] font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          View Details
                        </Link>

                        {action && (
                          <button
                            type="button"
                            disabled={updatingBooking === booking.id}
                            onClick={() =>
                              handleStatusUpdate(
                                booking.id,
                                action.nextStatus
                              )
                            }
                            className={`flex h-8 w-full items-center justify-center gap-1 px-1 text-[10px] font-bold text-white transition disabled:opacity-60 ${
                              action.nextStatus === "COMPLETED"
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            {updatingBooking === booking.id ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Updating
                              </>
                            ) : (
                              action.label
                            )}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Tablet and desktop layout */}
              <div className="hidden divide-y divide-slate-100 sm:block">
                {filteredAssignments.map((assignment) => {
                  const booking = assignment.booking;
                  const action = getNextAction(booking.status);

                  return (
                    <article
                      key={assignment.id}
                      className="p-4 transition hover:bg-slate-50/70 sm:p-5"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-[#061F35]">
                              {booking.bookingNumber}
                            </h3>
                            <span
                              className={`border px-2 py-1 text-[10px] font-bold ${statusClass(
                                booking.status
                              )}`}
                            >
                              {statusLabel(booking.status)}
                            </span>
                          </div>

                          <p className="mt-1.5 text-sm font-bold text-blue-700">
                            {booking.service.name}
                          </p>

                          <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-3">
                            <div className="bg-slate-50 p-3">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Customer
                              </p>
                              <p className="mt-1 text-xs font-semibold text-slate-800">
                                {booking.user.name}
                              </p>
                              <p className="mt-1 break-words text-xs text-slate-500">
                                {booking.user.phone || booking.user.email}
                              </p>
                            </div>

                            <div className="bg-slate-50 p-3">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Schedule
                              </p>
                              <p className="mt-1 text-xs font-semibold text-slate-800">
                                {formatDate(booking.scheduledDate)}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {booking.scheduledTime}
                              </p>
                            </div>

                            <div className="col-span-2 bg-slate-50 p-3 xl:col-span-1">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Location
                              </p>
                              <p className="mt-1 text-xs font-semibold text-slate-800">
                                {booking.address?.addressLine ||
                                  "Address unavailable"}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {booking.address?.city || ""}
                                {booking.address?.county
                                  ? `, ${booking.address.county}`
                                  : ""}
                              </p>
                            </div>
                          </div>

                          {booking.totalAmount && (
                            <p className="mt-3 text-xs font-bold text-slate-700">
                              Booking Amount: KSh{" "}
                              {Number(booking.totalAmount).toLocaleString(
                                "en-KE"
                              )}
                            </p>
                          )}
                        </div>

                        <div className="flex shrink-0 flex-row gap-2 lg:w-40 lg:flex-col">
                          <Link
                            href={`/staff/bookings/${booking.id}`}
                            className="inline-flex h-10 flex-1 items-center justify-center border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                          >
                            View Details
                          </Link>

                          {action && (
                            <button
                              type="button"
                              disabled={updatingBooking === booking.id}
                              onClick={() =>
                                handleStatusUpdate(
                                  booking.id,
                                  action.nextStatus
                                )
                              }
                              className={`inline-flex h-10 flex-1 items-center justify-center gap-2 px-3 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                action.nextStatus === "COMPLETED"
                                  ? "bg-emerald-600 hover:bg-emerald-700"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }`}
                            >
                              {updatingBooking === booking.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Updating
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
            </>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}

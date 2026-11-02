
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Loader2,
  MapPin,
  UserRound,
  ClipboardList,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { getMyAssignments } from "@/lib/staff";
import type { StaffAssignment } from "@/types/staff";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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

export default function StaffSchedulePage() {
  const [assignments, setAssignments] = useState<StaffAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSchedule() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyAssignments();
        setAssignments(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load schedule"
        );
      } finally {
        setLoading(false);
      }
    }

    loadSchedule();
  }, []);

  /*
   * Get all non-cancelled assignments and sort them by scheduled date.
   */
  const scheduledAssignments = useMemo(() => {
    return [...assignments]
      .filter((assignment) => assignment.booking.status !== "CANCELLED")
      .sort(
        (a, b) =>
          new Date(a.booking.scheduledDate).getTime() -
          new Date(b.booking.scheduledDate).getTime()
      );
  }, [assignments]);

  /*
   * Group assignments by calendar date.
   */
  const groupedByDate = useMemo(() => {
    return scheduledAssignments.reduce((groups, assignment) => {
      const date = assignment.booking.scheduledDate.split("T")[0];

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(assignment);

      return groups;
    }, {} as Record<string, StaffAssignment[]>);
  }, [scheduledAssignments]);

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
                My Schedule
              </h1>

              <p className="mt-1 max-w-xl text-xs leading-5 text-blue-100/75 sm:text-sm">
                View your assigned HomeServe jobs by scheduled date.
              </p>
            </div>

            <div className="hidden h-11 w-11 shrink-0 items-center justify-center border border-white/15 bg-white/10 sm:flex">
              <CalendarDays className="h-5 w-5 text-blue-100" />
            </div>
          </div>

          <Link
            href="/staff/bookings"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 transition hover:text-white sm:hidden"
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            My Bookings
          </Link>
        </section>

        {/* Error */}
        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              Loading schedule...
            </div>
          </div>
        ) : scheduledAssignments.length === 0 ? (
          /* Empty State */
          <div className="border border-slate-200 bg-white px-5 py-12 text-center shadow-sm sm:px-8 sm:py-14">
            <div className="mx-auto flex h-12 w-12 items-center justify-center bg-blue-50 text-[#061F35]">
              <CalendarDays className="h-5 w-5" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-[#061F35] sm:text-xl">
              No scheduled jobs
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
              You currently have no assigned jobs on your schedule.
            </p>

            <Link
              href="/staff/bookings"
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 bg-[#061F35] px-4 text-xs font-semibold text-white transition hover:bg-[#082B49] sm:h-11 sm:px-5 sm:text-sm"
            >
              View My Bookings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          /* Schedule */
          <div className="space-y-4 sm:space-y-5">
            {Object.entries(groupedByDate).map(([date, dayAssignments]) => (
              <section
                key={date}
                className="overflow-hidden border border-slate-200 bg-white shadow-sm"
              >
                {/* Date Heading */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-3 py-3.5 sm:px-5 sm:py-4">
                  <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-100 text-[#061F35] sm:h-10 sm:w-10">
                      <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-xs font-bold leading-5 text-[#061F35] sm:text-base">
                        {formatDate(dayAssignments[0].booking.scheduledDate)}
                      </h2>

                      <p className="text-[10px] text-slate-500 sm:text-xs">
                        {dayAssignments.length}{" "}
                        {dayAssignments.length === 1 ? "job" : "jobs"} scheduled
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 border border-slate-200 bg-white px-2 py-1 text-[9px] font-bold text-slate-600 sm:px-3 sm:text-xs">
                    {dayAssignments.length}{" "}
                    {dayAssignments.length === 1 ? "Assignment" : "Assignments"}
                  </span>
                </div>

                {/* Mobile two-column job cards */}
                <div className="grid grid-cols-2 gap-2.5 p-2.5 sm:hidden">
                  {dayAssignments.map((assignment) => {
                    const booking = assignment.booking;

                    return (
                      <Link
                        key={assignment.id}
                        href={`/staff/bookings/${booking.id}`}
                        className="group flex min-w-0 flex-col border border-slate-200 bg-white p-2.5 transition hover:border-blue-200 hover:bg-blue-50/30"
                      >
                        <div className="flex min-w-0 flex-col items-start gap-1.5">
                          <span className="break-all text-[10px] font-bold text-[#061F35]">
                            {booking.bookingNumber}
                          </span>

                          <span
                            className={`border px-1.5 py-0.5 text-[9px] font-bold ${statusClass(
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
                            <Clock3 className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />
                            <p className="min-w-0 text-[10px] leading-4 text-slate-600">
                              {booking.scheduledTime}
                            </p>
                          </div>

                          <div className="flex min-w-0 items-start gap-1.5">
                            <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />
                            <p className="min-w-0 break-words text-[10px] leading-4 text-slate-600">
                              {booking.address
                                ? `${booking.address.city}, ${booking.address.county}`
                                : "Location not provided"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-2">
                          <span className="text-[9px] font-semibold text-slate-500">
                            View job
                          </span>
                          <ArrowRight className="h-3 w-3 text-blue-600 transition group-hover:translate-x-0.5" />
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Tablet and desktop job list */}
                <div className="hidden divide-y divide-slate-100 sm:block">
                  {dayAssignments.map((assignment) => {
                    const booking = assignment.booking;

                    return (
                      <Link
                        key={assignment.id}
                        href={`/staff/bookings/${booking.id}`}
                        className="group block p-4 transition hover:bg-slate-50 sm:p-5"
                      >
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                          {/* Booking Information */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-bold text-[#061F35]">
                                {booking.bookingNumber}
                              </span>

                              <span
                                className={`border px-2 py-1 text-[10px] font-bold ${statusClass(
                                  booking.status
                                )}`}
                              >
                                {statusLabel(booking.status)}
                              </span>
                            </div>

                            <p className="mt-1.5 text-sm font-semibold text-blue-700">
                              {booking.service.name}
                            </p>

                            <div className="mt-3 flex flex-col gap-2 text-xs text-[#082B49] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
                              <div className="flex items-center gap-2">
                                <UserRound className="h-3.5 w-3.5 text-blue-600" />
                                <span>{booking.user.name}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-blue-600" />
                                <span>
                                  {booking.address
                                    ? `${booking.address.city}, ${booking.address.county}`
                                    : "Location not provided"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Job Details */}
                          <div className="grid grid-cols-3 gap-2 xl:min-w-[390px]">
                            <div className="border border-slate-200 bg-slate-50 p-3">
                              <div className="flex items-center gap-1.5">
                                <Clock3 className="h-3.5 w-3.5 text-[#061F35]" />
                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                  Time
                                </p>
                              </div>
                              <p className="mt-2 text-xs font-semibold text-[#061F35]">
                                {booking.scheduledTime}
                              </p>
                            </div>

                            <div className="border border-slate-200 bg-slate-50 p-3">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-[#061F35]" />
                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                  Location
                                </p>
                              </div>
                              <p className="mt-2 truncate text-xs font-semibold text-[#061F35]">
                                {booking.address
                                  ? booking.address.city
                                  : "Not provided"}
                              </p>
                            </div>

                            <div className="border border-slate-200 bg-slate-50 p-3">
                              <div className="flex items-center gap-1.5">
                                <BriefcaseBusiness className="h-3.5 w-3.5 text-[#061F35]" />
                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                  Amount
                                </p>
                              </div>
                              <p className="mt-2 text-xs font-semibold text-[#061F35]">
                                {booking.totalAmount
                                  ? `KSh ${Number(
                                      booking.totalAmount
                                    ).toLocaleString("en-KE")}`
                                  : "Quote"}
                              </p>
                            </div>
                          </div>

                          {/* Arrow */}
                          <div className="hidden shrink-0 xl:flex xl:items-center">
                            <div className="flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-[#061F35] transition group-hover:bg-blue-50">
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="sm:hidden">
          <Link
            href="/staff/bookings"
            className="flex h-10 items-center justify-center gap-2 border border-slate-200 bg-white text-xs font-semibold text-[#061F35] transition hover:bg-slate-50"
          >
            <ClipboardList className="h-4 w-4" />
            View All My Bookings
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}

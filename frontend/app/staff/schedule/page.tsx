
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
      return "border-blue-100 bg-blue-50 text-blue-700";

    case "IN_PROGRESS":
      return "border-amber-100 bg-amber-50 text-amber-700";

    case "COMPLETED":
      return "border-green-100 bg-green-50 text-green-700";

    case "CANCELLED":
      return "border-red-100 bg-red-50 text-red-700";

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
  const [assignments, setAssignments] =
    useState<StaffAssignment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadSchedule() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getMyAssignments();

        setAssignments(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load schedule"
        );
      } finally {
        setLoading(false);
      }
    }

    loadSchedule();
  }, []);

  /*
   * Get all non-cancelled assignments and
   * sort them by scheduled date.
   */
  const scheduledAssignments =
    useMemo(() => {
      return [...assignments]
        .filter(
          (assignment) =>
            assignment.booking.status !==
            "CANCELLED"
        )
        .sort(
          (a, b) =>
            new Date(
              a.booking.scheduledDate
            ).getTime() -
            new Date(
              b.booking.scheduledDate
            ).getTime()
        );
    }, [assignments]);

  /*
   * Group assignments by calendar date.
   */
  const groupedByDate =
    useMemo(() => {
      return scheduledAssignments.reduce(
        (
          groups,
          assignment
        ) => {
          const date =
            assignment.booking.scheduledDate.split(
              "T"
            )[0];

          if (!groups[date]) {
            groups[date] = [];
          }

          groups[date].push(
            assignment
          );

          return groups;
        },
        {} as Record<
          string,
          StaffAssignment[]
        >
      );
    }, [scheduledAssignments]);

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
                My Schedule
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                View your assigned HomeServe jobs by
                scheduled date.
              </p>
            </div>

            <Link
              href="/staff/bookings"
              className="hidden items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 sm:inline-flex"
            >
              My Bookings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              Loading schedule...
            </div>
          </div>
        ) : scheduledAssignments.length ===
          0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <CalendarDays className="h-6 w-6 text-[#061F35]" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#061F35]">
              No scheduled jobs
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You currently have no assigned jobs
              on your schedule.
            </p>

            <Link
              href="/staff/bookings"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#061F35] px-5 text-sm font-semibold text-white transition hover:bg-[#082B49]"
            >
              View My Bookings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          /* Schedule */
          <div className="space-y-6">
            {Object.entries(
              groupedByDate
            ).map(
              ([
                date,
                dayAssignments,
              ]) => (
                <section
                  key={date}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* Date Heading */}
                  <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                          <CalendarDays className="h-5 w-5 text-[#061F35]" />
                        </div>

                        <div>
                          <h2 className="text-lg font-bold text-[#061F35]">
                            {formatDate(
                              dayAssignments[0]
                                .booking
                                .scheduledDate
                            )}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            {
                              dayAssignments.length
                            }{" "}
                            {dayAssignments.length ===
                            1
                              ? "job"
                              : "jobs"}{" "}
                            scheduled
                          </p>
                        </div>
                      </div>

                      <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#082B49] sm:block">
                        {
                          dayAssignments.length
                        }{" "}
                        {dayAssignments.length ===
                        1
                          ? "Assignment"
                          : "Assignments"}
                      </div>
                    </div>
                  </div>

                  {/* Jobs */}
                  <div className="divide-y divide-slate-100">
                    {dayAssignments.map(
                      (assignment) => {
                        const booking =
                          assignment.booking;

                        return (
                          <Link
                            key={
                              assignment.id
                            }
                            href={`/staff/bookings/${booking.id}`}
                            className="group block p-5 transition hover:bg-slate-50 sm:p-6"
                          >
                            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                              {/* Booking Information */}
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2.5">
                                  <span className="font-bold text-[#061F35]">
                                    {
                                      booking.bookingNumber
                                    }
                                  </span>

                                  <span
                                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClass(
                                      booking.status
                                    )}`}
                                  >
                                    {statusLabel(
                                      booking.status
                                    )}
                                  </span>
                                </div>

                                <p className="mt-2 font-semibold text-blue-700">
                                  {
                                    booking
                                      .service
                                      .name
                                  }
                                </p>

                                <div className="mt-4 flex flex-col gap-2 text-sm text-[#082B49] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
                                  <div className="flex items-center gap-2">
                                    <UserRound className="h-4 w-4 text-blue-600" />

                                    <span>
                                      {
                                        booking
                                          .user
                                          .name
                                      }
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-blue-600" />

                                    <span>
                                      {booking
                                        .address
                                        ? `${booking.address.city}, ${booking.address.county}`
                                        : "Location not provided"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Job Details */}
                              <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[430px]">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                  <div className="flex items-center gap-2">
                                    <Clock3 className="h-4 w-4 text-[#061F35]" />

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                      Time
                                    </p>
                                  </div>

                                  <p className="mt-2 text-sm font-semibold text-[#061F35]">
                                    {
                                      booking
                                        .scheduledTime
                                    }
                                  </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-[#061F35]" />

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                      Location
                                    </p>
                                  </div>

                                  <p className="mt-2 text-sm font-semibold text-[#061F35]">
                                    {booking
                                      .address
                                      ? booking
                                          .address
                                          .city
                                      : "Not provided"}
                                  </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                  <div className="flex items-center gap-2">
                                    <BriefcaseBusiness className="h-4 w-4 text-[#061F35]" />

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                      Amount
                                    </p>
                                  </div>

                                  <p className="mt-2 text-sm font-semibold text-[#061F35]">
                                    {booking.totalAmount
                                      ? `KSh ${Number(
                                          booking.totalAmount
                                        ).toLocaleString(
                                          "en-KE"
                                        )}`
                                      : "Quote"}
                                  </p>
                                </div>
                              </div>

                              {/* Arrow */}
                              <div className="hidden shrink-0 xl:flex xl:items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#061F35] transition group-hover:bg-slate-50">
                                  <ArrowRight className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      }
                    )}
                  </div>
                </section>
              )
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
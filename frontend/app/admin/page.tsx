"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";

import { getBookings } from "@/lib/bookings";
import { getStaff } from "@/lib/staff";
import { getQuotes } from "@/lib/quotes";

import type { Booking } from "@/types/booking";
import type { Staff } from "@/types/staff";
import type { Quote } from "@/types/quote";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-KE",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function statusClass(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700";

    case "CONFIRMED":
      return "bg-blue-50 text-blue-700";

    case "ASSIGNED":
      return "bg-indigo-50 text-indigo-700";

    case "IN_PROGRESS":
      return "bg-orange-50 text-orange-700";

    case "COMPLETED":
      return "bg-green-50 text-green-700";

    case "CANCELLED":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function quoteStatusClass(status: string) {
  switch (status) {
    case "SENT":
      return "bg-blue-50 text-blue-700";

    case "ACCEPTED":
      return "bg-green-50 text-green-700";

    case "REJECTED":
      return "bg-red-50 text-red-700";

    case "EXPIRED":
      return "bg-slate-100 text-slate-600";

    default:
      return "bg-amber-50 text-amber-700";
  }
}

export default function AdminDashboardPage() {
  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [staff, setStaff] =
    useState<Staff[]>([]);

  const [quotes, setQuotes] =
    useState<Quote[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          bookingData,
          staffData,
          quoteData,
        ] = await Promise.all([
          getBookings(),
          getStaff(),
          getQuotes(),
        ]);

        setBookings(bookingData);
        setStaff(staffData);
        setQuotes(quoteData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const statistics = useMemo(() => {
    const pending = bookings.filter(
      (booking) =>
        booking.status === "PENDING"
    ).length;

    const active = bookings.filter(
      (booking) =>
        booking.status === "ASSIGNED" ||
        booking.status === "IN_PROGRESS"
    ).length;

    const completed = bookings.filter(
      (booking) =>
        booking.status === "COMPLETED"
    ).length;

    const cancelled = bookings.filter(
      (booking) =>
        booking.status === "CANCELLED"
    ).length;

    const availableStaff = staff.filter(
      (member) =>
        member.isAvailable
    ).length;

    const pendingQuotes = quotes.filter(
      (quote) =>
        quote.status === "PENDING" ||
        quote.status === "SENT"
    ).length;

    const revenue = bookings.reduce(
      (total, booking) => {
        if (
          booking.status ===
            "COMPLETED" &&
          booking.totalAmount
        ) {
          return (
            total +
            Number(
              booking.totalAmount
            )
          );
        }

        return total;
      },
      0
    );

    return {
      pending,
      active,
      completed,
      cancelled,
      availableStaff,
      pendingQuotes,
      revenue,
    };
  }, [bookings, staff, quotes]);

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      )
      .slice(0, 6);
  }, [bookings]);

  const upcomingBookings = useMemo(() => {
    return [...bookings]
      .filter(
        (booking) =>
          booking.status !==
            "COMPLETED" &&
          booking.status !==
            "CANCELLED"
      )
      .sort(
        (a, b) =>
          new Date(
            a.scheduledDate
          ).getTime() -
          new Date(
            b.scheduledDate
          ).getTime()
      )
      .slice(0, 5);
  }, [bookings]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading admin dashboard...
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            HomeServe Overview
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor bookings, staff, quotes, and
            service operations.
          </p>
        </section>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Main statistics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={bookings.length}
            description="All bookings"
          />

          <StatCard
            title="Pending Bookings"
            value={statistics.pending}
            description="Awaiting confirmation"
          />

          <StatCard
            title="Active Jobs"
            value={statistics.active}
            description="Assigned or in progress"
          />

          <StatCard
            title="Completed Jobs"
            value={statistics.completed}
            description="Successfully completed"
          />
        </section>

        {/* Secondary statistics */}
        <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Available Staff"
            value={`${statistics.availableStaff}/${staff.length}`}
            description="Currently available"
          />

          <StatCard
            title="Pending Quotes"
            value={statistics.pendingQuotes}
            description="Require attention"
          />

          <StatCard
            title="Cancelled"
            value={statistics.cancelled}
            description="Cancelled bookings"
          />

          <StatCard
            title="Completed Revenue"
            value={`KSh ${statistics.revenue.toLocaleString()}`}
            description="From completed bookings"
          />
        </section>

        {/* Quick actions */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/bookings"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <p className="font-bold text-slate-900">
                Manage Bookings
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Review and manage customer bookings.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                Open bookings →
              </span>
            </Link>

            <Link
              href="/admin/staff"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <p className="font-bold text-slate-900">
                Manage Staff
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Assign staff and manage availability.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                Open staff →
              </span>
            </Link>

            <Link
              href="/admin/quotes"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <p className="font-bold text-slate-900">
                Manage Quotes
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Review and send customer quotes.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                Open quotes →
              </span>
            </Link>

            <Link
              href="/admin/reports"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <p className="font-bold text-slate-900">
                View Reports
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Analyze HomeServe operations.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                Open reports →
              </span>
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          {/* Recent bookings */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Bookings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest customer activity.
                </p>
              </div>

              <Link
                href="/admin/bookings"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No bookings yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {recentBookings.map(
                  (booking) => (
                    <Link
                      key={booking.id}
                      href={`/bookings/${booking.id}`}
                      className="block px-6 py-4 hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {
                              booking.bookingNumber
                            }
                          </p>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            {
                              booking
                                .service
                                .name
                            }
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                              booking.status
                            )}`}
                          >
                            {
                              booking.status
                            }
                          </span>

                          <p className="mt-2 text-xs text-slate-400">
                            {formatDate(
                              booking.createdAt
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                )}
              </div>
            )}
          </section>

          {/* Upcoming jobs */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Upcoming Jobs
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Active scheduled services.
                </p>
              </div>

              <Link
                href="/admin/bookings"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>

            {upcomingBookings.length ===
            0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No upcoming jobs.
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {upcomingBookings.map(
                  (booking) => (
                    <Link
                      key={booking.id}
                      href={`/bookings/${booking.id}`}
                      className="block px-6 py-4 hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">
                            {
                              booking
                                .service
                                .name
                            }
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {booking
                              .address
                              .city}
                            ,{" "}
                            {booking
                              .address
                              .county}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-slate-900">
                            {formatDate(
                              booking.scheduledDate
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {
                              booking.scheduledTime
                            }
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                )}
              </div>
            )}
          </section>
        </div>

        {/* Staff overview */}
        <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Staff Availability
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current HomeServe workforce availability.
              </p>
            </div>

            <Link
              href="/admin/staff"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Manage staff
            </Link>
          </div>

          {staff.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No staff members have been created yet.
            </div>
          ) : (
            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
              {staff.slice(0, 8).map(
                (member) => (
                  <Link
                    key={member.id}
                    href={`/admin/staff/${member.id}`}
                    className="rounded-lg border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`h-3 w-3 shrink-0 rounded-full ${
                            member.isAvailable
                              ? "bg-green-500"
                              : "bg-slate-300"
                          }`}
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {
                              member.user
                                .name
                            }
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {
                              member.staffType
                            }
                          </p>
                        </div>
                      </div>

                      <span className="text-xs text-slate-400">
                        →
                      </span>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </section>

        {/* Quote overview */}
        <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Quote Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest quote requests and decisions.
              </p>
            </div>

            <Link
              href="/admin/quotes"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Manage quotes
            </Link>
          </div>

          {quotes.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No quotes yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {quotes.slice(0, 5).map(
                (quote) => (
                  <Link
                    key={quote.id}
                    href={`/admin/quotes/${quote.id}`}
                    className="flex flex-col gap-3 px-6 py-4 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        Quote
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Booking{" "}
                        {
                          quote
                            .booking
                            .bookingNumber
                        }
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {quote.finalAmount && (
                        <span className="text-sm font-semibold text-slate-900">
                          KSh{" "}
                          {Number(
                            quote.finalAmount
                          ).toLocaleString()}
                        </span>
                      )}

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${quoteStatusClass(
                          quote.status
                        )}`}
                      >
                        {quote.status}
                      </span>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
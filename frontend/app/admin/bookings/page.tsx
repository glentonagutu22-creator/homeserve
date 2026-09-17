"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";

import { getAdminBookings } from "@/lib/bookings";
import type {
  Booking,
  BookingStatus,
} from "@/types/booking";

const statusOptions: Array<
  "ALL" | BookingStatus
> = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function formatCurrency(amount: string | null) {
  if (!amount) {
    return "Pending quote";
  }

  return `KSh ${Number(amount).toLocaleString(
    "en-KE"
  )}`;
}

function getStatusClasses(status: BookingStatus) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700";

    case "CONFIRMED":
      return "bg-blue-50 text-blue-700";

    case "ASSIGNED":
      return "bg-indigo-50 text-indigo-700";

    case "IN_PROGRESS":
      return "bg-purple-50 text-purple-700";

    case "COMPLETED":
      return "bg-green-50 text-green-700";

    case "CANCELLED":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getCategoryClasses(
  category: Booking["service"]["category"]
) {
  switch (category) {
    case "CLEANING":
      return "bg-blue-50 text-blue-700";

    case "MOVING":
      return "bg-green-50 text-green-700";

    case "ELECTRICAL":
      return "bg-amber-50 text-amber-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<
    Booking[]
  >([]);

  const [status, setStatus] = useState<
    "ALL" | BookingStatus
  >("ALL");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAdminBookings();

        setBookings(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load bookings"
        );
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus =
        status === "ALL" ||
        booking.status === status;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        booking.bookingNumber
          .toLowerCase()
          .includes(normalizedSearch) ||
        booking.user.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        booking.user.email
          .toLowerCase()
          .includes(normalizedSearch) ||
        booking.service.name
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [bookings, status, search]);

  const stats = useMemo(() => {
    const completedRevenue =
      bookings
        .filter(
          (booking) =>
            booking.status === "COMPLETED"
        )
        .reduce(
          (total, booking) =>
            total +
            Number(
              booking.totalAmount || 0
            ),
          0
        );

    return {
      total: bookings.length,

      pending: bookings.filter(
        (booking) =>
          booking.status === "PENDING"
      ).length,

      active: bookings.filter(
        (booking) =>
          booking.status === "CONFIRMED" ||
          booking.status === "ASSIGNED" ||
          booking.status === "IN_PROGRESS"
      ).length,

      completed: bookings.filter(
        (booking) =>
          booking.status === "COMPLETED"
      ).length,

      revenue: completedRevenue,
    };
  }, [bookings]);

  return (
    <DashboardShell>
      <div className="p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Administration
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Bookings
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage and monitor all HomeServe bookings.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total bookings"
            value={stats.total}
            description="All bookings"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            description="Awaiting action"
          />

          <StatCard
            title="Active"
            value={stats.active}
            description="Current bookings"
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            description="Finished bookings"
          />

          <StatCard
            title="Revenue"
            value={`KSh ${stats.revenue.toLocaleString(
              "en-KE"
            )}`}
            description="Completed bookings"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}
            <div className="w-full lg:max-w-md">
              <label
                htmlFor="booking-search"
                className="sr-only"
              >
                Search bookings
              </label>

              <input
                id="booking-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search booking, customer or service..."
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Status */}
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setStatus(option)
                    }
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      status === option
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {option === "ALL"
                      ? "All"
                      : option.replace(
                          "_",
                          " "
                        )}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Booking
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Service
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Schedule
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      Loading bookings...
                    </td>
                  </tr>
                ) : filteredBookings.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center"
                    >
                      <p className="text-sm font-medium text-slate-700">
                        No bookings found
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Try changing your search or status filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map(
                    (booking) => (
                      <tr
                        key={booking.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-slate-900">
                            {booking.bookingNumber}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {booking.bookingType ===
                            "QUOTE_REQUEST"
                              ? "Quote request"
                              : "Instant"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-900">
                            {booking.user.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {booking.user.email}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-900">
                            {booking.service.name}
                          </p>

                          <span
                            className={`mt-1 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${getCategoryClasses(
                              booking.service.category
                            )}`}
                          >
                            {booking.service.category}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700">
                            {formatDate(
                              booking.scheduledDate
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {booking.scheduledTime}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-slate-900">
                            {formatCurrency(
                              booking.totalAmount
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                              booking.status
                            )}`}
                          >
                            {booking.status.replace(
                              "_",
                              " "
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/admin/bookings/${booking.id}`}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-slate-100 lg:hidden">
            {loading ? (
              <div className="px-5 py-12 text-center text-sm text-slate-500">
                Loading bookings...
              </div>
            ) : filteredBookings.length ===
              0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-sm font-medium text-slate-700">
                  No bookings found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Try changing your filters.
                </p>
              </div>
            ) : (
              filteredBookings.map(
                (booking) => (
                  <div
                    key={booking.id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {booking.bookingNumber}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {booking.user.name}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                          booking.status
                        )}`}
                      >
                        {booking.status.replace(
                          "_",
                          " "
                        )}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400">
                          Service
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-800">
                          {booking.service.name}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Amount
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {formatCurrency(
                            booking.totalAmount
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Date
                        </p>

                        <p className="mt-1 text-sm text-slate-800">
                          {formatDate(
                            booking.scheduledDate
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Time
                        </p>

                        <p className="mt-1 text-sm text-slate-800">
                          {booking.scheduledTime}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="mt-5 block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      View booking
                    </Link>
                  </div>
                )
              )
            )}
          </div>
        </div>

        {/* Result count */}
        {!loading && (
          <p className="mt-4 text-xs text-slate-500">
            Showing{" "}
            {filteredBookings.length} of{" "}
            {bookings.length} bookings
          </p>
        )}
      </div>
    </DashboardShell>
  );
}
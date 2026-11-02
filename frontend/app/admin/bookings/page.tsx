

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

const statusOptions: Array<"ALL" | BookingStatus> = [
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

  return `KSh ${Number(amount).toLocaleString("en-KE")}`;
}

function getStatusClasses(status: BookingStatus) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-100";

    case "CONFIRMED":
      return "bg-blue-50 text-blue-700 border-blue-100";

    case "ASSIGNED":
      return "bg-indigo-50 text-indigo-700 border-indigo-100";

    case "IN_PROGRESS":
      return "bg-purple-50 text-purple-700 border-purple-100";

    case "COMPLETED":
      return "bg-green-50 text-green-700 border-green-100";

    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-100";

    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function getCategoryClasses(
  category: Booking["service"]["category"]
) {
  switch (category) {
    case "CLEANING":
      return "bg-emerald-50 text-emerald-700";

    case "MOVING":
      return "bg-amber-50 text-amber-700";

    case "ELECTRICAL":
      return "bg-indigo-50 text-indigo-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [status, setStatus] = useState<"ALL" | BookingStatus>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminBookings();

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
    const normalizedSearch = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus =
        status === "ALL" || booking.status === status;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        booking.bookingNumber.toLowerCase().includes(normalizedSearch) ||
        booking.user.name.toLowerCase().includes(normalizedSearch) ||
        booking.user.email.toLowerCase().includes(normalizedSearch) ||
        booking.service.name.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [bookings, status, search]);

  const stats = useMemo(() => {
    const completedRevenue = bookings
      .filter((booking) => booking.status === "COMPLETED")
      .reduce(
        (total, booking) =>
          total + Number(booking.totalAmount || 0),
        0
      );

    return {
      total: bookings.length,

      pending: bookings.filter(
        (booking) => booking.status === "PENDING"
      ).length,

      active: bookings.filter(
        (booking) =>
          booking.status === "CONFIRMED" ||
          booking.status === "ASSIGNED" ||
          booking.status === "IN_PROGRESS"
      ).length,

      completed: bookings.filter(
        (booking) => booking.status === "COMPLETED"
      ).length,

      revenue: completedRevenue,
    };
  }, [bookings]);

  return (
    <DashboardShell>
      <div className="min-w-0 px-3 py-4 pb-24 sm:px-6 sm:py-6 lg:px-8 lg:py-8 lg:pb-8">
        {/* Page heading */}
        <div className="mb-5 sm:mb-7">
          <div className="border border-[#061F35] bg-[#061F35] px-4 py-4 sm:px-5 sm:py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">
              HomeServe Management
            </p>

            <h1 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Bookings
            </h1>

            <p className="mt-1 text-xs leading-relaxed text-blue-100 sm:text-sm">
              Manage and monitor all HomeServe bookings.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-5 grid grid-cols-2 gap-2.5 sm:mb-7 sm:gap-4 xl:grid-cols-5">
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

          <div className="col-span-2 xl:col-span-1">
            <StatCard
              title="Revenue"
              value={`KSh ${stats.revenue.toLocaleString("en-KE")}`}
              description="Completed bookings"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700 sm:text-sm">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-5 border border-slate-200 bg-white p-3 sm:mb-6 sm:p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="w-full xl:max-w-md">
              <label htmlFor="booking-search" className="sr-only">
                Search bookings
              </label>

              <input
                id="booking-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search booking, customer or service..."
                className="h-10 w-full border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 sm:h-11 sm:px-4 sm:text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStatus(option)}
                  className={`border px-2.5 py-2 text-[10px] font-semibold transition sm:px-3 sm:text-xs ${
                    status === option
                      ? "border-[#061F35] bg-[#061F35] text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {option === "ALL"
                    ? "All"
                    : option.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="overflow-hidden border border-slate-200 bg-white">
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
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <p className="text-sm font-medium text-slate-700">
                        No bookings found
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Try changing your search or status filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {booking.bookingNumber}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {booking.bookingType === "QUOTE_REQUEST"
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
                          className={`mt-1 inline-flex px-2 py-1 text-[11px] font-semibold ${getCategoryClasses(
                            booking.service.category
                          )}`}
                        >
                          {booking.service.category}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700">
                          {formatDate(booking.scheduledDate)}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {booking.scheduledTime}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {formatCurrency(booking.totalAmount)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                            booking.status
                          )}`}
                        >
                          {booking.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          className="text-sm font-semibold text-[#082B49] hover:text-blue-700"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile and tablet cards */}
          <div className="p-2.5 sm:p-4 lg:hidden">
            {loading ? (
              <div className="px-3 py-12 text-center text-sm text-slate-500">
                Loading bookings...
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="px-3 py-12 text-center">
                <p className="text-sm font-medium text-slate-700">
                  No bookings found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Try changing your search or status filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex min-w-0 flex-col border border-slate-200 bg-white p-2.5 transition hover:border-slate-300 sm:p-4"
                  >
                    <div className="flex min-w-0 flex-col items-start gap-2">
                      <p className="w-full break-words text-xs font-bold text-slate-900 sm:text-sm">
                        {booking.bookingNumber}
                      </p>

                      <span
                        className={`max-w-full border px-2 py-1 text-[9px] font-semibold leading-tight sm:text-[11px] ${getStatusClasses(
                          booking.status
                        )}`}
                      >
                        {booking.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-3 min-w-0">
                      <p className="text-[10px] text-slate-400 sm:text-xs">
                        Customer
                      </p>

                      <p className="mt-1 break-words text-xs font-medium text-slate-800 sm:text-sm">
                        {booking.user.name}
                      </p>
                    </div>

                    <div className="mt-3 min-w-0">
                      <p className="text-[10px] text-slate-400 sm:text-xs">
                        Service
                      </p>

                      <p className="mt-1 break-words text-xs font-medium text-slate-800 sm:text-sm">
                        {booking.service.name}
                      </p>

                      <span
                        className={`mt-1.5 inline-flex max-w-full px-2 py-1 text-[9px] font-semibold leading-tight sm:text-[10px] ${getCategoryClasses(
                          booking.service.category
                        )}`}
                      >
                        {booking.service.category}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 sm:text-xs">
                          Date
                        </p>

                        <p className="mt-1 break-words text-[11px] font-medium text-slate-700 sm:text-xs">
                          {formatDate(booking.scheduledDate)}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 sm:text-xs">
                          Time
                        </p>

                        <p className="mt-1 break-words text-[11px] font-medium text-slate-700 sm:text-xs">
                          {booking.scheduledTime}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 min-w-0">
                      <p className="text-[10px] text-slate-400 sm:text-xs">
                        Amount
                      </p>

                      <p className="mt-1 break-words text-xs font-bold text-slate-900 sm:text-sm">
                        {formatCurrency(booking.totalAmount)}
                      </p>
                    </div>

                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="mt-3 block w-full bg-[#061F35] px-2 py-2 text-center text-[10px] font-semibold text-white transition hover:bg-[#0b3455] sm:mt-4 sm:py-2.5 sm:text-xs"
                    >
                      View booking
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Result count */}
        {!loading && (
          <p className="mt-4 text-xs text-slate-500">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        )}
      </div>
    </DashboardShell>
  );
}

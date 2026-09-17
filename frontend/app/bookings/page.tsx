"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  ArrowRight,
  ClipboardList,
  CheckCircle2,
  LoaderCircle,
  XCircle,
  CircleDollarSign,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { getBookings } from "@/lib/bookings";
import type {
  Booking,
  BookingStatus,
} from "@/types/booking";

const categoryStyles = {
  CLEANING: {
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    accent: "bg-blue-600",
    icon: "bg-blue-50 text-blue-600",
  },

  MOVING: {
    badge: "bg-green-50 text-green-700 border-green-100",
    accent: "bg-green-600",
    icon: "bg-green-50 text-green-600",
  },

  ELECTRICAL: {
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    accent: "bg-amber-500",
    icon: "bg-amber-50 text-amber-600",
  },
};

const statusStyles: Record<
  BookingStatus,
  {
    badge: string;
    dot: string;
  }
> = {
  PENDING: {
    badge:
      "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-amber-500",
  },

  CONFIRMED: {
    badge:
      "bg-blue-50 text-blue-700 border-blue-100",
    dot: "bg-blue-600",
  },

  ASSIGNED: {
    badge:
      "bg-purple-50 text-purple-700 border-purple-100",
    dot: "bg-purple-600",
  },

  IN_PROGRESS: {
    badge:
      "bg-cyan-50 text-cyan-700 border-cyan-100",
    dot: "bg-cyan-600",
  },

  COMPLETED: {
    badge:
      "bg-green-50 text-green-700 border-green-100",
    dot: "bg-green-600",
  },

  CANCELLED: {
    badge:
      "bg-red-50 text-red-700 border-red-100",
    dot: "bg-red-600",
  },
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatCategory(category: string) {
  return (
    category.charAt(0) +
    category.slice(1).toLowerCase()
  );
}

function formatStatus(status: BookingStatus) {
  return status.replace("_", " ");
}

function formatAmount(
  amount: string | null
) {
  if (amount === null) {
    return "Price pending";
  }

  return `KES ${Number(amount).toLocaleString(
    "en-KE",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

export default function BookingsPage() {
  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        setError(null);

        const data = await getBookings();

        setBookings(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load bookings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  const stats = useMemo(() => {
    return {
      total: bookings.length,

      active: bookings.filter(
        (booking) =>
          booking.status === "PENDING" ||
          booking.status === "CONFIRMED" ||
          booking.status === "ASSIGNED" ||
          booking.status === "IN_PROGRESS"
      ).length,

      completed: bookings.filter(
        (booking) =>
          booking.status === "COMPLETED"
      ).length,

      cancelled: bookings.filter(
        (booking) =>
          booking.status === "CANCELLED"
      ).length,
    };
  }, [bookings]);

  return (
    <DashboardShell>
      <div className="space-y-7">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <ClipboardList className="h-4 w-4" />

              <span>Customer Account</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#061F35]">
              My Bookings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Keep track of your HomeServe services,
              schedules, locations and booking status.
            </p>
          </div>

          <Link
            href="/services"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#061F35]
              px-5
              py-3
              text-sm
              font-bold
              text-white
              shadow-sm
              transition
              hover:bg-[#082B49]
            "
          >
            Book a Service

            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* =====================================================
            SUMMARY
        ===================================================== */}

        {!loading && !error && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

            {/* Total */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Total
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#061F35]">
                    {stats.total}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ClipboardList className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                All bookings
              </p>
            </div>

            {/* Active */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Active
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#061F35]">
                    {stats.active}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Clock3 className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Currently in progress
              </p>
            </div>

            {/* Completed */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Completed
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#061F35]">
                    {stats.completed}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Successfully completed
              </p>
            </div>

            {/* Cancelled */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Cancelled
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#061F35]">
                    {stats.cancelled}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <XCircle className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Cancelled bookings
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            BOOKINGS HEADER
        ===================================================== */}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#061F35]">
              Your bookings
            </h2>

            {!loading && !error && bookings.length > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                {bookings.length}{" "}
                {bookings.length === 1
                  ? "booking"
                  : "bookings"}{" "}
                found
              </p>
            )}
          </div>
        </div>

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600" />

            <p className="mt-4 text-sm font-semibold text-[#061F35]">
              Loading your bookings...
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Please wait while we retrieve your
              bookings.
            </p>
          </div>
        ) : error ? (

          /* =====================================================
             ERROR
          ===================================================== */

          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <XCircle className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-red-900">
              Unable to load bookings
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-red-700">
              {error}
            </p>
          </div>

        ) : bookings.length === 0 ? (

          /* =====================================================
             EMPTY STATE
          ===================================================== */

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="px-6 py-14 text-center sm:px-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <CalendarDays className="h-8 w-8" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#061F35]">
                No bookings yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                You haven't booked a HomeServe service
                yet. Explore our services and schedule
                your first appointment.
              </p>

              <Link
                href="/services"
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-blue-700
                "
              >
                Explore Services

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        ) : (

          /* =====================================================
             BOOKINGS LIST
          ===================================================== */

          <div className="space-y-4">
            {bookings.map((booking) => {
              const category =
                booking.service.category;

              const categoryStyle =
                categoryStyles[category];

              const statusStyle =
                statusStyles[booking.status];

              return (
                <article
                  key={booking.id}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    shadow-sm
                    transition
                    hover:border-gray-300
                    hover:shadow-md
                  "
                >
                  {/* Category accent */}

                  <div
                    className={`absolute inset-y-0 left-0 w-1 ${categoryStyle.accent}`}
                  />

                  <div className="p-5 pl-6 sm:p-6 sm:pl-7">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                      {/* =================================================
                          BOOKING INFORMATION
                      ================================================= */}

                      <div className="min-w-0 flex-1">

                        {/* Badges */}

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`
                              inline-flex
                              items-center
                              rounded-full
                              border
                              px-3
                              py-1
                              text-[11px]
                              font-bold
                              uppercase
                              tracking-wide
                              ${categoryStyle.badge}
                            `}
                          >
                            {formatCategory(category)}
                          </span>

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              border
                              px-3
                              py-1
                              text-[11px]
                              font-bold
                              uppercase
                              tracking-wide
                              ${statusStyle.badge}
                            `}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                            />

                            {formatStatus(
                              booking.status
                            )}
                          </span>
                        </div>

                        {/* Service name */}

                        <div className="mt-4">
                          <h3 className="text-xl font-bold text-[#061F35]">
                            {booking.service.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            Booking #
                            {booking.bookingNumber}
                          </p>
                        </div>

                        {/* Details */}

                        <div className="mt-5 grid gap-4 sm:grid-cols-3">

                          {/* Date */}

                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-600">
                              <CalendarDays className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                Date
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-700">
                                {formatDate(
                                  booking.scheduledDate
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Time */}

                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-600">
                              <Clock3 className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                Time
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-700">
                                {booking.scheduledTime}
                              </p>
                            </div>
                          </div>

                          {/* Location */}

                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-600">
                              <MapPin className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                Location
                              </p>

                              <p className="mt-1 truncate text-sm font-semibold text-gray-700">
                                {booking.address.label}
                                {" · "}
                                {booking.address.city}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* =================================================
                          AMOUNT + ACTION
                      ================================================= */}

                      <div className="flex flex-col gap-4 border-t border-gray-100 pt-5 lg:min-w-[190px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">

                        <div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <CircleDollarSign className="h-4 w-4" />

                            <p className="text-[10px] font-bold uppercase tracking-wide">
                              Amount
                            </p>
                          </div>

                          <p className="mt-1 text-lg font-extrabold text-[#061F35]">
                            {formatAmount(
                              booking.totalAmount
                            )}
                          </p>
                        </div>

                        <Link
                          href={`/bookings/${booking.id}`}
                          className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[#061F35]
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-white
                            transition
                            hover:bg-[#082B49]
                          "
                        >
                          View Booking

                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
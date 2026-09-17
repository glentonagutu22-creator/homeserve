"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import { useAuth } from "@/components/AuthProvider";

import { getBookings } from "@/lib/bookings";
import { getQuotes } from "@/lib/quotes";
import { getAddresses } from "@/lib/addresses";

import type { Booking } from "@/types/booking";
import type { Quote } from "@/types/quote";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-KE",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function statusClass(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-50 text-green-700";

    case "ASSIGNED":
      return "bg-blue-50 text-blue-700";

    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700";

    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700";

    case "CANCELLED":
      return "bg-red-50 text-red-700";

    case "PENDING":
      return "bg-slate-100 text-slate-600";

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

export default function DashboardPage() {
  const { user } = useAuth();

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [quotes, setQuotes] =
    useState<Quote[]>([]);

  const [addressCount, setAddressCount] =
    useState(0);

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
          quoteData,
          addressData,
        ] = await Promise.all([
          getBookings(),
          getQuotes(),
          getAddresses(),
        ]);

        setBookings(bookingData);
        setQuotes(quoteData);
        setAddressCount(
          addressData.length
        );
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

  const upcomingBookings = useMemo(() => {
    return bookings
      .filter(
        (booking) =>
          booking.status !== "COMPLETED" &&
          booking.status !== "CANCELLED"
      )
      .sort(
        (a, b) =>
          new Date(
            a.scheduledDate
          ).getTime() -
          new Date(
            b.scheduledDate
          ).getTime()
      );
  }, [bookings]);

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
      .slice(0, 5);
  }, [bookings]);

  const pendingQuotes = quotes.filter(
    (quote) =>
      quote.status === "PENDING" ||
      quote.status === "SENT"
  ).length;

  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "COMPLETED"
    ).length;

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[70vh] items-center justify-center bg-white">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =====================================================
            WELCOME
        ===================================================== */}

        <section className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            Customer Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Welcome back,{" "}
            {user?.name?.split(" ")[0] ||
              "there"}
            !
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your HomeServe services,
            bookings, quotes, and addresses.
          </p>
        </section>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* =====================================================
            STATS
        ===================================================== */}

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
  <StatCard
    title="Total Bookings"
    value={bookings.length}
    description="All your service bookings"
  />

  <StatCard
    title="Upcoming"
    value={upcomingBookings.length}
    description="Active upcoming bookings"
  />

  <StatCard
    title="Pending Quotes"
    value={pendingQuotes}
    description="Quotes awaiting action"
  />

  <StatCard
    title="Completed"
    value={completedBookings}
    description="Successfully completed"
  />
</section>

        {/* =====================================================
            BOOK A SERVICE
        ===================================================== */}

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Book a Service
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose the service you need.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {/* Cleaning */}

            <Link
              href="/services/cleaning"
              className="
                group
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
                transition
                hover:-translate-y-1
                hover:border-blue-200
                hover:shadow-lg
              "
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src="/images/cleaning-brand.png/image.png"
                  alt="Cleaning services"
                  className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-500
                    group-hover:scale-105
                  "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="absolute bottom-3 left-4">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-700">
                    Cleaning
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-slate-900">
                  Cleaning Services
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Professional home and property
                  cleaning.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                  Explore cleaning →
                </span>
              </div>
            </Link>

            {/* Moving */}

            <Link
              href="/services/moving"
              className="
                group
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
                transition
                hover:-translate-y-1
                hover:border-green-200
                hover:shadow-lg
              "
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src="/images/moving-brand.png/image.png"
                  alt="Moving services"
                  className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-500
                    group-hover:scale-105
                  "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="absolute bottom-3 left-4">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-green-700">
                    Moving
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-slate-900">
                  Moving Services
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Reliable moving and relocation
                  services.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-green-600">
                  Explore moving →
                </span>
              </div>
            </Link>

            {/* Electrical */}

            <Link
              href="/services/electrical"
              className="
                group
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
                transition
                hover:-translate-y-1
                hover:border-amber-200
                hover:shadow-lg
              "
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src="/images/electrical-brand.png/image.png"
                  alt="Electrical services"
                  className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-500
                    group-hover:scale-105
                  "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="absolute bottom-3 left-4">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-amber-700">
                    Electrical
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-slate-900">
                  Electrical Services
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Professional electrical
                  installation and repair.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-amber-600">
                  Explore electrical →
                </span>
              </div>
            </Link>

          </div>
        </section>

        {/* =====================================================
            UPCOMING + ADDRESSES
        ===================================================== */}

        <div className="mt-10 grid gap-8 lg:grid-cols-3">

          {/* Upcoming bookings */}

          <section className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Upcoming Bookings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your next scheduled services.
                </p>
              </div>

              <Link
                href="/bookings"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>

            <div className="mt-4">
              {upcomingBookings.length ===
              0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                  <p className="font-medium text-slate-900">
                    No upcoming bookings
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Book a service when you
                    need one.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings
                    .slice(0, 3)
                    .map((booking) => (
                      <Link
                        key={booking.id}
                        href={`/bookings/${booking.id}`}
                        className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="font-semibold text-slate-900">
                                {
                                  booking.bookingNumber
                                }
                              </h3>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                                  booking.status
                                )}`}
                              >
                                {
                                  booking.status
                                }
                              </span>
                            </div>

                            <p className="mt-2 text-sm font-medium text-slate-700">
                              {
                                booking
                                  .service
                                  .name
                              }
                            </p>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-sm font-semibold text-slate-900">
                              {formatDate(
                                booking.scheduledDate
                              )}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {
                                booking.scheduledTime
                              }
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </section>

          {/* Addresses */}

          <section>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Addresses
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Saved service locations.
                </p>
              </div>

              <Link
                href="/addresses"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Manage
              </Link>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-3xl font-bold text-slate-900">
                {addressCount}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                saved{" "}
                {addressCount === 1
                  ? "address"
                  : "addresses"}
              </p>

              <Link
                href="/addresses"
                className="mt-5 block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                Manage Addresses
              </Link>
            </div>
          </section>
        </div>

        {/* =====================================================
            RECENT BOOKINGS
        ===================================================== */}

        <section className="mt-10 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Bookings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest HomeServe activity.
              </p>
            </div>

            <Link
              href="/bookings"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>

          {recentBookings.length ===
          0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">
                You haven't made any bookings
                yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {recentBookings.map(
                (booking) => (
                  <Link
                    key={booking.id}
                    href={`/bookings/${booking.id}`}
                    className="flex flex-col gap-3 px-6 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {
                          booking.bookingNumber
                        }
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {
                          booking
                            .service
                            .name
                        }
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-500">
                        {formatDate(
                          booking.createdAt
                        )}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </section>

        {/* =====================================================
            QUOTES
        ===================================================== */}

        {quotes.length > 0 && (
          <section className="mt-10 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Quotes
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review quotes for your
                  requested services.
                </p>
              </div>

              <Link
                href="/quotes"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-slate-200">
              {quotes
                .slice(0, 3)
                .map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/quotes/${quote.id}`}
                    className="flex flex-col gap-3 px-6 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        Quote
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Booking{" "}
                        {
                          quote.booking
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
                ))}
            </div>
          </section>
        )}

      </div>
    </DashboardShell>
  );
}
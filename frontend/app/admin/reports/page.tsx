"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileText,
  Loader2,
  RefreshCw,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";

import { getReports } from "@/lib/reports";

import type { ReportsData } from "@/lib/reports";

function formatCurrency(amount: number) {
  return `KSh ${amount.toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-KE",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function statusClass(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700";

    case "CONFIRMED":
      return "bg-green-50 text-green-700";

    case "ASSIGNED":
      return "bg-blue-50 text-blue-700";

    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700";

    case "CANCELLED":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function categoryLabel(category: string) {
  switch (category) {
    case "CLEANING":
      return "Cleaning";

    case "MOVING":
      return "Moving";

    case "ELECTRICAL":
      return "Electrical";

    default:
      return category;
  }
}

function categoryBarClass(category: string) {
  switch (category) {
    case "CLEANING":
      return "bg-blue-600";

    case "MOVING":
      return "bg-green-600";

    case "ELECTRICAL":
      return "bg-amber-500";

    default:
      return "bg-slate-600";
  }
}

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

function StatCard({
  title,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminReportsPage() {
  const [reports, setReports] =
    useState<ReportsData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const data = await getReports();

      setReports(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load reports."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const maxCategoryBookings =
    useMemo(() => {
      if (!reports) {
        return 1;
      }

      return Math.max(
        reports.bookingsByCategory.CLEANING,
        reports.bookingsByCategory.MOVING,
        reports.bookingsByCategory.ELECTRICAL,
        1
      );
    }, [reports]);

  const maxServiceBookings =
    useMemo(() => {
      if (!reports) {
        return 1;
      }

      return Math.max(
        ...reports.bookingsByService.map(
          (service) => service.bookings
        ),
        1
      );
    }, [reports]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />

            Loading reports...
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error || !reports) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#061F35]">
              Reports
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Monitor HomeServe platform activity,
              bookings, payments and revenue.
            </p>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <p className="font-semibold text-red-800">
                  Unable to load reports
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error ||
                    "No report data was returned."}
                </p>

                <button
                  type="button"
                  onClick={loadReports}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3">
                  <BarChart3 className="h-6 w-6 text-[#061F35]" />
                </div>

                <h1 className="text-2xl font-bold text-[#061F35]">
                  Reports
                </h1>
              </div>

              <p className="max-w-2xl text-sm text-gray-600">
                Monitor HomeServe bookings, revenue,
                payments, customers, services and
                quotes using live platform data.
              </p>
            </div>

            <button
              type="button"
              onClick={loadReports}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </section>

        {/* =====================================================
            OVERVIEW
        ===================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Bookings"
            value={reports.bookings.total}
            description="All platform bookings"
            icon={
              <ClipboardList className="h-5 w-5" />
            }
          />

          <StatCard
            title="Completed Revenue"
            value={formatCurrency(
              reports.revenue.completed
            )}
            description="Completed payments"
            icon={
              <Wallet className="h-5 w-5" />
            }
          />

          <StatCard
            title="Customers"
            value={reports.users.customers}
            description="Registered customers"
            icon={
              <Users className="h-5 w-5" />
            }
          />

          <StatCard
            title="Active Services"
            value={reports.services.active}
            description="Currently available"
            icon={
              <Activity className="h-5 w-5" />
            }
          />

        </section>

        {/* =====================================================
            BOOKING STATUS + CATEGORIES
        ===================================================== */}

        <section className="grid gap-6 lg:grid-cols-2">

          {/* Booking status */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="font-bold text-[#061F35]">
                  Booking Status
                </h2>

                <p className="text-sm text-gray-500">
                  Current booking distribution
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {Object.entries(
                reports.bookings.byStatus
              ).map(([status, count]) => {
                const percentage =
                  reports.bookings.total > 0
                    ? (count /
                        reports.bookings.total) *
                      100
                    : 0;

                return (
                  <div key={status}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        {status.replace(
                          "_",
                          " "
                        )}
                      </span>

                      <span className="font-semibold text-gray-900">
                        {count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Categories */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-50 p-3">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>

              <div>
                <h2 className="font-bold text-[#061F35]">
                  Service Categories
                </h2>

                <p className="text-sm text-gray-500">
                  Bookings by category
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {(
                [
                  "CLEANING",
                  "MOVING",
                  "ELECTRICAL",
                ] as const
              ).map((category) => {
                const count =
                  reports.bookingsByCategory[
                    category
                  ];

                const percentage =
                  (count /
                    maxCategoryBookings) *
                  100;

                return (
                  <div key={category}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        {categoryLabel(
                          category
                        )}
                      </span>

                      <span className="font-semibold text-gray-900">
                        {count}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${categoryBarClass(
                          category
                        )}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

        {/* =====================================================
            REVENUE + PAYMENTS
        ===================================================== */}

        <section className="grid gap-6 lg:grid-cols-2">

          {/* Revenue */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3">
                <Wallet className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <h2 className="font-bold text-[#061F35]">
                  Revenue
                </h2>

                <p className="text-sm text-gray-500">
                  Payment summary
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs font-medium text-emerald-700">
                  Completed
                </p>

                <p className="mt-1 text-xl font-bold text-emerald-800">
                  {formatCurrency(
                    reports.revenue.completed
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs font-medium text-blue-700">
                  Net Revenue
                </p>

                <p className="mt-1 text-xl font-bold text-blue-800">
                  {formatCurrency(
                    reports.revenue.net
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-xs font-medium text-red-700">
                  Refunded
                </p>

                <p className="mt-1 text-xl font-bold text-red-800">
                  {formatCurrency(
                    reports.revenue.refunded
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-gray-100 p-4">
                <p className="text-xs font-medium text-gray-600">
                  Completed Payments
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {reports.payments.completed}
                </p>
              </div>

            </div>
          </div>

          {/* Payment methods */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-50 p-3">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>

              <div>
                <h2 className="font-bold text-[#061F35]">
                  Payment Methods
                </h2>

                <p className="text-sm text-gray-500">
                  Completed payment breakdown
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {(
                [
                  "MPESA",
                  "CARD",
                  "CASH",
                ] as const
              ).map((method) => {
                const payment =
                  reports.payments.byMethod[
                    method
                  ];

                return (
                  <div
                    key={method}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {method}
                      </p>

                      <p className="text-xs text-gray-500">
                        {payment.count}{" "}
                        {payment.count === 1
                          ? "payment"
                          : "payments"}
                      </p>
                    </div>

                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(
                        payment.amount
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

        {/* =====================================================
            QUOTES
        ===================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-3">
              <FileText className="h-5 w-5 text-amber-600" />
            </div>

            <div>
              <h2 className="font-bold text-[#061F35]">
                Quotes
              </h2>

              <p className="text-sm text-gray-500">
                Quote pipeline
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {Object.entries(
              reports.quotes
            ).map(([status, count]) => (
              <div
                key={status}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4"
              >
                <p className="text-xs font-medium text-gray-500">
                  {status}
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {count}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            SERVICES
        ===================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-bold text-[#061F35]">
              Services
            </h2>

            <p className="text-sm text-gray-500">
              Booking volume by service
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {reports.bookingsByService.map(
              (service) => {
                const percentage =
                  (service.bookings /
                    maxServiceBookings) *
                  100;

                return (
                  <div key={service.id}>
                    <div className="mb-1.5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {service.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {categoryLabel(
                            service.category
                          )}
                        </p>
                      </div>

                      <span className="text-sm font-bold text-gray-900">
                        {service.bookings}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${categoryBarClass(
                          service.category
                        )}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}

            {reports.bookingsByService.length ===
              0 && (
              <p className="py-6 text-center text-sm text-gray-500">
                No active services found.
              </p>
            )}
          </div>
        </section>

        {/* =====================================================
            RECENT BOOKINGS
        ===================================================== */}

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-[#061F35]">
                Recent Bookings
              </h2>

              <p className="text-sm text-gray-500">
                Latest HomeServe activity
              </p>
            </div>

            <Link
              href="/admin/bookings"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all bookings →
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {reports.recentBookings.map(
              (booking) => (
                <Link
                  key={booking.id}
                  href={`/admin/bookings/${booking.id}`}
                  className="block px-6 py-5 transition hover:bg-gray-50"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-semibold text-gray-900">
                          {booking.bookingNumber}
                        </p>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-600">
                        {booking.service.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {booking.user.name} ·{" "}
                        {booking.user.email}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:flex lg:items-center">

                      <div>
                        <p className="text-xs text-gray-400">
                          Scheduled
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {formatDate(
                            booking.scheduledDate
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Amount
                        </p>

                        <p className="mt-1 text-sm font-bold text-gray-900">
                          {booking.totalAmount !==
                          null
                            ? formatCurrency(
                                booking.totalAmount
                              )
                            : "Quote"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Payment
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {booking.payment
                            ? booking.payment.status
                            : "Not paid"}
                        </p>
                      </div>

                    </div>
                  </div>
                </Link>
              )
            )}

            {reports.recentBookings.length ===
              0 && (
              <div className="px-6 py-12 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-gray-300" />

                <p className="mt-3 text-sm text-gray-500">
                  No bookings yet.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            PAYMENT SUMMARY
        ===================================================== */}

        <section className="grid gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />

              <div>
                <p className="text-xs text-gray-500">
                  Completed Payments
                </p>

                <p className="font-bold text-gray-900">
                  {reports.payments.completed}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-amber-600" />

              <div>
                <p className="text-xs text-gray-500">
                  Pending Payments
                </p>

                <p className="font-bold text-gray-900">
                  {reports.payments.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-600" />

              <div>
                <p className="text-xs text-gray-500">
                  Failed Payments
                </p>

                <p className="font-bold text-gray-900">
                  {reports.payments.failed}
                </p>
              </div>
            </div>
          </div>

        </section>

        {/* =====================================================
            ADMIN NAVIGATION
        ===================================================== */}

        <div className="flex justify-start">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </div>

      </div>
    </DashboardShell>
  );
}

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
  return new Date(date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
      return "bg-emerald-500";
    case "MOVING":
      return "bg-amber-500";
    case "ELECTRICAL":
      return "bg-indigo-500";
    default:
      return "bg-slate-600";
  }
}

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  accent: string;
  iconBackground: string;
}

function StatCard({
  title,
  value,
  description,
  icon,
  accent,
  iconBackground,
}: StatCardProps) {
  return (
    <div className="relative min-w-0 overflow-hidden border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
      <div className={`absolute left-0 top-0 h-full w-1 ${accent}`} />

      <div className="flex min-w-0 items-start justify-between gap-2 pl-1">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-slate-500 sm:text-sm">
            {title}
          </p>

          <p className="mt-2 break-words text-lg font-bold tracking-tight text-[#061F35] sm:text-2xl">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
            {description}
          </p>
        </div>

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center sm:h-10 sm:w-10 ${iconBackground}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

interface SectionHeadingProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconClass: string;
}

function SectionHeading({
  title,
  description,
  icon,
  iconClass,
}: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center ${iconClass}`}>
        {icon}
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-bold text-[#061F35] sm:text-base">
          {title}
        </h2>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const data = await getReports();
      setReports(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load reports."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const maxCategoryBookings = useMemo(() => {
    if (!reports) return 1;

    return Math.max(
      reports.bookingsByCategory.CLEANING,
      reports.bookingsByCategory.MOVING,
      reports.bookingsByCategory.ELECTRICAL,
      1
    );
  }, [reports]);

  const maxServiceBookings = useMemo(() => {
    if (!reports) return 1;

    return Math.max(
      ...reports.bookingsByService.map((service) => service.bookings),
      1
    );
  }, [reports]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-600">
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
        <div className="space-y-5">
          <div className="border border-[#061F35] bg-[#061F35] px-4 py-4 sm:px-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-200">
              HomeServe Management
            </p>
            <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">
              Reports & Analytics
            </h1>
            <p className="mt-1 text-xs text-blue-100 sm:text-sm">
              Review platform performance, bookings and financial activity.
            </p>
          </div>

          <div className="border border-red-200 bg-red-50 px-4 py-4">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div className="min-w-0">
                <p className="font-semibold text-red-800">
                  Unable to load reports
                </p>
                <p className="mt-1 break-words text-sm text-red-700">
                  {error || "No report data was returned."}
                </p>

                <button
                  type="button"
                  onClick={loadReports}
                  className="mt-4 inline-flex items-center gap-2 bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
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
      <div className="space-y-5 sm:space-y-7">
        {/* PAGE HEADER */}
        <section className="border border-[#061F35] bg-[#061F35] px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">
                HomeServe Management
              </p>

              <h1 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                Reports & Analytics
              </h1>

              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-blue-100 sm:text-sm">
                Track bookings, revenue, payments and customer activity across
                the platform.
              </p>
            </div>

            <button
              type="button"
              onClick={loadReports}
              className="inline-flex w-full items-center justify-center gap-2 border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20 sm:w-auto sm:text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh reports
            </button>
          </div>
        </section>

        {/* OVERVIEW */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#061F35] sm:text-base">
                Platform Overview
              </h2>
              <p className="text-xs text-slate-500">
                Key performance indicators
              </p>
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Summary
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4 xl:grid-cols-4">
            <StatCard
              title="Total Bookings"
              value={reports.bookings.total}
              description="All platform bookings"
              icon={<ClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />}
              accent="bg-blue-600"
              iconBackground="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="Completed Revenue"
              value={formatCurrency(reports.revenue.completed)}
              description="Completed payments"
              icon={<Wallet className="h-4 w-4 sm:h-5 sm:w-5" />}
              accent="bg-emerald-500"
              iconBackground="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              title="Customers"
              value={reports.users.customers}
              description="Registered customers"
              icon={<Users className="h-4 w-4 sm:h-5 sm:w-5" />}
              accent="bg-indigo-500"
              iconBackground="bg-indigo-50 text-indigo-600"
            />

            <StatCard
              title="Active Services"
              value={reports.services.active}
              description="Currently available"
              icon={<Activity className="h-4 w-4 sm:h-5 sm:w-5" />}
              accent="bg-amber-500"
              iconBackground="bg-amber-50 text-amber-600"
            />
          </div>
        </section>

        {/* BOOKING STATUS + CATEGORIES */}
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="min-w-0 border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionHeading
              title="Booking Status"
              description="Current booking distribution"
              icon={<BarChart3 className="h-5 w-5" />}
              iconClass="bg-blue-50 text-blue-700"
            />

            <div className="mt-5 space-y-4">
              {Object.entries(reports.bookings.byStatus).map(
                ([status, count]) => {
                  const percentage =
                    reports.bookings.total > 0
                      ? (count / reports.bookings.total) * 100
                      : 0;

                  return (
                    <div key={status}>
                      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
                        <span className="font-medium text-slate-700">
                          {status.replace("_", " ")}
                        </span>
                        <span className="font-bold text-slate-900">
                          {count}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden bg-slate-100">
                        <div
                          className="h-full bg-blue-600 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div className="min-w-0 border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionHeading
              title="Service Categories"
              description="Bookings by category"
              icon={<BarChart3 className="h-5 w-5" />}
              iconClass="bg-emerald-50 text-emerald-700"
            />

            <div className="mt-5 space-y-5">
              {(["CLEANING", "MOVING", "ELECTRICAL"] as const).map(
                (category) => {
                  const count = reports.bookingsByCategory[category];
                  const percentage = (count / maxCategoryBookings) * 100;

                  return (
                    <div key={category}>
                      <div className="mb-1.5 flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-medium text-slate-700">
                          {categoryLabel(category)}
                        </span>
                        <span className="font-bold text-slate-900">
                          {count}
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden bg-slate-100">
                        <div
                          className={`h-full ${categoryBarClass(category)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </section>

        {/* REVENUE + PAYMENTS */}
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="min-w-0 border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionHeading
              title="Revenue"
              description="Payment summary"
              icon={<Wallet className="h-5 w-5" />}
              iconClass="bg-emerald-50 text-emerald-700"
            />

            <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">
              <div className="border-l-2 border-emerald-500 bg-emerald-50 p-3 sm:p-4">
                <p className="text-[10px] font-medium text-emerald-700 sm:text-xs">
                  Completed
                </p>
                <p className="mt-1 break-words text-sm font-bold text-emerald-900 sm:text-xl">
                  {formatCurrency(reports.revenue.completed)}
                </p>
              </div>

              <div className="border-l-2 border-blue-500 bg-blue-50 p-3 sm:p-4">
                <p className="text-[10px] font-medium text-blue-700 sm:text-xs">
                  Net Revenue
                </p>
                <p className="mt-1 break-words text-sm font-bold text-blue-900 sm:text-xl">
                  {formatCurrency(reports.revenue.net)}
                </p>
              </div>

              <div className="border-l-2 border-red-500 bg-red-50 p-3 sm:p-4">
                <p className="text-[10px] font-medium text-red-700 sm:text-xs">
                  Refunded
                </p>
                <p className="mt-1 break-words text-sm font-bold text-red-900 sm:text-xl">
                  {formatCurrency(reports.revenue.refunded)}
                </p>
              </div>

              <div className="border-l-2 border-slate-400 bg-slate-100 p-3 sm:p-4">
                <p className="text-[10px] font-medium text-slate-600 sm:text-xs">
                  Completed Payments
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900 sm:text-xl">
                  {reports.payments.completed}
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0 border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionHeading
              title="Payment Methods"
              description="Completed payment breakdown"
              icon={<CreditCard className="h-5 w-5" />}
              iconClass="bg-indigo-50 text-indigo-700"
            />

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {(["MPESA", "CARD", "CASH"] as const).map((method) => {
                const payment = reports.payments.byMethod[method];

                return (
                  <div
                    key={method}
                    className="flex min-w-0 items-center justify-between gap-3 border border-slate-100 bg-slate-50 px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900">
                        {method}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {payment.count}{" "}
                        {payment.count === 1 ? "payment" : "payments"}
                      </p>
                    </div>

                    <p className="break-words text-right text-xs font-bold text-slate-900 sm:text-sm">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* QUOTES */}
        <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <SectionHeading
            title="Quotes"
            description="Quote pipeline"
            icon={<FileText className="h-5 w-5" />}
            iconClass="bg-amber-50 text-amber-700"
          />

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
            {Object.entries(reports.quotes).map(([status, count]) => (
              <div
                key={status}
                className="border border-slate-200 bg-slate-50 p-3 sm:p-4"
              >
                <p className="break-words text-[10px] font-medium text-slate-500 sm:text-xs">
                  {status}
                </p>
                <p className="mt-2 text-xl font-bold text-[#061F35] sm:text-2xl">
                  {count}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div>
            <h2 className="text-sm font-bold text-[#061F35] sm:text-base">
              Services
            </h2>
            <p className="text-xs text-slate-500">
              Booking volume by service
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            {reports.bookingsByService.map((service) => {
              const percentage =
                (service.bookings / maxServiceBookings) * 100;

              return (
                <div key={service.id} className="min-w-0">
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words text-xs font-semibold text-slate-900 sm:text-sm">
                        {service.name}
                      </p>
                      <p className="text-[10px] text-slate-500 sm:text-xs">
                        {categoryLabel(service.category)}
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-bold text-slate-900">
                      {service.bookings}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden bg-slate-100">
                    <div
                      className={`h-full ${categoryBarClass(service.category)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {reports.bookingsByService.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-500 sm:col-span-2">
                No active services found.
              </p>
            )}
          </div>
        </section>

        {/* RECENT BOOKINGS */}
        <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="text-sm font-bold text-[#061F35] sm:text-base">
                Recent Bookings
              </h2>
              <p className="text-xs text-slate-500">
                Latest HomeServe activity
              </p>
            </div>

            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 sm:text-sm"
            >
              View all bookings →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 p-2 sm:block sm:divide-y sm:divide-slate-100 sm:gap-0 sm:p-0">
            {reports.recentBookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/admin/bookings/${booking.id}`}
                className="flex min-w-0 flex-col border border-slate-200 p-3 transition hover:bg-slate-50 sm:border-0 sm:px-5 sm:py-4"
              >
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <p className="break-all text-xs font-bold text-slate-900 sm:text-sm">
                      {booking.bookingNumber}
                    </p>

                    <span
                      className={`px-2 py-1 text-[9px] font-semibold ${statusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="break-words text-xs font-medium text-slate-700">
                    {booking.service.name}
                  </p>

                  <p className="break-words text-[10px] text-slate-500">
                    {booking.user.name}
                  </p>

                  <p className="hidden break-all text-[10px] text-slate-400 sm:block">
                    {booking.user.email}
                  </p>

                  <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 sm:flex sm:items-center sm:justify-end sm:gap-8 sm:border-0 sm:pt-0">
                    <div>
                      <p className="text-[9px] text-slate-400 sm:text-xs">
                        Scheduled
                      </p>
                      <p className="mt-1 text-[10px] font-medium text-slate-700 sm:text-sm">
                        {formatDate(booking.scheduledDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-400 sm:text-xs">
                        Amount
                      </p>
                      <p className="mt-1 break-words text-[10px] font-bold text-slate-900 sm:text-sm">
                        {booking.totalAmount !== null
                          ? formatCurrency(booking.totalAmount)
                          : "Quote"}
                      </p>
                    </div>

                    <div className="col-span-2 sm:col-auto">
                      <p className="text-[9px] text-slate-400 sm:text-xs">
                        Payment
                      </p>
                      <p className="mt-1 text-[10px] font-medium text-slate-700 sm:text-sm">
                        {booking.payment
                          ? booking.payment.status
                          : "Not paid"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {reports.recentBookings.length === 0 && (
              <div className="col-span-2 px-4 py-10 text-center sm:px-6">
                <CheckCircle2 className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">
                  No bookings yet.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* PAYMENT SUMMARY */}
        <section>
          <div className="mb-3">
            <h2 className="text-sm font-bold text-[#061F35] sm:text-base">
              Payment Summary
            </h2>
            <p className="text-xs text-slate-500">
              Payment processing overview
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
            <div className="border border-slate-200 bg-white p-3 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 sm:h-5 sm:w-5" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 sm:text-xs">
                    Completed Payments
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {reports.payments.completed}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 bg-white p-3 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <Activity className="h-4 w-4 shrink-0 text-amber-600 sm:h-5 sm:w-5" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 sm:text-xs">
                    Pending Payments
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {reports.payments.pending}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-2 border border-slate-200 bg-white p-3 sm:col-span-1 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <XCircle className="h-4 w-4 shrink-0 text-red-600 sm:h-5 sm:w-5" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 sm:text-xs">
                    Failed Payments
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {reports.payments.failed}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ADMIN NAVIGATION */}
        <div className="border-t border-slate-200 pt-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 transition hover:text-blue-900 sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}

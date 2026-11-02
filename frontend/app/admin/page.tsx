

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Users,
  Wallet,
  FileText,
  BriefcaseBusiness,
  ArrowRight,
  XCircle,
  TrendingUp,
  ClipboardList,
  Sparkles,
  CalendarCheck,
  UserCheck,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";

import { getBookings } from "@/lib/bookings";
import { getStaff } from "@/lib/staff";
import { getQuotes } from "@/lib/quotes";

import type { Booking } from "@/types/booking";
import type { Staff } from "@/types/staff";
import type { Quote } from "@/types/quote";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-KE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusClass(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "CONFIRMED":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "ASSIGNED":
      return "bg-indigo-50 text-indigo-700 border-indigo-100";
    case "IN_PROGRESS":
      return "bg-orange-50 text-orange-700 border-orange-100";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-100";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function quoteStatusClass(status: string) {
  switch (status) {
    case "SENT":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "ACCEPTED":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "REJECTED":
      return "bg-red-50 text-red-700 border-red-100";
    case "EXPIRED":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-100";
  }
}

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [bookingData, staffData, quoteData] =
          await Promise.all([
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
      (booking) => booking.status === "PENDING"
    ).length;

    const active = bookings.filter(
      (booking) =>
        booking.status === "ASSIGNED" ||
        booking.status === "IN_PROGRESS"
    ).length;

    const completed = bookings.filter(
      (booking) => booking.status === "COMPLETED"
    ).length;

    const cancelled = bookings.filter(
      (booking) => booking.status === "CANCELLED"
    ).length;

    const availableStaff = staff.filter(
      (member) => member.isAvailable
    ).length;

    const pendingQuotes = quotes.filter(
      (quote) =>
        quote.status === "PENDING" ||
        quote.status === "SENT"
    ).length;

    const revenue = bookings.reduce((total, booking) => {
      if (
        booking.status === "COMPLETED" &&
        booking.totalAmount
      ) {
        return total + Number(booking.totalAmount);
      }

      return total;
    }, 0);

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
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 6);
  }, [bookings]);

  const upcomingBookings = useMemo(() => {
    return [...bookings]
      .filter(
        (booking) =>
          booking.status !== "COMPLETED" &&
          booking.status !== "CANCELLED"
      )
      .sort(
        (a, b) =>
          new Date(a.scheduledDate).getTime() -
          new Date(b.scheduledDate).getTime()
      )
      .slice(0, 5);
  }, [bookings]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-[#061F35]" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading admin dashboard...
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-7 bg-slate-50 px-3 py-5 pb-24 sm:space-y-9 sm:px-6 sm:py-8 lg:px-8 lg:pb-8">

        {/* PREMIUM WELCOME HEADER */}

        <section className="relative isolate overflow-hidden bg-[#061F35] px-4 py-5 text-white shadow-sm sm:px-7 sm:py-7">
          <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-64 w-64 rounded-full border-[35px] border-white/[0.04]" />
          <div className="pointer-events-none absolute -bottom-24 right-32 -z-10 h-52 w-52 rounded-full bg-blue-500/[0.08] blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-300" />

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                  Administration Dashboard
                </p>
              </div>

              <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                HomeServe Overview
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                Your central command centre for bookings, workforce,
                customer quotes and service operations.
              </p>
            </div>

            <div className="flex items-center gap-3 border border-white/10 bg-white/[0.06] px-4 py-3 sm:min-w-44">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-blue-400/15 text-blue-200">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-blue-200">
                  Total Bookings
                </p>

                <p className="mt-0.5 text-xl font-bold tabular-nums">
                  {bookings.length}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-[10px] font-medium text-slate-300 sm:text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {statistics.availableStaff} staff available
            </span>

            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              {statistics.pending} pending bookings
            </span>

            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              {statistics.pendingQuotes} pending quotes
            </span>
          </div>
        </section>

        {/* ERROR */}

        {error && (
          <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* MAIN STATISTICS */}

        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#061F35] sm:text-lg">
                Booking Performance
              </h2>

              <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                Overview of your service activity.
              </p>
            </div>

            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
              Primary Metrics
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <PremiumStatCard
              title="Total Bookings"
              value={bookings.length}
              description="All bookings"
              icon={CalendarDays}
              theme="blue"
            />

            <PremiumStatCard
              title="Pending Bookings"
              value={statistics.pending}
              description="Awaiting confirmation"
              icon={Clock}
              theme="amber"
            />

            <PremiumStatCard
              title="Active Jobs"
              value={statistics.active}
              description="Assigned or in progress"
              icon={BriefcaseBusiness}
              theme="violet"
            />

            <PremiumStatCard
              title="Completed Jobs"
              value={statistics.completed}
              description="Successfully completed"
              icon={CheckCircle2}
              theme="emerald"
            />
          </div>
        </section>

        {/* SECONDARY STATISTICS */}

        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#061F35] sm:text-lg">
                Business Overview
              </h2>

              <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                Workforce, quotations and financial performance.
              </p>
            </div>

            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
              Operations
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <PremiumStatCard
              title="Available Staff"
              value={`${statistics.availableStaff}/${staff.length}`}
              description="Currently available"
              icon={Users}
              theme="cyan"
            />

            <PremiumStatCard
              title="Pending Quotes"
              value={statistics.pendingQuotes}
              description="Require attention"
              icon={FileText}
              theme="orange"
            />

            <PremiumStatCard
              title="Cancelled"
              value={statistics.cancelled}
              description="Cancelled bookings"
              icon={XCircle}
              theme="rose"
            />

            <PremiumStatCard
              title="Completed Revenue"
              value={`KSh ${statistics.revenue.toLocaleString()}`}
              description="From completed bookings"
              icon={Wallet}
              theme="emerald"
              compactValue
            />
          </div>
        </section>

        {/* QUICK ACTIONS */}

        <section>
          <div className="mb-4">
            <h2 className="text-base font-bold text-[#061F35] sm:text-lg">
              Quick Actions
            </h2>

            <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
              Jump directly into your most-used management areas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <QuickAction
              href="/admin/bookings"
              title="Manage Bookings"
              description="Review customer bookings."
              action="Open bookings"
              icon={CalendarDays}
              theme="blue"
            />

            <QuickAction
              href="/admin/staff"
              title="Manage Staff"
              description="Assign staff and manage availability."
              action="Open staff"
              icon={Users}
              theme="violet"
            />

            <QuickAction
              href="/admin/quotes"
              title="Manage Quotes"
              description="Review and send customer quotes."
              action="Open quotes"
              icon={FileText}
              theme="amber"
            />

            <QuickAction
              href="/admin/reports"
              title="View Reports"
              description="Analyze HomeServe operations."
              action="Open reports"
              icon={Wallet}
              theme="emerald"
            />
          </div>
        </section>

        {/* RECENT BOOKINGS AND UPCOMING JOBS */}

        <div className="grid gap-5 xl:grid-cols-2">

          {/* RECENT BOOKINGS */}

          <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              title="Recent Bookings"
              description="Latest customer activity."
              href="/admin/bookings"
              action="View all"
              icon={ClipboardList}
              theme="blue"
            />

            {recentBookings.length === 0 ? (
              <EmptyState message="No bookings yet." />
            ) : (
              <div className="grid grid-cols-2 gap-2 p-3 sm:gap-3 sm:p-4">
                {recentBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/bookings/${booking.id}`}
                    className="group min-w-0 border border-slate-100 bg-slate-50/70 p-3 transition hover:border-blue-200 hover:bg-blue-50/40 sm:p-4"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-blue-100 text-blue-700">
                        <CalendarDays className="h-3.5 w-3.5" />
                      </span>

                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                    </div>

                    <p className="mt-3 truncate text-xs font-bold text-[#061F35] sm:text-sm">
                      {booking.bookingNumber}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-slate-500 sm:text-xs">
                      {booking.service.name}
                    </p>

                    <span
                      className={`mt-3 inline-block max-w-full truncate border px-2 py-1 text-[9px] font-bold sm:text-[10px] ${statusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status.replace("_", " ")}
                    </span>

                    <p className="mt-2 text-[9px] text-slate-400 sm:text-[10px]">
                      {formatDate(booking.createdAt)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* UPCOMING JOBS */}

          <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              title="Upcoming Jobs"
              description="Active scheduled services."
              href="/admin/bookings"
              action="View all"
              icon={CalendarCheck}
              theme="violet"
            />

            {upcomingBookings.length === 0 ? (
              <EmptyState message="No upcoming jobs." />
            ) : (
              <div className="grid grid-cols-2 gap-2 p-3 sm:gap-3 sm:p-4">
                {upcomingBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/bookings/${booking.id}`}
                    className="group min-w-0 border border-slate-100 bg-slate-50/70 p-3 transition hover:border-violet-200 hover:bg-violet-50/40 sm:p-4"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-violet-100 text-violet-700">
                        <BriefcaseBusiness className="h-3.5 w-3.5" />
                      </span>

                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-600" />
                    </div>

                    <p className="mt-3 truncate text-xs font-bold text-[#061F35] sm:text-sm">
                      {booking.service.name}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-slate-500 sm:text-xs">
                      {booking.address.city}, {booking.address.county}
                    </p>

                    <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-violet-700 sm:text-xs">
                      <CalendarDays className="h-3 w-3 shrink-0" />

                      <span className="truncate">
                        {formatDate(booking.scheduledDate)}
                      </span>
                    </div>

                    <p className="mt-2 text-[9px] text-slate-400 sm:text-[10px]">
                      {booking.scheduledTime}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* STAFF AVAILABILITY */}

        <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            title="Staff Availability"
            description="Current HomeServe workforce availability."
            href="/admin/staff"
            action="Manage staff"
            icon={UserCheck}
            theme="emerald"
          />

          {staff.length === 0 ? (
            <EmptyState message="No staff members have been created yet." />
          ) : (
            <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-2 sm:gap-4 sm:p-5 lg:grid-cols-4">
              {staff.slice(0, 8).map((member) => (
                <Link
                  key={member.id}
                  href={`/admin/staff/${member.id}`}
                  className="group min-w-0 border border-slate-100 bg-slate-50/70 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/40 sm:p-4"
                >
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center ${
                        member.isAvailable
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <Users className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[#061F35] sm:text-sm">
                        {member.user.name}
                      </p>

                      <p className="mt-0.5 truncate text-[9px] font-medium text-slate-500 sm:text-[10px]">
                        {member.staffType}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        member.isAvailable
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />

                    <p
                      className={`text-[10px] font-bold sm:text-xs ${
                        member.isAvailable
                          ? "text-emerald-700"
                          : "text-slate-500"
                      }`}
                    >
                      {member.isAvailable ? "Available" : "Unavailable"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* QUOTE ACTIVITY */}

        <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            title="Quote Activity"
            description="Latest quote requests and decisions."
            href="/admin/quotes"
            action="Manage quotes"
            icon={FileText}
            theme="amber"
          />

          {quotes.length === 0 ? (
            <EmptyState message="No quotes yet." />
          ) : (
            <div className="grid grid-cols-2 gap-2 p-3 sm:gap-3 sm:p-4">
              {quotes.slice(0, 6).map((quote) => (
                <Link
                  key={quote.id}
                  href={`/admin/quotes/${quote.id}`}
                  className="group min-w-0 border border-slate-100 bg-slate-50/70 p-3 transition hover:border-amber-200 hover:bg-amber-50/40 sm:p-4"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-amber-100 text-amber-700">
                      <FileText className="h-3.5 w-3.5" />
                    </span>

                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-amber-600" />
                  </div>

                  <p className="mt-3 text-xs font-bold text-[#061F35] sm:text-sm">
                    Quote
                  </p>

                  <p className="mt-1 truncate text-[10px] text-slate-500 sm:text-xs">
                    Booking {quote.booking.bookingNumber}
                  </p>

                  {quote.finalAmount && (
                    <p className="mt-2 text-xs font-bold text-[#061F35] sm:text-sm">
                      KSh {Number(quote.finalAmount).toLocaleString()}
                    </p>
                  )}

                  <span
                    className={`mt-3 inline-block max-w-full truncate border px-2 py-1 text-[9px] font-bold sm:text-[10px] ${quoteStatusClass(
                      quote.status
                    )}`}
                  >
                    {quote.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}

/* PREMIUM STATISTIC CARD */

const statThemes = {
  blue: {
    icon: "bg-blue-100 text-blue-700",
    accent: "bg-blue-500",
    value: "text-blue-950",
    background: "from-blue-50/80 to-white",
  },
  amber: {
    icon: "bg-amber-100 text-amber-700",
    accent: "bg-amber-500",
    value: "text-amber-950",
    background: "from-amber-50/80 to-white",
  },
  violet: {
    icon: "bg-violet-100 text-violet-700",
    accent: "bg-violet-500",
    value: "text-violet-950",
    background: "from-violet-50/80 to-white",
  },
  emerald: {
    icon: "bg-emerald-100 text-emerald-700",
    accent: "bg-emerald-500",
    value: "text-emerald-950",
    background: "from-emerald-50/80 to-white",
  },
  cyan: {
    icon: "bg-cyan-100 text-cyan-700",
    accent: "bg-cyan-500",
    value: "text-cyan-950",
    background: "from-cyan-50/80 to-white",
  },
  orange: {
    icon: "bg-orange-100 text-orange-700",
    accent: "bg-orange-500",
    value: "text-orange-950",
    background: "from-orange-50/80 to-white",
  },
  rose: {
    icon: "bg-rose-100 text-rose-700",
    accent: "bg-rose-500",
    value: "text-rose-950",
    background: "from-rose-50/80 to-white",
  },
};

function PremiumStatCard({
  title,
  value,
  description,
  icon: Icon,
  theme,
  compactValue = false,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  theme: keyof typeof statThemes;
  compactValue?: boolean;
}) {
  const colors = statThemes[theme];

  return (
    <div
      className={`group relative min-w-0 overflow-hidden border border-slate-200 bg-gradient-to-br ${colors.background} p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-4`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${colors.accent}`} />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold leading-relaxed text-slate-500 sm:text-xs">
            {title}
          </p>

          <p
            className={`mt-2 break-words font-extrabold tracking-tight ${
              compactValue
                ? "text-sm sm:text-xl"
                : "text-xl sm:text-2xl"
            } ${colors.value}`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center sm:h-10 sm:w-10 ${colors.icon}`}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>

      <p className="mt-2 text-[9px] leading-relaxed text-slate-400 sm:text-[10px]">
        {description}
      </p>

      <div
        className={`absolute bottom-0 left-0 h-0.5 w-0 ${colors.accent} transition-all duration-300 group-hover:w-full`}
      />
    </div>
  );
}

/* QUICK ACTION CARD */

const actionThemes = {
  blue: {
    icon: "bg-blue-100 text-blue-700",
    link: "text-blue-700",
    hover: "group-hover:border-blue-200",
    background: "group-hover:bg-blue-50/40",
  },
  violet: {
    icon: "bg-violet-100 text-violet-700",
    link: "text-violet-700",
    hover: "group-hover:border-violet-200",
    background: "group-hover:bg-violet-50/40",
  },
  amber: {
    icon: "bg-amber-100 text-amber-700",
    link: "text-amber-700",
    hover: "group-hover:border-amber-200",
    background: "group-hover:bg-amber-50/40",
  },
  emerald: {
    icon: "bg-emerald-100 text-emerald-700",
    link: "text-emerald-700",
    hover: "group-hover:border-emerald-200",
    background: "group-hover:bg-emerald-50/40",
  },
};

function QuickAction({
  href,
  title,
  description,
  action,
  icon: Icon,
  theme,
}: {
  href: string;
  title: string;
  description: string;
  action: string;
  icon: React.ElementType;
  theme: keyof typeof actionThemes;
}) {
  const colors = actionThemes[theme];

  return (
    <Link
      href={href}
      className={`group min-w-0 border border-slate-200 bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${colors.hover} ${colors.background}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className={`flex h-9 w-9 items-center justify-center sm:h-11 sm:w-11 ${colors.icon}`}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>

        <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600" />
      </div>

      <p className="mt-4 text-xs font-bold text-[#061F35] sm:text-base">
        {title}
      </p>

      <p className="mt-1 min-h-8 text-[10px] leading-relaxed text-slate-500 sm:min-h-10 sm:text-xs">
        {description}
      </p>

      <span
        className={`mt-3 flex items-center gap-1 text-[10px] font-bold sm:mt-4 sm:text-xs ${colors.link}`}
      >
        {action}
        <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

/* SECTION HEADER */

const sectionThemes = {
  blue: "bg-blue-100 text-blue-700",
  violet: "bg-violet-100 text-violet-700",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
};

function SectionHeader({
  title,
  description,
  href,
  action,
  icon: Icon,
  theme,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
  icon: React.ElementType;
  theme: keyof typeof sectionThemes;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-4 sm:px-5 sm:py-5">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center ${sectionThemes[theme]}`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-[#061F35] sm:text-base">
            {title}
          </h2>

          <p className="mt-0.5 truncate text-[9px] text-slate-500 sm:text-xs">
            {description}
          </p>
        </div>
      </div>

      <Link
        href={href}
        className="shrink-0 text-[10px] font-bold text-blue-700 transition hover:text-blue-900 sm:text-xs"
      >
        {action}
      </Link>
    </div>
  );
}

/* EMPTY STATE */

function EmptyState({ message }: { message: string }) {
  return (
    <div className="px-4 py-10 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center bg-slate-100 text-slate-400">
        <ClipboardList className="h-5 w-5" />
      </div>

      <p className="mt-3 text-xs font-medium text-slate-500">
        {message}
      </p>
    </div>
  );
}


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
  Sparkles,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { getBookings } from "@/lib/bookings";
import type {
  Booking,
  BookingStatus,
} from "@/types/booking";

const categoryStyles = {
  CLEANING: {
    badge: "border-sky-200 bg-sky-50 text-sky-700",
    accent: "bg-sky-500",
    icon: "bg-sky-100 text-sky-700",
  },
  MOVING: {
    badge: "border-orange-200 bg-orange-50 text-orange-700",
    accent: "bg-orange-500",
    icon: "bg-orange-100 text-orange-700",
  },
  ELECTRICAL: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    accent: "bg-amber-500",
    icon: "bg-amber-100 text-amber-700",
  },
};

const statusStyles: Record<
  BookingStatus,
  { badge: string; dot: string }
> = {
  PENDING: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  CONFIRMED: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-600",
  },
  ASSIGNED: {
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-600",
  },
  IN_PROGRESS: {
    badge: "bg-cyan-50 text-cyan-700 border-cyan-200",
    dot: "bg-cyan-600",
  },
  COMPLETED: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-600",
  },
  CANCELLED: {
    badge: "bg-red-50 text-red-700 border-red-200",
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
  return category.charAt(0) + category.slice(1).toLowerCase();
}

function formatStatus(status: BookingStatus) {
  return status.replace("_", " ");
}

function formatAmount(amount: string | null) {
  if (amount === null) return "Price pending";

  return `KES ${Number(amount).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
  color: "blue" | "amber" | "green" | "red";
}) {
  const styles = {
    blue: {
      card: "border-blue-200 bg-blue-50/70",
      icon: "bg-blue-100 text-blue-700",
      number: "text-blue-950",
      label: "text-blue-700",
    },
    amber: {
      card: "border-amber-200 bg-amber-50/70",
      icon: "bg-amber-100 text-amber-700",
      number: "text-amber-950",
      label: "text-amber-700",
    },
    green: {
      card: "border-emerald-200 bg-emerald-50/70",
      icon: "bg-emerald-100 text-emerald-700",
      number: "text-emerald-950",
      label: "text-emerald-700",
    },
    red: {
      card: "border-red-200 bg-red-50/70",
      icon: "bg-red-100 text-red-700",
      number: "text-red-950",
      label: "text-red-700",
    },
  };

  const style = styles[color];

  return (
    <div className={`relative min-w-0 overflow-hidden border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-4 ${style.card}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={`text-[9px] font-extrabold uppercase tracking-wider sm:text-[10px] ${style.label}`}>
            {label}
          </p>

          <p className={`mt-2 text-2xl font-black tabular-nums sm:text-3xl ${style.number}`}>
            {value}
          </p>
        </div>

        <div className={`flex h-8 w-8 shrink-0 items-center justify-center sm:h-10 sm:w-10 ${style.icon}`}>
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-2 text-[9px] leading-relaxed text-slate-500 sm:text-[10px]">
        {description}
      </p>
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const category = booking.service.category;
  const categoryStyle =
    categoryStyles[category as keyof typeof categoryStyles];

  const statusStyle = statusStyles[booking.status];

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className={`h-1 w-full ${categoryStyle.accent}`} />

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`border px-2 py-1 text-[8px] font-extrabold uppercase tracking-wide sm:text-[9px] ${categoryStyle.badge}`}>
            {formatCategory(category)}
          </span>

          <span className={`inline-flex items-center gap-1 border px-2 py-1 text-[8px] font-extrabold uppercase tracking-wide sm:text-[9px] ${statusStyle.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
            {formatStatus(booking.status)}
          </span>
        </div>

        {/* Service */}
        <div className="mt-3 min-w-0">
          <h3 className="line-clamp-2 text-xs font-extrabold leading-snug text-[#061F35] sm:text-sm">
            {booking.service.name}
          </h3>

          <p className="mt-1 truncate text-[9px] text-slate-400 sm:text-[10px]">
            #{booking.bookingNumber}
          </p>
        </div>

        {/* Booking details */}
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-blue-50 text-blue-700">
              <CalendarDays size={13} />
            </div>

            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                Date
              </p>
              <p className="truncate text-[10px] font-semibold text-slate-700 sm:text-xs">
                {formatDate(booking.scheduledDate)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-violet-50 text-violet-700">
              <Clock3 size={13} />
            </div>

            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                Time
              </p>
              <p className="truncate text-[10px] font-semibold text-slate-700 sm:text-xs">
                {booking.scheduledTime}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-emerald-50 text-emerald-700">
              <MapPin size={13} />
            </div>

            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                Location
              </p>
              <p className="truncate text-[10px] font-semibold text-slate-700 sm:text-xs">
                {booking.address.label} · {booking.address.city}
              </p>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
            Booking Amount
          </p>
          <p className="mt-1 break-words text-xs font-extrabold text-[#061F35] sm:text-sm">
            {formatAmount(booking.totalAmount)}
          </p>
        </div>

        {/* Action */}
        <Link
          href={`/bookings/${booking.id}`}
          className="mt-4 flex w-full items-center justify-center gap-2 bg-[#061F35] px-2 py-2.5 text-[10px] font-bold text-white transition hover:bg-[#0b3455] sm:text-xs"
        >
          View Details
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const stats = useMemo(() => ({
    total: bookings.length,

    active: bookings.filter(
      (booking) =>
        booking.status === "PENDING" ||
        booking.status === "CONFIRMED" ||
        booking.status === "ASSIGNED" ||
        booking.status === "IN_PROGRESS"
    ).length,

    completed: bookings.filter(
      (booking) => booking.status === "COMPLETED"
    ).length,

    cancelled: bookings.filter(
      (booking) => booking.status === "CANCELLED"
    ).length,
  }), [bookings]);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-5 px-3 py-4 pb-24 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8 lg:pb-8">

        {/* Compact welcome banner */}
        <section className="relative overflow-hidden border-l-4 border-sky-400 bg-[#061F35] px-4 py-3.5 shadow-sm sm:px-5">
          <div className="pointer-events-none absolute -right-6 -top-9 h-24 w-24 rounded-full border-[14px] border-white/[0.05]" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-sky-300">
                Customer workspace
              </p>

              <h1 className="mt-1 text-lg font-extrabold text-white sm:text-xl">
                Welcome back!
              </h1>

              <p className="mt-1 text-[10px] text-slate-300 sm:text-xs">
                Your services, schedules and bookings — all in one place.
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-white/10 text-sky-200">
              <ClipboardList size={20} />
            </div>
          </div>
        </section>

        {/* Page heading and action */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-blue-600">
              <Sparkles size={13} />
              Your activity
            </div>

            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[#061F35] sm:text-2xl">
              My Bookings
            </h2>

            <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-slate-500 sm:text-xs">
              Keep track of your HomeServe services, schedules, locations and booking status.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 bg-[#061F35] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#0b3455] sm:px-5"
          >
            Book a Service
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Summary cards */}
        {!loading && !error && (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            <SummaryCard
              label="Total"
              value={stats.total}
              description="All your bookings"
              icon={ClipboardList}
              color="blue"
            />

            <SummaryCard
              label="Active"
              value={stats.active}
              description="Currently in progress"
              icon={Clock3}
              color="amber"
            />

            <SummaryCard
              label="Completed"
              value={stats.completed}
              description="Successfully completed"
              icon={CheckCircle2}
              color="green"
            />

            <SummaryCard
              label="Cancelled"
              value={stats.cancelled}
              description="Cancelled bookings"
              icon={XCircle}
              color="red"
            />
          </div>
        )}

        {/* Bookings section heading */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-[#061F35] sm:text-base">
              Your Bookings
            </h2>

            {!loading && !error && bookings.length > 0 && (
              <p className="mt-1 text-[10px] text-slate-500">
                {bookings.length} {bookings.length === 1 ? "booking" : "bookings"} found
              </p>
            )}
          </div>

          {!loading && !error && bookings.length > 0 && (
            <span className="border border-blue-100 bg-blue-50 px-2.5 py-1 text-[9px] font-bold text-blue-700">
              {stats.active} Active
            </span>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="border border-slate-200 bg-white px-4 py-14 text-center shadow-sm">
            <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-4 text-sm font-bold text-[#061F35]">
              Loading your bookings...
            </p>
            <p className="mt-1 text-[10px] text-slate-500">
              Please wait while we retrieve your bookings.
            </p>
          </div>
        ) : error ? (
          /* Error */
          <div className="border border-red-200 bg-red-50 p-6 text-center sm:p-8">
            <div className="mx-auto flex h-11 w-11 items-center justify-center bg-red-100 text-red-600">
              <XCircle size={22} />
            </div>

            <h2 className="mt-3 text-base font-extrabold text-red-900">
              Unable to load bookings
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs text-red-700">
              {error}
            </p>
          </div>
        ) : bookings.length === 0 ? (
          /* Empty state */
          <div className="border border-slate-200 bg-white px-5 py-12 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-blue-50 text-blue-600">
              <CalendarDays size={27} />
            </div>

            <h2 className="mt-4 text-lg font-extrabold text-[#061F35]">
              No bookings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
              You haven't booked a HomeServe service yet. Explore our services and schedule your first appointment.
            </p>

            <Link
              href="/services"
              className="mt-5 inline-flex items-center gap-2 bg-blue-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-blue-700"
            >
              Explore Services
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          /* Booking cards */
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

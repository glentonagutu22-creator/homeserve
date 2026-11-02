
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ClipboardList,
  MapPin,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/components/AuthProvider";

import { getBookings } from "@/lib/bookings";
import { getQuotes } from "@/lib/quotes";
import { getAddresses } from "@/lib/addresses";

import type { Booking } from "@/types/booking";
import type { Quote } from "@/types/quote";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-KE", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusClass(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-100 text-green-800";
    case "ASSIGNED":
      return "bg-blue-100 text-blue-800";
    case "IN_PROGRESS":
      return "bg-amber-100 text-amber-800";
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "PENDING":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function quoteStatusClass(status: string) {
  switch (status) {
    case "SENT":
      return "bg-blue-100 text-blue-800";
    case "ACCEPTED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "EXPIRED":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

const bookingPalettes = [
  {
    background: "bg-blue-50",
    border: "border-blue-100",
    icon: "bg-blue-100 text-blue-700",
    accent: "text-blue-700",
  },
  {
    background: "bg-violet-50",
    border: "border-violet-100",
    icon: "bg-violet-100 text-violet-700",
    accent: "text-violet-700",
  },
  {
    background: "bg-emerald-50",
    border: "border-emerald-100",
    icon: "bg-emerald-100 text-emerald-700",
    accent: "text-emerald-700",
  },
  {
    background: "bg-amber-50",
    border: "border-amber-100",
    icon: "bg-amber-100 text-amber-700",
    accent: "text-amber-700",
  },
  {
    background: "bg-rose-50",
    border: "border-rose-100",
    icon: "bg-rose-100 text-rose-700",
    accent: "text-rose-700",
  },
];

function SectionHeading({
  title,
  description,
  href,
  linkText = "View all",
}: {
  title: string;
  description: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
          {title}
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          {description}
        </p>
      </div>

      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#075985] transition hover:text-blue-800 sm:text-sm"
        >
          {linkText}
          <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  theme,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  theme: {
    background: string;
    border: string;
    icon: string;
    value: string;
    accent: string;
  };
}) {
  return (
    <div
      className={`relative min-w-0 overflow-hidden border p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-4 ${theme.background} ${theme.border}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${theme.icon}`}>
          <Icon size={18} />
        </div>

        <ArrowUpRight size={15} className={theme.accent} />
      </div>

      <p className={`mt-3 text-2xl font-black tracking-tight sm:text-3xl ${theme.value}`}>
        {value}
      </p>

      <h3 className="mt-1 text-xs font-bold text-slate-800 sm:text-sm">
        {title}
      </h3>

      <p className="mt-1 hidden text-[11px] leading-4 text-slate-500 sm:block">
        {description}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [addressCount, setAddressCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [bookingData, quoteData, addressData] =
          await Promise.all([
            getBookings(),
            getQuotes(),
            getAddresses(),
          ]);

        setBookings(bookingData);
        setQuotes(quoteData);
        setAddressCount(addressData.length);
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
          new Date(a.scheduledDate).getTime() -
          new Date(b.scheduledDate).getTime()
      );
  }, [bookings]);

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [bookings]);

  const pendingQuotes = quotes.filter(
    (quote) =>
      quote.status === "PENDING" ||
      quote.status === "SENT"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED"
  ).length;

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[65vh] items-center justify-center bg-slate-50">
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

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-7 px-3 py-4 pb-24 sm:space-y-9 sm:px-6 sm:py-6 lg:px-8 lg:pb-8">

        {/* COMPACT WELCOME BANNER */}
        <section className="relative overflow-hidden border-l-4 border-blue-400 bg-[#061F35] px-4 py-3.5 shadow-sm sm:px-5 sm:py-4">
          <div className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full border-[18px] border-white/[0.04]" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-amber-300" />
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-300 sm:text-[10px]">
                  HomeServe Customer
                </p>
              </div>

              <h1 className="mt-1 text-lg font-extrabold tracking-tight text-white sm:text-xl">
                Welcome back, {firstName}!
              </h1>

              <p className="mt-1 max-w-lg text-[11px] leading-4 text-slate-300 sm:text-xs">
                A brighter, easier home starts here. What can we help you with today?
              </p>
            </div>

            <div className="flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 p-2.5">
              <Image
                src="/images/homeserve-logo.webp"
                alt="HomeServe"
                width={42}
                height={42}
                sizes="42px"
                className="h-10 w-10 object-contain"
              />
            </div>
          </div>
        </section>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* STATISTICS */}
        <section>
          <SectionHeading
            title="Your Overview"
            description="A quick look at your HomeServe activity."
          />

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard
              title="Total Bookings"
              value={bookings.length}
              description="All your service bookings"
              icon={ClipboardList}
              theme={{
                background: "bg-blue-50",
                border: "border-blue-100",
                icon: "bg-blue-100 text-blue-700",
                value: "text-blue-800",
                accent: "text-blue-500",
              }}
            />

            <StatCard
              title="Upcoming"
              value={upcomingBookings.length}
              description="Active upcoming bookings"
              icon={CalendarDays}
              theme={{
                background: "bg-violet-50",
                border: "border-violet-100",
                icon: "bg-violet-100 text-violet-700",
                value: "text-violet-800",
                accent: "text-violet-500",
              }}
            />

            <StatCard
              title="Pending Quotes"
              value={pendingQuotes}
              description="Quotes awaiting action"
              icon={Clock3}
              theme={{
                background: "bg-amber-50",
                border: "border-amber-100",
                icon: "bg-amber-100 text-amber-700",
                value: "text-amber-800",
                accent: "text-amber-500",
              }}
            />

            <StatCard
              title="Completed"
              value={completedBookings}
              description="Successfully completed"
              icon={CheckCircle2}
              theme={{
                background: "bg-emerald-50",
                border: "border-emerald-100",
                icon: "bg-emerald-100 text-emerald-700",
                value: "text-emerald-800",
                accent: "text-emerald-500",
              }}
            />
          </div>
        </section>

        {/* BOOK A SERVICE */}
        <section>
          <SectionHeading
            title="Explore Our Services"
            description="Professional services to make your home life easier."
            href="/services/cleaning"
            linkText="Explore"
          />

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">

            {/* CLEANING CARD */}
            <Link
              href="/services/cleaning"
              className="group overflow-hidden border border-blue-100 bg-blue-50 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
            >
              <div className="relative h-28 overflow-hidden bg-blue-100 sm:h-44">
                <Image
                  src="/images/cleaning-service.webp"
                  alt="HomeServe cleaning services"
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain p-1 transition duration-500 group-hover:scale-105"
                />

                <span className="absolute left-2 top-2 rounded-md bg-blue-700 px-2 py-1 text-[9px] font-bold text-white shadow-sm sm:left-3 sm:top-3 sm:text-[10px]">
                  CLEANING
                </span>
              </div>

              <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-extrabold text-blue-950 sm:text-base">
                    Cleaning Services
                  </h3>
                  <ArrowUpRight size={15} className="shrink-0 text-blue-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <p className="mt-1.5 text-[10px] leading-4 text-blue-900/70 sm:text-sm sm:leading-5">
                  Enjoy a fresh, spotless and comfortable space.
                </p>

                <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 sm:text-xs">
                  Discover cleaning <ArrowRight size={12} />
                </span>
              </div>
            </Link>

            {/* MOVING CARD */}
            <Link
              href="/services/moving"
              className="group overflow-hidden border border-emerald-100 bg-emerald-50 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
            >
              <div className="relative h-28 overflow-hidden bg-emerald-100 sm:h-44">
                <Image
                  src="/images/moving-service.webp"
                  alt="HomeServe moving services"
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain p-1 transition duration-500 group-hover:scale-105"
                />

                <span className="absolute left-2 top-2 rounded-md bg-emerald-700 px-2 py-1 text-[9px] font-bold text-white shadow-sm sm:left-3 sm:top-3 sm:text-[10px]">
                  MOVING
                </span>
              </div>

              <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-extrabold text-emerald-950 sm:text-base">
                    Moving Services
                  </h3>
                  <ArrowUpRight size={15} className="shrink-0 text-emerald-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <p className="mt-1.5 text-[10px] leading-4 text-emerald-900/70 sm:text-sm sm:leading-5">
                  Move your belongings safely and confidently.
                </p>

                <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 sm:text-xs">
                  Discover moving <ArrowRight size={12} />
                </span>
              </div>
            </Link>

            {/* ELECTRICAL CARD */}
            <Link
              href="/services/electrical"
              className="group overflow-hidden border border-amber-100 bg-amber-50 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
            >
              <div className="relative h-28 overflow-hidden bg-amber-100 sm:h-44">
                <Image
                  src="/images/electrical-service.webp"
                  alt="HomeServe electrical services"
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain p-1 transition duration-500 group-hover:scale-105"
                />

                <span className="absolute left-2 top-2 rounded-md bg-amber-600 px-2 py-1 text-[9px] font-bold text-white shadow-sm sm:left-3 sm:top-3 sm:text-[10px]">
                  ELECTRICAL
                </span>
              </div>

              <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-extrabold text-amber-950 sm:text-base">
                    Electrical Services
                  </h3>
                  <ArrowUpRight size={15} className="shrink-0 text-amber-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <p className="mt-1.5 text-[10px] leading-4 text-amber-900/70 sm:text-sm sm:leading-5">
                  Reliable electrical installation and repairs.
                </p>

                <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 sm:text-xs">
                  Discover electrical <ArrowRight size={12} />
                </span>
              </div>
            </Link>

          </div>
        </section>

        {/* UPCOMING BOOKINGS + ADDRESSES */}
        <div className="grid gap-7 lg:grid-cols-3">

          {/* UPCOMING BOOKINGS */}
          <section className="lg:col-span-2">
            <SectionHeading
              title="Upcoming Bookings"
              description="Keep track of your next scheduled services."
              href="/bookings"
            />

            {upcomingBookings.length === 0 ? (
              <div className="border border-dashed border-blue-200 bg-blue-50 p-7 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <CalendarDays size={21} />
                </div>

                <p className="mt-3 text-sm font-bold text-slate-900">
                  No upcoming bookings
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Your next service appointment will appear here.
                </p>

                <Link
                  href="/services/cleaning"
                  className="mt-4 inline-flex items-center gap-2 bg-[#061F35] px-4 py-2 text-xs font-bold text-white hover:bg-blue-900"
                >
                  Book a service <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {upcomingBookings.slice(0, 4).map((booking, index) => {
                  const palette =
                    bookingPalettes[index % bookingPalettes.length];

                  return (
                    <Link
                      key={booking.id}
                      href={`/bookings/${booking.id}`}
                      className={`min-w-0 border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-4 ${palette.background} ${palette.border}`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${palette.icon}`}>
                          <CalendarDays size={14} />
                        </div>

                        <span
                          className={`rounded-full px-1.5 py-1 text-[8px] font-bold ${statusClass(
                            booking.status
                          )}`}
                        >
                          {booking.status.replace("_", " ")}
                        </span>
                      </div>

                      <p className="mt-3 truncate text-[10px] font-extrabold text-slate-900 sm:text-sm">
                        {booking.bookingNumber}
                      </p>

                      <p className="mt-1 line-clamp-1 text-xs font-semibold text-slate-700">
                        {booking.service.name}
                      </p>

                      <div className="mt-3 border-t border-black/5 pt-2">
                        <p className={`text-[10px] font-bold sm:text-xs ${palette.accent}`}>
                          {formatDate(booking.scheduledDate)}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                          <Clock3 size={11} />
                          {booking.scheduledTime}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* ADDRESS CARD */}
          <section>
            <SectionHeading
              title="Saved Addresses"
              description="Your service locations."
              href="/addresses"
              linkText="Manage"
            />

            <div className="relative overflow-hidden border border-violet-100 bg-violet-50 p-4 shadow-sm sm:p-5">
              <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-violet-100" />

              <div className="relative flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <MapPin size={20} />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
                  Locations
                </span>
              </div>

              <p className="relative mt-4 text-3xl font-black text-violet-950">
                {addressCount}
              </p>

              <p className="relative mt-1 text-xs text-violet-800/70">
                Saved {addressCount === 1 ? "address" : "addresses"}
              </p>

              <Link
                href="/addresses"
                className="relative mt-5 flex items-center justify-between bg-violet-700 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-violet-800"
              >
                Manage addresses
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        </div>

        {/* RECENT BOOKINGS */}
        <section>
          <SectionHeading
            title="Recent Bookings"
            description="Your latest HomeServe activity."
            href="/bookings"
          />

          {recentBookings.length === 0 ? (
            <div className="border border-slate-200 bg-slate-50 p-7 text-center">
              <ClipboardList className="mx-auto text-slate-400" size={26} />
              <p className="mt-2 text-sm font-semibold text-slate-700">
                No bookings yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Your booking history will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              {recentBookings.map((booking, index) => {
                const palette =
                  bookingPalettes[index % bookingPalettes.length];

                return (
                  <Link
                    key={booking.id}
                    href={`/bookings/${booking.id}`}
                    className={`min-w-0 border p-3 shadow-sm transition hover:shadow-md sm:p-4 lg:flex lg:items-center lg:justify-between ${palette.background} ${palette.border}`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-extrabold text-slate-900 sm:text-sm">
                        {booking.bookingNumber}
                      </p>

                      <p className="mt-1 truncate text-[10px] text-slate-600 sm:text-sm">
                        {booking.service.name}
                      </p>

                      <p className={`mt-2 text-[10px] font-semibold ${palette.accent}`}>
                        {formatDate(booking.createdAt)}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 lg:mt-0 lg:justify-end">
                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-bold ${statusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status.replace("_", " ")}
                      </span>

                      <ArrowUpRight size={15} className="shrink-0 text-slate-500" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* RECENT QUOTES */}
        {quotes.length > 0 && (
          <section>
            <SectionHeading
              title="Recent Quotes"
              description="Review quotes for your requested services."
              href="/quotes"
            />

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              {quotes.slice(0, 3).map((quote, index) => {
                const palette =
                  bookingPalettes[(index + 2) % bookingPalettes.length];

                return (
                  <Link
                    key={quote.id}
                    href={`/quotes/${quote.id}`}
                    className={`min-w-0 border p-3 shadow-sm transition hover:shadow-md sm:p-4 lg:flex lg:items-center lg:justify-between ${palette.background} ${palette.border}`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${palette.icon}`}>
                          <ClipboardList size={14} />
                        </div>

                        <p className="text-xs font-extrabold text-slate-900 sm:text-sm">
                          Quote
                        </p>
                      </div>

                      <p className="mt-2 truncate text-[10px] text-slate-600 sm:text-sm">
                        Booking {quote.booking.bookingNumber}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 lg:mt-0 lg:justify-end">
                      {quote.finalAmount && (
                        <span className="text-xs font-extrabold text-slate-900 sm:text-sm">
                          KSh {Number(quote.finalAmount).toLocaleString()}
                        </span>
                      )}

                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-bold ${quoteStatusClass(
                          quote.status
                        )}`}
                      >
                        {quote.status}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* BOTTOM SERVICE PROMPT */}
        <section className="flex items-center justify-between gap-3 border border-sky-100 bg-sky-50 p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <Sparkles size={20} />
            </div>

            <div className="min-w-0">
              <h3 className="text-xs font-extrabold text-sky-950 sm:text-sm">
                Need a hand around the house?
              </h3>
              <p className="mt-1 text-[10px] text-sky-800/70 sm:text-xs">
                Let HomeServe make your day easier.
              </p>
            </div>
          </div>

          <Link
            href="/services/cleaning"
            className="flex shrink-0 items-center gap-1 bg-sky-700 px-3 py-2 text-[10px] font-bold text-white transition hover:bg-sky-800 sm:text-xs"
          >
            Book now <ArrowRight size={12} />
          </Link>
        </section>

      </div>
    </DashboardShell>
  );
}


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getQuotes } from "@/lib/quotes";
import type { Quote } from "@/types/quote";
import DashboardShell from "@/components/dashboard/DashboardShell";

function formatAmount(amount: string | null) {
  if (!amount) return "Pending";

  return `KSh ${Number(amount).toLocaleString("en-KE", {
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

function getStatusClasses(status: Quote["status"]) {
  switch (status) {
    case "SENT":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "ACCEPTED":
      return "bg-green-50 text-green-700 border-green-200";

    case "REJECTED":
      return "bg-red-50 text-red-700 border-red-200";

    case "EXPIRED":
      return "bg-slate-100 text-slate-600 border-slate-200";

    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

function getStatusLabel(status: Quote["status"]) {
  switch (status) {
    case "SENT":
      return "Awaiting response";

    case "ACCEPTED":
      return "Accepted";

    case "REJECTED":
      return "Rejected";

    case "EXPIRED":
      return "Expired";

    case "PENDING":
      return "Being prepared";

    default:
      return status;
  }
}

function getQuoteAccent(status: Quote["status"]) {
  switch (status) {
    case "SENT":
      return {
        border: "border-blue-100",
        background: "bg-blue-50",
        icon: "bg-blue-100 text-blue-700",
        amount: "bg-blue-50/80",
        arrow: "text-blue-600",
      };

    case "ACCEPTED":
      return {
        border: "border-green-100",
        background: "bg-green-50",
        icon: "bg-green-100 text-green-700",
        amount: "bg-green-50/80",
        arrow: "text-green-600",
      };

    case "REJECTED":
      return {
        border: "border-red-100",
        background: "bg-red-50",
        icon: "bg-red-100 text-red-700",
        amount: "bg-red-50/80",
        arrow: "text-red-600",
      };

    case "EXPIRED":
      return {
        border: "border-slate-200",
        background: "bg-slate-100",
        icon: "bg-slate-200 text-slate-600",
        amount: "bg-slate-50",
        arrow: "text-slate-500",
      };

    case "PENDING":
    default:
      return {
        border: "border-amber-100",
        background: "bg-amber-50",
        icon: "bg-amber-100 text-amber-700",
        amount: "bg-amber-50/80",
        arrow: "text-amber-600",
      };
  }
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuotes() {
      try {
        setLoading(true);
        setError("");

        const data = await getQuotes();
        setQuotes(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load your quotes."
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuotes();
  }, []);

  return (
    <DashboardShell>
      <main className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* Compact welcome banner */}
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl bg-[#061F35] px-4 py-3 text-white shadow-sm sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <path d="M8 3h8l4 4v14H4V3h4Z" />
                  <path d="M8 3v5h8V3M8 13h8M8 17h5" />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  Your HomeServe quotes
                </p>
                <p className="text-xs text-slate-300">
                  Review offers and manage your service requests.
                </p>
              </div>
            </div>

            <span className="hidden shrink-0 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100 sm:inline-flex">
              My Account
            </span>
          </div>

          {/* Page heading */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#061F35] sm:text-2xl">
                My Quotes
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Review personalized quotes and decide how to proceed.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg bg-[#061F35] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b3555]"
            >
              <span>+</span>
              Book a Service
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#061F35]" />

              <p className="text-sm text-slate-600">
                Loading your quotes...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 font-bold text-red-700">
                  !
                </div>

                <div>
                  <h2 className="text-sm font-bold text-red-800">
                    Unable to load quotes
                  </h2>

                  <p className="mt-1 text-sm text-red-700">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && quotes.length === 0 && (
            <div className="rounded-xl border border-blue-100 bg-white p-8 text-center shadow-sm sm:p-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-7 w-7"
                >
                  <path d="M8 3h8l4 4v14H4V3h4Z" />
                  <path d="M8 3v5h8V3M8 13h8M8 17h5" />
                </svg>
              </div>

              <h2 className="mt-5 text-lg font-bold text-[#061F35]">
                No quotes yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                When HomeServe prepares a quote for one of your
                service requests, it will appear here.
              </p>

              <Link
                href="/services"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-[#061F35] px-5 text-sm font-semibold text-white transition hover:bg-[#0b3555]"
              >
                Explore Services
              </Link>
            </div>
          )}

          {/* Quotes grid */}
          {!loading && !error && quotes.length > 0 && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  Your quote history
                </p>

                <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200">
                  {quotes.length} {quotes.length === 1 ? "Quote" : "Quotes"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                {quotes.map((quote) => {
                  const accent = getQuoteAccent(quote.status);

                  return (
                    <Link
                      key={quote.id}
                      href={`/quotes/${quote.id}`}
                      className={`group flex min-w-0 flex-col rounded-xl border bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${accent.border}`}
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accent.icon}`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              className="h-4 w-4"
                            >
                              <path d="M8 3h8l4 4v14H4V3h4Z" />
                              <path d="M8 3v5h8V3M8 13h8M8 17h5" />
                            </svg>
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                              Quote
                            </p>

                            <p className="truncate text-xs font-bold text-[#061F35] sm:text-sm">
                              {quote.booking?.service?.name ||
                                "Service Quote"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="mt-3">
                        <span
                          className={`inline-flex max-w-full rounded-full border px-2 py-1 text-[9px] font-semibold leading-tight sm:px-2.5 sm:text-[11px] ${getStatusClasses(
                            quote.status
                          )}`}
                        >
                          {getStatusLabel(quote.status)}
                        </span>
                      </div>

                      {/* Amount */}
                      <div
                        className={`mt-3 rounded-lg p-3 sm:mt-4 sm:p-4 ${accent.amount}`}
                      >
                        <p className="text-[10px] font-medium text-slate-500 sm:text-xs">
                          {quote.finalAmount
                            ? "Final quote"
                            : "Estimated quote"}
                        </p>

                        <p className="mt-1 break-words text-base font-bold leading-tight text-[#061F35] sm:text-xl">
                          {formatAmount(
                            quote.finalAmount ||
                              quote.estimatedAmount
                          )}
                        </p>
                      </div>

                      {/* Details */}
                      <div className="mt-3 space-y-2 text-xs sm:mt-4 sm:space-y-3 sm:text-sm">
                        {quote.booking?.bookingNumber && (
                          <div>
                            <p className="text-[10px] text-slate-400 sm:text-xs">
                              Booking
                            </p>

                            <p className="mt-0.5 break-all font-medium text-slate-700">
                              {quote.booking.bookingNumber}
                            </p>
                          </div>
                        )}

                        {quote.booking?.scheduledDate && (
                          <div>
                            <p className="text-[10px] text-slate-400 sm:text-xs">
                              Service date
                            </p>

                            <p className="mt-0.5 font-medium text-slate-700">
                              {formatDate(quote.booking.scheduledDate)}
                            </p>
                          </div>
                        )}

                        {quote.validUntil && (
                          <div>
                            <p className="text-[10px] text-slate-400 sm:text-xs">
                              Valid until
                            </p>

                            <p className="mt-0.5 font-medium text-slate-700">
                              {formatDate(quote.validUntil)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {quote.description && (
                        <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500 sm:mt-4 sm:text-sm">
                          {quote.description}
                        </p>
                      )}

                      {/* View quote */}
                      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
                        <span
                          className={`text-xs font-bold sm:text-sm ${accent.arrow}`}
                        >
                          View quote
                        </span>

                        <span
                          className={`text-base transition-transform group-hover:translate-x-1 ${accent.arrow}`}
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}

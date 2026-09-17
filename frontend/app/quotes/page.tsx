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
      return "bg-blue-50 text-blue-700 border-blue-100";

    case "ACCEPTED":
      return "bg-green-50 text-green-700 border-green-100";

    case "REJECTED":
      return "bg-red-50 text-red-700 border-red-100";

    case "EXPIRED":
      return "bg-slate-100 text-slate-600 border-slate-200";

    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700 border-amber-100";
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
      <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                HomeServe
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#061F35] sm:text-3xl">
                My Quotes
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                Review personalized quotes from HomeServe
                and decide how you want to proceed.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex w-fit items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Book a Service
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="text-sm text-slate-600">
                Loading your quotes...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <h2 className="font-semibold text-red-800">
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
          )}

          {/* Empty */}
          {!loading && !error && quotes.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                <span className="text-2xl text-blue-600">
                  $
                </span>
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#061F35]">
                No quotes yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                When HomeServe prepares a quote for one
                of your service requests, it will appear
                here.
              </p>

              <Link
                href="/services"
                className="mt-6 inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Explore Services
              </Link>
            </div>
          )}

          {/* Quotes */}
          {!loading &&
            !error &&
            quotes.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2">

                {quotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/quotes/${quote.id}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Quote
                        </p>

                        <h2 className="mt-1 truncate text-base font-bold text-[#061F35] transition group-hover:text-blue-600 sm:text-lg">
                          {quote.booking?.service?.name ||
                            "Service Quote"}
                        </h2>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:text-xs ${getStatusClasses(
                          quote.status
                        )}`}
                      >
                        {getStatusLabel(quote.status)}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="mt-5 rounded-xl bg-slate-50 p-4 sm:mt-6">
                      <p className="text-xs font-medium text-slate-500">
                        {quote.finalAmount
                          ? "Final quote"
                          : "Estimated quote"}
                      </p>

                      <p className="mt-1 text-xl font-bold text-[#061F35] sm:text-2xl">
                        {formatAmount(
                          quote.finalAmount ||
                            quote.estimatedAmount
                        )}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="mt-5 space-y-3 text-sm">
                      {quote.booking?.bookingNumber && (
                        <div className="flex items-start justify-between gap-4">
                          <span className="shrink-0 text-slate-500">
                            Booking
                          </span>

                          <span className="text-right font-medium text-slate-700">
                            {quote.booking.bookingNumber}
                          </span>
                        </div>
                      )}

                      {quote.booking?.scheduledDate && (
                        <div className="flex items-start justify-between gap-4">
                          <span className="shrink-0 text-slate-500">
                            Service date
                          </span>

                          <span className="text-right font-medium text-slate-700">
                            {formatDate(
                              quote.booking.scheduledDate
                            )}
                          </span>
                        </div>
                      )}

                      {quote.validUntil && (
                        <div className="flex items-start justify-between gap-4">
                          <span className="shrink-0 text-slate-500">
                            Valid until
                          </span>

                          <span className="text-right font-medium text-slate-700">
                            {formatDate(
                              quote.validUntil
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {quote.description && (
                      <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-500">
                        {quote.description}
                      </p>
                    )}

                    {/* View */}
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm font-semibold text-blue-600">
                        View quote
                      </span>

                      <span className="text-lg text-blue-600 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </Link>
                ))}

              </div>
            )}

        </div>
      </main>
    </DashboardShell>
  );
}
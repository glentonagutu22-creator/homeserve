
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import DashboardShell from "@/components/dashboard/DashboardShell";

import { getAdminQuotes } from "@/lib/quotes";

import type { Quote } from "@/types/quote";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(amount: number | string | null | undefined) {
  return amount
    ? `KSh ${Number(amount).toLocaleString("en-KE")}`
    : "Not set";
}

function getStatusClasses(status: Quote["status"]) {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-800";

    case "SENT":
      return "bg-blue-100 text-blue-800";

    case "ACCEPTED":
      return "bg-emerald-100 text-emerald-800";

    case "REJECTED":
      return "bg-red-100 text-red-800";

    case "EXPIRED":
      return "bg-slate-100 text-slate-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuotes() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminQuotes();

        setQuotes(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load quotes."
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuotes();
  }, []);

  const pendingCount = quotes.filter(
    (quote) => quote.status === "PENDING"
  ).length;

  const sentCount = quotes.filter(
    (quote) => quote.status === "SENT"
  ).length;

  const acceptedCount = quotes.filter(
    (quote) => quote.status === "ACCEPTED"
  ).length;

  return (
    <DashboardShell>
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-7xl space-y-5 px-3 py-4 pb-24 sm:space-y-6 sm:px-6 sm:py-7 lg:pb-10">

          {/* Page heading */}
          <section className="bg-[#061F35] px-4 py-4 text-white sm:px-6 sm:py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
              HomeServe Admin
            </p>

            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold sm:text-2xl">
                  Quote Requests
                </h1>

                <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                  Review customer quote requests, set pricing, and send quotes.
                </p>
              </div>

              <div className="border border-white/20 px-3 py-2">
                <p className="text-[9px] font-semibold uppercase tracking-wide text-blue-200">
                  Total Requests
                </p>

                <p className="text-xl font-bold tabular-nums">
                  {quotes.length}
                </p>
              </div>
            </div>
          </section>

          {/* Summary cards */}
          {!loading && !error && (
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SummaryCard
                label="Total Quotes"
                value={quotes.length}
                accent="bg-slate-500"
              />

              <SummaryCard
                label="Pending"
                value={pendingCount}
                accent="bg-amber-500"
              />

              <SummaryCard
                label="Sent"
                value={sentCount}
                accent="bg-blue-500"
              />

              <SummaryCard
                label="Accepted"
                value={acceptedCount}
                accent="bg-emerald-500"
              />
            </section>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start justify-between gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <p>{error}</p>

              <button
                type="button"
                onClick={() => setError("")}
                className="font-bold"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-3 h-6 w-6 animate-spin border-2 border-slate-200 border-t-[#061F35]" />

              <p className="text-sm font-medium text-slate-600">
                Loading quote requests...
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && quotes.length === 0 && (
            <div className="border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center bg-slate-100 text-xl text-slate-500">
                Q
              </div>

              <h2 className="mt-4 text-base font-bold text-[#061F35]">
                No quote requests
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-slate-500 sm:text-sm">
                New customer quote requests will appear here.
              </p>
            </div>
          )}

          {/* Quotes */}
          {!loading && !error && quotes.length > 0 && (
            <>
              {/* Mobile and tablet cards */}
              <section className="grid grid-cols-2 gap-3 lg:hidden">
                {quotes.map((quote) => {
                  const customerName =
                    quote.booking?.user?.name ?? "Unknown";

                  const serviceName =
                    quote.booking?.service?.name ?? "Unknown service";

                  const amount =
                    quote.finalAmount || quote.estimatedAmount;

                  return (
                    <article
                      key={quote.id}
                      className="flex min-w-0 flex-col border border-slate-200 bg-white p-3 shadow-sm"
                    >
                      {/* Customer */}
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                          Customer
                        </p>

                        <h3 className="mt-1 break-words text-xs font-bold leading-snug text-[#061F35] sm:text-sm">
                          {customerName}
                        </h3>

                        <p className="mt-1 break-all text-[10px] leading-relaxed text-slate-500 sm:text-xs">
                          {quote.booking?.user?.email ?? "No email"}
                        </p>
                      </div>

                      <div className="my-3 border-t border-slate-100" />

                      {/* Service */}
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                          Service
                        </p>

                        <p className="mt-1 break-words text-xs font-semibold leading-snug text-slate-800 sm:text-sm">
                          {serviceName}
                        </p>

                        <p className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                          {quote.booking?.service?.category ?? ""}
                        </p>
                      </div>

                      {/* Booking */}
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                            Booking
                          </p>

                          <p className="mt-1 break-all font-mono text-[10px] text-slate-600 sm:text-xs">
                            {quote.booking?.bookingNumber ?? "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                            Date
                          </p>

                          <p className="mt-1 text-[10px] text-slate-600 sm:text-xs">
                            {quote.booking?.scheduledDate
                              ? formatDate(quote.booking.scheduledDate)
                              : "-"}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="mt-3">
                        <span
                          className={`inline-flex max-w-full px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${getStatusClasses(
                            quote.status
                          )}`}
                        >
                          {quote.status}
                        </span>
                      </div>

                      {/* Amount */}
                      <div className="mt-3 border-t border-slate-100 pt-3">
                        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                          Quote Amount
                        </p>

                        <p className="mt-1 break-words text-xs font-bold text-[#061F35] sm:text-sm">
                          {formatAmount(amount)}
                        </p>
                      </div>

                      {/* Action */}
                      <Link
                        href={`/admin/quotes/${quote.id}`}
                        className="mt-3 flex w-full items-center justify-center bg-[#061F35] px-2 py-2.5 text-[10px] font-bold text-white transition hover:bg-[#082B49] sm:text-xs"
                      >
                        Review Quote
                      </Link>
                    </article>
                  );
                })}
              </section>

              {/* Desktop table */}
              <section className="hidden overflow-hidden border border-slate-200 bg-white shadow-sm lg:block">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#061F35]">
                      All Quote Requests
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Review and manage customer quotations.
                    </p>
                  </div>

                  <span className="bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    {quotes.length} requests
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-[#061F35] text-left text-xs font-semibold uppercase tracking-wide text-white">
                      <tr>
                        <th className="px-5 py-4">Customer</th>
                        <th className="px-5 py-4">Service</th>
                        <th className="px-5 py-4">Booking</th>
                        <th className="px-5 py-4">Date</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Amount</th>
                        <th className="px-5 py-4">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {quotes.map((quote) => {
                        const amount =
                          quote.finalAmount || quote.estimatedAmount;

                        return (
                          <tr
                            key={quote.id}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-5 py-4">
                              <p className="font-semibold text-[#061F35]">
                                {quote.booking?.user?.name ?? "Unknown"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {quote.booking?.user?.email ?? "No email"}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="font-medium text-slate-800">
                                {quote.booking?.service?.name ??
                                  "Unknown service"}
                              </p>

                              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                {quote.booking?.service?.category ?? ""}
                              </p>
                            </td>

                            <td className="px-5 py-4 font-mono text-xs text-slate-600">
                              {quote.booking?.bookingNumber ?? "-"}
                            </td>

                            <td className="px-5 py-4 text-xs text-slate-600">
                              {quote.booking?.scheduledDate
                                ? formatDate(quote.booking.scheduledDate)
                                : "-"}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusClasses(
                                  quote.status
                                )}`}
                              >
                                {quote.status}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm font-bold text-[#061F35]">
                              {formatAmount(amount)}
                            </td>

                            <td className="px-5 py-4">
                              <Link
                                href={`/admin/quotes/${quote.id}`}
                                className="inline-flex bg-[#061F35] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#082B49]"
                              >
                                Review
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </DashboardShell>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="relative min-w-0 overflow-hidden border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className={`absolute inset-y-0 left-0 w-1 ${accent}`} />

      <div className="pl-2">
        <p className="text-[10px] font-semibold text-slate-500 sm:text-xs">
          {label}
        </p>

        <p className="mt-1 text-xl font-bold tabular-nums text-[#061F35] sm:text-2xl">
          {value}
        </p>
      </div>
    </div>
  );
}

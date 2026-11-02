
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getQuote,
  acceptQuote,
  rejectQuote,
} from "@/lib/quotes";
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
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
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
      return "Awaiting your response";

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

export default function QuoteDetailsPage() {
  const params = useParams();
  const quoteId = String(params.id);

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const [showRejectConfirmation, setShowRejectConfirmation] =
    useState(false);

  useEffect(() => {
    async function loadQuote() {
      try {
        setLoading(true);
        setError("");

        const data = await getQuote(quoteId);
        setQuote(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load the quote."
        );
      } finally {
        setLoading(false);
      }
    }

    if (quoteId) {
      loadQuote();
    }
  }, [quoteId]);

  async function handleAccept() {
    if (!quote) return;

    const confirmed = window.confirm(
      "Are you sure you want to accept this quote?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setActionError("");

      const updatedQuote = await acceptQuote(quote.id);
      setQuote(updatedQuote);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Failed to accept the quote."
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!quote) return;

    try {
      setActionLoading(true);
      setActionError("");

      const updatedQuote = await rejectQuote(quote.id);

      setQuote(updatedQuote);
      setShowRejectConfirmation(false);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Failed to reject the quote."
      );
    } finally {
      setActionLoading(false);
    }
  }

  const canRespond = quote?.status === "SENT";

  const amount =
    quote?.finalAmount ||
    quote?.estimatedAmount ||
    null;

  return (
    <DashboardShell>
      <main className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

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
                  Your service quote
                </p>
                <p className="text-xs text-slate-300">
                  Review the details and manage your response.
                </p>
              </div>
            </div>

            <span className="hidden shrink-0 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100 sm:inline-flex">
              HomeServe
            </span>
          </div>

          {/* Back navigation */}
          <Link
            href="/quotes"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#061F35]"
          >
            <span aria-hidden="true">←</span>
            Back to quotes
          </Link>

          {/* Loading */}
          {loading && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#061F35]" />
              <p className="text-sm text-slate-500">
                Loading quote...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 sm:p-6">
              <h1 className="text-lg font-bold text-red-800">
                Unable to load quote
              </h1>

              <p className="mt-2 text-sm text-red-700">
                {error}
              </p>

              <Link
                href="/quotes"
                className="mt-5 inline-flex rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Back to quotes
              </Link>
            </div>
          )}

          {/* Quote content */}
          {!loading && !error && quote && (
            <div className="space-y-5">

              {/* Quote overview */}
              <section className="overflow-hidden rounded-xl bg-[#061F35] text-white shadow-sm">
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-300">
                        HomeServe / Quote details
                      </p>

                      <h1 className="mt-2 break-words text-xl font-bold sm:text-2xl">
                        {quote.booking?.service?.name ||
                          "Service Quote"}
                      </h1>

                      {quote.booking?.bookingNumber && (
                        <p className="mt-1.5 text-sm text-slate-300">
                          Booking{" "}
                          <span className="font-semibold text-white">
                            {quote.booking.bookingNumber}
                          </span>
                        </p>
                      )}
                    </div>

                    <span
                      className={`inline-flex w-fit shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                        quote.status
                      )}`}
                    >
                      {getStatusLabel(quote.status)}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="text-xs font-medium text-slate-300">
                      {quote.finalAmount
                        ? "Final quoted amount"
                        : "Estimated amount"}
                    </p>

                    <p className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                      {formatAmount(amount)}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Amount quoted for your requested service
                    </p>
                  </div>
                </div>
              </section>

              {/* Action error */}
              {actionError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <span className="font-bold">!</span>
                  <p>{actionError}</p>
                </div>
              )}

              {/* Quote information */}
              <div className="grid gap-4 md:grid-cols-2">

                {/* Description */}
                <section className="rounded-xl border border-blue-100 bg-white shadow-sm">
                  <div className="border-b border-blue-100 bg-blue-50/70 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-4 w-4"
                        >
                          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                        </svg>
                      </span>

                      <h2 className="text-sm font-bold text-[#061F35]">
                        Quote details
                      </h2>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    {quote.description ? (
                      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                        {quote.description}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-500">
                        No additional description was provided.
                      </p>
                    )}
                  </div>
                </section>

                {/* Service information */}
                <section className="rounded-xl border border-violet-100 bg-white shadow-sm">
                  <div className="border-b border-violet-100 bg-violet-50/70 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-4 w-4"
                        >
                          <rect x="3" y="4" width="18" height="17" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                      </span>

                      <h2 className="text-sm font-bold text-[#061F35]">
                        Service information
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 sm:p-5">
                    {quote.booking?.scheduledDate && (
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Service date
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {formatDate(quote.booking.scheduledDate)}
                        </p>
                      </div>
                    )}

                    {quote.booking?.scheduledTime && (
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Preferred time
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {quote.booking.scheduledTime}
                        </p>
                      </div>
                    )}

                    {quote.validUntil && (
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Quote valid until
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {formatDate(quote.validUntil)}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Quote created
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {formatDateTime(quote.createdAt)}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Response section */}
              {canRespond && (
                <section className="overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm">
                  <div className="border-b border-emerald-100 bg-emerald-50 px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-4 w-4"
                        >
                          <path d="M12 3v18M3 12h18" />
                        </svg>
                      </span>

                      <h2 className="text-sm font-bold text-emerald-900">
                        Ready to proceed?
                      </h2>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="text-sm leading-6 text-slate-600">
                      Review the quote above. If you're happy
                      with the price and service details, you
                      can accept the quote and confirm your
                      booking.
                    </p>

                    {!showRejectConfirmation ? (
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={handleAccept}
                          disabled={actionLoading}
                          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {actionLoading ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Processing...
                            </>
                          ) : (
                            "Accept Quote"
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setShowRejectConfirmation(true)
                          }
                          disabled={actionLoading}
                          className="flex h-11 items-center justify-center rounded-lg border border-red-200 bg-white px-5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Reject Quote
                        </button>
                      </div>
                    ) : (
                      <div className="mt-5 rounded-lg border border-red-200 bg-red-50/60 p-4">
                        <h3 className="text-sm font-bold text-red-900">
                          Reject this quote?
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-red-800">
                          Rejecting this quote will cancel the
                          quote request. You can submit a new
                          service request later if needed.
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={handleReject}
                            disabled={actionLoading}
                            className="flex h-10 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {actionLoading
                              ? "Rejecting..."
                              : "Yes, Reject Quote"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setShowRejectConfirmation(false)
                            }
                            disabled={actionLoading}
                            className="flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Keep Quote
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Accepted */}
              {quote.status === "ACCEPTED" && (
                <section className="rounded-xl border border-green-200 bg-green-50 p-4 sm:p-5">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white">
                      ✓
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-green-900">
                        Quote accepted
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-green-800">
                        Your quote has been accepted and your
                        booking has been confirmed. HomeServe
                        can now proceed with the service.
                      </p>

                      <Link
                        href={`/bookings/${quote.bookingId}`}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-green-700 transition hover:text-green-900"
                      >
                        View booking
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </section>
              )}

              {/* Rejected */}
              {quote.status === "REJECTED" && (
                <section className="rounded-xl border border-red-200 bg-red-50 p-4 sm:p-5">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white">
                      ×
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-red-900">
                        Quote rejected
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-red-800">
                        This quote has been rejected and the
                        associated booking request has been
                        cancelled.
                      </p>

                      <Link
                        href="/services"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-red-700 transition hover:text-red-900"
                      >
                        Browse services
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </section>
              )}

              {/* Pending */}
              {quote.status === "PENDING" && (
                <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-amber-900">
                        Quote being prepared
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-amber-800">
                        HomeServe is reviewing your request.
                        You'll be able to respond once the quote
                        has been sent.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* Expired */}
              {quote.status === "EXPIRED" && (
                <section className="rounded-xl border border-slate-200 bg-slate-100 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-600">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-slate-800">
                        Quote expired
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        This quote is no longer valid. Please
                        contact HomeServe or submit a new service
                        request.
                      </p>
                    </div>
                  </div>
                </section>
              )}

            </div>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}

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
      <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          {/* Back */}
          <Link
            href="/quotes"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <span>←</span>
            Back to quotes
          </Link>

          {/* Loading */}
          {loading && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="text-sm text-slate-600">
                Loading quote...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
              <h1 className="text-lg font-bold text-red-800">
                Unable to load quote
              </h1>

              <p className="mt-2 text-sm text-red-700">
                {error}
              </p>

              <Link
                href="/quotes"
                className="mt-5 inline-flex rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Back to quotes
              </Link>
            </div>
          )}

          {/* Quote */}
          {!loading && !error && quote && (
            <div className="mt-6">

              {/* Header */}
              <div className="rounded-3xl bg-[#061F35] p-5 text-white shadow-xl sm:p-8">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                      HomeServe Quote
                    </p>

                    <h1 className="mt-2 break-words text-2xl font-bold sm:text-3xl">
                      {quote.booking?.service?.name ||
                        "Service Quote"}
                    </h1>

                    {quote.booking?.bookingNumber && (
                      <p className="mt-2 text-sm text-slate-300">
                        Booking{" "}
                        <span className="font-semibold text-white">
                          {quote.booking.bookingNumber}
                        </span>
                      </p>
                    )}
                  </div>

                  <span
                    className={`inline-flex w-fit shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 ${getStatusClasses(
                      quote.status
                    )}`}
                  >
                    {getStatusLabel(quote.status)}
                  </span>
                </div>

                {/* Amount */}
                <div className="mt-7 border-t border-white/10 pt-5 sm:mt-8 sm:pt-6">
                  <p className="text-sm text-slate-300">
                    {quote.finalAmount
                      ? "Final quoted amount"
                      : "Estimated amount"}
                  </p>

                  <p className="mt-1 text-3xl font-bold sm:text-5xl">
                    {formatAmount(amount)}
                  </p>
                </div>
              </div>

              {/* Action error */}
              {actionError && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {actionError}
                </div>
              )}

              {/* Quote information */}
              <div className="mt-6 grid gap-5 md:grid-cols-2">

                {/* Description */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-bold text-[#061F35]">
                    Quote details
                  </h2>

                  {quote.description ? (
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {quote.description}
                    </p>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">
                      No additional description was provided.
                    </p>
                  )}
                </section>

                {/* Schedule */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-bold text-[#061F35]">
                    Service information
                  </h2>

                  <div className="mt-4 space-y-4 text-sm">

                    {quote.booking?.scheduledDate && (
                      <div>
                        <p className="text-slate-400">
                          Service date
                        </p>

                        <p className="mt-1 font-medium text-slate-700">
                          {formatDate(
                            quote.booking.scheduledDate
                          )}
                        </p>
                      </div>
                    )}

                    {quote.booking?.scheduledTime && (
                      <div>
                        <p className="text-slate-400">
                          Preferred time
                        </p>

                        <p className="mt-1 font-medium text-slate-700">
                          {quote.booking.scheduledTime}
                        </p>
                      </div>
                    )}

                    {quote.validUntil && (
                      <div>
                        <p className="text-slate-400">
                          Quote valid until
                        </p>

                        <p className="mt-1 font-medium text-slate-700">
                          {formatDate(
                            quote.validUntil
                          )}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-slate-400">
                        Quote created
                      </p>

                      <p className="mt-1 font-medium text-slate-700">
                        {formatDateTime(
                          quote.createdAt
                        )}
                      </p>
                    </div>

                  </div>
                </section>

              </div>

              {/* Response section */}
              {canRespond && (
                <section className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:mt-6 sm:p-8">

                  <h2 className="text-xl font-bold text-[#061F35]">
                    Ready to proceed?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Review the quote above. If you're happy
                    with the price and service details, you
                    can accept the quote and confirm your
                    booking.
                  </p>

                  {!showRejectConfirmation ? (
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                      <button
                        type="button"
                        onClick={handleAccept}
                        disabled={actionLoading}
                        className="flex h-12 flex-1 items-center justify-center rounded-xl bg-green-600 px-5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoading
                          ? "Processing..."
                          : "Accept Quote"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setShowRejectConfirmation(true)
                        }
                        disabled={actionLoading}
                        className="flex h-12 flex-1 items-center justify-center rounded-xl border border-red-200 bg-white px-5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Reject Quote
                      </button>

                    </div>
                  ) : (
                    <div className="mt-6 rounded-xl border border-red-200 bg-white p-5">

                      <h3 className="font-semibold text-slate-800">
                        Reject this quote?
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Rejecting this quote will cancel the
                        quote request. You can submit a new
                        service request later if needed.
                      </p>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                        <button
                          type="button"
                          onClick={handleReject}
                          disabled={actionLoading}
                          className="flex h-11 items-center justify-center rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                          className="flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Keep Quote
                        </button>

                      </div>
                    </div>
                  )}

                </section>
              )}

              {/* Accepted */}
              {quote.status === "ACCEPTED" && (
                <section className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5 sm:mt-6 sm:p-8">
                  <div className="flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                      ✓
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-green-900">
                        Quote accepted
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-green-800">
                        Your quote has been accepted and your
                        booking has been confirmed. HomeServe
                        can now proceed with the service.
                      </p>

                      <Link
                        href={`/bookings/${quote.bookingId}`}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900"
                      >
                        View booking
                        <span>→</span>
                      </Link>
                    </div>

                  </div>
                </section>
              )}

              {/* Rejected */}
              {quote.status === "REJECTED" && (
                <section className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 sm:mt-6 sm:p-8">
                  <div className="flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                      ×
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-red-900">
                        Quote rejected
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-red-800">
                        This quote has been rejected and the
                        associated booking request has been
                        cancelled.
                      </p>

                      <Link
                        href="/services"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-900"
                      >
                        Browse services
                        <span>→</span>
                      </Link>
                    </div>

                  </div>
                </section>
              )}

              {/* Pending */}
              {quote.status === "PENDING" && (
                <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:mt-6">
                  <h2 className="font-bold text-amber-900">
                    Quote being prepared
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-amber-800">
                    HomeServe is reviewing your request.
                    You'll be able to respond once the quote
                    has been sent.
                  </p>
                </section>
              )}

              {/* Expired */}
              {quote.status === "EXPIRED" && (
                <section className="mt-5 rounded-2xl border border-slate-200 bg-slate-100 p-5 sm:mt-6">
                  <h2 className="font-bold text-slate-800">
                    Quote expired
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    This quote is no longer valid. Please
                    contact HomeServe or submit a new service
                    request.
                  </p>
                </section>
              )}

            </div>
          )}

        </div>
      </main>
    </DashboardShell>
  );
}
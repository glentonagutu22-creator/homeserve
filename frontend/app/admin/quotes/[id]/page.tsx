"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import DashboardShell from "@/components/dashboard/DashboardShell";

import {
  getAdminQuote,
  updateAdminQuote,
  sendAdminQuote,
} from "@/lib/quotes";

import type { Quote } from "@/types/quote";

export default function AdminQuoteDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const quoteId = String(params.id);

  const [quote, setQuote] =
    useState<Quote | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [estimatedAmount, setEstimatedAmount] =
    useState("");

  const [finalAmount, setFinalAmount] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [validUntil, setValidUntil] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Load quote
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadQuote() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAdminQuote(quoteId);

        setQuote(data);

        setEstimatedAmount(
          data.estimatedAmount
            ? String(data.estimatedAmount)
            : ""
        );

        setFinalAmount(
          data.finalAmount
            ? String(data.finalAmount)
            : ""
        );

        setDescription(
          data.description ?? ""
        );

        if (data.validUntil) {
          setValidUntil(
            data.validUntil.slice(0, 10)
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load quote."
        );
      } finally {
        setLoading(false);
      }
    }

    if (quoteId) {
      loadQuote();
    }
  }, [quoteId]);

  /*
  |--------------------------------------------------------------------------
  | Save quote
  |--------------------------------------------------------------------------
  */

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (
        estimatedAmount &&
        Number(estimatedAmount) <= 0
      ) {
        setError(
          "Estimated amount must be greater than zero."
        );
        return;
      }

      if (
        finalAmount &&
        Number(finalAmount) <= 0
      ) {
        setError(
          "Final amount must be greater than zero."
        );
        return;
      }

      const updated =
        await updateAdminQuote(
          quoteId,
          {
            estimatedAmount:
              estimatedAmount
                ? Number(estimatedAmount)
                : undefined,

            finalAmount:
              finalAmount
                ? Number(finalAmount)
                : undefined,

            description:
              description.trim() ||
              undefined,

            validUntil:
              validUntil
                ? new Date(
                    `${validUntil}T23:59:59`
                  ).toISOString()
                : undefined,
          }
        );

      setQuote(updated);

      setSuccess(
        "Quote saved successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save quote."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Send quote
  |--------------------------------------------------------------------------
  */

  async function handleSend() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!estimatedAmount && !finalAmount) {
        setError(
          "Enter an estimated amount or final amount before sending the quote."
        );
        return;
      }

      if (
        estimatedAmount &&
        Number(estimatedAmount) <= 0
      ) {
        setError(
          "Estimated amount must be greater than zero."
        );
        return;
      }

      if (
        finalAmount &&
        Number(finalAmount) <= 0
      ) {
        setError(
          "Final amount must be greater than zero."
        );
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Save the latest quote information first
      |--------------------------------------------------------------------------
      */

      await updateAdminQuote(
        quoteId,
        {
          estimatedAmount:
            estimatedAmount
              ? Number(estimatedAmount)
              : undefined,

          finalAmount:
            finalAmount
              ? Number(finalAmount)
              : undefined,

          description:
            description.trim() ||
            undefined,

          validUntil:
            validUntil
              ? new Date(
                  `${validUntil}T23:59:59`
                ).toISOString()
              : undefined,
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Send quote
      |--------------------------------------------------------------------------
      */

      const sentQuote =
        await sendAdminQuote(quoteId);

      setQuote(sentQuote);

      setSuccess(
        "Quote sent successfully to the customer."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send quote."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <DashboardShell>
        <div className="min-h-screen bg-slate-50">
          <main className="mx-auto max-w-5xl px-6 py-16">
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-slate-600">
                Loading quote...
              </p>
            </div>
          </main>
        </div>
      </DashboardShell>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error && !quote) {
    return (
      <DashboardShell>
        <div className="min-h-screen bg-slate-50">
          <main className="mx-auto max-w-5xl px-6 py-16">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
              {error}
            </div>

            <Link
              href="/admin/quotes"
              className="mt-6 inline-block font-semibold text-[#061F35]"
            >
              ← Back to Quotes
            </Link>
          </main>
        </div>
      </DashboardShell>
    );
  }

  if (!quote) {
    return null;
  }

  const booking =
    quote.booking;

  const isLocked =
    quote.status === "SENT" ||
    quote.status === "ACCEPTED" ||
    quote.status === "REJECTED" ||
    quote.status === "EXPIRED";

  return (
    <DashboardShell>
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-6xl px-6 py-12">
          {/* Header */}

          <div className="mb-8">
            <Link
              href="/admin/quotes"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              ← Back to Quote Requests
            </Link>

            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  HomeServe Admin
                </p>

                <h1 className="mt-1 text-3xl font-bold text-[#061F35]">
                  Review Quote
                </h1>

                <p className="mt-2 text-slate-600">
                  Booking{" "}
                  <span className="font-mono">
                    {booking?.bookingNumber}
                  </span>
                </p>
              </div>

              <span className="inline-flex w-fit rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
                {quote.status}
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
              {success}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Customer / Booking Information */}

            <div className="space-y-6 lg:col-span-1">
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#061F35]">
                  Customer
                </h2>

                <div className="mt-5 space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Name
                    </p>

                    <p className="font-medium text-slate-800">
                      {booking?.user?.name ??
                        "Unknown"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Email
                    </p>

                    <p className="break-all text-slate-700">
                      {booking?.user?.email ??
                        "No email"}
                    </p>
                  </div>

                  {booking?.user?.phone && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        Phone
                      </p>

                      <p className="text-slate-700">
                        {booking.user.phone}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#061F35]">
                  Booking
                </h2>

                <div className="mt-5 space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Service
                    </p>

                    <p className="font-medium text-slate-800">
                      {booking?.service?.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Category
                    </p>

                    <p className="text-slate-700">
                      {booking?.service?.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Date
                    </p>

                    <p className="text-slate-700">
                      {booking?.scheduledDate
                        ? new Date(
                            booking.scheduledDate
                          ).toLocaleDateString(
                            "en-KE",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Time
                    </p>

                    <p className="text-slate-700">
                      {booking?.scheduledTime ??
                        "-"}
                    </p>
                  </div>
                </div>
              </section>

              {booking?.address && (
                <section className="rounded-2xl bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-[#061F35]">
                    Service Address
                  </h2>

                  <div className="mt-5">
                    <p className="font-medium text-slate-800">
                      {booking.address.label}
                    </p>

                    <p className="mt-1 text-slate-600">
                      {booking.address.addressLine}
                    </p>

                    <p className="text-slate-600">
                      {booking.address.city},{" "}
                      {booking.address.county}
                    </p>
                  </div>
                </section>
              )}
            </div>

            {/* Quote + Request Details */}

            <div className="space-y-6 lg:col-span-2">
              {/* Request details */}

              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#061F35]">
                  Customer Requirements
                </h2>

                {booking.cleaningRequest && (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Info
                      label="Property Type"
                      value={
                        booking
                          .cleaningRequest
                          .propertyType
                      }
                    />

                    <Info
                      label="Cleaning Type"
                      value={
                        booking
                          .cleaningRequest
                          .cleaningType
                      }
                    />

                    <Info
                      label="Bedrooms"
                      value={String(
                        booking
                          .cleaningRequest
                          .bedrooms ??
                          "-"
                      )}
                    />

                    <Info
                      label="Bathrooms"
                      value={String(
                        booking
                          .cleaningRequest
                          .bathrooms ??
                          "-"
                      )}
                    />

                    <Info
                      label="Area"
                      value={
                        booking
                          .cleaningRequest
                          .squareMeters
                          ? `${booking.cleaningRequest.squareMeters} m²`
                          : "-"
                      }
                    />

                    <Info
                      label="Additional Requirements"
                      value={
                        booking
                          .cleaningRequest
                          .additionalRequirements ??
                        "None"
                      }
                    />
                  </div>
                )}

                {booking.movingRequest && (
                  <div className="mt-5 space-y-4">
                    <Info
                      label="Property Type"
                      value={
                        booking
                          .movingRequest
                          .propertyType
                      }
                    />

                    <Info
                      label="Pickup"
                      value={
                        booking
                          .movingRequest
                          .pickupAddress
                      }
                    />

                    <Info
                      label="Destination"
                      value={
                        booking
                          .movingRequest
                          .destinationAddress
                      }
                    />

                    <Info
                      label="Truck Size"
                      value={
                        booking
                          .movingRequest
                          .truckSize ??
                        "-"
                      }
                    />

                    <Info
                      label="Number of Movers"
                      value={String(
                        booking
                          .movingRequest
                          .numberOfMovers ??
                          "-"
                      )}
                    />

                    <Info
                      label="Packing Required"
                      value={
                        booking
                          .movingRequest
                          .packingRequired
                          ? "Yes"
                          : "No"
                      }
                    />

                    <Info
                      label="Special Items"
                      value={
                        booking
                          .movingRequest
                          .specialItems ??
                        "None"
                      }
                    />
                  </div>
                )}

                {booking.electricalRequest && (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Info
                      label="Property Type"
                      value={
                        booking
                          .electricalRequest
                          .propertyType
                      }
                    />

                    <Info
                      label="Floors"
                      value={String(
                        booking
                          .electricalRequest
                          .numberOfFloors ??
                          "-"
                      )}
                    />

                    <Info
                      label="Bedrooms"
                      value={String(
                        booking
                          .electricalRequest
                          .bedrooms ??
                          "-"
                      )}
                    />

                    <Info
                      label="New Installation"
                      value={
                        booking
                          .electricalRequest
                          .newInstallation
                          ? "Yes"
                          : "No"
                      }
                    />

                    <Info
                      label="Rewiring"
                      value={
                        booking
                          .electricalRequest
                          .rewiring
                          ? "Yes"
                          : "No"
                      }
                    />

                    <Info
                      label="Sockets"
                      value={String(
                        booking
                          .electricalRequest
                          .numberOfSockets ??
                          "-"
                      )}
                    />

                    <Info
                      label="Lights"
                      value={String(
                        booking
                          .electricalRequest
                          .numberOfLights ??
                          "-"
                      )}
                    />

                    <Info
                      label="Distribution Board"
                      value={
                        booking
                          .electricalRequest
                          .distributionBoard
                          ? "Yes"
                          : "No"
                      }
                    />

                    <Info
                      label="Additional Requirements"
                      value={
                        booking
                          .electricalRequest
                          .additionalRequirements ??
                        "None"
                      }
                    />
                  </div>
                )}
              </section>

              {/* Quote editor */}

              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-[#061F35]">
                    Quote Pricing
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Set the amount and information
                    the customer will receive.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Estimated Amount (KSh)
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={estimatedAmount}
                      onChange={(e) =>
                        setEstimatedAmount(
                          e.target.value
                        )
                      }
                      disabled={isLocked}
                      placeholder="e.g. 15000"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Final Amount (KSh)
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={finalAmount}
                      onChange={(e) =>
                        setFinalAmount(
                          e.target.value
                        )
                      }
                      disabled={isLocked}
                      placeholder="e.g. 18000"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Quote Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    disabled={isLocked}
                    rows={5}
                    maxLength={2000}
                    placeholder="Explain the work included, materials, labor, or any other important information..."
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                  />

                  <p className="mt-1 text-right text-xs text-slate-400">
                    {description.length}/2000
                  </p>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Quote Valid Until
                  </label>

                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) =>
                      setValidUntil(
                        e.target.value
                      )
                    }
                    disabled={isLocked}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>

                {!isLocked && (
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-xl bg-[#061F35] px-6 py-3 font-semibold text-white transition hover:bg-[#082B49] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving
                        ? "Saving..."
                        : "Save Quote"}
                    </button>

                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={saving}
                      className="rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving
                        ? "Sending..."
                        : "Send Quote"}
                    </button>
                  </div>
                )}

                {isLocked && (
                  <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                    This quote is{" "}
                    <strong>
                      {quote.status.toLowerCase()}
                    </strong>{" "}
                    and can no longer be modified.
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </DashboardShell>
  );
}

/*
|--------------------------------------------------------------------------
| Info component
|--------------------------------------------------------------------------
*/

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
        {value}
      </p>
    </div>
  );
}
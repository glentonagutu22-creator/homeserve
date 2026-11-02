
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import DashboardShell from "@/components/dashboard/DashboardShell";

import {
  getAdminQuote,
  updateAdminQuote,
  sendAdminQuote,
} from "@/lib/quotes";

import type { Quote } from "@/types/quote";

export default function AdminQuoteDetailsPage() {
  const params = useParams();
  const quoteId = String(params.id);

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [estimatedAmount, setEstimatedAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [description, setDescription] = useState("");
  const [validUntil, setValidUntil] = useState("");

  useEffect(() => {
    async function loadQuote() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminQuote(quoteId);

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

        setDescription(data.description ?? "");

        if (data.validUntil) {
          setValidUntil(data.validUntil.slice(0, 10));
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

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (
        estimatedAmount &&
        Number(estimatedAmount) <= 0
      ) {
        setError("Estimated amount must be greater than zero.");
        return;
      }

      if (
        finalAmount &&
        Number(finalAmount) <= 0
      ) {
        setError("Final amount must be greater than zero.");
        return;
      }

      const updated = await updateAdminQuote(quoteId, {
        estimatedAmount: estimatedAmount
          ? Number(estimatedAmount)
          : undefined,

        finalAmount: finalAmount
          ? Number(finalAmount)
          : undefined,

        description: description.trim() || undefined,

        validUntil: validUntil
          ? new Date(`${validUntil}T23:59:59`).toISOString()
          : undefined,
      });

      setQuote(updated);
      setSuccess("Quote saved successfully.");
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
        setError("Estimated amount must be greater than zero.");
        return;
      }

      if (
        finalAmount &&
        Number(finalAmount) <= 0
      ) {
        setError("Final amount must be greater than zero.");
        return;
      }

      // Save the latest quote information first.
      await updateAdminQuote(quoteId, {
        estimatedAmount: estimatedAmount
          ? Number(estimatedAmount)
          : undefined,

        finalAmount: finalAmount
          ? Number(finalAmount)
          : undefined,

        description: description.trim() || undefined,

        validUntil: validUntil
          ? new Date(`${validUntil}T23:59:59`).toISOString()
          : undefined,
      });

      // Send the quote.
      const sentQuote = await sendAdminQuote(quoteId);

      setQuote(sentQuote);
      setSuccess("Quote sent successfully to the customer.");
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

  if (loading) {
    return (
      <DashboardShell>
        <div className="min-h-screen bg-slate-50 px-3 py-6 sm:px-6 sm:py-10">
          <main className="mx-auto max-w-6xl">
            <div className="border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-600">
                Loading quote...
              </p>
            </div>
          </main>
        </div>
      </DashboardShell>
    );
  }

  if (error && !quote) {
    return (
      <DashboardShell>
        <div className="min-h-screen bg-slate-50 px-3 py-6 sm:px-6 sm:py-10">
          <main className="mx-auto max-w-6xl">
            <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>

            <Link
              href="/admin/quotes"
              className="mt-5 inline-block text-sm font-semibold text-[#061F35] hover:underline"
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

  const booking = quote.booking;

  const isLocked =
    quote.status === "SENT" ||
    quote.status === "ACCEPTED" ||
    quote.status === "REJECTED" ||
    quote.status === "EXPIRED";

  const statusStyles: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    SENT: "bg-blue-100 text-blue-700",
    ACCEPTED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-red-100 text-red-700",
    EXPIRED: "bg-amber-100 text-amber-800",
  };

  return (
    <DashboardShell>
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-6xl space-y-5 px-3 py-4 pb-24 sm:space-y-6 sm:px-6 sm:py-7 lg:pb-10">

          {/* Page heading */}
          <section className="bg-[#061F35] px-4 py-4 text-white sm:px-6 sm:py-5">
            <Link
              href="/admin/quotes"
              className="mb-3 inline-flex text-xs font-medium text-blue-200 transition hover:text-white"
            >
              ← Back to Quote Requests
            </Link>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
                  HomeServe Admin
                </p>

                <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                  Review Quote
                </h1>

                <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                  Booking{" "}
                  <span className="font-mono font-semibold text-white">
                    {booking?.bookingNumber}
                  </span>
                </p>
              </div>

              <span
                className={`inline-flex items-center px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${
                  statusStyles[quote.status] ??
                  "bg-slate-100 text-slate-700"
                }`}
              >
                {quote.status}
              </span>
            </div>
          </section>

          {/* Feedback messages */}
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

          {success && (
            <div className="flex items-start justify-between gap-3 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <p>{success}</p>
              <button
                type="button"
                onClick={() => setSuccess("")}
                className="font-bold"
                aria-label="Dismiss success message"
              >
                ×
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

            {/* Customer and booking information */}
            <div className="space-y-4 lg:col-span-1">

              {/* Customer */}
              <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <SectionHeading title="Customer" />

                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
                  <Info
                    label="Name"
                    value={booking?.user?.name ?? "Unknown"}
                  />

                  <Info
                    label="Phone"
                    value={booking?.user?.phone ?? "Not provided"}
                  />

                  <div className="col-span-2 min-w-0">
                    <Info
                      label="Email"
                      value={booking?.user?.email ?? "No email"}
                    />
                  </div>
                </div>
              </section>

              {/* Booking */}
              <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <SectionHeading title="Booking" />

                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
                  <Info
                    label="Service"
                    value={booking?.service?.name ?? "-"}
                  />

                  <Info
                    label="Category"
                    value={booking?.service?.category ?? "-"}
                  />

                  <Info
                    label="Date"
                    value={
                      booking?.scheduledDate
                        ? new Date(
                            booking.scheduledDate
                          ).toLocaleDateString("en-KE", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "-"
                    }
                  />

                  <Info
                    label="Time"
                    value={booking?.scheduledTime ?? "-"}
                  />
                </div>
              </section>

              {/* Service address */}
              {booking?.address && (
                <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <SectionHeading title="Service Address" />

                  <div className="mt-4 space-y-2">
                    <Info
                      label="Address Label"
                      value={booking.address.label}
                    />

                    <Info
                      label="Street / Area"
                      value={booking.address.addressLine}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <Info
                        label="City"
                        value={booking.address.city}
                      />

                      <Info
                        label="County"
                        value={booking.address.county}
                      />
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Request details and quote editor */}
            <div className="space-y-5 lg:col-span-2">

              {/* Customer requirements */}
              <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <SectionHeading title="Customer Requirements" />

                {booking.cleaningRequest && (
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
                    <Info
                      label="Property Type"
                      value={booking.cleaningRequest.propertyType}
                    />

                    <Info
                      label="Cleaning Type"
                      value={booking.cleaningRequest.cleaningType}
                    />

                    <Info
                      label="Bedrooms"
                      value={String(
                        booking.cleaningRequest.bedrooms ?? "-"
                      )}
                    />

                    <Info
                      label="Bathrooms"
                      value={String(
                        booking.cleaningRequest.bathrooms ?? "-"
                      )}
                    />

                    <Info
                      label="Area"
                      value={
                        booking.cleaningRequest.squareMeters
                          ? `${booking.cleaningRequest.squareMeters} m²`
                          : "-"
                      }
                    />

                    <Info
                      label="Additional Requirements"
                      value={
                        booking.cleaningRequest.additionalRequirements ??
                        "None"
                      }
                    />
                  </div>
                )}

                {booking.movingRequest && (
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
                    <Info
                      label="Property Type"
                      value={booking.movingRequest.propertyType}
                    />

                    <Info
                      label="Truck Size"
                      value={booking.movingRequest.truckSize ?? "-"}
                    />

                    <div className="col-span-2">
                      <Info
                        label="Pickup"
                        value={booking.movingRequest.pickupAddress}
                      />
                    </div>

                    <div className="col-span-2">
                      <Info
                        label="Destination"
                        value={booking.movingRequest.destinationAddress}
                      />
                    </div>

                    <Info
                      label="Number of Movers"
                      value={String(
                        booking.movingRequest.numberOfMovers ?? "-"
                      )}
                    />

                    <Info
                      label="Packing Required"
                      value={
                        booking.movingRequest.packingRequired
                          ? "Yes"
                          : "No"
                      }
                    />

                    <div className="col-span-2">
                      <Info
                        label="Special Items"
                        value={
                          booking.movingRequest.specialItems ?? "None"
                        }
                      />
                    </div>
                  </div>
                )}

                {booking.electricalRequest && (
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
                    <Info
                      label="Property Type"
                      value={booking.electricalRequest.propertyType}
                    />

                    <Info
                      label="Floors"
                      value={String(
                        booking.electricalRequest.numberOfFloors ?? "-"
                      )}
                    />

                    <Info
                      label="Bedrooms"
                      value={String(
                        booking.electricalRequest.bedrooms ?? "-"
                      )}
                    />

                    <Info
                      label="New Installation"
                      value={
                        booking.electricalRequest.newInstallation
                          ? "Yes"
                          : "No"
                      }
                    />

                    <Info
                      label="Rewiring"
                      value={
                        booking.electricalRequest.rewiring
                          ? "Yes"
                          : "No"
                      }
                    />

                    <Info
                      label="Sockets"
                      value={String(
                        booking.electricalRequest.numberOfSockets ?? "-"
                      )}
                    />

                    <Info
                      label="Lights"
                      value={String(
                        booking.electricalRequest.numberOfLights ?? "-"
                      )}
                    />

                    <Info
                      label="Distribution Board"
                      value={
                        booking.electricalRequest.distributionBoard
                          ? "Yes"
                          : "No"
                      }
                    />

                    <div className="col-span-2">
                      <Info
                        label="Additional Requirements"
                        value={
                          booking.electricalRequest.additionalRequirements ??
                          "None"
                        }
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* Quote editor */}
              <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-5">
                  <SectionHeading title="Quote Pricing" />

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Set the amount and information the customer will receive.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                  <div className="min-w-0">
                    <label className="mb-2 block text-xs font-semibold text-slate-700 sm:text-sm">
                      Estimated Amount (KSh)
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={estimatedAmount}
                      onChange={(e) =>
                        setEstimatedAmount(e.target.value)
                      }
                      disabled={isLocked}
                      placeholder="e.g. 15000"
                      className="w-full min-w-0 border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500 sm:px-4 sm:py-3"
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="mb-2 block text-xs font-semibold text-slate-700 sm:text-sm">
                      Final Amount (KSh)
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={finalAmount}
                      onChange={(e) =>
                        setFinalAmount(e.target.value)
                      }
                      disabled={isLocked}
                      placeholder="e.g. 18000"
                      className="w-full min-w-0 border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500 sm:px-4 sm:py-3"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <label className="block text-xs font-semibold text-slate-700 sm:text-sm">
                      Quote Description
                    </label>

                    <span className="text-[10px] text-slate-400 sm:text-xs">
                      {description.length}/2000
                    </span>
                  </div>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    disabled={isLocked}
                    rows={5}
                    maxLength={2000}
                    placeholder="Explain the work included, materials, labor, or any other important information..."
                    className="w-full resize-none border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500 sm:px-4"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-xs font-semibold text-slate-700 sm:text-sm">
                    Quote Valid Until
                  </label>

                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) =>
                      setValidUntil(e.target.value)
                    }
                    disabled={isLocked}
                    className="w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500 sm:w-auto sm:px-4 sm:py-3"
                  />
                </div>

                {!isLocked && (
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-[#061F35] px-3 py-3 text-xs font-bold text-white transition hover:bg-[#082B49] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-36 sm:px-6 sm:text-sm"
                    >
                      {saving ? "Saving..." : "Save Quote"}
                    </button>

                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={saving}
                      className="border border-[#061F35] px-3 py-3 text-xs font-bold text-[#061F35] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-36 sm:px-6 sm:text-sm"
                    >
                      {saving ? "Sending..." : "Send Quote"}
                    </button>
                  </div>
                )}

                {isLocked && (
                  <div className="mt-5 border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    This quote is{" "}
                    <strong>{quote.status.toLowerCase()}</strong>{" "}
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

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="border-b border-slate-100 pb-3 text-sm font-bold text-[#061F35] sm:text-base">
      {title}
    </h2>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:text-[10px]">
        {label}
      </p>

      <p className="mt-1 break-words whitespace-pre-wrap text-xs font-medium leading-relaxed text-slate-800 sm:text-sm">
        {value}
      </p>
    </div>
  );
}

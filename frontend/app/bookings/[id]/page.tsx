"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import DashboardShell from "@/components/dashboard/DashboardShell";

import {
  cancelBooking,
  getBooking,
} from "@/lib/bookings";

import type {
  Booking,
  BookingStatus,
} from "@/types/booking";

const statusStyles: Record<
  BookingStatus,
  string
> = {
  PENDING:
    "bg-amber-50 text-amber-700 border-amber-100",

  CONFIRMED:
    "bg-blue-50 text-blue-700 border-blue-100",

  ASSIGNED:
    "bg-purple-50 text-purple-700 border-purple-100",

  IN_PROGRESS:
    "bg-cyan-50 text-cyan-700 border-cyan-100",

  COMPLETED:
    "bg-green-50 text-green-700 border-green-100",

  CANCELLED:
    "bg-red-50 text-red-700 border-red-100",
};

const categoryStyles = {
  CLEANING:
    "bg-blue-50 text-blue-700 border-blue-100",

  MOVING:
    "bg-green-50 text-green-700 border-green-100",

  ELECTRICAL:
    "bg-amber-50 text-amber-700 border-amber-100",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatCategory(category: string) {
  return (
    category.charAt(0) +
    category.slice(1).toLowerCase()
  );
}

function formatStatus(status: BookingStatus) {
  return status.replace("_", " ");
}

function formatAmount(
  amount: string | null
) {
  if (amount === null) {
    return "Price pending";
  }

  return `KES ${Number(amount).toLocaleString(
    "en-KE",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-700">
        {value}
      </p>
    </div>
  );
}

export default function BookingDetailsPage() {
  const params = useParams();

  const bookingId = String(params.id);

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [showCancelForm, setShowCancelForm] =
    useState(false);

  const [
    cancellationReason,
    setCancellationReason,
  ] = useState("");

  const [cancelling, setCancelling] =
    useState(false);

  const [cancelError, setCancelError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadBooking() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getBooking(bookingId);

        setBooking(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load booking."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [bookingId]);

  async function handleCancelBooking() {
    try {
      setCancelling(true);
      setCancelError(null);

      await cancelBooking(bookingId, {
        reason:
          cancellationReason.trim() || undefined,
      });

      const refreshedBooking =
        await getBooking(bookingId);

      setBooking(refreshedBooking);

      setShowCancelForm(false);
      setCancellationReason("");
    } catch (error) {
      setCancelError(
        error instanceof Error
          ? error.message
          : "Failed to cancel booking."
      );
    } finally {
      setCancelling(false);
    }
  }

  /*
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (loading) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Customer Account
            </p>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#061F35] sm:text-3xl">
              Booking Details
            </h1>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading booking details...
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  /*
   * ==========================================================
   * ERROR
   * ==========================================================
   */

  if (error || !booking) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Customer Account
            </p>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#061F35] sm:text-3xl">
              Booking Details
            </h1>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <h1 className="text-2xl font-bold text-red-900">
              Booking not found
            </h1>

            <p className="mt-3 text-sm text-red-700">
              {error ||
                "We couldn't find this booking."}
            </p>

            <Link
              href="/bookings"
              className="mt-6 inline-flex rounded-xl bg-[#061F35] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#082B49]"
            >
              ← Back to Bookings
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const category =
    booking.service.category;

  return (
    <DashboardShell>
      <div className="space-y-7">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div>
          <Link
            href="/bookings"
            className="inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            ← Back to My Bookings
          </Link>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${categoryStyles[category]}`}
                >
                  {formatCategory(category)}
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${statusStyles[booking.status]}`}
                >
                  {formatStatus(
                    booking.status
                  )}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#061F35] sm:text-4xl">
                {booking.service.name}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Booking #
                {booking.bookingNumber}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm sm:min-w-[190px] sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Total Amount
              </p>

              <p className="mt-1 text-lg font-extrabold text-[#061F35]">
                {formatAmount(
                  booking.totalAmount
                )}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">

          {/* ===================================================
              LEFT COLUMN
          =================================================== */}

          <div className="space-y-6">

            {/* Service */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                Service
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#061F35]">
                {booking.service.name}
              </h2>

              {booking.service.description && (
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {booking.service.description}
                </p>
              )}

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <DetailItem
                  label="Category"
                  value={formatCategory(
                    booking.service.category
                  )}
                />

                <DetailItem
                  label="Pricing"
                  value={
                    booking.service
                      .pricingType ===
                    "QUOTE"
                      ? "Quote required"
                      : booking.service
                            .pricingType ===
                        "FIXED"
                        ? "Fixed price"
                        : "Calculated"
                  }
                />

                <DetailItem
                  label="Duration"
                  value={
                    booking.service
                      .duration
                      ? `Approx. ${Math.round(
                          booking.service
                            .duration / 60
                        )} hours`
                      : "Duration varies"
                  }
                />

                <DetailItem
                  label="Booking Type"
                  value={
                    booking.bookingType ===
                    "INSTANT"
                      ? "Instant booking"
                      : "Quote request"
                  }
                />
              </div>
            </section>

            {/* Schedule */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                Schedule
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#061F35]">
                Service appointment
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <DetailItem
                  label="Date"
                  value={formatDate(
                    booking.scheduledDate
                  )}
                />

                <DetailItem
                  label="Time"
                  value={
                    booking.scheduledTime
                  }
                />
              </div>
            </section>

            {/* Address */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                Service Location
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#061F35]">
                {booking.address.label}
              </h2>

              <div className="mt-5 text-sm leading-6 text-gray-600">
                <p>
                  {booking.address.addressLine}
                </p>

                <p>
                  {booking.address.city},{" "}
                  {booking.address.county}
                </p>
              </div>
            </section>

            {/* Notes */}

            {booking.notes && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                  Notes
                </p>

                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
                  {booking.notes}
                </p>
              </section>
            )}

            {/* =================================================
                CLEANING DETAILS
            ================================================= */}

            {booking.cleaningRequest && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                  Cleaning Details
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#061F35]">
                  Property information
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <DetailItem
                    label="Property Type"
                    value={
                      booking
                        .cleaningRequest
                        .propertyType
                    }
                  />

                  <DetailItem
                    label="Cleaning Type"
                    value={
                      booking
                        .cleaningRequest
                        .cleaningType
                    }
                  />

                  <DetailItem
                    label="Bedrooms"
                    value={
                      booking
                        .cleaningRequest
                        .bedrooms !==
                      null
                        ? String(
                            booking
                              .cleaningRequest
                              .bedrooms
                          )
                        : "Not specified"
                    }
                  />

                  <DetailItem
                    label="Bathrooms"
                    value={
                      booking
                        .cleaningRequest
                        .bathrooms !==
                      null
                        ? String(
                            booking
                              .cleaningRequest
                              .bathrooms
                          )
                        : "Not specified"
                    }
                  />

                  <DetailItem
                    label="Square Metres"
                    value={
                      booking
                        .cleaningRequest
                        .squareMeters
                        ? `${booking.cleaningRequest.squareMeters} m²`
                        : "Not specified"
                    }
                  />
                </div>

                {booking.cleaningRequest
                  .additionalRequirements && (
                  <div className="mt-6 border-t border-gray-100 pt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Additional Requirements
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {
                        booking
                          .cleaningRequest
                          .additionalRequirements
                      }
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* =================================================
                MOVING DETAILS
            ================================================= */}

            {booking.movingRequest && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-600">
                  Moving Details
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#061F35]">
                  Moving information
                </h2>

                <div className="mt-6 space-y-5">
                  <DetailItem
                    label="Pickup Address"
                    value={
                      booking.movingRequest
                        .pickupAddress
                    }
                  />

                  <DetailItem
                    label="Destination"
                    value={
                      booking.movingRequest
                        .destinationAddress
                    }
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <DetailItem
                      label="Property Type"
                      value={
                        booking.movingRequest
                          .propertyType
                      }
                    />

                    <DetailItem
                      label="Truck Size"
                      value={
                        booking.movingRequest
                          .truckSize ||
                        "Not specified"
                      }
                    />

                    <DetailItem
                      label="Number of Movers"
                      value={
                        booking.movingRequest
                          .numberOfMovers !==
                        null
                          ? String(
                              booking
                                .movingRequest
                                .numberOfMovers
                            )
                          : "Not specified"
                      }
                    />

                    <DetailItem
                      label="Packing"
                      value={
                        booking.movingRequest
                          .packingRequired
                          ? "Required"
                          : "Not required"
                      }
                    />
                  </div>

                  {booking.movingRequest
                    .estimatedDistanceKm && (
                    <DetailItem
                      label="Estimated Distance"
                      value={`${booking.movingRequest.estimatedDistanceKm} km`}
                    />
                  )}

                  {booking.movingRequest
                    .specialItems && (
                    <div className="border-t border-gray-100 pt-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Special Items
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {
                          booking
                            .movingRequest
                            .specialItems
                        }
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* =================================================
                ELECTRICAL DETAILS
            ================================================= */}

            {booking.electricalRequest && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
                  Electrical Details
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#061F35]">
                  Electrical requirements
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <DetailItem
                    label="Property Type"
                    value={
                      booking
                        .electricalRequest
                        .propertyType
                    }
                  />

                  <DetailItem
                    label="Floors"
                    value={
                      booking
                        .electricalRequest
                        .numberOfFloors !==
                      null
                        ? String(
                            booking
                              .electricalRequest
                              .numberOfFloors
                          )
                        : "Not specified"
                    }
                  />

                  <DetailItem
                    label="Bedrooms"
                    value={
                      booking
                        .electricalRequest
                        .bedrooms !==
                      null
                        ? String(
                            booking
                              .electricalRequest
                              .bedrooms
                          )
                        : "Not specified"
                    }
                  />

                  <DetailItem
                    label="Sockets"
                    value={
                      booking
                        .electricalRequest
                        .numberOfSockets !==
                      null
                        ? String(
                            booking
                              .electricalRequest
                              .numberOfSockets
                          )
                        : "Not specified"
                    }
                  />

                  <DetailItem
                    label="Lights"
                    value={
                      booking
                        .electricalRequest
                        .numberOfLights !==
                      null
                        ? String(
                            booking
                              .electricalRequest
                              .numberOfLights
                          )
                        : "Not specified"
                    }
                  />

                  <DetailItem
                    label="New Installation"
                    value={
                      booking
                        .electricalRequest
                        .newInstallation
                        ? "Yes"
                        : "No"
                    }
                  />

                  <DetailItem
                    label="Rewiring"
                    value={
                      booking
                        .electricalRequest
                        .rewiring
                        ? "Yes"
                        : "No"
                    }
                  />

                  <DetailItem
                    label="Distribution Board"
                    value={
                      booking
                        .electricalRequest
                        .distributionBoard
                        ? "Required"
                        : "Not required"
                    }
                  />
                </div>

                {booking
                  .electricalRequest
                  .additionalRequirements && (
                  <div className="mt-6 border-t border-gray-100 pt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Additional Requirements
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {
                        booking
                          .electricalRequest
                          .additionalRequirements
                      }
                    </p>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* ===================================================
              RIGHT COLUMN
          =================================================== */}

          <aside className="space-y-6">

            {/* Booking Status */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                Booking Status
              </p>

              <div className="mt-4">
                <span
                  className={`inline-flex rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide ${statusStyles[booking.status]}`}
                >
                  {formatStatus(
                    booking.status
                  )}
                </span>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-5">
                <DetailItem
                  label="Booking Number"
                  value={
                    booking.bookingNumber
                  }
                />
              </div>
            </section>

            {/* Cancel Booking */}

            {booking.status !== "CANCELLED" &&
              booking.status !== "COMPLETED" &&
              booking.status !== "IN_PROGRESS" && (
                <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">
                    Manage Booking
                  </p>

                  {!showCancelForm ? (
                    <>
                      <h2 className="mt-2 text-xl font-bold text-[#061F35]">
                        Need to cancel?
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        You can cancel this
                        booking before the
                        service is completed.
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setShowCancelForm(
                            true
                          );
                          setCancelError(null);
                        }}
                        className="mt-5 w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                      >
                        Cancel Booking
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="mt-2 text-xl font-bold text-[#061F35]">
                        Cancel this booking?
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        This action will
                        cancel your booking.
                      </p>

                      <div className="mt-5">
                        <label
                          htmlFor="cancellationReason"
                          className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                          Reason{" "}
                          <span className="font-normal text-gray-400">
                            (optional)
                          </span>
                        </label>

                        <textarea
                          id="cancellationReason"
                          value={
                            cancellationReason
                          }
                          onChange={(event) =>
                            setCancellationReason(
                              event.target.value
                            )
                          }
                          maxLength={500}
                          rows={4}
                          placeholder="Why are you cancelling?"
                          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white"
                        />

                        <p className="mt-1 text-right text-xs text-gray-400">
                          {
                            cancellationReason.length
                          }
                          /500
                        </p>
                      </div>

                      {cancelError && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                          {cancelError}
                        </div>
                      )}

                      <div className="mt-5 flex flex-col gap-3">
                        <button
                          type="button"
                          onClick={
                            handleCancelBooking
                          }
                          disabled={cancelling}
                          className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {cancelling
                            ? "Cancelling..."
                            : "Confirm Cancellation"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowCancelForm(
                              false
                            );
                            setCancellationReason(
                              ""
                            );
                            setCancelError(null);
                          }}
                          disabled={cancelling}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Keep Booking
                        </button>
                      </div>
                    </>
                  )}
                </section>
              )}

            {/* Quote */}

            {booking.quote && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                  Quote
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#061F35]">
                  Quote information
                </h2>

                <div className="mt-5 space-y-5">
                  <DetailItem
                    label="Status"
                    value={
                      booking.quote.status
                    }
                  />

                  <DetailItem
                    label="Estimated Amount"
                    value={
                      booking.quote
                        .estimatedAmount
                        ? `KES ${Number(
                            booking.quote
                              .estimatedAmount
                          ).toLocaleString(
                            "en-KE"
                          )}`
                        : "Not available"
                    }
                  />

                  <DetailItem
                    label="Final Amount"
                    value={
                      booking.quote
                        .finalAmount
                        ? `KES ${Number(
                            booking.quote
                              .finalAmount
                          ).toLocaleString(
                            "en-KE"
                          )}`
                        : "Not available"
                    }
                  />
                </div>
              </section>
            )}

            {/* Payment */}

            {booking.payment && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                  Payment
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#061F35]">
                  Payment information
                </h2>

                <div className="mt-5 space-y-5">
                  <DetailItem
                    label="Status"
                    value={
                      booking.payment.status
                    }
                  />

                  <DetailItem
                    label="Method"
                    value={
                      booking.payment.method
                    }
                  />

                  <DetailItem
                    label="Amount"
                    value={`KES ${Number(
                      booking.payment.amount
                    ).toLocaleString(
                      "en-KE"
                    )}`}
                  />

                  {booking.payment
                    .transactionId && (
                    <DetailItem
                      label="Transaction"
                      value={
                        booking.payment
                          .transactionId
                      }
                    />
                  )}
                </div>
              </section>
            )}

            {/* Staff */}

            {(booking.staffAssignments?.length ?? 0) > 0 && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                  Assigned Staff
                </p>

                <div className="mt-5 space-y-4">
                  {(booking.staffAssignments ?? []).map(
                    (assignment) => (
                      <div
                        key={
                          assignment.id
                        }
                        className="rounded-xl bg-gray-50 p-4"
                      >
                        <p className="font-semibold text-[#061F35]">
                          {
                            assignment.staff
                              .user
                              .name
                          }
                        </p>

                        <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">
                          {
                            assignment.staff
                              .staffType
                          }
                        </p>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

            {/* Review */}

            {booking.review && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                  Review
                </p>

                <div className="mt-4">
                  <p className="text-lg font-bold text-amber-500">
                    {"★".repeat(
                      booking.review.rating
                    )}
                  </p>

                  {booking.review.comment && (
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {
                        booking.review.comment
                      }
                    </p>
                  )}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </DashboardShell>
  );
}
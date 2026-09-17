"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import DashboardShell from "@/components/dashboard/DashboardShell";

import {
  getAdminBooking,
} from "@/lib/bookings";

import {
  getStaff,
  assignStaff,
  unassignStaff,
} from "@/lib/staff";

import type { Booking } from "@/types/booking";
import type { Staff } from "@/types/staff";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatCurrency(amount: string | null) {
  if (!amount) {
    return "Pending quote";
  }

  return `KSh ${Number(amount).toLocaleString(
    "en-KE"
  )}`;
}

function getStatusClasses(
  status: Booking["status"]
) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700";

    case "CONFIRMED":
      return "bg-blue-50 text-blue-700";

    case "ASSIGNED":
      return "bg-indigo-50 text-indigo-700";

    case "IN_PROGRESS":
      return "bg-purple-50 text-purple-700";

    case "COMPLETED":
      return "bg-green-50 text-green-700";

    case "CANCELLED":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getStaffTypeForCategory(
  category: Booking["service"]["category"]
) {
  switch (category) {
    case "CLEANING":
      return "CLEANER";

    case "MOVING":
      return "MOVER";

    case "ELECTRICAL":
      return "ELECTRICIAN";

    default:
      return null;
  }
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-1 text-sm text-slate-800">
        {value || "—"}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          {title}
        </h2>
      </div>

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}

export default function AdminBookingDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const bookingId = String(params.id);

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [staff, setStaff] = useState<Staff[]>([]);

  const [selectedStaffId, setSelectedStaffId] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [loadingStaff, setLoadingStaff] =
    useState(true);

  const [assigning, setAssigning] =
    useState(false);

  const [removingAssignmentId, setRemovingAssignmentId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  const [staffError, setStaffError] =
    useState("");

  async function loadBooking() {
    try {
      setError("");

      const data =
        await getAdminBooking(bookingId);

      setBooking(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load booking"
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadStaff() {
    try {
      setStaffError("");

      const data = await getStaff();

      setStaff(data);
    } catch (error) {
      setStaffError(
        error instanceof Error
          ? error.message
          : "Failed to load staff"
      );
    } finally {
      setLoadingStaff(false);
    }
  }

  useEffect(() => {
    loadBooking();
    loadStaff();
  }, [bookingId]);

  const assignedStaffIds = useMemo(() => {
    return new Set(
      booking?.staffAssignments.map(
        (assignment) =>
          assignment.staffId
      ) || []
    );
  }, [booking]);

  const requiredStaffType =
    booking
      ? getStaffTypeForCategory(
          booking.service.category
        )
      : null;

  const availableStaff = useMemo(() => {
    if (!requiredStaffType) {
      return [];
    }

    return staff.filter(
      (member) =>
        member.isAvailable &&
        member.staffType ===
          requiredStaffType &&
        !assignedStaffIds.has(member.id)
    );
  }, [
    staff,
    requiredStaffType,
    assignedStaffIds,
  ]);

  async function handleAssignStaff() {
    if (!selectedStaffId) {
      setStaffError(
        "Please select a staff member."
      );
      return;
    }

    try {
      setAssigning(true);
      setStaffError("");

      await assignStaff(
        selectedStaffId,
        bookingId
      );

      setSelectedStaffId("");

      await loadBooking();
      await loadStaff();
    } catch (error) {
      setStaffError(
        error instanceof Error
          ? error.message
          : "Failed to assign staff"
      );
    } finally {
      setAssigning(false);
    }
  }

  async function handleUnassign(
    assignmentId: string
  ) {
    try {
      setRemovingAssignmentId(
        assignmentId
      );
      setStaffError("");

      await unassignStaff(
        assignmentId
      );

      await loadBooking();
      await loadStaff();
    } catch (error) {
      setStaffError(
        error instanceof Error
          ? error.message
          : "Failed to unassign staff"
      );
    } finally {
      setRemovingAssignmentId(null);
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <p className="text-sm text-slate-500">
            Loading booking...
          </p>
        </div>
      </DashboardShell>
    );
  }

  if (error || !booking) {
    return (
      <DashboardShell>
        <div className="p-6 lg:p-8">
          <Link
            href="/admin/bookings"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to bookings
          </Link>

          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error || "Booking not found"}
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/bookings"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to bookings
          </Link>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Booking details
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {booking.bookingNumber}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Created{" "}
                {formatDateTime(
                  booking.createdAt
                )}
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-3 py-1.5 text-sm font-semibold ${getStatusClasses(
                booking.status
              )}`}
            >
              {booking.status.replace(
                "_",
                " "
              )}
            </span>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">

          {/* Main information */}
          <div className="space-y-6 xl:col-span-2">

            {/* Booking overview */}
            <Section title="Booking overview">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  label="Booking number"
                  value={
                    booking.bookingNumber
                  }
                />

                <DetailItem
                  label="Booking type"
                  value={
                    booking.bookingType ===
                    "QUOTE_REQUEST"
                      ? "Quote request"
                      : "Instant booking"
                  }
                />

                <DetailItem
                  label="Service"
                  value={
                    booking.service.name
                  }
                />

                <DetailItem
                  label="Category"
                  value={
                    booking.service.category
                  }
                />

                <DetailItem
                  label="Scheduled date"
                  value={formatDate(
                    booking.scheduledDate
                  )}
                />

                <DetailItem
                  label="Scheduled time"
                  value={
                    booking.scheduledTime
                  }
                />

                <DetailItem
                  label="Total amount"
                  value={
                    <span className="font-semibold">
                      {formatCurrency(
                        booking.totalAmount
                      )}
                    </span>
                  }
                />

                <DetailItem
                  label="Created"
                  value={formatDateTime(
                    booking.createdAt
                  )}
                />

                <DetailItem
                  label="Updated"
                  value={formatDateTime(
                    booking.updatedAt
                  )}
                />
              </div>
            </Section>

            {/* Customer */}
            <Section title="Customer">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  label="Name"
                  value={
                    booking.user.name
                  }
                />

                <DetailItem
                  label="Email"
                  value={
                    booking.user.email
                  }
                />

                <DetailItem
                  label="Phone"
                  value={
                    booking.user.phone
                  }
                />
              </div>
            </Section>

            {/* Address */}
            <Section title="Service address">
              <div className="grid gap-5 sm:grid-cols-2">
                <DetailItem
                  label="Label"
                  value={
                    booking.address.label
                  }
                />

                <DetailItem
                  label="City"
                  value={
                    booking.address.city
                  }
                />

                <DetailItem
                  label="County"
                  value={
                    booking.address.county
                  }
                />

                <DetailItem
                  label="Address"
                  value={
                    booking.address.addressLine
                  }
                />
              </div>
            </Section>

            {/* Cleaning */}
            {booking.cleaningRequest && (
              <Section title="Cleaning requirements">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailItem
                    label="Property type"
                    value={
                      booking
                        .cleaningRequest
                        .propertyType
                    }
                  />

                  <DetailItem
                    label="Bedrooms"
                    value={
                      booking
                        .cleaningRequest
                        .bedrooms
                    }
                  />

                  <DetailItem
                    label="Bathrooms"
                    value={
                      booking
                        .cleaningRequest
                        .bathrooms
                    }
                  />

                  <DetailItem
                    label="Size"
                    value={
                      booking
                        .cleaningRequest
                        .squareMeters
                        ? `${booking.cleaningRequest.squareMeters} m²`
                        : "—"
                    }
                  />

                  <DetailItem
                    label="Cleaning type"
                    value={
                      booking
                        .cleaningRequest
                        .cleaningType
                    }
                  />

                  <DetailItem
                    label="Additional requirements"
                    value={
                      booking
                        .cleaningRequest
                        .additionalRequirements
                    }
                  />
                </div>
              </Section>
            )}

            {/* Moving */}
            {booking.movingRequest && (
              <Section title="Moving requirements">
                <div className="grid gap-5 sm:grid-cols-2">
                  <DetailItem
                    label="Property type"
                    value={
                      booking
                        .movingRequest
                        .propertyType
                    }
                  />

                  <DetailItem
                    label="Truck size"
                    value={
                      booking
                        .movingRequest
                        .truckSize
                    }
                  />

                  <DetailItem
                    label="Number of movers"
                    value={
                      booking
                        .movingRequest
                        .numberOfMovers
                    }
                  />

                  <DetailItem
                    label="Packing required"
                    value={
                      booking
                        .movingRequest
                        .packingRequired
                        ? "Yes"
                        : "No"
                    }
                  />

                  <DetailItem
                    label="Estimated distance"
                    value={
                      booking
                        .movingRequest
                        .estimatedDistanceKm
                        ? `${booking.movingRequest.estimatedDistanceKm} km`
                        : "—"
                    }
                  />

                  <DetailItem
                    label="Special items"
                    value={
                      booking
                        .movingRequest
                        .specialItems
                    }
                  />

                  <div className="sm:col-span-2">
                    <DetailItem
                      label="Pickup address"
                      value={
                        booking
                          .movingRequest
                          .pickupAddress
                      }
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <DetailItem
                      label="Destination address"
                      value={
                        booking
                          .movingRequest
                          .destinationAddress
                      }
                    />
                  </div>
                </div>
              </Section>
            )}

            {/* Electrical */}
            {booking.electricalRequest && (
              <Section title="Electrical requirements">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailItem
                    label="Property type"
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
                        .numberOfFloors
                    }
                  />

                  <DetailItem
                    label="Bedrooms"
                    value={
                      booking
                        .electricalRequest
                        .bedrooms
                    }
                  />

                  <DetailItem
                    label="New installation"
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
                    label="Sockets"
                    value={
                      booking
                        .electricalRequest
                        .numberOfSockets
                    }
                  />

                  <DetailItem
                    label="Lights"
                    value={
                      booking
                        .electricalRequest
                        .numberOfLights
                    }
                  />

                  <DetailItem
                    label="Distribution board"
                    value={
                      booking
                        .electricalRequest
                        .distributionBoard
                        ? "Yes"
                        : "No"
                    }
                  />

                  <div className="lg:col-span-3">
                    <DetailItem
                      label="Additional requirements"
                      value={
                        booking
                          .electricalRequest
                          .additionalRequirements
                      }
                    />
                  </div>
                </div>
              </Section>
            )}

            {/* Notes */}
            {booking.notes && (
              <Section title="Booking notes">
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {booking.notes}
                </p>
              </Section>
            )}

            {/* Quote */}
            {booking.quote && (
              <Section title="Quote">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailItem
                    label="Status"
                    value={
                      <span className="font-semibold">
                        {booking.quote.status}
                      </span>
                    }
                  />

                  <DetailItem
                    label="Estimated amount"
                    value={
                      formatCurrency(
                        booking.quote
                          .estimatedAmount
                      )
                    }
                  />

                  <DetailItem
                    label="Final amount"
                    value={
                      formatCurrency(
                        booking.quote
                          .finalAmount
                      )
                    }
                  />

                  <DetailItem
                    label="Valid until"
                    value={
                      booking.quote.validUntil
                        ? formatDate(
                            booking.quote
                              .validUntil
                          )
                        : "—"
                    }
                  />

                  <div className="sm:col-span-2">
                    <DetailItem
                      label="Description"
                      value={
                        booking.quote
                          .description
                      }
                    />
                  </div>
                </div>
              </Section>
            )}

            {/* Payment */}
            {booking.payment && (
              <Section title="Payment">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailItem
                    label="Amount"
                    value={
                      formatCurrency(
                        booking.payment
                          .amount
                      )
                    }
                  />

                  <DetailItem
                    label="Method"
                    value={
                      booking.payment.method
                    }
                  />

                  <DetailItem
                    label="Status"
                    value={
                      booking.payment.status
                    }
                  />

                  <DetailItem
                    label="Transaction reference"
                    value={
                      booking.payment
                        .transactionId
                    }
                  />

                  <DetailItem
                    label="Paid at"
                    value={
                      booking.payment.paidAt
                        ? formatDateTime(
                            booking.payment
                              .paidAt
                          )
                        : "Not paid"
                    }
                  />
                </div>
              </Section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Staff assignment */}
            <Section title="Assigned staff">
              {booking.staffAssignments
                .length === 0 ? (
                <div className="rounded-lg bg-slate-50 px-4 py-4">
                  <p className="text-sm font-medium text-slate-700">
                    No staff assigned
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Assign a qualified available staff member below.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {booking.staffAssignments.map(
                    (assignment) => (
                      <div
                        key={
                          assignment.id
                        }
                        className="rounded-lg border border-slate-200 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {
                                assignment
                                  .staff
                                  .user
                                  .name
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                assignment
                                  .staff
                                  .staffType
                              }
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleUnassign(
                                assignment.id
                              )
                            }
                            disabled={
                              removingAssignmentId ===
                              assignment.id
                            }
                            className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            {removingAssignmentId ===
                            assignment.id
                              ? "Removing..."
                              : "Unassign"}
                          </button>
                        </div>

                        <div className="mt-3 space-y-1 text-xs text-slate-500">
                          <p>
                            {
                              assignment
                                .staff
                                .user
                                .email
                            }
                          </p>

                          {assignment
                            .staff
                            .user
                            .phone && (
                            <p>
                              {
                                assignment
                                  .staff
                                  .user
                                  .phone
                              }
                            </p>
                          )}

                          <p>
                            Assigned{" "}
                            {formatDateTime(
                              assignment.assignedAt
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              <div className="my-5 border-t border-slate-200" />

              <p className="mb-2 text-sm font-semibold text-slate-900">
                Assign staff
              </p>

              <p className="mb-3 text-xs leading-5 text-slate-500">
                Required staff type:{" "}
                <span className="font-semibold text-slate-700">
                  {requiredStaffType ||
                    "Not applicable"}
                </span>
              </p>

              {staffError && (
                <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {staffError}
                </div>
              )}

              {loadingStaff ? (
                <p className="text-xs text-slate-500">
                  Loading staff...
                </p>
              ) : availableStaff.length ===
                0 ? (
                <div className="rounded-lg bg-slate-50 px-4 py-3">
                  <p className="text-xs leading-5 text-slate-500">
                    No available qualified staff members are currently available.
                  </p>
                </div>
              ) : (
                <>
                  <select
                    value={selectedStaffId}
                    onChange={(event) =>
                      setSelectedStaffId(
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="">
                      Select staff member
                    </option>

                    {availableStaff.map(
                      (member) => (
                        <option
                          key={member.id}
                          value={member.id}
                        >
                          {member.user.name} —{" "}
                          {member.staffType}
                        </option>
                      )
                    )}
                  </select>

                  <button
                    type="button"
                    onClick={
                      handleAssignStaff
                    }
                    disabled={
                      assigning ||
                      !selectedStaffId
                    }
                    className="mt-3 flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {assigning
                      ? "Assigning..."
                      : "Assign staff"}
                  </button>
                </>
              )}
            </Section>

            {/* Review */}
            {booking.review && (
              <Section title="Customer review">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-900">
                    {booking.review.rating}
                  </span>

                  <span className="text-sm text-slate-500">
                    / 5
                  </span>
                </div>

                {booking.review.comment && (
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {booking.review.comment}
                  </p>
                )}

                <p className="mt-3 text-xs text-slate-400">
                  {formatDateTime(
                    booking.review
                      .createdAt
                  )}
                </p>
              </Section>
            )}

            {/* Quick navigation */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Quick actions
              </h2>

              <div className="mt-4 space-y-2">
                <Link
                  href="/admin/bookings"
                  className="block rounded-lg bg-slate-100 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Back to bookings
                </Link>

                {booking.quote && (
                  <Link
                    href={`/admin/quotes/${booking.quote.id}`}
                    className="block rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    View quote
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
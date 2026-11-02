
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import DashboardShell from "@/components/dashboard/DashboardShell";

import { getAdminBooking } from "@/lib/bookings";

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
  if (!amount) return "Pending quote";

  return `KSh ${Number(amount).toLocaleString("en-KE")}`;
}

function getStatusClasses(status: Booking["status"]) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "CONFIRMED":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "ASSIGNED":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "IN_PROGRESS":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "COMPLETED":
      return "bg-green-50 text-green-700 border-green-200";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
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
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">
        {label}
      </p>
      <div className="mt-1 break-words text-xs leading-5 text-slate-800 sm:text-sm">
        {value || "—"}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  accent = "border-slate-200",
}: {
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <section className={`overflow-hidden border bg-white ${accent}`}>
      <div className="border-b border-slate-100 px-3 py-3 sm:px-5 sm:py-4">
        <h2 className="text-sm font-bold text-slate-900 sm:text-base">
          {title}
        </h2>
      </div>

      <div className="p-3 sm:p-5">{children}</div>
    </section>
  );
}

function DetailGrid({
  children,
  columns = "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3",
}: {
  children: React.ReactNode;
  columns?: string;
}) {
  return (
    <div className={`grid ${columns} gap-x-3 gap-y-5 sm:gap-x-6 sm:gap-y-6`}>
      {children}
    </div>
  );
}

export default function AdminBookingDetailsPage() {
  const params = useParams();
  const bookingId = String(params.id);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const [removingAssignmentId, setRemovingAssignmentId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [staffError, setStaffError] = useState("");

  async function loadBooking() {
    try {
      setError("");
      const data = await getAdminBooking(bookingId);
      setBooking(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load booking"
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
        error instanceof Error ? error.message : "Failed to load staff"
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
      booking?.staffAssignments.map((assignment) => assignment.staffId) || []
    );
  }, [booking]);

  const requiredStaffType = booking
    ? getStaffTypeForCategory(booking.service.category)
    : null;

  const availableStaff = useMemo(() => {
    if (!requiredStaffType) return [];

    return staff.filter(
      (member) =>
        member.isAvailable &&
        member.staffType === requiredStaffType &&
        !assignedStaffIds.has(member.id)
    );
  }, [staff, requiredStaffType, assignedStaffIds]);

  async function handleAssignStaff() {
    if (!selectedStaffId) {
      setStaffError("Please select a staff member.");
      return;
    }

    try {
      setAssigning(true);
      setStaffError("");

      await assignStaff(selectedStaffId, bookingId);

      setSelectedStaffId("");

      await loadBooking();
      await loadStaff();
    } catch (error) {
      setStaffError(
        error instanceof Error ? error.message : "Failed to assign staff"
      );
    } finally {
      setAssigning(false);
    }
  }

  async function handleUnassign(assignmentId: string) {
    try {
      setRemovingAssignmentId(assignmentId);
      setStaffError("");

      await unassignStaff(assignmentId);

      await loadBooking();
      await loadStaff();
    } catch (error) {
      setStaffError(
        error instanceof Error ? error.message : "Failed to unassign staff"
      );
    } finally {
      setRemovingAssignmentId(null);
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <p className="text-sm text-slate-500">Loading booking...</p>
        </div>
      </DashboardShell>
    );
  }

  if (error || !booking) {
    return (
      <DashboardShell>
        <div className="p-4 sm:p-6 lg:p-8">
          <Link
            href="/admin/bookings"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to bookings
          </Link>

          <div className="mt-5 border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            {error || "Booking not found"}
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="min-w-0 space-y-5 p-3 pb-24 sm:space-y-6 sm:p-6 sm:pb-24 lg:p-8 lg:pb-8">
        {/* Page heading */}
        <div className="space-y-3">
          <Link
            href="/admin/bookings"
            className="inline-flex text-xs font-semibold text-blue-600 hover:text-blue-700 sm:text-sm"
          >
            ← Back to bookings
          </Link>

          <div className="border border-[#061F35] bg-[#061F35] px-4 py-4 sm:px-5 sm:py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">
                  HomeServe Management
                </p>

                <h1 className="mt-1 break-all text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {booking.bookingNumber}
                </h1>

                <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                  Booking details · Created {formatDateTime(booking.createdAt)}
                </p>
              </div>

              <span
                className={`inline-flex w-fit shrink-0 border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide sm:text-xs ${getStatusClasses(
                  booking.status
                )}`}
              >
                {booking.status.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-3">
          {/* Main booking information */}
          <div className="min-w-0 space-y-5 xl:col-span-2">
            <Section title="Booking overview">
              <DetailGrid>
                <DetailItem label="Booking number" value={booking.bookingNumber} />

                <DetailItem
                  label="Booking type"
                  value={
                    booking.bookingType === "QUOTE_REQUEST"
                      ? "Quote request"
                      : "Instant booking"
                  }
                />

                <DetailItem label="Service" value={booking.service.name} />
                <DetailItem label="Category" value={booking.service.category} />

                <DetailItem
                  label="Scheduled date"
                  value={formatDate(booking.scheduledDate)}
                />

                <DetailItem
                  label="Scheduled time"
                  value={booking.scheduledTime}
                />

                <DetailItem
                  label="Total amount"
                  value={
                    <span className="font-bold text-slate-900">
                      {formatCurrency(booking.totalAmount)}
                    </span>
                  }
                />

                <DetailItem
                  label="Created"
                  value={formatDateTime(booking.createdAt)}
                />

                <DetailItem
                  label="Updated"
                  value={formatDateTime(booking.updatedAt)}
                />
              </DetailGrid>
            </Section>

            <Section title="Customer">
              <DetailGrid>
                <DetailItem label="Name" value={booking.user.name} />
                <DetailItem label="Email" value={booking.user.email} />
                <DetailItem label="Phone" value={booking.user.phone} />
              </DetailGrid>
            </Section>

            <Section title="Service address">
              <DetailGrid>
                <DetailItem label="Label" value={booking.address.label} />
                <DetailItem label="City" value={booking.address.city} />
                <DetailItem label="County" value={booking.address.county} />
                <DetailItem
                  label="Address"
                  value={booking.address.addressLine}
                />
              </DetailGrid>
            </Section>

            {/* Cleaning requirements */}
            {booking.cleaningRequest && (
              <Section title="Cleaning requirements" accent="border-emerald-200">
                <DetailGrid>
                  <DetailItem
                    label="Property type"
                    value={booking.cleaningRequest.propertyType}
                  />
                  <DetailItem
                    label="Bedrooms"
                    value={booking.cleaningRequest.bedrooms}
                  />
                  <DetailItem
                    label="Bathrooms"
                    value={booking.cleaningRequest.bathrooms}
                  />
                  <DetailItem
                    label="Size"
                    value={
                      booking.cleaningRequest.squareMeters
                        ? `${booking.cleaningRequest.squareMeters} m²`
                        : "—"
                    }
                  />
                  <DetailItem
                    label="Cleaning type"
                    value={booking.cleaningRequest.cleaningType}
                  />
                  <DetailItem
                    label="Additional requirements"
                    value={booking.cleaningRequest.additionalRequirements}
                  />
                </DetailGrid>
              </Section>
            )}

            {/* Moving requirements */}
            {booking.movingRequest && (
              <Section title="Moving requirements" accent="border-amber-200">
                <DetailGrid>
                  <DetailItem
                    label="Property type"
                    value={booking.movingRequest.propertyType}
                  />
                  <DetailItem
                    label="Truck size"
                    value={booking.movingRequest.truckSize}
                  />
                  <DetailItem
                    label="Number of movers"
                    value={booking.movingRequest.numberOfMovers}
                  />
                  <DetailItem
                    label="Packing required"
                    value={booking.movingRequest.packingRequired ? "Yes" : "No"}
                  />
                  <DetailItem
                    label="Estimated distance"
                    value={
                      booking.movingRequest.estimatedDistanceKm
                        ? `${booking.movingRequest.estimatedDistanceKm} km`
                        : "—"
                    }
                  />
                  <DetailItem
                    label="Special items"
                    value={booking.movingRequest.specialItems}
                  />
                  <div className="col-span-2">
                    <DetailItem
                      label="Pickup address"
                      value={booking.movingRequest.pickupAddress}
                    />
                  </div>
                  <div className="col-span-2">
                    <DetailItem
                      label="Destination address"
                      value={booking.movingRequest.destinationAddress}
                    />
                  </div>
                </DetailGrid>
              </Section>
            )}

            {/* Electrical requirements */}
            {booking.electricalRequest && (
              <Section
                title="Electrical requirements"
                accent="border-indigo-200"
              >
                <DetailGrid>
                  <DetailItem
                    label="Property type"
                    value={booking.electricalRequest.propertyType}
                  />
                  <DetailItem
                    label="Floors"
                    value={booking.electricalRequest.numberOfFloors}
                  />
                  <DetailItem
                    label="Bedrooms"
                    value={booking.electricalRequest.bedrooms}
                  />
                  <DetailItem
                    label="New installation"
                    value={
                      booking.electricalRequest.newInstallation ? "Yes" : "No"
                    }
                  />
                  <DetailItem
                    label="Rewiring"
                    value={booking.electricalRequest.rewiring ? "Yes" : "No"}
                  />
                  <DetailItem
                    label="Sockets"
                    value={booking.electricalRequest.numberOfSockets}
                  />
                  <DetailItem
                    label="Lights"
                    value={booking.electricalRequest.numberOfLights}
                  />
                  <DetailItem
                    label="Distribution board"
                    value={
                      booking.electricalRequest.distributionBoard
                        ? "Yes"
                        : "No"
                    }
                  />
                  <div className="col-span-2 lg:col-span-3">
                    <DetailItem
                      label="Additional requirements"
                      value={booking.electricalRequest.additionalRequirements}
                    />
                  </div>
                </DetailGrid>
              </Section>
            )}

            {booking.notes && (
              <Section title="Booking notes">
                <p className="whitespace-pre-wrap break-words text-xs leading-6 text-slate-700 sm:text-sm">
                  {booking.notes}
                </p>
              </Section>
            )}

            {/* Quote */}
            {booking.quote && (
              <Section title="Quote" accent="border-blue-200">
                <DetailGrid>
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
                    value={formatCurrency(booking.quote.estimatedAmount)}
                  />

                  <DetailItem
                    label="Final amount"
                    value={formatCurrency(booking.quote.finalAmount)}
                  />

                  <DetailItem
                    label="Valid until"
                    value={
                      booking.quote.validUntil
                        ? formatDate(booking.quote.validUntil)
                        : "—"
                    }
                  />

                  <div className="col-span-2">
                    <DetailItem
                      label="Description"
                      value={booking.quote.description}
                    />
                  </div>
                </DetailGrid>
              </Section>
            )}

            {/* Payment */}
            {booking.payment && (
              <Section title="Payment">
                <DetailGrid>
                  <DetailItem
                    label="Amount"
                    value={formatCurrency(booking.payment.amount)}
                  />

                  <DetailItem
                    label="Method"
                    value={booking.payment.method}
                  />

                  <DetailItem
                    label="Status"
                    value={booking.payment.status}
                  />

                  <DetailItem
                    label="Transaction reference"
                    value={booking.payment.transactionId}
                  />

                  <DetailItem
                    label="Paid at"
                    value={
                      booking.payment.paidAt
                        ? formatDateTime(booking.payment.paidAt)
                        : "Not paid"
                    }
                  />
                </DetailGrid>
              </Section>
            )}
          </div>

          {/* Sidebar */}
          <div className="min-w-0 space-y-5">
            <Section title="Assigned staff">
              {booking.staffAssignments.length === 0 ? (
                <div className="border border-dashed border-slate-200 bg-slate-50 px-3 py-4">
                  <p className="text-xs font-semibold text-slate-700 sm:text-sm">
                    No staff assigned
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Assign a qualified available staff member below.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-3">
                  {booking.staffAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="min-w-0 border border-slate-200 p-2.5 sm:p-4"
                    >
                      <div className="flex min-w-0 flex-col gap-2">
                        <div className="min-w-0">
                          <p className="break-words text-xs font-bold text-slate-900 sm:text-sm">
                            {assignment.staff.user.name}
                          </p>
                          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-blue-600 sm:text-xs">
                            {assignment.staff.staffType}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleUnassign(assignment.id)}
                          disabled={removingAssignmentId === assignment.id}
                          className="w-fit text-[10px] font-bold text-red-600 hover:text-red-700 disabled:opacity-50 sm:text-xs"
                        >
                          {removingAssignmentId === assignment.id
                            ? "Removing..."
                            : "Unassign"}
                        </button>
                      </div>

                      <div className="mt-3 space-y-1 break-words text-[10px] leading-4 text-slate-500 sm:text-xs">
                        <p>{assignment.staff.user.email}</p>

                        {assignment.staff.user.phone && (
                          <p>{assignment.staff.user.phone}</p>
                        )}

                        <p className="pt-1">
                          Assigned {formatDateTime(assignment.assignedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="my-4 border-t border-slate-200 sm:my-5" />

              <p className="text-xs font-bold text-slate-900 sm:text-sm">
                Assign staff
              </p>

              <p className="mt-2 text-[10px] leading-5 text-slate-500 sm:text-xs">
                Required staff type:{" "}
                <span className="font-bold text-slate-700">
                  {requiredStaffType || "Not applicable"}
                </span>
              </p>

              {staffError && (
                <div className="mt-3 border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
                  {staffError}
                </div>
              )}

              {loadingStaff ? (
                <p className="mt-3 text-xs text-slate-500">
                  Loading staff...
                </p>
              ) : availableStaff.length === 0 ? (
                <div className="mt-3 border border-slate-200 bg-slate-50 px-3 py-3">
                  <p className="text-xs leading-5 text-slate-500">
                    No available qualified staff members are currently
                    available.
                  </p>
                </div>
              ) : (
                <>
                  <select
                    value={selectedStaffId}
                    onChange={(event) =>
                      setSelectedStaffId(event.target.value)
                    }
                    className="mt-3 h-10 w-full min-w-0 border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 sm:h-11 sm:text-sm"
                  >
                    <option value="">Select staff member</option>

                    {availableStaff.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.user.name} — {member.staffType}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleAssignStaff}
                    disabled={assigning || !selectedStaffId}
                    className="mt-3 flex h-10 w-full items-center justify-center bg-[#061F35] px-4 text-xs font-bold text-white transition hover:bg-[#0b3455] disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:text-sm"
                  >
                    {assigning ? "Assigning..." : "Assign staff"}
                  </button>
                </>
              )}
            </Section>

            {/* Customer review */}
            {booking.review && (
              <Section title="Customer review">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {booking.review.rating}
                  </span>
                  <span className="text-sm text-slate-400">/ 5</span>
                </div>

                {booking.review.comment && (
                  <p className="mt-3 break-words text-xs leading-6 text-slate-600 sm:text-sm">
                    {booking.review.comment}
                  </p>
                )}

                <p className="mt-3 text-[10px] text-slate-400 sm:text-xs">
                  {formatDateTime(booking.review.createdAt)}
                </p>
              </Section>
            )}

            {/* Quick actions */}
            <section className="border border-slate-200 bg-white p-3 sm:p-5">
              <h2 className="text-sm font-bold text-slate-900">
                Quick actions
              </h2>

              <div className="mt-3 space-y-2">
                <Link
                  href="/admin/bookings"
                  className="block border border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-100 sm:text-sm"
                >
                  Back to bookings
                </Link>

                {booking.quote && (
                  <Link
                    href={`/admin/quotes/${booking.quote.id}`}
                    className="block border border-slate-200 px-3 py-2.5 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:text-sm"
                  >
                    View quote
                  </Link>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

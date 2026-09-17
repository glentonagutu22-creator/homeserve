"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  UserRound,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";

import {
  getMyAssignments,
  updateMyBookingStatus,
} from "@/lib/staff";

import type { StaffAssignment } from "@/types/staff";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function statusClass(status: string) {
  switch (status) {
    case "ASSIGNED":
      return "bg-blue-50 text-blue-700 border-blue-100";

    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 border-amber-100";

    case "COMPLETED":
      return "bg-green-50 text-green-700 border-green-100";

    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-100";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "ASSIGNED":
      return "Assigned";

    case "IN_PROGRESS":
      return "In Progress";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status;
  }
}

export default function StaffBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [assignment, setAssignment] =
    useState<StaffAssignment | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updating, setUpdating] =
    useState(false);

  async function loadBooking() {
    try {
      setLoading(true);
      setError("");

      const assignments =
        await getMyAssignments();

      const found = assignments.find(
        (item) => item.booking.id === id
      );

      if (!found) {
        throw new Error(
          "This booking is not assigned to you."
        );
      }

      setAssignment(found);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load booking"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooking();
  }, [id]);

  async function updateStatus(
    status: "IN_PROGRESS" | "COMPLETED"
  ) {
    try {
      setUpdating(true);
      setError("");

      await updateMyBookingStatus(
        id,
        status
      );

      await loadBooking();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update booking"
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading booking...
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!assignment) {
    return (
      <DashboardShell>
        <div className="flex min-h-[500px] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <span className="text-lg font-bold text-red-600">
                !
              </span>
            </div>

            <h1 className="mt-5 text-xl font-bold text-[#061F35]">
              Booking unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error ||
                "This booking could not be found among your assignments."}
            </p>

            <Link
              href="/staff/bookings"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#061F35] px-5 text-sm font-semibold text-white transition hover:bg-[#082B49]"
            >
              Back to My Bookings
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const booking = assignment.booking;

  const canStart =
    booking.status === "ASSIGNED";

  const canComplete =
    booking.status === "IN_PROGRESS";

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page Header */}
        <section>
          <Link
            href="/staff/bookings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            My Bookings
          </Link>

          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                Service Booking
              </p>

              <h1 className="mt-2 break-words text-2xl font-bold tracking-tight text-[#061F35] sm:text-3xl">
                {booking.bookingNumber}
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                {booking.service.name}
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${statusClass(
                booking.status
              )}`}
            >
              {statusLabel(booking.status)}
            </span>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 xl:col-span-2">
            {/* Schedule */}
            <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <CalendarDays className="h-5 w-5 text-[#061F35]" />
                </div>

                <div>
                  <h2 className="font-bold text-[#061F35]">
                    Service Schedule
                  </h2>

                  <p className="text-sm text-blue-800/70">
                    When the service is scheduled.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                    Date
                  </p>

                  <p className="mt-2 font-semibold text-[#061F35]">
                    {formatDate(booking.scheduledDate)}
                  </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                    Time
                  </p>

                  <p className="mt-2 font-semibold text-[#061F35]">
                    {booking.scheduledTime}
                  </p>
                </div>
              </div>
            </section>

            {/* Customer */}
            <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <UserRound className="h-5 w-5 text-[#061F35]" />
                </div>

                <div>
                  <h2 className="font-bold text-[#061F35]">
                    Customer
                  </h2>

                  <p className="text-sm text-blue-800/70">
                    Customer contact information.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                    Name
                  </p>

                  <p className="mt-2 font-semibold text-[#061F35]">
                    {booking.user.name}
                  </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                    Phone
                  </p>

                  <p className="mt-2 text-sm text-[#082B49]">
                    {booking.user.phone ||
                      "Not provided"}
                  </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                    Email
                  </p>

                  <p className="mt-2 break-words text-sm text-[#082B49]">
                    {booking.user.email}
                  </p>
                </div>
              </div>
            </section>

            {/* Address */}
            <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <MapPin className="h-5 w-5 text-[#061F35]" />
                </div>

                <div>
                  <h2 className="font-bold text-[#061F35]">
                    Service Location
                  </h2>

                  <p className="text-sm text-blue-800/70">
                    Where the service will be performed.
                  </p>
                </div>
              </div>

              {booking.address ? (
                <div className="mt-6 rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                  <p className="font-semibold text-[#061F35]">
                    {booking.address.label}
                  </p>

                  <p className="mt-2 text-sm text-[#082B49]">
                    {booking.address.addressLine}
                  </p>

                  <p className="mt-1 text-sm text-blue-800/70">
                    {booking.address.city},{" "}
                    {booking.address.county}
                  </p>
                </div>
              ) : (
                <p className="mt-6 text-sm text-blue-800/70">
                  No address information available.
                </p>
              )}
            </section>

            {/* Service Requirements */}
            <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <BriefcaseBusiness className="h-5 w-5 text-[#061F35]" />
                </div>

                <div>
                  <h2 className="font-bold text-[#061F35]">
                    Service Requirements
                  </h2>

                  <p className="text-sm text-blue-800/70">
                    Details provided for this service.
                  </p>
                </div>
              </div>

              {/* Cleaning */}
              {booking.cleaningRequest && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                      Property Type
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#061F35]">
                      {booking.cleaningRequest.propertyType}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                      Cleaning Type
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#061F35]">
                      {booking.cleaningRequest.cleaningType}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                      Bedrooms
                    </p>

                    <p className="mt-1 text-sm text-[#082B49]">
                      {booking.cleaningRequest.bedrooms ??
                        "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                      Bathrooms
                    </p>

                    <p className="mt-1 text-sm text-[#082B49]">
                      {booking.cleaningRequest.bathrooms ??
                        "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                      Area
                    </p>

                    <p className="mt-1 text-sm text-[#082B49]">
                      {booking.cleaningRequest.squareMeters
                        ? `${booking.cleaningRequest.squareMeters} m²`
                        : "Not specified"}
                    </p>
                  </div>

                  {booking.cleaningRequest
                    .additionalRequirements && (
                    <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4 sm:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                        Additional Requirements
                      </p>

                      <p className="mt-1 text-sm leading-6 text-[#082B49]">
                        {
                          booking.cleaningRequest
                            .additionalRequirements
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Moving */}
              {booking.movingRequest && (
                <div className="mt-6 space-y-5">
                  <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                      Pickup
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#061F35]">
                      {booking.movingRequest.pickupAddress}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                      Destination
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#061F35]">
                      {
                        booking.movingRequest
                          .destinationAddress
                      }
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                        Property Type
                      </p>

                      <p className="mt-1 text-sm text-[#082B49]">
                        {booking.movingRequest.propertyType}
                      </p>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                        Truck Size
                      </p>

                      <p className="mt-1 text-sm text-[#082B49]">
                        {booking.movingRequest.truckSize ||
                          "Not specified"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                        Number of Movers
                      </p>

                      <p className="mt-1 text-sm text-[#082B49]">
                        {booking.movingRequest.numberOfMovers ??
                          "Not specified"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                        Packing Required
                      </p>

                      <p className="mt-1 text-sm text-[#082B49]">
                        {booking.movingRequest.packingRequired
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>
                  </div>

                  {booking.movingRequest.specialItems && (
                    <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                        Special Items
                      </p>

                      <p className="mt-1 text-sm leading-6 text-[#082B49]">
                        {booking.movingRequest.specialItems}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Electrical */}
              {booking.electricalRequest && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                      Property Type
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#061F35]">
                      {
                        booking.electricalRequest
                          .propertyType
                      }
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                      Floors
                    </p>

                    <p className="mt-1 text-sm text-[#082B49]">
                      {booking.electricalRequest
                        .numberOfFloors ??
                        "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                      Bedrooms
                    </p>

                    <p className="mt-1 text-sm text-[#082B49]">
                      {booking.electricalRequest.bedrooms ??
                        "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                      Sockets
                    </p>

                    <p className="mt-1 text-sm text-[#082B49]">
                      {booking.electricalRequest.numberOfSockets ??
                        "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                      Lights
                    </p>

                    <p className="mt-1 text-sm text-[#082B49]">
                      {booking.electricalRequest.numberOfLights ??
                        "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                      Distribution Board
                    </p>

                    <p className="mt-1 text-sm text-[#082B49]">
                      {booking.electricalRequest.distributionBoard
                        ? "Required"
                        : "Not required"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                      New Installation
                    </p>

                    <p className="mt-1 text-sm text-[#082B49]">
                      {booking.electricalRequest.newInstallation
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                      Rewiring
                    </p>

                    <p className="mt-1 text-sm text-[#082B49]">
                      {booking.electricalRequest.rewiring
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>

                  {booking.electricalRequest
                    .additionalRequirements && (
                    <div className="rounded-xl border border-blue-100 bg-blue-100/60 p-4 sm:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                        Additional Requirements
                      </p>

                      <p className="mt-1 text-sm leading-6 text-[#082B49]">
                        {
                          booking.electricalRequest
                            .additionalRequirements
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Notes */}
            {booking.notes && (
              <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm sm:p-6">
                <h2 className="font-bold text-[#061F35]">
                  Customer Notes
                </h2>

                <p className="mt-4 rounded-xl border border-blue-100 bg-blue-100/60 p-4 text-sm leading-6 text-[#082B49]">
                  {booking.notes}
                </p>
              </section>
            )}
          </div>

          {/* Action Panel */}
          <aside>
            <div className="sticky top-6 rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <Clock3 className="h-5 w-5 text-[#061F35]" />
                </div>

                <div>
                  <h2 className="font-bold text-[#061F35]">
                    Job Status
                  </h2>

                  <p className="text-sm text-blue-800/70">
                    Manage this assignment.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <span
                  className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${statusClass(
                    booking.status
                  )}`}
                >
                  {statusLabel(booking.status)}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {canStart && (
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() =>
                      updateStatus("IN_PROGRESS")
                    }
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Start Job"
                    )}
                  </button>
                )}

                {canComplete && (
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() =>
                      updateStatus("COMPLETED")
                    }
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-green-600 px-5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Complete Job"
                    )}
                  </button>
                )}

                {booking.status === "COMPLETED" && (
                  <div className="flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        Service completed
                      </p>

                      <p className="mt-1 text-xs leading-5 text-green-700">
                        This service has been successfully completed.
                      </p>
                    </div>
                  </div>
                )}

                {booking.status === "CANCELLED" && (
                  <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-800">
                      Booking cancelled
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-700">
                      This booking has been cancelled.
                    </p>
                  </div>
                )}
              </div>

              {/* Assignment Information */}
              <div className="mt-6 border-t border-blue-200 pt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-800/60">
                  Assignment
                </p>

                <p className="mt-2 text-sm text-[#082B49]">
                  Assigned{" "}
                  {formatDate(assignment.assignedAt)}
                </p>

                {assignment.completedAt && (
                  <p className="mt-1 text-sm font-medium text-green-700">
                    Completed{" "}
                    {formatDate(assignment.completedAt)}
                  </p>
                )}
              </div>

              <Link
                href="/staff/bookings"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-[#061F35] transition hover:bg-blue-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to My Bookings
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </DashboardShell>
  );
}
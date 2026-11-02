
"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  ClipboardList,
  Home,
  Truck,
  Zap,
  XCircle,
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
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "IN_PROGRESS":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "COMPLETED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "CANCELLED":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
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

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-50 text-[#061F35]">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-bold text-[#061F35] sm:text-base">
          {title}
        </h2>
        <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
          {description}
        </p>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-w-0 border border-slate-100 bg-slate-50 p-3 ${className}`}>
      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:text-[10px]">
        {label}
      </p>
      <div className="mt-1.5 break-words text-xs font-semibold leading-relaxed text-slate-800 sm:text-sm">
        {value}
      </div>
    </div>
  );
}

export default function StaffBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [assignment, setAssignment] = useState<StaffAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  async function loadBooking() {
    try {
      setLoading(true);
      setError("");

      const assignments = await getMyAssignments();

      const found = assignments.find(
        (item) => item.booking.id === id
      );

      if (!found) {
        throw new Error("This booking is not assigned to you.");
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

  async function updateStatus(status: "IN_PROGRESS" | "COMPLETED") {
    try {
      setUpdating(true);
      setError("");

      await updateMyBookingStatus(id, status);

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
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-[#061F35]" />
            Loading booking...
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!assignment) {
    return (
      <DashboardShell>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="w-full max-w-md border border-red-200 bg-white p-6 text-center sm:p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center bg-red-50 text-red-600">
              <XCircle className="h-6 w-6" />
            </div>

            <h1 className="mt-4 text-lg font-bold text-[#061F35]">
              Booking unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error ||
                "This booking could not be found among your assignments."}
            </p>

            <Link
              href="/staff/bookings"
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 bg-[#061F35] px-5 text-sm font-semibold text-white transition hover:bg-[#0b3556]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Bookings
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const booking = assignment.booking;
  const canStart = booking.status === "ASSIGNED";
  const canComplete = booking.status === "IN_PROGRESS";

  return (
    <DashboardShell>
      <div className="min-w-0 space-y-5 px-3 py-5 pb-24 sm:space-y-6 sm:px-6 sm:py-7 lg:px-8 lg:pb-8">

        {/* Navigation and heading */}
        <section className="border-b border-slate-200 pb-5">
          <Link
            href="/staff/bookings"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 transition hover:text-blue-900 sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            My Bookings
          </Link>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700 sm:text-xs">
                Service booking
              </p>

              <h1 className="mt-1 break-all text-xl font-bold tracking-tight text-[#061F35] sm:text-2xl">
                {booking.bookingNumber}
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {booking.service.name}
              </p>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 border px-3 py-1.5 text-[10px] font-bold sm:text-xs ${statusClass(
                booking.status
              )}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {statusLabel(booking.status)}
            </span>
          </div>
        </section>

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-2 border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700 sm:text-sm">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Main layout */}
        <div className="grid min-w-0 gap-5 xl:grid-cols-3">

          {/* Main booking information */}
          <div className="min-w-0 space-y-5 xl:col-span-2">

            {/* Schedule */}
            <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionHeading
                icon={CalendarDays}
                title="Service schedule"
                description="Date and time of the assigned service."
              />

              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
                <DetailItem
                  label="Scheduled date"
                  value={formatDate(booking.scheduledDate)}
                />

                <DetailItem
                  label="Scheduled time"
                  value={booking.scheduledTime}
                />
              </div>
            </section>

            {/* Customer information */}
            <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionHeading
                icon={UserRound}
                title="Customer information"
                description="Contact details for this booking."
              />

              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
                <DetailItem
                  label="Customer name"
                  value={booking.user.name}
                />

                <DetailItem
                  label="Phone number"
                  value={
                    booking.user.phone ? (
                      <a
                        href={`tel:${booking.user.phone}`}
                        className="text-blue-700 hover:underline"
                      >
                        {booking.user.phone}
                      </a>
                    ) : (
                      "Not provided"
                    )
                  }
                />

                <DetailItem
                  label="Email address"
                  value={booking.user.email}
                  className="col-span-2 sm:col-span-1"
                />
              </div>
            </section>

            {/* Service location */}
            <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionHeading
                icon={MapPin}
                title="Service location"
                description="Where the service will be performed."
              />

              {booking.address ? (
                <div className="mt-4 border border-blue-100 bg-blue-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-100 text-blue-800">
                      <Home className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#061F35] sm:text-sm">
                        {booking.address.label}
                      </p>

                      <p className="mt-1 break-words text-xs leading-relaxed text-slate-700 sm:text-sm">
                        {booking.address.addressLine}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                        {booking.address.city}, {booking.address.county}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-xs text-slate-500">
                  No address information available.
                </p>
              )}
            </section>

            {/* Service requirements */}
            <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionHeading
                icon={ClipboardList}
                title="Service requirements"
                description="Details provided by the customer."
              />

              {/* Cleaning */}
              {booking.cleaningRequest && (
                <div className="mt-4">
                  <div className="mb-3 flex items-center gap-2">
                    <BriefcaseBusiness className="h-4 w-4 text-emerald-700" />
                    <p className="text-xs font-bold text-emerald-800">
                      Cleaning service
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <DetailItem
                      label="Property type"
                      value={booking.cleaningRequest.propertyType}
                    />

                    <DetailItem
                      label="Cleaning type"
                      value={booking.cleaningRequest.cleaningType}
                    />

                    <DetailItem
                      label="Bedrooms"
                      value={booking.cleaningRequest.bedrooms ?? "Not specified"}
                    />

                    <DetailItem
                      label="Bathrooms"
                      value={booking.cleaningRequest.bathrooms ?? "Not specified"}
                    />

                    <DetailItem
                      label="Area"
                      value={
                        booking.cleaningRequest.squareMeters
                          ? `${booking.cleaningRequest.squareMeters} m²`
                          : "Not specified"
                      }
                    />

                    {booking.cleaningRequest.additionalRequirements && (
                      <DetailItem
                        label="Additional requirements"
                        value={booking.cleaningRequest.additionalRequirements}
                        className="col-span-2"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Moving */}
              {booking.movingRequest && (
                <div className="mt-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Truck className="h-4 w-4 text-amber-700" />
                    <p className="text-xs font-bold text-amber-800">
                      Moving service
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <DetailItem
                      label="Pickup address"
                      value={booking.movingRequest.pickupAddress}
                      className="col-span-2"
                    />

                    <DetailItem
                      label="Destination"
                      value={booking.movingRequest.destinationAddress}
                      className="col-span-2"
                    />

                    <DetailItem
                      label="Property type"
                      value={booking.movingRequest.propertyType}
                    />

                    <DetailItem
                      label="Truck size"
                      value={booking.movingRequest.truckSize || "Not specified"}
                    />

                    <DetailItem
                      label="Number of movers"
                      value={booking.movingRequest.numberOfMovers ?? "Not specified"}
                    />

                    <DetailItem
                      label="Packing required"
                      value={booking.movingRequest.packingRequired ? "Yes" : "No"}
                    />

                    {booking.movingRequest.specialItems && (
                      <DetailItem
                        label="Special items"
                        value={booking.movingRequest.specialItems}
                        className="col-span-2"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Electrical */}
              {booking.electricalRequest && (
                <div className="mt-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-600" />
                    <p className="text-xs font-bold text-amber-800">
                      Electrical service
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <DetailItem
                      label="Property type"
                      value={booking.electricalRequest.propertyType}
                    />

                    <DetailItem
                      label="Number of floors"
                      value={booking.electricalRequest.numberOfFloors ?? "Not specified"}
                    />

                    <DetailItem
                      label="Bedrooms"
                      value={booking.electricalRequest.bedrooms ?? "Not specified"}
                    />

                    <DetailItem
                      label="Sockets"
                      value={booking.electricalRequest.numberOfSockets ?? "Not specified"}
                    />

                    <DetailItem
                      label="Lights"
                      value={booking.electricalRequest.numberOfLights ?? "Not specified"}
                    />

                    <DetailItem
                      label="Distribution board"
                      value={booking.electricalRequest.distributionBoard ? "Required" : "Not required"}
                    />

                    <DetailItem
                      label="New installation"
                      value={booking.electricalRequest.newInstallation ? "Yes" : "No"}
                    />

                    <DetailItem
                      label="Rewiring"
                      value={booking.electricalRequest.rewiring ? "Yes" : "No"}
                    />

                    {booking.electricalRequest.additionalRequirements && (
                      <DetailItem
                        label="Additional requirements"
                        value={booking.electricalRequest.additionalRequirements}
                        className="col-span-2"
                      />
                    )}
                  </div>
                </div>
              )}

              {!booking.cleaningRequest &&
                !booking.movingRequest &&
                !booking.electricalRequest && (
                  <p className="mt-4 text-xs text-slate-500">
                    No additional service requirements were provided.
                  </p>
                )}
            </section>

            {/* Customer notes */}
            {booking.notes && (
              <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <SectionHeading
                  icon={ClipboardList}
                  title="Customer notes"
                  description="Additional instructions for this booking."
                />

                <p className="mt-4 border-l-2 border-blue-500 bg-blue-50/60 p-3 text-xs leading-relaxed text-slate-700 sm:text-sm">
                  {booking.notes}
                </p>
              </section>
            )}
          </div>

          {/* Job status and actions */}
          <aside className="min-w-0">
            <div className="border border-slate-200 bg-white shadow-sm xl:sticky xl:top-6">

              <div className="border-b border-slate-200 bg-[#061F35] px-4 py-4 sm:px-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-200">
                  Assignment controls
                </p>

                <h2 className="mt-1 text-base font-bold text-white">
                  Job status
                </h2>

                <p className="mt-1 text-[10px] text-slate-300 sm:text-xs">
                  Manage your assigned service.
                </p>
              </div>

              <div className="p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Current status
                </p>

                <span
                  className={`mt-2 inline-flex border px-3 py-1.5 text-xs font-bold ${statusClass(
                    booking.status
                  )}`}
                >
                  {statusLabel(booking.status)}
                </span>

                <div className="mt-5 space-y-2.5">
                  {canStart && (
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => updateStatus("IN_PROGRESS")}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-blue-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Clock3 className="h-4 w-4" />
                          Start job
                        </>
                      )}
                    </button>
                  )}

                  {canComplete && (
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => updateStatus("COMPLETED")}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-emerald-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Complete job
                        </>
                      )}
                    </button>
                  )}

                  {booking.status === "COMPLETED" && (
                    <div className="flex items-start gap-3 border border-emerald-200 bg-emerald-50 p-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-emerald-800">
                          Service completed
                        </p>
                        <p className="mt-1 text-[10px] leading-relaxed text-emerald-700">
                          This service has been successfully completed.
                        </p>
                      </div>
                    </div>
                  )}

                  {booking.status === "CANCELLED" && (
                    <div className="flex items-start gap-3 border border-red-200 bg-red-50 p-3">
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                      <div>
                        <p className="text-xs font-bold text-red-800">
                          Booking cancelled
                        </p>
                        <p className="mt-1 text-[10px] leading-relaxed text-red-700">
                          This booking has been cancelled.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Assignment timeline */}
                <div className="mt-6 border-t border-slate-200 pt-5">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Assignment timeline
                  </p>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-blue-50 text-blue-700">
                        <BriefcaseBusiness className="h-3.5 w-3.5" />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          Assigned to you
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {formatDate(assignment.assignedAt)}
                        </p>
                      </div>
                    </div>

                    {assignment.completedAt && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-emerald-800">
                            Job completed
                          </p>
                          <p className="mt-1 text-[10px] text-slate-500">
                            {formatDate(assignment.completedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  href="/staff/bookings"
                  className="mt-6 inline-flex min-h-10 w-full items-center justify-center gap-2 border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#061F35] transition hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to my bookings
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardShell>
  );
}


"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Wallet,
  ClipboardList,
  Sparkles,
  Truck,
  Zap,
  CreditCard,
  Users,
  Star,
  Ban,
  Loader2,
  CheckCircle2,
  FileText,
  Home,
  ShieldCheck,
  Receipt,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";

import { cancelBooking, getBooking } from "@/lib/bookings";

import type { Booking, BookingStatus } from "@/types/booking";

const statusStyles: Record<BookingStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  ASSIGNED: "bg-purple-50 text-purple-700 border-purple-200",
  IN_PROGRESS: "bg-cyan-50 text-cyan-700 border-cyan-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const categoryStyles = {
  CLEANING: {
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    icon: "bg-sky-100 text-sky-700",
    border: "border-sky-200",
    heading: "text-sky-700",
  },
  MOVING: {
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    icon: "bg-orange-100 text-orange-700",
    border: "border-orange-200",
    heading: "text-orange-700",
  },
  ELECTRICAL: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "bg-amber-100 text-amber-700",
    border: "border-amber-200",
    heading: "text-amber-700",
  },
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatCategory(category: string) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

function formatStatus(status: BookingStatus) {
  return status.replace("_", " ");
}

function formatAmount(amount: string | null) {
  if (amount === null) return "Price pending";

  return `KES ${Number(amount).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:text-[10px]">
        {label}
      </p>
      <p className="mt-1 break-words text-xs font-semibold leading-relaxed text-slate-700 sm:text-sm">
        {value}
      </p>
    </div>
  );
}

function InfoCard({
  title,
  subtitle,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  color: "blue" | "sky" | "orange" | "amber" | "green" | "purple" | "red" | "cyan" | "indigo";
  children: React.ReactNode;
}) {
  const styles = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    sky: "border-sky-100 bg-sky-50 text-sky-700",
    orange: "border-orange-100 bg-orange-50 text-orange-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    purple: "border-purple-100 bg-purple-50 text-purple-700",
    red: "border-red-100 bg-red-50 text-red-700",
    cyan: "border-cyan-100 bg-cyan-50 text-cyan-700",
    indigo: "border-indigo-100 bg-indigo-50 text-indigo-700",
  };

  return (
    <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-3 sm:px-5 sm:py-4">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center border ${styles[color]}`}>
          <Icon size={17} />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-extrabold text-[#061F35] sm:text-base">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="p-3 sm:p-5">{children}</div>
    </section>
  );
}

function DetailGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-6">
      {children}
    </div>
  );
}

export default function BookingDetailsPage() {
  const params = useParams();
  const bookingId = String(params.id);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBooking() {
      try {
        setLoading(true);
        setError(null);

        const data = await getBooking(bookingId);
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
        reason: cancellationReason.trim() || undefined,
      });

      const refreshedBooking = await getBooking(bookingId);
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

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[55vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-3 text-xs text-slate-500">
              Loading booking details...
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error || !booking) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-3xl border border-red-200 bg-red-50 p-6 text-center sm:p-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center bg-red-100 text-red-600">
            <Ban size={22} />
          </div>
          <h1 className="mt-4 text-xl font-extrabold text-red-900">
            Booking not found
          </h1>
          <p className="mt-2 text-sm text-red-700">
            {error || "We couldn't find this booking."}
          </p>
          <Link
            href="/bookings"
            className="mt-5 inline-flex items-center gap-2 bg-[#061F35] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#0b3455]"
          >
            <ArrowLeft size={15} />
            Back to Bookings
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const category = booking.service.category;
  const categoryStyle =
    categoryStyles[category as keyof typeof categoryStyles];

  const canCancel =
    booking.status !== "CANCELLED" &&
    booking.status !== "COMPLETED" &&
    booking.status !== "IN_PROGRESS";

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-4 px-3 py-4 pb-24 sm:space-y-5 sm:px-6 sm:py-6 lg:px-8 lg:pb-8">

        {/* COMPACT WELCOME BANNER */}
        <section className="relative overflow-hidden border-l-4 border-sky-400 bg-[#061F35] px-4 py-3 shadow-sm sm:px-5">
          <div className="pointer-events-none absolute -right-5 -top-8 h-24 w-24 rounded-full border-[13px] border-white/[0.05]" />
          <div className="relative flex items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-sky-300">
                Customer workspace
              </p>
              <h1 className="mt-1 text-base font-extrabold text-white sm:text-lg">
                Booking Details
              </h1>
              <p className="mt-0.5 text-[10px] text-slate-300 sm:text-xs">
                Everything about your service appointment in one place.
              </p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-white/10 text-sky-200">
              <ClipboardList size={19} />
            </div>
          </div>
        </section>

        {/* BOOKING INTRO */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <Link
              href="/bookings"
              className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 transition hover:text-blue-800"
            >
              <ArrowLeft size={14} />
              My Bookings
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide ${categoryStyle.badge}`}>
                {formatCategory(category)}
              </span>
              <span className={`border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide ${statusStyles[booking.status]}`}>
                {formatStatus(booking.status)}
              </span>
            </div>

            <h2 className="mt-2 text-xl font-extrabold tracking-tight text-[#061F35] sm:text-2xl">
              {booking.service.name}
            </h2>
            <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
              Booking #{booking.bookingNumber}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 border border-emerald-200 bg-emerald-50 px-4 py-3 sm:min-w-[190px] sm:justify-start">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                Total Amount
              </p>
              <p className="mt-1 text-base font-extrabold text-emerald-900 sm:text-lg">
                {formatAmount(booking.totalAmount)}
              </p>
            </div>
            <Wallet size={21} className="text-emerald-600" />
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr] lg:gap-5">

          {/* LEFT COLUMN */}
          <div className="min-w-0 space-y-4">

            {/* SERVICE */}
            <InfoCard
              title="Service Information"
              subtitle="The service you requested"
              icon={Sparkles}
              color={
                category === "CLEANING"
                  ? "sky"
                  : category === "MOVING"
                    ? "orange"
                    : "amber"
              }
            >
              {booking.service.description && (
                <p className="mb-5 text-xs leading-6 text-slate-600">
                  {booking.service.description}
                </p>
              )}

              <DetailGrid>
                <DetailItem
                  label="Category"
                  value={formatCategory(booking.service.category)}
                />
                <DetailItem
                  label="Pricing"
                  value={
                    booking.service.pricingType === "QUOTE"
                      ? "Quote required"
                      : booking.service.pricingType === "FIXED"
                        ? "Fixed price"
                        : "Calculated"
                  }
                />
                <DetailItem
                  label="Duration"
                  value={
                    booking.service.duration
                      ? `Approx. ${Math.round(booking.service.duration / 60)} hours`
                      : "Duration varies"
                  }
                />
                <DetailItem
                  label="Booking Type"
                  value={
                    booking.bookingType === "INSTANT"
                      ? "Instant booking"
                      : "Quote request"
                  }
                />
              </DetailGrid>
            </InfoCard>

            {/* SCHEDULE */}
            <InfoCard
              title="Schedule"
              subtitle="Your appointment details"
              icon={CalendarDays}
              color="purple"
            >
              <DetailGrid>
                <DetailItem
                  label="Appointment Date"
                  value={formatDate(booking.scheduledDate)}
                />
                <DetailItem
                  label="Appointment Time"
                  value={booking.scheduledTime}
                />
              </DetailGrid>
            </InfoCard>

            {/* ADDRESS */}
            <InfoCard
              title="Service Location"
              subtitle="Where the service will take place"
              icon={MapPin}
              color="green"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-emerald-100 text-emerald-700">
                  <Home size={17} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-slate-800">
                    {booking.address.label}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {booking.address.addressLine}
                  </p>
                  <p className="text-xs text-slate-600">
                    {booking.address.city}, {booking.address.county}
                  </p>
                </div>
              </div>
            </InfoCard>

            {/* CUSTOMER NOTES */}
            {booking.notes && (
              <InfoCard
                title="Additional Notes"
                subtitle="Instructions provided with your booking"
                icon={FileText}
                color="indigo"
              >
                <p className="whitespace-pre-line text-xs leading-6 text-slate-600">
                  {booking.notes}
                </p>
              </InfoCard>
            )}

            {/* CLEANING REQUEST */}
            {booking.cleaningRequest && (
              <InfoCard
                title="Cleaning Details"
                subtitle="Property and cleaning requirements"
                icon={Sparkles}
                color="sky"
              >
                <DetailGrid>
                  <DetailItem
                    label="Property Type"
                    value={booking.cleaningRequest.propertyType}
                  />
                  <DetailItem
                    label="Cleaning Type"
                    value={booking.cleaningRequest.cleaningType}
                  />
                  <DetailItem
                    label="Bedrooms"
                    value={
                      booking.cleaningRequest.bedrooms !== null
                        ? String(booking.cleaningRequest.bedrooms)
                        : "Not specified"
                    }
                  />
                  <DetailItem
                    label="Bathrooms"
                    value={
                      booking.cleaningRequest.bathrooms !== null
                        ? String(booking.cleaningRequest.bathrooms)
                        : "Not specified"
                    }
                  />
                  <DetailItem
                    label="Square Metres"
                    value={
                      booking.cleaningRequest.squareMeters
                        ? `${booking.cleaningRequest.squareMeters} m²`
                        : "Not specified"
                    }
                  />
                </DetailGrid>

                {booking.cleaningRequest.additionalRequirements && (
                  <div className="mt-5 border-t border-sky-100 pt-4">
                    <DetailItem
                      label="Additional Requirements"
                      value={booking.cleaningRequest.additionalRequirements}
                    />
                  </div>
                )}
              </InfoCard>
            )}

            {/* MOVING REQUEST */}
            {booking.movingRequest && (
              <InfoCard
                title="Moving Details"
                subtitle="Pickup, destination and moving requirements"
                icon={Truck}
                color="orange"
              >
                <div className="space-y-4">
                  <div className="border-l-2 border-orange-300 pl-3">
                    <DetailItem
                      label="Pickup Address"
                      value={booking.movingRequest.pickupAddress}
                    />
                  </div>
                  <div className="border-l-2 border-emerald-300 pl-3">
                    <DetailItem
                      label="Destination"
                      value={booking.movingRequest.destinationAddress}
                    />
                  </div>
                  <DetailGrid>
                    <DetailItem
                      label="Property Type"
                      value={booking.movingRequest.propertyType}
                    />
                    <DetailItem
                      label="Truck Size"
                      value={booking.movingRequest.truckSize || "Not specified"}
                    />
                    <DetailItem
                      label="Number of Movers"
                      value={
                        booking.movingRequest.numberOfMovers !== null
                          ? String(booking.movingRequest.numberOfMovers)
                          : "Not specified"
                      }
                    />
                    <DetailItem
                      label="Packing"
                      value={
                        booking.movingRequest.packingRequired
                          ? "Required"
                          : "Not required"
                      }
                    />
                  </DetailGrid>

                  {booking.movingRequest.estimatedDistanceKm && (
                    <DetailItem
                      label="Estimated Distance"
                      value={`${booking.movingRequest.estimatedDistanceKm} km`}
                    />
                  )}

                  {booking.movingRequest.specialItems && (
                    <div className="border-t border-orange-100 pt-4">
                      <DetailItem
                        label="Special Items"
                        value={booking.movingRequest.specialItems}
                      />
                    </div>
                  )}
                </div>
              </InfoCard>
            )}

            {/* ELECTRICAL REQUEST */}
            {booking.electricalRequest && (
              <InfoCard
                title="Electrical Details"
                subtitle="Property and electrical requirements"
                icon={Zap}
                color="amber"
              >
                <DetailGrid>
                  <DetailItem
                    label="Property Type"
                    value={booking.electricalRequest.propertyType}
                  />
                  <DetailItem
                    label="Floors"
                    value={
                      booking.electricalRequest.numberOfFloors !== null
                        ? String(booking.electricalRequest.numberOfFloors)
                        : "Not specified"
                    }
                  />
                  <DetailItem
                    label="Bedrooms"
                    value={
                      booking.electricalRequest.bedrooms !== null
                        ? String(booking.electricalRequest.bedrooms)
                        : "Not specified"
                    }
                  />
                  <DetailItem
                    label="Sockets"
                    value={
                      booking.electricalRequest.numberOfSockets !== null
                        ? String(booking.electricalRequest.numberOfSockets)
                        : "Not specified"
                    }
                  />
                  <DetailItem
                    label="Lights"
                    value={
                      booking.electricalRequest.numberOfLights !== null
                        ? String(booking.electricalRequest.numberOfLights)
                        : "Not specified"
                    }
                  />
                  <DetailItem
                    label="New Installation"
                    value={
                      booking.electricalRequest.newInstallation
                        ? "Yes"
                        : "No"
                    }
                  />
                  <DetailItem
                    label="Rewiring"
                    value={
                      booking.electricalRequest.rewiring ? "Yes" : "No"
                    }
                  />
                  <DetailItem
                    label="Distribution Board"
                    value={
                      booking.electricalRequest.distributionBoard
                        ? "Required"
                        : "Not required"
                    }
                  />
                </DetailGrid>

                {booking.electricalRequest.additionalRequirements && (
                  <div className="mt-5 border-t border-amber-100 pt-4">
                    <DetailItem
                      label="Additional Requirements"
                      value={booking.electricalRequest.additionalRequirements}
                    />
                  </div>
                )}
              </InfoCard>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <aside className="min-w-0 space-y-4">

            {/* STATUS */}
            <InfoCard
              title="Booking Status"
              subtitle="Current progress of your request"
              icon={CheckCircle2}
              color="blue"
            >
              <span className={`inline-flex border px-3 py-2 text-[10px] font-extrabold uppercase tracking-wide ${statusStyles[booking.status]}`}>
                {formatStatus(booking.status)}
              </span>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <DetailItem
                  label="Booking Number"
                  value={booking.bookingNumber}
                />
              </div>
            </InfoCard>

            {/* CANCELLATION */}
            {canCancel && (
              <InfoCard
                title="Manage Booking"
                subtitle="Booking cancellation options"
                icon={Ban}
                color="red"
              >
                {!showCancelForm ? (
                  <>
                    <h3 className="text-sm font-bold text-slate-800">
                      Need to cancel?
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      You can cancel this booking before the service is completed.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCancelForm(true);
                        setCancelError(null);
                      }}
                      className="mt-4 w-full border border-red-200 px-4 py-3 text-xs font-bold text-red-700 transition hover:bg-red-50"
                    >
                      Cancel Booking
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-bold text-slate-800">
                      Cancel this booking?
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Please provide a reason if you would like to.
                    </p>

                    <div className="mt-4">
                      <label
                        htmlFor="cancellationReason"
                        className="mb-2 block text-xs font-bold text-slate-700"
                      >
                        Reason <span className="font-normal text-slate-400">(optional)</span>
                      </label>
                      <textarea
                        id="cancellationReason"
                        value={cancellationReason}
                        onChange={(event) =>
                          setCancellationReason(event.target.value)
                        }
                        maxLength={500}
                        rows={4}
                        placeholder="Why are you cancelling?"
                        className="w-full resize-none border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-800 outline-none transition focus:border-red-400 focus:bg-white"
                      />
                      <p className="mt-1 text-right text-[10px] text-slate-400">
                        {cancellationReason.length}/500
                      </p>
                    </div>

                    {cancelError && (
                      <div className="mt-3 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                        {cancelError}
                      </div>
                    )}

                    <div className="mt-4 space-y-2">
                      <button
                        type="button"
                        onClick={handleCancelBooking}
                        disabled={cancelling}
                        className="flex w-full items-center justify-center gap-2 bg-red-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                      >
                        {cancelling ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          "Confirm Cancellation"
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowCancelForm(false);
                          setCancellationReason("");
                          setCancelError(null);
                        }}
                        disabled={cancelling}
                        className="w-full border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        Keep Booking
                      </button>
                    </div>
                  </>
                )}
              </InfoCard>
            )}

            {/* QUOTE */}
            {booking.quote && (
              <InfoCard
                title="Quote Information"
                subtitle="Pricing details for this service"
                icon={Receipt}
                color="purple"
              >
                <div className="space-y-4">
                  <DetailItem
                    label="Quote Status"
                    value={booking.quote.status}
                  />
                  <DetailItem
                    label="Estimated Amount"
                    value={
                      booking.quote.estimatedAmount
                        ? `KES ${Number(booking.quote.estimatedAmount).toLocaleString("en-KE")}`
                        : "Not available"
                    }
                  />
                  <DetailItem
                    label="Final Amount"
                    value={
                      booking.quote.finalAmount
                        ? `KES ${Number(booking.quote.finalAmount).toLocaleString("en-KE")}`
                        : "Not available"
                    }
                  />
                </div>
              </InfoCard>
            )}

            {/* PAYMENT */}
            {booking.payment && (
              <InfoCard
                title="Payment Information"
                subtitle="Transaction details"
                icon={CreditCard}
                color="green"
              >
                <div className="space-y-4">
                  <DetailItem
                    label="Payment Status"
                    value={booking.payment.status}
                  />
                  <DetailItem
                    label="Payment Method"
                    value={booking.payment.method}
                  />
                  <DetailItem
                    label="Amount Paid"
                    value={`KES ${Number(booking.payment.amount).toLocaleString("en-KE")}`}
                  />
                  {booking.payment.transactionId && (
                    <DetailItem
                      label="Transaction ID"
                      value={booking.payment.transactionId}
                    />
                  )}
                </div>
              </InfoCard>
            )}

            {/* ASSIGNED STAFF */}
            {(booking.staffAssignments?.length ?? 0) > 0 && (
              <InfoCard
                title="Assigned Staff"
                subtitle="Team members assigned to your service"
                icon={Users}
                color="cyan"
              >
                <div className="grid grid-cols-2 gap-3">
                  {(booking.staffAssignments ?? []).map((assignment) => (
                    <div
                      key={assignment.id}
                      className="min-w-0 border border-cyan-100 bg-cyan-50/60 p-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center bg-cyan-100 text-cyan-700">
                        <Users size={15} />
                      </div>
                      <p className="mt-2 break-words text-xs font-bold text-slate-800">
                        {assignment.staff.user.name}
                      </p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-cyan-700">
                        {assignment.staff.staffType}
                      </p>
                    </div>
                  ))}
                </div>
              </InfoCard>
            )}

            {/* REVIEW */}
            {booking.review && (
              <InfoCard
                title="Your Review"
                subtitle="Feedback submitted for this booking"
                icon={Star}
                color="amber"
              >
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from(
                    { length: booking.review.rating },
                    (_, index) => (
                      <Star
                        key={index}
                        size={17}
                        fill="currentColor"
                      />
                    )
                  )}
                </div>

                {booking.review.comment && (
                  <p className="mt-3 border-l-2 border-amber-300 pl-3 text-xs leading-6 text-slate-600">
                    {booking.review.comment}
                  </p>
                )}
              </InfoCard>
            )}
          </aside>
        </div>
      </div>
    </DashboardShell>
  );
}

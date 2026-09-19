"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";

import DashboardShell from "@/components/dashboard/DashboardShell";

import {
  assignStaff,
  getStaffAssignments,
  getStaffMember,
  unassignStaff,
  updateStaffAvailability,
  updateStaffMember,
} from "@/lib/staff";

import { getAdminBookings } from "@/lib/bookings";

import type {
  Staff,
  StaffAssignment,
  StaffType,
} from "@/types/staff";

import type { Booking } from "@/types/booking";

const staffTypes: StaffType[] = [
  "CLEANER",
  "MOVER",
  "ELECTRICIAN",
  "SUPERVISOR",
];

function staffTypeLabel(type: StaffType) {
  switch (type) {
    case "CLEANER":
      return "Cleaner";

    case "MOVER":
      return "Mover";

    case "ELECTRICIAN":
      return "Electrician";

    case "SUPERVISOR":
      return "Supervisor";

    default:
      return type;
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-KE",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString(
    "en-KE",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

function statusClass(status: string) {
  switch (status) {
    case "ASSIGNED":
      return "bg-blue-50 text-blue-700";

    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700";

    case "COMPLETED":
      return "bg-green-50 text-green-700";

    case "CANCELLED":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function AdminStaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [staff, setStaff] =
    useState<Staff | null>(null);

  const [assignments, setAssignments] =
    useState<StaffAssignment[]>([]);

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingBookings, setLoadingBookings] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [staffType, setStaffType] =
    useState<StaffType>("CLEANER");

  const [selectedBookingId, setSelectedBookingId] =
    useState("");

  const [assigning, setAssigning] =
    useState(false);

  async function loadStaff() {
    try {
      setLoading(true);
      setError("");

      const [
        staffResult,
        assignmentResult,
      ] = await Promise.all([
        getStaffMember(id),
        getStaffAssignments(id),
      ]);

      setStaff(staffResult);
      setAssignments(assignmentResult);

      setName(staffResult.user.name);

      setPhone(
        staffResult.user.phone || ""
      );

      setStaffType(
        staffResult.staffType
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load staff member"
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadBookings() {
    try {
      setLoadingBookings(true);

      const result =
        await getAdminBookings();

      setBookings(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load bookings"
      );
    } finally {
      setLoadingBookings(false);
    }
  }

  useEffect(() => {
    loadStaff();
    loadBookings();
  }, [id]);

  const assignedBookingIds =
    useMemo(() => {
      return new Set(
        assignments.map(
          (assignment) =>
            assignment.bookingId
        )
      );
    }, [assignments]);

  const eligibleBookings =
    useMemo(() => {
      return bookings.filter(
        (booking) => {
          if (
            booking.status ===
              "CANCELLED" ||
            booking.status ===
              "COMPLETED"
          ) {
            return false;
          }

          if (
            assignedBookingIds.has(
              booking.id
            )
          ) {
            return false;
          }

          if (
            staffType ===
            "CLEANER"
          ) {
            return (
              booking.service
                .category ===
              "CLEANING"
            );
          }

          if (
            staffType === "MOVER"
          ) {
            return (
              booking.service
                .category ===
              "MOVING"
            );
          }

          if (
            staffType ===
            "ELECTRICIAN"
          ) {
            return (
              booking.service
                .category ===
              "ELECTRICAL"
            );
          }

          return true;
        }
      );
    }, [
      bookings,
      assignedBookingIds,
      staffType,
    ]);

  const selectedBooking =
    useMemo(() => {
      return eligibleBookings.find(
        (booking) =>
          booking.id ===
          selectedBookingId
      );
    }, [
      eligibleBookings,
      selectedBookingId,
    ]);

  async function handleUpdate(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated =
        await updateStaffMember(id, {
          name,
          phone,
          staffType,
        });

      setStaff(updated);

      setSuccess(
        "Staff member updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update staff member"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleAvailability() {
    if (!staff) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated =
        await updateStaffAvailability(
          id,
          !staff.isAvailable
        );

      setStaff(updated);

      setSuccess(
        updated.isAvailable
          ? "Staff member is now available."
          : "Staff member is now unavailable."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update availability"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleAssign() {
    if (!selectedBookingId) {
      setError(
        "Please select a booking."
      );
      return;
    }

    try {
      setAssigning(true);
      setError("");
      setSuccess("");

      await assignStaff(
        id,
        selectedBookingId
      );

      setSelectedBookingId("");

      await loadStaff();
      await loadBookings();

      setSuccess(
        "Staff member assigned successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to assign staff member"
      );
    } finally {
      setAssigning(false);
    }
  }

  async function handleUnassign(
    assignmentId: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to remove this staff assignment?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await unassignStaff(
        assignmentId
      );

      await loadStaff();
      await loadBookings();

      setSuccess(
        "Staff assignment removed successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to remove assignment"
      );
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <main className="min-h-full bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <p className="text-sm text-slate-500">
              Loading staff member...
            </p>
          </div>
        </main>
      </DashboardShell>
    );
  }

  if (!staff) {
    return (
      <DashboardShell>
        <main className="min-h-full bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Staff member not found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error ||
                "The requested staff member could not be found."}
            </p>

            <Link
              href="/admin/staff"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Back to Staff
            </Link>
          </div>
        </main>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <main className="min-h-full bg-slate-50">
        {/* Header */}
        <section className="bg-[#061F35]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Link
              href="/admin/staff"
              className="text-sm font-medium text-blue-300 hover:text-white"
            >
              ← Back to Staff
            </Link>

            <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">
                  Staff Management
                </p>

                <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                  {staff.user.name}
                </h1>

                <p className="mt-2 text-slate-300">
                  {staffTypeLabel(
                    staff.staffType
                  )}{" "}
                  · {staff.user.email}
                </p>
              </div>

              <span
                className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                  staff.isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {staff.isAvailable
                  ? "Available"
                  : "Unavailable"}
              </span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Profile */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
              <h2 className="text-lg font-bold text-slate-900">
                Staff Profile
              </h2>

              <form
                onSubmit={handleUpdate}
                className="mt-6 space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={staff.user.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value
                      )
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Staff Type
                  </label>

                  <select
                    value={staffType}
                    onChange={(event) =>
                      setStaffType(
                        event.target
                          .value as StaffType
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {staffTypes.map(
                      (type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {staffTypeLabel(
                            type
                          )}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </form>

              <div className="mt-6 border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={
                    handleAvailability
                  }
                  disabled={saving}
                  className={`w-full rounded-lg px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    staff.isAvailable
                      ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {staff.isAvailable
                    ? "Mark Unavailable"
                    : "Mark Available"}
                </button>
              </div>
            </section>

            {/* Assignments */}
            <section className="lg:col-span-2">
              {/* Assign booking */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Assign Booking
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select an eligible booking to
                    assign to this staff member.
                  </p>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Select booking
                  </label>

                  {loadingBookings ? (
                    <div className="rounded-lg bg-slate-50 px-4 py-4 text-sm text-slate-500">
                      Loading available bookings...
                    </div>
                  ) : eligibleBookings.length ===
                    0 ? (
                    <div className="rounded-lg bg-slate-50 px-4 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        No eligible bookings available.
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        There are currently no
                        unassigned active{" "}
                        {staffTypeLabel(
                          staff.staffType
                        ).toLowerCase()}{" "}
                        bookings available for this
                        staff member.
                      </p>
                    </div>
                  ) : (
                    <>
                      <select
                        value={
                          selectedBookingId
                        }
                        onChange={(event) =>
                          setSelectedBookingId(
                            event.target.value
                          )
                        }
                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      >
                        <option value="">
                          Select a booking
                        </option>

                        {eligibleBookings.map(
                          (booking) => (
                            <option
                              key={
                                booking.id
                              }
                              value={
                                booking.id
                              }
                            >
                              {
                                booking.bookingNumber
                              }{" "}
                              —{" "}
                              {
                                booking
                                  .service
                                  .name
                              }{" "}
                              —{" "}
                              {
                                booking
                                  .user
                                  .name
                              }
                            </option>
                          )
                        )}
                      </select>

                      {selectedBooking && (
                        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {
                                  selectedBooking.bookingNumber
                                }
                              </p>

                              <p className="mt-1 text-sm text-slate-600">
                                {
                                  selectedBooking
                                    .service
                                    .name
                                }
                              </p>
                            </div>

                            <span
                              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                                selectedBooking.status
                              )}`}
                            >
                              {
                                selectedBooking.status
                              }
                            </span>
                          </div>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Customer
                              </p>

                              <p className="mt-1 text-sm text-slate-700">
                                {
                                  selectedBooking
                                    .user
                                    .name
                                }
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Category
                              </p>

                              <p className="mt-1 text-sm text-slate-700">
                                {
                                  selectedBooking
                                    .service
                                    .category
                                }
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Date
                              </p>

                              <p className="mt-1 text-sm text-slate-700">
                                {formatDate(
                                  selectedBooking.scheduledDate
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Time
                              </p>

                              <p className="mt-1 text-sm text-slate-700">
                                {
                                  selectedBooking.scheduledTime
                                }
                              </p>
                            </div>

                            <div className="sm:col-span-2">
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Location
                              </p>

                              <p className="mt-1 text-sm text-slate-700">
                                {
                                  selectedBooking
                                    .address
                                    .addressLine
                                }
                                ,{" "}
                                {
                                  selectedBooking
                                    .address
                                    .city
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={
                          handleAssign
                        }
                        disabled={
                          assigning ||
                          !selectedBookingId
                        }
                        className="mt-4 w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {assigning
                          ? "Assigning..."
                          : "Assign Booking"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Assigned bookings */}
              <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Assigned Bookings
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {assignments.length}{" "}
                    assignment
                    {assignments.length ===
                    1
                      ? ""
                      : "s"}
                  </p>
                </div>

                {assignments.length ===
                0 ? (
                  <div className="px-6 py-12 text-center">
                    <p className="font-medium text-slate-900">
                      No assignments yet
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Select an available booking above
                      to assign the first job.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {assignments.map(
                      (assignment) => (
                        <div
                          key={
                            assignment.id
                          }
                          className="p-6"
                        >
                          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {
                                  assignment
                                    .booking
                                    .bookingNumber
                                }
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                {
                                  assignment
                                    .booking
                                    .service
                                    .name
                                }
                              </p>

                              <div className="mt-3 space-y-1 text-sm text-slate-600">
                                <p>
                                  <span className="font-medium">
                                    Customer:
                                  </span>{" "}
                                  {
                                    assignment
                                      .booking
                                      .user
                                      .name
                                  }
                                </p>

                                <p>
                                  <span className="font-medium">
                                    Date:
                                  </span>{" "}
                                  {formatDate(
                                    assignment
                                      .booking
                                      .scheduledDate
                                  )}
                                </p>

                                <p>
                                  <span className="font-medium">
                                    Time:
                                  </span>{" "}
                                  {
                                    assignment
                                      .booking
                                      .scheduledTime
                                  }
                                </p>

                                <p>
                                  <span className="font-medium">
                                    Location:
                                  </span>{" "}
                                  {
                                    assignment
                                      .booking
                                      .address
                                      ?.addressLine
                                  }
                                  ,{" "}
                                  {
                                    assignment
                                      .booking
                                      .address
                                      ?.city
                                  }
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col items-start gap-3 sm:items-end">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                                  assignment
                                    .booking
                                    .status
                                )}`}
                              >
                                {
                                  assignment
                                    .booking
                                    .status
                                }
                              </span>

                              {assignment.completedAt ? (
                                <span className="text-xs text-slate-500">
                                  Completed{" "}
                                  {formatDate(
                                    assignment.completedAt
                                  )}
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUnassign(
                                      assignment.id
                                    )
                                  }
                                  disabled={
                                    assignment
                                      .booking
                                      .status ===
                                    "COMPLETED"
                                  }
                                  className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  Unassign
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}
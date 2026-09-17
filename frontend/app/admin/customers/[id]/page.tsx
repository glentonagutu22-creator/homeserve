"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import DashboardShell from "@/components/dashboard/DashboardShell";

import {
  getCustomer,
  updateCustomerRole,
  deleteCustomer,
} from "@/lib/customers";

import type {
  CustomerDetail,
  CustomerRole,
} from "@/types/customer";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function formatCurrency(
  amount: string | null
) {
  if (!amount) {
    return "Pending quote";
  }

  return `KSh ${Number(amount).toLocaleString(
    "en-KE"
  )}`;
}

function getStatusClasses(status: string) {
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

export default function AdminCustomerDetailsPage() {
  const params = useParams();

  const customerId = String(
    params.id
  );

  const [customer, setCustomer] =
    useState<CustomerDetail | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedRole, setSelectedRole] =
    useState<CustomerRole>("CUSTOMER");

  const [changingRole, setChangingRole] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [actionError, setActionError] =
    useState("");

  async function loadCustomer() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getCustomer(customerId);

      setCustomer(data);
      setSelectedRole(data.role);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load customer"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  async function handleRoleChange() {
    if (!customer) {
      return;
    }

    if (selectedRole === customer.role) {
      return;
    }

    const confirmed = window.confirm(
      `Change ${customer.name}'s role from ${customer.role} to ${selectedRole}?`
    );

    if (!confirmed) {
      setSelectedRole(customer.role);
      return;
    }

    try {
      setChangingRole(true);
      setActionError("");

      const updated =
        await updateCustomerRole(
          customer.id,
          selectedRole
        );

      setCustomer(updated);
      setSelectedRole(updated.role);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to change customer role"
      );

      setSelectedRole(customer.role);
    } finally {
      setChangingRole(false);
    }
  }

  async function handleDelete() {
    if (!customer) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to permanently delete ${customer.name}'s account?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setActionError("");

      await deleteCustomer(
        customer.id
      );

      window.location.href =
        "/admin/customers";
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to delete customer"
      );

      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading customer...
          </p>
        </div>
      </DashboardShell>
    );
  }

  if (!customer || error) {
    return (
      <DashboardShell>
        <div className="p-6 lg:p-8">
          <Link
            href="/admin/customers"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to customers
          </Link>

          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error ||
              "Customer not found"}
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
            href="/admin/customers"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to customers
          </Link>

          <div className="mt-4">
            <p className="text-sm font-medium text-blue-600">
              Customer details
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {customer.name}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Customer since{" "}
              {formatDate(
                customer.createdAt
              )}
            </p>
          </div>
        </div>

        {actionError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-3">

          {/* Main */}
          <div className="space-y-6 xl:col-span-2">

            {/* Profile */}
            <Section title="Customer information">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Name
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {customer.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-slate-800">
                    {customer.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-slate-800">
                    {customer.phone ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Joined
                  </p>

                  <p className="mt-1 text-sm text-slate-800">
                    {formatDate(
                      customer.createdAt
                    )}
                  </p>
                </div>
              </div>
            </Section>

            {/* Bookings */}
            <Section title="Booking history">
              {customer.bookings.length ===
              0 ? (
                <p className="text-sm text-slate-500">
                  This customer has no bookings.
                </p>
              ) : (
                <div className="space-y-3">
                  {customer.bookings.map(
                    (booking) => (
                      <Link
                        key={booking.id}
                        href={`/admin/bookings/${booking.id}`}
                        className="block rounded-lg border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-slate-50"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {
                                booking.bookingNumber
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                booking
                                  .service
                                  .name
                              }
                            </p>
                          </div>

                          <span
                            className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                              booking.status
                            )}`}
                          >
                            {booking.status.replace(
                              "_",
                              " "
                            )}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                          <div>
                            <p className="text-xs text-slate-400">
                              Date
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                              {formatDate(
                                booking.scheduledDate
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">
                              Time
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                              {
                                booking.scheduledTime
                              }
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">
                              Amount
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {formatCurrency(
                                booking.totalAmount
                              )}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              )}
            </Section>

            {/* Addresses */}
            <Section title="Saved addresses">
              {customer.addresses.length ===
              0 ? (
                <p className="text-sm text-slate-500">
                  This customer has no saved addresses.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {customer.addresses.map(
                    (address) => (
                      <div
                        key={address.id}
                        className="rounded-lg border border-slate-200 p-4"
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {address.label}
                        </p>

                        <p className="mt-2 text-sm text-slate-600">
                          {
                            address.addressLine
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {address.city},{" "}
                          {address.county}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </Section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Stats */}
            <Section title="Activity">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <p className="text-xl font-bold text-slate-900">
                    {
                      customer._count
                        .bookings
                    }
                  </p>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Bookings
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <p className="text-xl font-bold text-slate-900">
                    {
                      customer._count
                        .addresses
                    }
                  </p>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Addresses
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <p className="text-xl font-bold text-slate-900">
                    {
                      customer._count
                        .reviews
                    }
                  </p>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Reviews
                  </p>
                </div>
              </div>
            </Section>

            {/* Role */}
            <Section title="Account role">
              <p className="text-sm text-slate-500">
                Change the role assigned to this account.
              </p>

              <select
                value={selectedRole}
                onChange={(event) =>
                  setSelectedRole(
                    event.target
                      .value as CustomerRole
                  )
                }
                disabled={changingRole}
                className="mt-4 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
              >
                <option value="CUSTOMER">
                  CUSTOMER
                </option>

                <option value="ADMIN">
                  ADMIN
                </option>
              </select>

              <button
                type="button"
                onClick={
                  handleRoleChange
                }
                disabled={
                  changingRole ||
                  selectedRole ===
                    customer.role
                }
                className="mt-3 h-11 w-full rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {changingRole
                  ? "Updating..."
                  : "Update role"}
              </button>

              <p className="mt-3 text-xs leading-5 text-slate-400">
                Staff accounts must be created through the Staff management module so that a StaffProfile is created correctly.
              </p>
            </Section>

            {/* Delete */}
            <section className="rounded-xl border border-red-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-red-700">
                Danger zone
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Permanently delete this customer account. Customers with existing bookings cannot be deleted.
              </p>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="mt-4 h-11 w-full rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete customer"}
              </button>
            </section>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
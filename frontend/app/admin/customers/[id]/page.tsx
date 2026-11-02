
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

function formatCurrency(amount: string | null) {
  if (!amount) {
    return "Pending quote";
  }

  return `KSh ${Number(amount).toLocaleString("en-KE")}`;
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

function getRoleClasses(role: CustomerRole) {
  switch (role) {
    case "ADMIN":
      return "bg-purple-50 text-purple-700";

    case "CUSTOMER":
      return "bg-blue-50 text-blue-700";

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
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-3 py-3 sm:px-5 sm:py-4">
        <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
          {title}
        </h2>
      </div>

      <div className="p-3 sm:p-5">
        {children}
      </div>
    </section>
  );
}

export default function AdminCustomerDetailsPage() {
  const params = useParams();
  const customerId = String(params.id);

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<CustomerRole>("CUSTOMER");
  const [changingRole, setChangingRole] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadCustomer() {
    try {
      setLoading(true);
      setError("");

      const data = await getCustomer(customerId);

      setCustomer(data);
      setSelectedRole(data.role);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load user"
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

    const oldRole = customer.role;
    const newRole = selectedRole;

    const confirmed = window.confirm(
      `Are you sure you want to change ${customer.name}'s role from ${oldRole} to ${newRole}?`
    );

    if (!confirmed) {
      setSelectedRole(customer.role);
      return;
    }

    try {
      setChangingRole(true);
      setActionError("");
      setSuccessMessage("");

      const updated = await updateCustomerRole(
        customer.id,
        newRole
      );

      /*
       * The role-update endpoint returns a basic
       * Customer object, not a complete CustomerDetail.
       * Preserve the existing details and update only
       * the fields returned by the role-update request.
       */
      setCustomer((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          id: updated.id,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          role: updated.role,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        };
      });

      setSelectedRole(updated.role);

      setSuccessMessage(
        `${updated.name}'s role has been changed from ${oldRole} to ${updated.role}.`
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to change user role"
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

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${customer.name}'s account?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setActionError("");
      setSuccessMessage("");

      await deleteCustomer(customer.id);

      window.location.href = "/admin/customers";
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
        <div className="flex min-h-[60vh] items-center justify-center pb-20 lg:pb-0">
          <p className="text-sm text-slate-500">
            Loading user...
          </p>
        </div>
      </DashboardShell>
    );
  }

  if (!customer || error) {
    return (
      <DashboardShell>
        <div className="px-3 py-5 pb-24 sm:p-6 lg:p-8 lg:pb-8">
          <Link
            href="/admin/customers"
            className="text-sm font-medium text-[#082B49] hover:text-blue-700"
          >
            ← Back to users
          </Link>

          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            {error || "User not found"}
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="px-3 py-5 pb-24 sm:px-6 sm:py-6 lg:px-8 lg:py-8 lg:pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/admin/customers"
            className="text-xs font-semibold text-[#082B49] hover:text-blue-700 sm:text-sm"
          >
            ← Back to users
          </Link>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 sm:text-sm">
              User details
            </p>

            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {customer.name}
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-[10px] font-semibold sm:text-xs ${getRoleClasses(
                  customer.role
                )}`}
              >
                {customer.role}
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-500 sm:text-sm">
              Account created {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-xs text-green-700 sm:mb-6 sm:px-4 sm:py-4 sm:text-sm">
            <span className="font-bold">✓</span>

            <div className="min-w-0">
              <p className="font-semibold">
                Role updated successfully
              </p>

              <p className="mt-1 break-words">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {actionError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs text-red-700 sm:mb-6 sm:px-4 sm:py-3 sm:text-sm">
            {actionError}
          </div>
        )}

        <div className="grid min-w-0 gap-4 xl:grid-cols-3 sm:gap-6">
          {/* Main content */}
          <div className="min-w-0 space-y-4 sm:space-y-6 xl:col-span-2">
            {/* Profile */}
            <Section title="User information">
              <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-5">
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-xs">
                    Name
                  </p>

                  <p className="mt-1 break-words text-xs font-medium text-slate-900 sm:text-sm">
                    {customer.name}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-xs">
                    Email
                  </p>

                  <p className="mt-1 break-all text-xs text-slate-800 sm:text-sm">
                    {customer.email}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-xs">
                    Phone
                  </p>

                  <p className="mt-1 break-words text-xs text-slate-800 sm:text-sm">
                    {customer.phone || "—"}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-xs">
                    Joined
                  </p>

                  <p className="mt-1 break-words text-xs text-slate-800 sm:text-sm">
                    {formatDate(customer.createdAt)}
                  </p>
                </div>
              </div>
            </Section>

            {/* Booking history */}
            <Section title="Booking history">
              {customer.bookings.length === 0 ? (
                <p className="text-xs text-slate-500 sm:text-sm">
                  This user has no bookings.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {customer.bookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/admin/bookings/${booking.id}`}
                      className="flex min-w-0 flex-col rounded-lg border border-slate-200 p-2.5 transition hover:border-blue-200 hover:bg-slate-50 sm:p-4"
                    >
                      <div className="flex min-w-0 flex-col items-start gap-2">
                        <p className="w-full break-words text-xs font-semibold text-slate-900 sm:text-sm">
                          {booking.bookingNumber}
                        </p>

                        <span
                          className={`max-w-full rounded-full px-2 py-1 text-[9px] font-semibold leading-tight sm:text-[11px] ${getStatusClasses(
                            booking.status
                          )}`}
                        >
                          {booking.status.replace("_", " ")}
                        </span>
                      </div>

                      <p className="mt-2 break-words text-[11px] text-slate-600 sm:text-sm">
                        {booking.service.name}
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-400 sm:text-xs">
                            Date
                          </p>

                          <p className="mt-1 break-words text-[10px] text-slate-700 sm:text-xs">
                            {formatDate(booking.scheduledDate)}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-400 sm:text-xs">
                            Time
                          </p>

                          <p className="mt-1 break-words text-[10px] text-slate-700 sm:text-xs">
                            {booking.scheduledTime}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 border-t border-slate-100 pt-2">
                        <p className="text-[10px] text-slate-400 sm:text-xs">
                          Amount
                        </p>

                        <p className="mt-1 break-words text-xs font-semibold text-slate-800 sm:text-sm">
                          {formatCurrency(booking.totalAmount)}
                        </p>
                      </div>

                      <p className="mt-3 text-[10px] font-semibold text-[#082B49] sm:text-xs">
                        View booking →
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </Section>

            {/* Addresses */}
            <Section title="Saved addresses">
              {customer.addresses.length === 0 ? (
                <p className="text-xs text-slate-500 sm:text-sm">
                  This user has no saved addresses.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {customer.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="min-w-0 rounded-lg border border-slate-200 p-2.5 sm:p-4"
                    >
                      <p className="break-words text-xs font-semibold text-slate-900 sm:text-sm">
                        {address.label}
                      </p>

                      <p className="mt-2 break-words text-xs text-slate-600 sm:text-sm">
                        {address.addressLine}
                      </p>

                      <p className="mt-1 break-words text-[10px] text-slate-500 sm:text-xs">
                        {address.city}, {address.county}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* Sidebar */}
          <div className="min-w-0 space-y-4 sm:space-y-6">
            {/* Activity */}
            <Section title="Activity">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-lg bg-slate-50 p-2 text-center sm:p-3">
                  <p className="text-lg font-bold text-slate-900 sm:text-xl">
                    {customer._count.bookings}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500 sm:text-[11px]">
                    Bookings
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-2 text-center sm:p-3">
                  <p className="text-lg font-bold text-slate-900 sm:text-xl">
                    {customer._count.addresses}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500 sm:text-[11px]">
                    Addresses
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-2 text-center sm:p-3">
                  <p className="text-lg font-bold text-slate-900 sm:text-xl">
                    {customer._count.reviews}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500 sm:text-[11px]">
                    Reviews
                  </p>
                </div>
              </div>
            </Section>

            {/* Role */}
            <Section title="Account role">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-500 sm:text-sm">
                  Current role
                </p>

                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold sm:text-xs ${getRoleClasses(
                    customer.role
                  )}`}
                >
                  {customer.role}
                </span>
              </div>

              <p className="mt-4 text-xs text-slate-500 sm:text-sm">
                Change the role assigned to this account.
              </p>

              <select
                value={selectedRole}
                onChange={(event) => {
                  setSelectedRole(
                    event.target.value as CustomerRole
                  );

                  setActionError("");
                  setSuccessMessage("");
                }}
                disabled={changingRole}
                className="mt-3 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60 sm:mt-4 sm:text-sm"
              >
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <button
                type="button"
                onClick={handleRoleChange}
                disabled={
                  changingRole ||
                  selectedRole === customer.role
                }
                className="mt-3 h-11 w-full rounded-lg bg-[#082B49] px-4 text-xs font-semibold text-white transition hover:bg-[#0b3b63] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                {changingRole ? "Updating..." : "Update role"}
              </button>

              <p className="mt-3 text-[10px] leading-5 text-slate-400 sm:text-xs">
                Only CUSTOMER and ADMIN roles can be changed here.
                Staff accounts are managed through Staff Management.
              </p>
            </Section>

            {/* Danger zone */}
            {customer.role === "CUSTOMER" && (
              <section className="rounded-xl border border-red-200 bg-white p-3 shadow-sm sm:p-5">
                <h2 className="text-sm font-semibold text-red-700 sm:text-base">
                  Danger zone
                </h2>

                <p className="mt-2 text-[11px] leading-5 text-slate-500 sm:text-xs">
                  Permanently delete this customer account.
                  Customers with existing bookings cannot be deleted.
                </p>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="mt-4 h-11 w-full rounded-lg border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                >
                  {deleting ? "Deleting..." : "Delete customer"}
                </button>
              </section>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

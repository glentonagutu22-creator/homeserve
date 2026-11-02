
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";

import {
  getCustomers,
  updateCustomerRole,
} from "@/lib/customers";

import type {
  Customer,
  CustomerRole,
} from "@/types/customer";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
  }).format(new Date(date));
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

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [changingRoleId, setChangingRoleId] = useState<string | null>(null);

  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");

      const data = await getCustomers();

      setCustomers(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone?.toLowerCase().includes(query) ||
        customer.role.toLowerCase().includes(query)
    );
  }, [customers, search]);

  const totalBookings = customers.reduce(
    (total, customer) => total + customer._count.bookings,
    0
  );

  const totalAdmins = customers.filter(
    (customer) => customer.role === "ADMIN"
  ).length;

  const totalCustomers = customers.filter(
    (customer) => customer.role === "CUSTOMER"
  ).length;

  async function handleRoleChange(customer: Customer) {
    const newRole: CustomerRole =
      customer.role === "CUSTOMER" ? "ADMIN" : "CUSTOMER";

    const action = newRole === "ADMIN" ? "promote" : "demote";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${customer.name} ${
        newRole === "ADMIN"
          ? "to an administrator"
          : "to a customer"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setChangingRoleId(customer.id);
      setError("");
      setSuccess("");

      await updateCustomerRole(customer.id, newRole);

      await loadCustomers();

      setSuccess(
        newRole === "ADMIN"
          ? `${customer.name} has been promoted to administrator.`
          : `${customer.name} has been demoted to customer.`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to change user role"
      );
    } finally {
      setChangingRoleId(null);
    }
  }

  return (
    <DashboardShell>
      <div className="px-3 py-5 pb-24 sm:px-6 sm:py-6 lg:px-8 lg:py-8 lg:pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 sm:text-sm">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            User Management
          </h1>

          <p className="mt-1.5 text-xs text-slate-500 sm:mt-2 sm:text-sm">
            Manage HomeServe users, roles, and account access.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={customers.length}
            description="Customers and administrators"
          />

          <StatCard
            title="Customers"
            value={totalCustomers}
            description="Customer accounts"
          />

          <StatCard
            title="Administrators"
            value={totalAdmins}
            description="Administrator accounts"
          />

          <StatCard
            title="Bookings"
            value={totalBookings}
            description="Bookings across users"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Search */}
        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:mb-6 sm:p-4">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, phone or role..."
            aria-label="Search users"
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:px-4 lg:max-w-md"
          />
        </div>

        {/* Users */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Phone
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Bookings
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Role
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Joined
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center"
                    >
                      <p className="text-sm font-medium text-slate-700">
                        No users found
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Try a different search.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {customer.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {customer.email}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {customer.phone || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                        {customer._count.bookings}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleClasses(
                            customer.role
                          )}`}
                        >
                          {customer.role}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(customer.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-4">
                          <Link
                            href={`/admin/customers/${customer.id}`}
                            className="text-sm font-semibold text-[#082B49] hover:text-blue-700"
                          >
                            View
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleRoleChange(customer)}
                            disabled={changingRoleId === customer.id}
                            className={`text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                              customer.role === "CUSTOMER"
                                ? "text-purple-600 hover:text-purple-700"
                                : "text-amber-600 hover:text-amber-700"
                            }`}
                          >
                            {changingRoleId === customer.id
                              ? "Updating..."
                              : customer.role === "CUSTOMER"
                                ? "Make Admin"
                                : "Make Customer"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile and tablet cards */}
          <div className="p-2.5 lg:hidden sm:p-4">
            {loading ? (
              <div className="px-3 py-12 text-center text-sm text-slate-500">
                Loading users...
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="px-3 py-12 text-center text-sm text-slate-500">
                No users found.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-2.5 transition hover:border-slate-300 sm:p-4"
                  >
                    {/* User identity */}
                    <div className="min-w-0">
                      <p className="break-words text-xs font-bold leading-snug text-slate-900 sm:text-sm">
                        {customer.name}
                      </p>

                      <p className="mt-1 break-all text-[10px] leading-snug text-slate-500 sm:text-xs">
                        {customer.email}
                      </p>

                      <span
                        className={`mt-2 inline-flex rounded-full px-2 py-1 text-[9px] font-semibold sm:text-[11px] ${getRoleClasses(
                          customer.role
                        )}`}
                      >
                        {customer.role}
                      </span>
                    </div>

                    {/* User details */}
                    <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 sm:text-xs">
                          Phone
                        </p>

                        <p className="mt-0.5 break-words text-[11px] font-medium text-slate-700 sm:text-xs">
                          {customer.phone || "—"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-400 sm:text-xs">
                            Bookings
                          </p>

                          <p className="mt-0.5 text-xs font-semibold text-slate-800 sm:text-sm">
                            {customer._count.bookings}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-400 sm:text-xs">
                            Joined
                          </p>

                          <p className="mt-0.5 break-words text-[10px] font-medium text-slate-700 sm:text-xs">
                            {formatDate(customer.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="w-full rounded-lg border border-slate-200 px-2 py-2 text-center text-[10px] font-semibold text-[#082B49] transition hover:bg-slate-50 sm:text-xs"
                      >
                        View profile
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleRoleChange(customer)}
                        disabled={changingRoleId === customer.id}
                        className={`w-full rounded-lg px-2 py-2 text-center text-[10px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs ${
                          customer.role === "CUSTOMER"
                            ? "bg-[#082B49] hover:bg-[#0b3b63]"
                            : "bg-amber-500 hover:bg-amber-600"
                        }`}
                      >
                        {changingRoleId === customer.id
                          ? "Updating..."
                          : customer.role === "CUSTOMER"
                            ? "Make Admin"
                            : "Make Customer"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Result count */}
        {!loading && (
          <p className="mt-4 text-xs text-slate-500">
            Showing {filteredCustomers.length} of {customers.length} users
          </p>
        )}
      </div>
    </DashboardShell>
  );
}

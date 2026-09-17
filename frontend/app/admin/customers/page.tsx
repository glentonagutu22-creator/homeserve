"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";

import { getCustomers } from "@/lib/customers";

import type { Customer } from "@/types/customer";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function getRoleClasses(
  role: Customer["role"]
) {
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
  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getCustomers();

        setCustomers(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load customers"
        );
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter(
      (customer) =>
        customer.name
          .toLowerCase()
          .includes(query) ||
        customer.email
          .toLowerCase()
          .includes(query) ||
        customer.phone
          ?.toLowerCase()
          .includes(query)
    );
  }, [customers, search]);

  const totalBookings =
    customers.reduce(
      (total, customer) =>
        total + customer._count.bookings,
      0
    );

  return (
    <DashboardShell>
      <div className="p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Customers
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage HomeServe customer accounts and activity.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <StatCard
            title="Customers"
            value={customers.length}
            description="Registered customer accounts"
          />

          <StatCard
            title="Bookings"
            value={totalBookings}
            description="Bookings across customers"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by name, email or phone..."
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 lg:max-w-md"
          />
        </div>

        {/* Customers */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* Desktop */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Customer
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
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredCustomers.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center"
                    >
                      <p className="text-sm font-medium text-slate-700">
                        No customers found
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Try a different search.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map(
                    (customer) => (
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
                          {customer.phone ||
                            "—"}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                          {
                            customer._count
                              .bookings
                          }
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
                          {formatDate(
                            customer.createdAt
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/admin/customers/${customer.id}`}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-slate-100 lg:hidden">
            {loading ? (
              <div className="px-5 py-12 text-center text-sm text-slate-500">
                Loading customers...
              </div>
            ) : filteredCustomers.length ===
              0 ? (
              <div className="px-5 py-12 text-center text-sm text-slate-500">
                No customers found.
              </div>
            ) : (
              filteredCustomers.map(
                (customer) => (
                  <div
                    key={customer.id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {customer.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {customer.email}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleClasses(
                          customer.role
                        )}`}
                      >
                        {customer.role}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400">
                          Phone
                        </p>

                        <p className="mt-1 text-sm text-slate-700">
                          {customer.phone ||
                            "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Bookings
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {
                            customer._count
                              .bookings
                          }
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="mt-5 block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      View customer
                    </Link>
                  </div>
                )
              )
            )}
          </div>
        </div>

        {!loading && (
          <p className="mt-4 text-xs text-slate-500">
            Showing{" "}
            {filteredCustomers.length} of{" "}
            {customers.length} customers
          </p>
        )}
      </div>
    </DashboardShell>
  );
}
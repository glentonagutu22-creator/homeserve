"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import DashboardShell from "@/components/dashboard/DashboardShell";

import {
  createStaff,
  getStaff,
} from "@/lib/staff";

import type {
  CreateStaffData,
  Staff,
  StaffType,
} from "@/types/staff";

const staffTypes: StaffType[] = [
  "CLEANER",
  "MOVER",
  "ELECTRICIAN",
  "SUPERVISOR",
];

function formatStaffType(
  type: StaffType
) {
  return (
    type.charAt(0) +
    type.slice(1).toLowerCase()
  );
}

function getStaffTypeLabel(
  type: StaffType
) {
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
      return formatStaffType(type);
  }
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [form, setForm] =
    useState<CreateStaffData>({
      name: "",
      email: "",
      phone: "",
      password: "",
      staffType: "CLEANER",
    });

  async function loadStaff() {
    try {
      setLoading(true);
      setError("");

      const result = await getStaff();

      setStaff(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load staff"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStaff();
  }, []);

  function updateField(
    field: keyof CreateStaffData,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleCreateStaff(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      await createStaff(form);

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        staffType: "CLEANER",
      });

      setShowForm(false);

      await loadStaff();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create staff member"
      );
    } finally {
      setSubmitting(false);
    }
  }

  const filteredStaff =
    staff.filter((member) => {
      const searchValue =
        search.toLowerCase().trim();

      if (!searchValue) {
        return true;
      }

      return (
        member.user.name
          .toLowerCase()
          .includes(searchValue) ||
        member.user.email
          .toLowerCase()
          .includes(searchValue) ||
        member.user.phone
          ?.toLowerCase()
          .includes(searchValue) ||
        member.staffType
          .toLowerCase()
          .includes(searchValue)
      );
    });

  return (
    <DashboardShell>
      <main className="min-h-full bg-slate-50">
        {/* Header */}
        <section className="bg-[#061F35]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-300">
                  HomeServe Admin
                </p>

                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  Staff Management
                </h1>

                <p className="mt-3 max-w-2xl text-slate-300">
                  Manage HomeServe service professionals,
                  their roles, and availability.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowForm((current) => !current)
                }
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {showForm
                  ? "Close Form"
                  : "+ Add Staff"}
              </button>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Create staff form */}
          {showForm && (
            <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Create Staff Account
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a staff login and assign their
                  professional role.
                </p>
              </div>

              <form
                onSubmit={handleCreateStaff}
                className="grid gap-5 md:grid-cols-2"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateField(
                        "name",
                        event.target.value
                      )
                    }
                    required
                    placeholder="John Kamau"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value
                      )
                    }
                    required
                    placeholder="john@homeserve.co.ke"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone
                  </label>

                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value
                      )
                    }
                    required
                    placeholder="0712345678"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Staff Type
                  </label>

                  <select
                    value={form.staffType}
                    onChange={(event) =>
                      updateField(
                        "staffType",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {staffTypes.map((type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {getStaffTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Temporary Password
                  </label>

                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) =>
                      updateField(
                        "password",
                        event.target.value
                      )
                    }
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row md:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? "Creating..."
                      : "Create Staff"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShowForm(false)
                    }
                    className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Search */}
          <section className="mb-6">
            <div className="relative max-w-md">
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search staff..."
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </section>

          {/* Stats */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Staff
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {staff.length}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Available
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {
                  staff.filter(
                    (member) =>
                      member.isAvailable
                  ).length
                }
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Cleaners
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {
                  staff.filter(
                    (member) =>
                      member.staffType ===
                      "CLEANER"
                  ).length
                }
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Electricians
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-600">
                {
                  staff.filter(
                    (member) =>
                      member.staffType ===
                      "ELECTRICIAN"
                  ).length
                }
              </p>
            </div>
          </section>

          {/* Staff table */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-bold text-slate-900">
                Staff Members
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your HomeServe service professionals.
              </p>
            </div>

            {loading ? (
              <div className="px-6 py-16 text-center text-sm text-slate-500">
                Loading staff...
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="font-medium text-slate-900">
                  {search
                    ? "No staff members found"
                    : "No staff members yet"}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {search
                    ? "Try a different search."
                    : "Create your first staff account to get started."}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Staff
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Type
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Phone
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Availability
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredStaff.map(
                        (member) => (
                          <tr
                            key={member.id}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-6 py-5">
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {member.user.name}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                  {member.user.email}
                                </p>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                {getStaffTypeLabel(
                                  member.staffType
                                )}
                              </span>
                            </td>

                            <td className="px-6 py-5 text-sm text-slate-600">
                              {member.user.phone ||
                                "—"}
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  member.isAvailable
                                    ? "bg-green-50 text-green-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {member.isAvailable
                                  ? "Available"
                                  : "Unavailable"}
                              </span>
                            </td>

                            <td className="px-6 py-5 text-right">
                              <Link
                                href={`/admin/staff/${member.id}`}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                              >
                                View →
                              </Link>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="divide-y divide-slate-100 md:hidden">
                  {filteredStaff.map(
                    (member) => (
                      <div
                        key={member.id}
                        className="p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {member.user.name}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              {member.user.email}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {member.user.phone ||
                                "No phone"}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                              member.isAvailable
                                ? "bg-green-50 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {member.isAvailable
                              ? "Available"
                              : "Unavailable"}
                          </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {getStaffTypeLabel(
                              member.staffType
                            )}
                          </span>

                          <Link
                            href={`/admin/staff/${member.id}`}
                            className="text-sm font-semibold text-blue-600"
                          >
                            View →
                          </Link>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}
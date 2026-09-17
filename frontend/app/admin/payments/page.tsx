"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import {
  getPayments,
  updatePaymentStatus,
} from "@/lib/payments";
import type {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from "@/types/payment";

const statusOptions: PaymentStatus[] = [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
];

const methodOptions: PaymentMethod[] = [
  "MPESA",
  "CARD",
  "CASH",
];

function formatAmount(amount: string | number) {
  return `KES ${Number(amount).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(date: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusClasses(status: PaymentStatus) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800";

    case "FAILED":
      return "bg-red-100 text-red-800";

    case "REFUNDED":
      return "bg-purple-100 text-purple-800";

    case "PENDING":
    default:
      return "bg-amber-100 text-amber-800";
  }
}

function getMethodClasses(method: PaymentMethod) {
  switch (method) {
    case "MPESA":
      return "bg-green-100 text-green-800";

    case "CARD":
      return "bg-blue-100 text-blue-800";

    case "CASH":
      return "bg-gray-200 text-gray-800";

    default:
      return "bg-gray-200 text-gray-800";
  }
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<PaymentStatus | "ALL">("ALL");

  const [methodFilter, setMethodFilter] =
    useState<PaymentMethod | "ALL">("ALL");

  const [updatingId, setUpdatingId] = useState<string | null>(
    null
  );

  async function loadPayments() {
    try {
      setLoading(true);
      setError("");

      const data = await getPayments();
      setPayments(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load payments"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  async function handleStatusChange(
    paymentId: string,
    status: PaymentStatus
  ) {
    try {
      setUpdatingId(paymentId);
      setError("");

      const updatedPayment =
        await updatePaymentStatus(paymentId, status);

      setPayments((current) =>
        current.map((payment) =>
          payment.id === paymentId
            ? updatedPayment
            : payment
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update payment"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "ALL" ||
        payment.method === methodFilter;

      return matchesStatus && matchesMethod;
    });
  }, [payments, statusFilter, methodFilter]);

  const statistics = useMemo(() => {
    const completed = payments.filter(
      (payment) => payment.status === "COMPLETED"
    );

    const pending = payments.filter(
      (payment) => payment.status === "PENDING"
    );

    const failed = payments.filter(
      (payment) => payment.status === "FAILED"
    );

    const refunded = payments.filter(
      (payment) => payment.status === "REFUNDED"
    );

    const completedAmount = completed.reduce(
      (total, payment) =>
        total + Number(payment.amount),
      0
    );

    return {
      total: payments.length,
      completed: completed.length,
      pending: pending.length,
      failed: failed.length,
      refunded: refunded.length,
      completedAmount,
    };
  }, [payments]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <div>
          <h1 className="text-2xl font-bold text-[#061F35]">
            Payments
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            View and manage customer payment records.
          </p>
        </div>

        {/* =====================================================
            ERROR MESSAGE
        ====================================================== */}
        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </div>
        )}

        {/* =====================================================
            STATISTICS CARDS
        ====================================================== */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {/* Total */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-blue-900">
              Total Payments
            </p>

            <p className="mt-2 text-2xl font-bold text-[#061F35]">
              {statistics.total}
            </p>

            <p className="mt-1 text-xs font-medium text-blue-700">
              All payment records
            </p>
          </div>

          {/* Completed */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-blue-900">
              Completed
            </p>

            <p className="mt-2 text-2xl font-bold text-green-700">
              {statistics.completed}
            </p>

            <p className="mt-1 text-xs font-medium text-blue-700">
              Successfully completed
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-blue-900">
              Pending
            </p>

            <p className="mt-2 text-2xl font-bold text-amber-700">
              {statistics.pending}
            </p>

            <p className="mt-1 text-xs font-medium text-blue-700">
              Awaiting completion
            </p>
          </div>

          {/* Failed */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-blue-900">
              Failed
            </p>

            <p className="mt-2 text-2xl font-bold text-red-700">
              {statistics.failed}
            </p>

            <p className="mt-1 text-xs font-medium text-blue-700">
              Unsuccessful payments
            </p>
          </div>

          {/* Completed value */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-blue-900">
              Completed Value
            </p>

            <p className="mt-2 text-lg font-bold text-[#061F35]">
              {formatAmount(
                statistics.completedAmount
              )}
            </p>

            <p className="mt-1 text-xs font-medium text-blue-700">
              Total completed payments
            </p>
          </div>
        </div>

        {/* =====================================================
            PAYMENT RECORDS HEADER + FILTERS
        ====================================================== */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#061F35]">
                Payment Records
              </h2>

              <p className="mt-1 text-sm font-medium text-gray-600">
                Showing{" "}
                <span className="font-bold text-gray-800">
                  {filteredPayments.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-800">
                  {payments.length}
                </span>{" "}
                payments
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div>
                <label
                  htmlFor="status-filter"
                  className="mb-1 block text-xs font-bold text-gray-700"
                >
                  Status
                </label>

                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as
                        | PaymentStatus
                        | "ALL"
                    )
                  }
                  className="w-full rounded-lg border border-gray-400 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 sm:w-44"
                >
                  <option value="ALL">
                    All statuses
                  </option>

                  {statusOptions.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="method-filter"
                  className="mb-1 block text-xs font-bold text-gray-700"
                >
                  Payment Method
                </label>

                <select
                  id="method-filter"
                  value={methodFilter}
                  onChange={(e) =>
                    setMethodFilter(
                      e.target.value as
                        | PaymentMethod
                        | "ALL"
                    )
                  }
                  className="w-full rounded-lg border border-gray-400 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 sm:w-44"
                >
                  <option value="ALL">
                    All methods
                  </option>

                  {methodOptions.map((method) => (
                    <option
                      key={method}
                      value={method}
                    >
                      {method}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* =================================================
              LOADING
          ================================================== */}
          {loading && (
            <div className="p-12 text-center">
              <p className="text-sm font-semibold text-gray-700">
                Loading payments...
              </p>
            </div>
          )}

          {/* =================================================
              EMPTY STATE
          ================================================== */}
          {!loading &&
            filteredPayments.length === 0 && (
              <div className="p-12 text-center">
                <p className="font-bold text-gray-800">
                  No payments found
                </p>

                <p className="mt-1 text-sm font-medium text-gray-600">
                  Try changing the filters or create a
                  payment through a booking.
                </p>
              </div>
            )}

          {/* =================================================
              DESKTOP TABLE
          ================================================== */}
          {!loading &&
            filteredPayments.length > 0 && (
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1150px]">
                  <thead className="border-b-2 border-gray-200 bg-gray-100">
                    <tr className="text-left">
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-700">
                        Booking
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-700">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-700">
                        Service
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-700">
                        Amount
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-700">
                        Method
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-700">
                        Reference
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-700">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-700">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {filteredPayments.map(
                      (payment) => (
                        <tr
                          key={payment.id}
                          className="transition hover:bg-blue-50/50"
                        >
                          {/* Booking */}
                          <td className="px-5 py-5">
                            <p className="font-bold text-[#061F35]">
                              {
                                payment.booking
                                  .bookingNumber
                              }
                            </p>

                            <p className="mt-1 text-xs font-medium text-gray-600">
                              {
                                payment.booking
                                  .scheduledTime
                              }
                            </p>
                          </td>

                          {/* Customer */}
                          <td className="px-5 py-5">
                            <p className="font-semibold text-gray-900">
                              {
                                payment.booking.user
                                  .name
                              }
                            </p>

                            <p className="mt-1 text-xs font-medium text-gray-600">
                              {
                                payment.booking.user
                                  .email
                              }
                            </p>

                            {payment.booking.user
                              .phone && (
                              <p className="mt-1 text-xs font-medium text-gray-600">
                                {
                                  payment.booking.user
                                    .phone
                                }
                              </p>
                            )}
                          </td>

                          {/* Service */}
                          <td className="px-5 py-5">
                            <p className="font-semibold text-gray-900">
                              {
                                payment.booking
                                  .service.name
                              }
                            </p>

                            <p className="mt-1 text-xs font-bold text-gray-600">
                              {
                                payment.booking
                                  .service.category
                              }
                            </p>
                          </td>

                          {/* Amount */}
                          <td className="px-5 py-5">
                            <p className="font-bold text-[#061F35]">
                              {formatAmount(
                                payment.amount
                              )}
                            </p>
                          </td>

                          {/* Method */}
                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getMethodClasses(
                                payment.method
                              )}`}
                            >
                              {payment.method}
                            </span>
                          </td>

                          {/* Reference */}
                          <td className="max-w-[190px] px-5 py-5">
                            <span className="block truncate text-sm font-semibold text-gray-800">
                              {
                                payment.transactionReference ||
                                "No reference"
                              }
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-5">
                            <select
                              value={
                                payment.status
                              }
                              disabled={
                                updatingId ===
                                payment.id
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  payment.id,
                                  e.target
                                    .value as PaymentStatus
                                )
                              }
                              className={`rounded-lg border-0 px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-200 ${getStatusClasses(
                                payment.status
                              )}`}
                            >
                              {statusOptions.map(
                                (status) => (
                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {status}
                                  </option>
                                )
                              )}
                            </select>
                          </td>

                          {/* Date */}
                          <td className="whitespace-nowrap px-5 py-5">
                            <p className="text-sm font-semibold text-gray-800">
                              {formatDate(
                                payment.createdAt
                              )}
                            </p>

                            <p className="mt-1 text-xs font-medium text-gray-600">
                              {formatDateTime(
                                payment.createdAt
                              )
                                .split(", ")
                                .slice(1)
                                .join(", ")}
                            </p>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

          {/* =================================================
              MOBILE PAYMENT CARDS
          ================================================== */}
          {!loading &&
            filteredPayments.length > 0 && (
              <div className="space-y-4 p-4 lg:hidden">
                {filteredPayments.map(
                  (payment) => (
                    <div
                      key={payment.id}
                      className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm"
                    >
                      {/* Top */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-[#061F35]">
                            {
                              payment.booking
                                .bookingNumber
                            }
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-800">
                            {
                              payment.booking
                                .service.name
                            }
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="mt-5 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                            Customer
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-900">
                            {
                              payment.booking.user
                                .name
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                            Amount
                          </p>

                          <p className="mt-1 text-sm font-bold text-[#061F35]">
                            {formatAmount(
                              payment.amount
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                            Method
                          </p>

                          <span
                            className={`mt-1 inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getMethodClasses(
                              payment.method
                            )}`}
                          >
                            {payment.method}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                            Date
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-800">
                            {formatDate(
                              payment.createdAt
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Reference */}
                      <div className="mt-5 border-t border-gray-200 pt-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                          Transaction Reference
                        </p>

                        <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                          {
                            payment.transactionReference ||
                            "No transaction reference"
                          }
                        </p>
                      </div>

                      {/* Status update */}
                      <div className="mt-5">
                        <label
                          htmlFor={`payment-status-${payment.id}`}
                          className="mb-1 block text-xs font-bold text-gray-700"
                        >
                          Update Status
                        </label>

                        <select
                          id={`payment-status-${payment.id}`}
                          value={payment.status}
                          disabled={
                            updatingId ===
                            payment.id
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              payment.id,
                              e.target
                                .value as PaymentStatus
                            )
                          }
                          className="w-full rounded-lg border border-gray-400 bg-white px-3 py-2.5 text-sm font-bold text-gray-800 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        >
                          {statusOptions.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
        </div>
      </div>
    </DashboardShell>
  );
}
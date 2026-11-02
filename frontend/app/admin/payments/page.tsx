
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
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "FAILED":
      return "bg-red-50 text-red-700 border-red-200";
    case "REFUNDED":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

function getMethodClasses(method: PaymentMethod) {
  switch (method) {
    case "MPESA":
      return "bg-emerald-50 text-emerald-700";
    case "CARD":
      return "bg-blue-50 text-blue-700";
    case "CASH":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

interface PaymentStatProps {
  title: string;
  value: string | number;
  description: string;
  accent: string;
  valueClass?: string;
}

function PaymentStat({
  title,
  value,
  description,
  accent,
  valueClass = "text-[#061F35]",
}: PaymentStatProps) {
  return (
    <div className="relative min-w-0 overflow-hidden border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className={`absolute left-0 top-0 h-full w-1 ${accent}`} />

      <div className="pl-1">
        <p className="text-[10px] font-semibold text-slate-500 sm:text-xs">
          {title}
        </p>

        <p className={`mt-2 break-words text-xl font-bold sm:text-2xl ${valueClass}`}>
          {value}
        </p>

        <p className="mt-1 text-[9px] text-slate-500 sm:text-xs">
          {description}
        </p>
      </div>
    </div>
  );
}

interface PaymentStatusSelectProps {
  payment: Payment;
  updating: boolean;
  onChange: (paymentId: string, status: PaymentStatus) => void;
  mobile?: boolean;
}

function PaymentStatusSelect({
  payment,
  updating,
  onChange,
  mobile = false,
}: PaymentStatusSelectProps) {
  return (
    <select
      id={mobile ? `payment-status-${payment.id}` : undefined}
      aria-label={`Update status for payment ${payment.id}`}
      value={payment.status}
      disabled={updating}
      onChange={(e) =>
        onChange(payment.id, e.target.value as PaymentStatus)
      }
      className={`min-w-0 border px-2 py-2 text-[10px] font-bold outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-wait disabled:opacity-60 sm:text-xs ${
        mobile
          ? "w-full border-slate-300 bg-white text-slate-800"
          : `border-transparent ${getStatusClasses(payment.status)}`
      }`}
    >
      {statusOptions.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<PaymentStatus | "ALL">("ALL");

  const [methodFilter, setMethodFilter] =
    useState<PaymentMethod | "ALL">("ALL");

  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

      const updatedPayment = await updatePaymentStatus(
        paymentId,
        status
      );

      setPayments((current) =>
        current.map((payment) =>
          payment.id === paymentId ? updatedPayment : payment
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
      (total, payment) => total + Number(payment.amount),
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
      <div className="space-y-5 sm:space-y-7">
        {/* PAGE HEADER */}
        <section className="border border-[#061F35] bg-[#061F35] px-4 py-4 sm:px-5 sm:py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">
            HomeServe Management
          </p>

          <h1 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
            Payments
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-blue-100 sm:text-sm">
            Monitor customer transactions, payment methods and payment
            statuses across the platform.
          </p>
        </section>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="flex items-start justify-between gap-3 border border-red-200 bg-red-50 px-4 py-3">
            <p className="break-words text-xs font-medium text-red-800 sm:text-sm">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 text-xs font-bold text-red-700 hover:text-red-900"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* STATISTICS */}
        <section>
          <div className="mb-3">
            <h2 className="text-sm font-bold text-[#061F35] sm:text-base">
              Payment Overview
            </h2>
            <p className="text-xs text-slate-500">
              Summary of all recorded transactions
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-5">
            <PaymentStat
              title="Total Payments"
              value={statistics.total}
              description="All payment records"
              accent="bg-blue-600"
            />

            <PaymentStat
              title="Completed"
              value={statistics.completed}
              description="Successfully completed"
              accent="bg-emerald-500"
              valueClass="text-emerald-700"
            />

            <PaymentStat
              title="Pending"
              value={statistics.pending}
              description="Awaiting completion"
              accent="bg-amber-500"
              valueClass="text-amber-700"
            />

            <PaymentStat
              title="Failed"
              value={statistics.failed}
              description="Unsuccessful payments"
              accent="bg-red-500"
              valueClass="text-red-700"
            />

            <div className="col-span-2 xl:col-span-1">
              <PaymentStat
                title="Completed Value"
                value={formatAmount(statistics.completedAmount)}
                description="Total completed payments"
                accent="bg-indigo-500"
              />
            </div>
          </div>
        </section>

        {/* PAYMENT RECORDS */}
        <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
          {/* RECORDS HEADER AND FILTERS */}
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#061F35] sm:text-base">
                  Payment Records
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Showing{" "}
                  <span className="font-bold text-slate-800">
                    {filteredPayments.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-800">
                    {payments.length}
                  </span>{" "}
                  payments
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="min-w-0">
                  <label
                    htmlFor="status-filter"
                    className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500"
                  >
                    Status
                  </label>

                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as PaymentStatus | "ALL"
                      )
                    }
                    className="w-full border border-slate-300 bg-white px-2 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 sm:min-w-40 sm:px-3"
                  >
                    <option value="ALL">All statuses</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0">
                  <label
                    htmlFor="method-filter"
                    className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500"
                  >
                    Payment Method
                  </label>

                  <select
                    id="method-filter"
                    value={methodFilter}
                    onChange={(e) =>
                      setMethodFilter(
                        e.target.value as PaymentMethod | "ALL"
                      )
                    }
                    className="w-full border border-slate-300 bg-white px-2 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 sm:min-w-40 sm:px-3"
                  >
                    <option value="ALL">All methods</option>
                    {methodOptions.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex min-h-48 items-center justify-center">
              <p className="text-sm font-medium text-slate-600">
                Loading payments...
              </p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && filteredPayments.length === 0 && (
            <div className="px-4 py-12 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center bg-slate-100 text-slate-400">
                <span className="text-lg">₭</span>
              </div>

              <p className="mt-3 text-sm font-bold text-slate-800">
                No payments found
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Try changing the filters or create a payment through a
                booking.
              </p>
            </div>
          )}

          {/* DESKTOP TABLE */}
          {!loading && filteredPayments.length > 0 && (
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1150px]">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr className="text-left">
                    {[
                      "Booking",
                      "Customer",
                      "Service",
                      "Amount",
                      "Method",
                      "Reference",
                      "Status",
                      "Date",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-[#061F35]">
                          {payment.booking.bookingNumber}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {payment.booking.scheduledTime}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {payment.booking.user.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {payment.booking.user.email}
                        </p>
                        {payment.booking.user.phone && (
                          <p className="mt-1 text-xs text-slate-500">
                            {payment.booking.user.phone}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {payment.booking.service.name}
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          {payment.booking.service.category}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-[#061F35]">
                          {formatAmount(payment.amount)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1.5 text-[10px] font-bold ${getMethodClasses(
                            payment.method
                          )}`}
                        >
                          {payment.method}
                        </span>
                      </td>

                      <td className="max-w-[190px] px-5 py-4">
                        <span className="block truncate text-xs font-medium text-slate-700">
                          {payment.transactionReference || "No reference"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <PaymentStatusSelect
                          payment={payment}
                          updating={updatingId === payment.id}
                          onChange={handleStatusChange}
                        />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="text-xs font-semibold text-slate-800">
                          {formatDate(payment.createdAt)}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {formatDateTime(payment.createdAt)
                            .split(", ")
                            .slice(1)
                            .join(", ")}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MOBILE PAYMENT CARDS */}
          {!loading && filteredPayments.length > 0 && (
            <div className="grid grid-cols-2 gap-2 p-2 lg:hidden sm:gap-3 sm:p-4">
              {filteredPayments.map((payment) => (
                <article
                  key={payment.id}
                  className="flex min-w-0 flex-col border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
                >
                  {/* BOOKING AND STATUS */}
                  <div className="min-w-0 border-b border-slate-100 pb-3">
                    <p className="break-all text-xs font-bold text-[#061F35] sm:text-sm">
                      {payment.booking.bookingNumber}
                    </p>

                    <p className="mt-1 break-words text-[10px] font-medium text-slate-600 sm:text-xs">
                      {payment.booking.service.name}
                    </p>

                    <span
                      className={`mt-2 inline-flex max-w-full px-2 py-1 text-[9px] font-bold ${getStatusClasses(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </div>

                  {/* CUSTOMER AND AMOUNT */}
                  <div className="grid min-w-0 grid-cols-1 gap-3 py-3">
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        Customer
                      </p>
                      <p className="mt-1 break-words text-[11px] font-semibold text-slate-800 sm:text-xs">
                        {payment.booking.user.name}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        Amount
                      </p>
                      <p className="mt-1 break-words text-xs font-bold text-[#061F35] sm:text-sm">
                        {formatAmount(payment.amount)}
                      </p>
                    </div>
                  </div>

                  {/* METHOD AND DATE */}
                  <div className="grid min-w-0 grid-cols-1 gap-3 border-t border-slate-100 py-3">
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        Method
                      </p>
                      <span
                        className={`mt-1 inline-flex max-w-full px-2 py-1 text-[9px] font-bold ${getMethodClasses(
                          payment.method
                        )}`}
                      >
                        {payment.method}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        Date
                      </p>
                      <p className="mt-1 text-[10px] font-medium text-slate-700 sm:text-xs">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* TRANSACTION REFERENCE */}
                  <div className="min-w-0 border-t border-slate-100 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                      Transaction Reference
                    </p>
                    <p className="mt-1 break-all text-[10px] font-medium text-slate-700">
                      {payment.transactionReference ||
                        "No transaction reference"}
                    </p>
                  </div>

                  {/* STATUS UPDATE */}
                  <div className="mt-auto border-t border-slate-100 pt-3">
                    <label
                      htmlFor={`payment-status-${payment.id}`}
                      className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-slate-500"
                    >
                      Update Status
                    </label>

                    <PaymentStatusSelect
                      payment={payment}
                      updating={updatingId === payment.id}
                      onChange={handleStatusChange}
                      mobile
                    />

                    {updatingId === payment.id && (
                      <p className="mt-1 text-[9px] text-slate-500">
                        Updating...
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}

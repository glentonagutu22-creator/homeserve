"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import DashboardShell from "@/components/dashboard/DashboardShell";

import {
  getAdminQuotes,
} from "@/lib/quotes";

import type {
  Quote,
} from "@/types/quote";

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

function getStatusClasses(
  status: Quote["status"]
) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";

    case "SENT":
      return "bg-blue-100 text-blue-800";

    case "ACCEPTED":
      return "bg-green-100 text-green-800";

    case "REJECTED":
      return "bg-red-100 text-red-800";

    case "EXPIRED":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadQuotes() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAdminQuotes();

        setQuotes(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load quotes."
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuotes();
  }, []);

  return (
    <DashboardShell>
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              HomeServe Admin
            </p>

            <h1 className="text-3xl font-bold text-[#061F35]">
              Quote Requests
            </h1>

            <p className="mt-2 text-slate-600">
              Review customer quote requests,
              set pricing, and send quotes.
            </p>
          </div>

          {loading && (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-slate-600">
                Loading quote requests...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            quotes.length === 0 && (
              <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                <h2 className="text-xl font-semibold text-[#061F35]">
                  No quote requests
                </h2>

                <p className="mt-2 text-slate-600">
                  New customer quote requests
                  will appear here.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            quotes.length > 0 && (
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-[#061F35] text-left text-sm text-white">
                      <tr>
                        <th className="px-6 py-4">
                          Customer
                        </th>

                        <th className="px-6 py-4">
                          Service
                        </th>

                        <th className="px-6 py-4">
                          Booking
                        </th>

                        <th className="px-6 py-4">
                          Date
                        </th>

                        <th className="px-6 py-4">
                          Status
                        </th>

                        <th className="px-6 py-4">
                          Amount
                        </th>

                        <th className="px-6 py-4">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {quotes.map(
                        (quote) => (
                          <tr
                            key={quote.id}
                            className="hover:bg-slate-50"
                          >
                            <td className="px-6 py-5">
                              <p className="font-semibold text-[#061F35]">
                                {quote.booking?.user
                                  ?.name ??
                                  "Unknown"}
                              </p>

                              <p className="text-sm text-slate-500">
                                {quote.booking?.user
                                  ?.email ??
                                  "No email"}
                              </p>
                            </td>

                            <td className="px-6 py-5">
                              <p className="font-medium text-slate-800">
                                {quote.booking
                                  ?.service
                                  ?.name ??
                                  "Unknown service"}
                              </p>

                              <p className="text-xs uppercase text-slate-500">
                                {quote.booking
                                  ?.service
                                  ?.category ??
                                  ""}
                              </p>
                            </td>

                            <td className="px-6 py-5 font-mono text-sm text-slate-600">
                              {quote.booking
                                ?.bookingNumber ??
                                "-"}
                            </td>

                            <td className="px-6 py-5 text-sm text-slate-600">
                              {quote.booking
                                ?.scheduledDate
                                ? formatDate(
                                    quote
                                      .booking
                                      .scheduledDate
                                  )
                                : "-"}
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                  quote.status
                                )}`}
                              >
                                {quote.status}
                              </span>
                            </td>

                            <td className="px-6 py-5 font-semibold text-slate-800">
                              {quote.finalAmount
                                ? `KSh ${Number(
                                    quote.finalAmount
                                  ).toLocaleString()}`
                                : quote.estimatedAmount
                                ? `KSh ${Number(
                                    quote.estimatedAmount
                                  ).toLocaleString()}`
                                : "Not set"}
                            </td>

                            <td className="px-6 py-5">
                              <Link
                                href={`/admin/quotes/${quote.id}`}
                                className="inline-flex rounded-lg bg-[#061F35] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#082B49]"
                              >
                                Review
                              </Link>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </main>
      </div>
    </DashboardShell>
  );
}
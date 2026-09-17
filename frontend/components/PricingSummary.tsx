"use client";

import type { PricingResult } from "../types/pricing";

interface PricingSummaryProps {
  pricing: PricingResult | null;
  loading?: boolean;
  error?: string | null;
}

export default function PricingSummary({
  pricing,
  loading = false,
  error = null,
}: PricingSummaryProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />

          <div>
            <p className="font-semibold text-[#061F35]">
              Calculating your price...
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Please wait while we calculate your estimated cost.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <p className="font-semibold text-red-700">
          Unable to calculate price
        </p>

        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (!pricing) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
      {/* Header */}
      <div className="bg-[#061F35] px-6 py-5 text-white">
        <p className="text-sm font-medium text-blue-200">
          Estimated Price
        </p>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            KSh {pricing.totalAmount.toLocaleString()}
          </span>
        </div>

        <p className="mt-1 text-sm text-blue-100">
          {pricing.serviceName}
        </p>
      </div>

      {/* Breakdown */}
      <div className="p-6">
        <h3 className="font-semibold text-[#061F35]">
          Price breakdown
        </h3>

        <div className="mt-4 space-y-3">
          {pricing.breakdown.map((item, index) => (
            <div
              key={`${item.item}-${index}`}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <div>
                <p className="font-medium text-slate-700">
                  {item.item}
                </p>

                {item.quantity !== 1 && (
                  <p className="text-xs text-slate-400">
                    {item.quantity} × KSh{" "}
                    {item.unitPrice.toLocaleString()}
                  </p>
                )}
              </div>

              <p className="font-medium text-slate-700">
                KSh {item.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="my-5 border-t border-slate-200" />

        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#061F35]">
            Estimated total
          </span>

          <span className="text-xl font-bold text-blue-700">
            KSh {pricing.totalAmount.toLocaleString()}
          </span>
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          This is an estimated price based on the information
          provided. The final price may vary if additional
          requirements are identified.
        </p>
      </div>
    </div>
  );
}
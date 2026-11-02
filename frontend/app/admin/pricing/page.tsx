
"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardShell from "@/components/dashboard/DashboardShell";

import {
  getPricingRules,
  updatePricingRule,
  updatePricingRuleStatus,
} from "@/lib/pricing";

import type {
  PricingCategory,
  PricingRule,
} from "@/types/pricing";

const categoryConfig: Record<
  PricingCategory,
  {
    title: string;
    description: string;
    accent: string;
    soft: string;
    border: string;
    text: string;
    badge: string;
    icon: string;
  }
> = {
  CLEANING: {
    title: "Cleaning",
    description: "Pricing rules for cleaning service calculations.",
    accent: "bg-emerald-600",
    soft: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
    icon: "✦",
  },
  MOVING: {
    title: "Moving",
    description: "Pricing rules for moving service calculations.",
    accent: "bg-amber-500",
    soft: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700",
    icon: "↗",
  },
  ELECTRICAL: {
    title: "Electrical",
    description: "Pricing rules for electrical service calculations.",
    accent: "bg-indigo-600",
    soft: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    badge: "bg-indigo-100 text-indigo-700",
    icon: "ϟ",
  },
};

function formatRuleName(name: string) {
  return name
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCurrency(value: string | number) {
  return `KSh ${Number(value).toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function SummaryCard({
  label,
  value,
  description,
  accent,
}: {
  label: string;
  value: number;
  description: string;
  accent: string;
}) {
  return (
    <div className="relative min-w-0 border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      <div className={`absolute inset-y-0 left-0 w-1 ${accent}`} />
      <div className="pl-2">
        <p className="text-[11px] font-medium text-gray-500 sm:text-xs">
          {label}
        </p>
        <p className="mt-1 text-xl font-bold tabular-nums text-[#061F35] sm:text-2xl">
          {value}
        </p>
        <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function AdminPricingPage() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  async function loadRules() {
    try {
      setLoading(true);
      setError("");

      const data = await getPricingRules();
      setRules(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load pricing rules"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRules();
  }, []);

  const groupedRules = useMemo(() => {
    return {
      CLEANING: rules.filter((rule) => rule.category === "CLEANING"),
      MOVING: rules.filter((rule) => rule.category === "MOVING"),
      ELECTRICAL: rules.filter((rule) => rule.category === "ELECTRICAL"),
    };
  }, [rules]);

  const activeCount = rules.filter((rule) => rule.isActive).length;
  const inactiveCount = rules.length - activeCount;

  function openEdit(rule: PricingRule) {
    setEditingRule(rule);
    setEditPrice(String(rule.unitPrice));
    setError("");
    setSuccessMessage("");
  }

  function closeEdit() {
    if (saving) return;

    setEditingRule(null);
    setEditPrice("");
  }

  async function handleSavePrice() {
    if (!editingRule) return;

    const numericPrice = Number(editPrice);

    if (!Number.isFinite(numericPrice)) {
      setError("Please enter a valid price.");
      return;
    }

    if (numericPrice < 0) {
      setError("Price cannot be negative.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedRule = await updatePricingRule(editingRule.id, {
        unitPrice: numericPrice,
      });

      setRules((currentRules) =>
        currentRules.map((rule) =>
          rule.id === updatedRule.id ? updatedRule : rule
        )
      );

      setEditingRule(null);
      setEditPrice("");

      setSuccessMessage(
        `${formatRuleName(updatedRule.name)} price updated successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update pricing rule"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(rule: PricingRule) {
    try {
      setUpdatingStatus(rule.id);
      setError("");
      setSuccessMessage("");

      const updatedRule = await updatePricingRuleStatus(
        rule.id,
        !rule.isActive
      );

      setRules((currentRules) =>
        currentRules.map((currentRule) =>
          currentRule.id === updatedRule.id ? updatedRule : currentRule
        )
      );

      setSuccessMessage(
        `${formatRuleName(updatedRule.name)} ${
          updatedRule.isActive ? "activated" : "deactivated"
        } successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update pricing rule status"
      );
    } finally {
      setUpdatingStatus(null);
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-5 pb-4 sm:space-y-7">
        {/* Page heading */}
        <div className="border border-[#061F35] bg-[#061F35] px-4 py-4 sm:px-5 sm:py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">
            HomeServe Management
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
            Pricing Rules
          </h1>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-blue-100 sm:text-sm">
            Configure unit prices used by the HomeServe service calculation
            engine.
          </p>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="flex items-start gap-2 border border-green-200 bg-green-50 px-3 py-3 text-xs text-green-700 sm:text-sm">
            <span className="font-bold">✓</span>
            <p className="min-w-0 flex-1">{successMessage}</p>
            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              className="shrink-0 font-semibold"
              aria-label="Dismiss success message"
            >
              ✕
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 border border-red-200 bg-red-50 px-3 py-3 text-xs text-red-700 sm:text-sm">
            <span className="font-bold">!</span>
            <p className="min-w-0 flex-1">{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 font-semibold"
              aria-label="Dismiss error message"
            >
              ✕
            </button>
          </div>
        )}

        {/* Summary */}
        {!loading && !error && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            <SummaryCard
              label="Total Rules"
              value={rules.length}
              description="All pricing rules"
              accent="bg-[#061F35]"
            />
            <SummaryCard
              label="Active Rules"
              value={activeCount}
              description="Currently in use"
              accent="bg-emerald-500"
            />
            <div className="col-span-2 sm:col-span-1">
              <SummaryCard
                label="Inactive Rules"
                value={inactiveCount}
                description="Currently disabled"
                accent="bg-gray-400"
              />
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 border border-gray-200 bg-white p-6">
            <div className="h-6 w-6 animate-spin border-2 border-gray-200 border-t-[#061F35]" />
            <p className="text-xs text-gray-500 sm:text-sm">
              Loading pricing rules...
            </p>
          </div>
        )}

        {/* Pricing categories */}
        {!loading &&
          !error &&
          (Object.keys(categoryConfig) as PricingCategory[]).map(
            (category) => {
              const config = categoryConfig[category];
              const categoryRules = groupedRules[category];
              const categoryActive = categoryRules.filter(
                (rule) => rule.isActive
              ).length;

              return (
                <section key={category} className="space-y-3 sm:space-y-4">
                  {/* Category heading */}
                  <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center text-lg font-bold text-white ${config.accent}`}
                      >
                        {config.icon}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold text-[#061F35] sm:text-base">
                          {config.title}
                        </h2>
                        <p className="text-[10px] text-gray-500 sm:text-xs">
                          {config.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold tabular-nums text-[#061F35]">
                        {categoryRules.length}
                      </p>
                      <p className="text-[9px] text-gray-400 sm:text-[10px]">
                        {categoryActive} active
                      </p>
                    </div>
                  </div>

                  {categoryRules.length === 0 ? (
                    <div className="border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
                      <p className="text-xs text-gray-500">
                        No {config.title.toLowerCase()} pricing rules found.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-hidden border border-gray-200 bg-white shadow-sm">
                      {/* Desktop table */}
                      <div className="hidden overflow-x-auto md:block">
                        <table className="w-full text-left">
                          <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Rule
                              </th>
                              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Unit
                              </th>
                              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Price
                              </th>
                              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Status
                              </th>
                              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Actions
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-100">
                            {categoryRules.map((rule) => (
                              <tr
                                key={rule.id}
                                className="transition hover:bg-gray-50"
                              >
                                <td className="px-5 py-4">
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={`mt-1 h-7 w-1 shrink-0 ${config.accent}`}
                                    />
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-gray-900">
                                        {formatRuleName(rule.name)}
                                      </p>
                                      {rule.description && (
                                        <p className="mt-1 max-w-md text-xs leading-relaxed text-gray-500">
                                          {rule.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                <td className="px-5 py-4 text-sm text-gray-600">
                                  {rule.unit}
                                </td>

                                <td className="px-5 py-4">
                                  <span className="text-sm font-bold text-[#061F35]">
                                    {formatCurrency(rule.unitPrice)}
                                  </span>
                                </td>

                                <td className="px-5 py-4">
                                  <span
                                    className={`inline-flex px-2.5 py-1 text-xs font-semibold ${
                                      rule.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {rule.isActive ? "Active" : "Inactive"}
                                  </span>
                                </td>

                                <td className="px-5 py-4">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => openEdit(rule)}
                                      className="border border-gray-200 px-3 py-2 text-xs font-semibold text-[#061F35] transition hover:bg-gray-50"
                                    >
                                      Edit price
                                    </button>

                                    <button
                                      type="button"
                                      disabled={updatingStatus === rule.id}
                                      onClick={() => handleToggleStatus(rule)}
                                      className={`px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                        rule.isActive
                                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                          : "bg-green-600 text-white hover:bg-green-700"
                                      }`}
                                    >
                                      {updatingStatus === rule.id
                                        ? "Updating..."
                                        : rule.isActive
                                          ? "Disable"
                                          : "Enable"}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile two-column cards */}
                      <div className="grid grid-cols-2 gap-px bg-gray-200 md:hidden">
                        {categoryRules.map((rule) => (
                          <article
                            key={rule.id}
                            className="flex min-w-0 flex-col bg-white p-3"
                          >
                            <div className={`-mx-3 -mt-3 mb-3 h-1 ${config.accent}`} />

                            <div className="flex min-w-0 flex-col items-start gap-2">
                              <span
                                className={`inline-flex px-2 py-1 text-[9px] font-semibold ${
                                  rule.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {rule.isActive ? "Active" : "Inactive"}
                              </span>

                              <h3 className="w-full break-words text-xs font-bold leading-snug text-[#061F35]">
                                {formatRuleName(rule.name)}
                              </h3>
                            </div>

                            {rule.description && (
                              <p className="mt-1 line-clamp-2 break-words text-[10px] leading-relaxed text-gray-500">
                                {rule.description}
                              </p>
                            )}

                            <div className={`mt-3 space-y-2 border-t ${config.border} pt-2`}>
                              <div className="min-w-0">
                                <p className="text-[9px] uppercase tracking-wide text-gray-400">
                                  Unit
                                </p>
                                <p className="break-words text-[11px] font-medium text-gray-700">
                                  {rule.unit}
                                </p>
                              </div>

                              <div className="min-w-0">
                                <p className="text-[9px] uppercase tracking-wide text-gray-400">
                                  Unit price
                                </p>
                                <p className={`break-words text-sm font-bold ${config.text}`}>
                                  {formatCurrency(rule.unitPrice)}
                                </p>
                              </div>
                            </div>

                            <div className="mt-auto grid grid-cols-1 gap-2 pt-3">
                              <button
                                type="button"
                                onClick={() => openEdit(rule)}
                                className="border border-gray-200 px-2 py-2 text-[10px] font-semibold text-[#061F35] transition hover:bg-gray-50"
                              >
                                Edit price
                              </button>

                              <button
                                type="button"
                                disabled={updatingStatus === rule.id}
                                onClick={() => handleToggleStatus(rule)}
                                className={`px-2 py-2 text-[10px] font-semibold transition disabled:opacity-50 ${
                                  rule.isActive
                                    ? "bg-gray-100 text-gray-700"
                                    : "bg-green-600 text-white"
                                }`}
                              >
                                {updatingStatus === rule.id
                                  ? "Updating..."
                                  : rule.isActive
                                    ? "Disable"
                                    : "Enable"}
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              );
            }
          )}

        {/* Information note */}
        {!loading && !error && (
          <div className="flex gap-3 border border-blue-200 bg-blue-50 p-3 sm:p-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-blue-100 text-sm font-bold text-blue-700">
              i
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-blue-900">
                Pricing configuration
              </h3>
              <p className="mt-1 text-[10px] leading-relaxed text-blue-800 sm:text-xs">
                Changes to active pricing rules may affect how new service
                bookings are calculated. Disabled rules are excluded from
                active pricing calculations.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Edit price modal */}
      {editingRule && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 px-0 sm:items-center sm:px-4"
          onClick={closeEdit}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pricing-modal-title"
            className="w-full max-w-md border border-gray-200 bg-white p-5 shadow-xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                  Pricing configuration
                </p>
                <h2
                  id="pricing-modal-title"
                  className="mt-1 text-lg font-bold text-[#061F35]"
                >
                  Edit Pricing Rule
                </h2>
                <p className="mt-1 break-words text-xs text-gray-500">
                  {formatRuleName(editingRule.name)} · {editingRule.unit}
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="shrink-0 border border-gray-200 px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                aria-label="Close edit dialog"
              >
                ✕
              </button>
            </div>

            <div>
              <label
                htmlFor="pricing-price"
                className="mb-2 block text-xs font-semibold text-gray-700"
              >
                Unit Price (KSh)
              </label>

              <input
                id="pricing-price"
                type="number"
                min="0"
                step="0.01"
                value={editPrice}
                onChange={(event) => setEditPrice(event.target.value)}
                className="w-full border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-[#061F35]/10"
                placeholder="Enter price"
              />

              <p className="mt-2 text-[10px] text-gray-400">
                Enter the new unit price for this pricing rule.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={closeEdit}
                className="border border-gray-200 px-4 py-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleSavePrice}
                className="bg-[#061F35] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#082B49] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Price"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

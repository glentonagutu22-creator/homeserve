"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  }
> = {
  CLEANING: {
    title: "Cleaning",
    description:
      "Pricing rules used when calculating cleaning services.",
  },
  MOVING: {
    title: "Moving",
    description:
      "Pricing rules used when calculating moving services.",
  },
  ELECTRICAL: {
    title: "Electrical",
    description:
      "Pricing rules used when calculating electrical services.",
  },
};

function formatRuleName(name: string) {
  return name
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatCurrency(value: string | number) {
  return `KSh ${Number(value).toLocaleString(
    "en-KE",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  )}`;
}

export default function AdminPricingPage() {
  const [rules, setRules] = useState<PricingRule[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingRule, setEditingRule] =
    useState<PricingRule | null>(null);

  const [editPrice, setEditPrice] =
    useState("");

  const [saving, setSaving] = useState(false);

  const [updatingStatus, setUpdatingStatus] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState("");

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
      CLEANING: rules.filter(
        (rule) => rule.category === "CLEANING"
      ),
      MOVING: rules.filter(
        (rule) => rule.category === "MOVING"
      ),
      ELECTRICAL: rules.filter(
        (rule) => rule.category === "ELECTRICAL"
      ),
    };
  }, [rules]);

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
      setError(
        "Price cannot be negative."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedRule =
        await updatePricingRule(
          editingRule.id,
          {
            unitPrice: numericPrice,
          }
        );

      setRules((currentRules) =>
        currentRules.map((rule) =>
          rule.id === updatedRule.id
            ? updatedRule
            : rule
        )
      );

      setEditingRule(null);
      setEditPrice("");

      setSuccessMessage(
        `${formatRuleName(
          updatedRule.name
        )} price updated successfully.`
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

  async function handleToggleStatus(
    rule: PricingRule
  ) {
    try {
      setUpdatingStatus(rule.id);
      setError("");
      setSuccessMessage("");

      const updatedRule =
        await updatePricingRuleStatus(
          rule.id,
          !rule.isActive
        );

      setRules((currentRules) =>
        currentRules.map((currentRule) =>
          currentRule.id === updatedRule.id
            ? updatedRule
            : currentRule
        )
      );

      setSuccessMessage(
        `${formatRuleName(
          updatedRule.name
        )} ${
          updatedRule.isActive
            ? "activated"
            : "deactivated"
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
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#061F35]">
            Pricing
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the pricing rules used by
            HomeServe's calculation engine.
          </p>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Summary */}
        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Total Rules
              </p>

              <p className="mt-2 text-2xl font-bold text-[#061F35]">
                {rules.length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Active Rules
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {
                  rules.filter(
                    (rule) => rule.isActive
                  ).length
                }
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Inactive Rules
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-500">
                {
                  rules.filter(
                    (rule) => !rule.isActive
                  ).length
                }
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Loading pricing rules...
          </div>
        )}

        {/* Pricing categories */}
        {!loading &&
          !error &&
          (
            Object.keys(
              categoryConfig
            ) as PricingCategory[]
          ).map((category) => {
            const config =
              categoryConfig[category];

            const categoryRules =
              groupedRules[category];

            return (
              <section
                key={category}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-lg font-semibold text-[#061F35]">
                    {config.title}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {config.description}
                  </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
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
                        {categoryRules.map(
                          (rule) => (
                            <tr
                              key={rule.id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-5 py-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {formatRuleName(
                                      rule.name
                                    )}
                                  </p>

                                  {rule.description && (
                                    <p className="mt-1 max-w-md text-xs text-gray-500">
                                      {
                                        rule.description
                                      }
                                    </p>
                                  )}
                                </div>
                              </td>

                              <td className="px-5 py-4 text-sm text-gray-600">
                                {rule.unit}
                              </td>

                              <td className="px-5 py-4">
                                <span className="font-semibold text-[#061F35]">
                                  {formatCurrency(
                                    rule.unitPrice
                                  )}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                    rule.isActive
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {rule.isActive
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openEdit(
                                        rule
                                      )
                                    }
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-[#061F35] transition hover:bg-gray-50"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      updatingStatus ===
                                      rule.id
                                    }
                                    onClick={() =>
                                      handleToggleStatus(
                                        rule
                                      )
                                    }
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                      rule.isActive
                                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        : "bg-green-600 text-white hover:bg-green-700"
                                    }`}
                                  >
                                    {updatingStatus ===
                                    rule.id
                                      ? "Updating..."
                                      : rule.isActive
                                      ? "Disable"
                                      : "Enable"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="divide-y divide-gray-100 md:hidden">
                    {categoryRules.map(
                      (rule) => (
                        <div
                          key={rule.id}
                          className="space-y-4 p-5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {formatRuleName(
                                  rule.name
                                )}
                              </h3>

                              {rule.description && (
                                <p className="mt-1 text-xs text-gray-500">
                                  {
                                    rule.description
                                  }
                                </p>
                              )}
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                                rule.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {rule.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">
                                Unit
                              </p>

                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {rule.unit}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500">
                                Price
                              </p>

                              <p className="mt-1 text-sm font-semibold text-[#061F35]">
                                {formatCurrency(
                                  rule.unitPrice
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openEdit(
                                  rule
                                )
                              }
                              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-[#061F35] hover:bg-gray-50"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              disabled={
                                updatingStatus ===
                                rule.id
                              }
                              onClick={() =>
                                handleToggleStatus(
                                  rule
                                )
                              }
                              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-50 ${
                                rule.isActive
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-green-600 text-white"
                              }`}
                            >
                              {updatingStatus ===
                              rule.id
                                ? "Updating..."
                                : rule.isActive
                                ? "Disable"
                                : "Enable"}
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </section>
            );
          })}

        {/* Edit modal */}
        {editingRule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#061F35]">
                  Edit Pricing Rule
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {formatRuleName(
                    editingRule.name
                  )}{" "}
                  · {editingRule.unit}
                </p>
              </div>

              <div>
                <label
                  htmlFor="pricing-price"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Unit Price (KSh)
                </label>

                <input
                  id="pricing-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editPrice}
                  onChange={(event) =>
                    setEditPrice(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-[#061F35]/10"
                  placeholder="Enter price"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={closeEdit}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSavePrice}
                  className="rounded-lg bg-[#061F35] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#082B49] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Price"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
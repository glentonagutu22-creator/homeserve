"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import DashboardShell from "@/components/dashboard/DashboardShell";

import {
  getServices,
  updateService,
  updateServiceStatus,
} from "@/lib/pricing";

import type { Service } from "@/lib/pricing";

type ServiceCategory =
  | "CLEANING"
  | "MOVING"
  | "ELECTRICAL";

type PricingType =
  | "FIXED"
  | "CALCULATED"
  | "QUOTE";

const categoryConfig: Record<
  ServiceCategory,
  {
    title: string;
    description: string;
  }
> = {
  CLEANING: {
    title: "Cleaning",
    description:
      "Professional cleaning services available through HomeServe.",
  },

  MOVING: {
    title: "Moving",
    description:
      "Moving, packing and transportation services.",
  },

  ELECTRICAL: {
    title: "Electrical",
    description:
      "Electrical installation, inspection and repair services.",
  },
};

function formatCurrency(
  value: string | number | null
) {
  if (value === null || value === undefined) {
    return "Quote";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "—";
  }

  return `KSh ${numericValue.toLocaleString(
    "en-KE",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  )}`;
}

function formatDuration(
  duration: number | null
) {
  if (!duration) {
    return "—";
  }

  if (duration < 60) {
    return `${duration} min`;
  }

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

function formatPricingType(
  pricingType: PricingType
) {
  switch (pricingType) {
    case "FIXED":
      return "Fixed";

    case "CALCULATED":
      return "Calculated";

    case "QUOTE":
      return "Quote";

    default:
      return pricingType;
  }
}

function pricingTypeClass(
  pricingType: PricingType
) {
  switch (pricingType) {
    case "FIXED":
      return "bg-gray-100 text-gray-700";

    case "CALCULATED":
      return "bg-blue-100 text-blue-700";

    case "QUOTE":
      return "bg-amber-100 text-amber-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function AdminServicesPage() {
  const [services, setServices] =
    useState<Service[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState<"ALL" | ServiceCategory>("ALL");

  const [editingService, setEditingService] =
    useState<Service | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [updatingStatus, setUpdatingStatus] =
    useState<string | null>(null);

  async function loadServices() {
    try {
      setLoading(true);
      setError("");

      const data = await getServices();

      setServices(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load services"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  const groupedServices = useMemo(() => {
    return {
      CLEANING: services.filter(
        (service) =>
          service.category === "CLEANING"
      ),

      MOVING: services.filter(
        (service) =>
          service.category === "MOVING"
      ),

      ELECTRICAL: services.filter(
        (service) =>
          service.category === "ELECTRICAL"
      ),
    };
  }, [services]);

  const visibleServices =
    useMemo(() => {
      if (selectedCategory === "ALL") {
        return services;
      }

      return services.filter(
        (service) =>
          service.category ===
          selectedCategory
      );
    }, [
      services,
      selectedCategory,
    ]);

  const categories: ServiceCategory[] = [
    "CLEANING",
    "MOVING",
    "ELECTRICAL",
  ];

  function openEdit(service: Service) {
    setEditingService(service);
    setError("");
    setSuccessMessage("");
  }

  function closeEdit() {
    if (saving) return;

    setEditingService(null);
  }

  async function handleUpdate(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editingService) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const formData =
        new FormData(event.currentTarget);

      const name = String(
        formData.get("name") ?? ""
      ).trim();

      const description = String(
        formData.get("description") ?? ""
      ).trim();

      const pricingType =
        formData.get("pricingType") as PricingType;

      const basePriceValue = String(
        formData.get("basePrice") ?? ""
      ).trim();

      const durationValue = String(
        formData.get("duration") ?? ""
      ).trim();

      const basePrice =
        basePriceValue === ""
          ? null
          : Number(basePriceValue);

      const duration =
        durationValue === ""
          ? null
          : Number(durationValue);

      if (!name) {
        setError(
          "Service name is required."
        );
        return;
      }

      if (
        basePrice !== null &&
        (!Number.isFinite(basePrice) ||
          basePrice < 0)
      ) {
        setError(
          "Please enter a valid base price."
        );
        return;
      }

      if (
        duration !== null &&
        (!Number.isInteger(duration) ||
          duration <= 0)
      ) {
        setError(
          "Duration must be a positive whole number."
        );
        return;
      }

      const updatedService =
        await updateService(
          editingService.id,
          {
            name,
            description:
              description || null,
            pricingType,
            basePrice,
            duration,
          }
        );

      setServices((currentServices) =>
        currentServices.map((service) =>
          service.id ===
          updatedService.id
            ? updatedService
            : service
        )
      );

      setEditingService(null);

      setSuccessMessage(
        `${updatedService.name} updated successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update service"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(
    service: Service
  ) {
    try {
      setUpdatingStatus(service.id);
      setError("");
      setSuccessMessage("");

      const updatedService =
        await updateServiceStatus(
          service.id,
          !service.isActive
        );

      setServices((currentServices) =>
        currentServices.map(
          (currentService) =>
            currentService.id ===
            updatedService.id
              ? updatedService
              : currentService
        )
      );

      setSuccessMessage(
        `${updatedService.name} ${
          updatedService.isActive
            ? "activated"
            : "deactivated"
        } successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update service status"
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
            Services
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the service offerings available
            across HomeServe.
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
        {!loading && (
          <div className="grid gap-4 sm:grid-cols-3">
            {categories.map(
              (category) => {
                const categoryServices =
                  groupedServices[
                    category
                  ];

                const activeCount =
                  categoryServices.filter(
                    (service) =>
                      service.isActive
                  ).length;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory ===
                          category
                          ? "ALL"
                          : category
                      )
                    }
                    className={`rounded-xl border bg-white p-5 text-left shadow-sm transition ${
                      selectedCategory ===
                      category
                        ? "border-blue-500 ring-2 ring-blue-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          {
                            categoryConfig[
                              category
                            ].title
                          }
                        </p>

                        <p className="mt-2 text-2xl font-bold text-[#061F35]">
                          {
                            categoryServices.length
                          }
                        </p>
                      </div>

                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                        {activeCount} active
                      </span>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-gray-500">
                      {
                        categoryConfig[
                          category
                        ].description
                      }
                    </p>
                  </button>
                );
              }
            )}
          </div>
        )}

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setSelectedCategory("ALL")
            }
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              selectedCategory === "ALL"
                ? "bg-[#061F35] text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Services
          </button>

          {categories.map(
            (category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  selectedCategory ===
                  category
                    ? "bg-[#061F35] text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {
                  categoryConfig[
                    category
                  ].title
                }
              </button>
            )
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Loading services...
          </div>
        )}

        {/* Services */}
        {!loading &&
          visibleServices.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
              No services found.
            </div>
          )}

        {!loading &&
          visibleServices.length > 0 && (
            <div className="space-y-8">
              {(
                Object.keys(
                  categoryConfig
                ) as ServiceCategory[]
              )
                .filter(
                  (category) =>
                    selectedCategory ===
                      "ALL" ||
                    selectedCategory ===
                      category
                )
                .map((category) => {
                  const categoryServices =
                    groupedServices[
                      category
                    ];

                  if (
                    categoryServices.length ===
                    0
                  ) {
                    return null;
                  }

                  const config =
                    categoryConfig[
                      category
                    ];

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

                      {/* Desktop */}
                      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead className="border-b border-gray-200 bg-gray-50">
                              <tr>
                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Service
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Pricing
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Base Price
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Duration
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
                              {categoryServices.map(
                                (
                                  service
                                ) => (
                                  <tr
                                    key={
                                      service.id
                                    }
                                    className="hover:bg-gray-50"
                                  >
                                    <td className="px-5 py-4">
                                      <div>
                                        <p className="font-medium text-gray-900">
                                          {
                                            service.name
                                          }
                                        </p>

                                        {service.description && (
                                          <p className="mt-1 max-w-md text-xs text-gray-500">
                                            {
                                              service.description
                                            }
                                          </p>
                                        )}
                                      </div>
                                    </td>

                                    <td className="px-5 py-4">
                                      <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${pricingTypeClass(
                                          service.pricingType
                                        )}`}
                                      >
                                        {formatPricingType(
                                          service.pricingType
                                        )}
                                      </span>
                                    </td>

                                    <td className="px-5 py-4">
                                      <span className="font-semibold text-[#061F35]">
                                        {formatCurrency(
                                          service.basePrice
                                        )}
                                      </span>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-600">
                                      {formatDuration(
                                        service.duration
                                      )}
                                    </td>

                                    <td className="px-5 py-4">
                                      <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                          service.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                      >
                                        {service.isActive
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
                                              service
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
                                            service.id
                                          }
                                          onClick={() =>
                                            handleToggleStatus(
                                              service
                                            )
                                          }
                                          className={`rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                            service.isActive
                                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                              : "bg-green-600 text-white hover:bg-green-700"
                                          }`}
                                        >
                                          {updatingStatus ===
                                          service.id
                                            ? "Updating..."
                                            : service.isActive
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
                      </div>

                      {/* Mobile */}
                      <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:hidden">
                        {categoryServices.map(
                          (service) => (
                            <div
                              key={
                                service.id
                              }
                              className="space-y-4 p-5"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    {
                                      service.name
                                    }
                                  </h3>

                                  {service.description && (
                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                      {
                                        service.description
                                      }
                                    </p>
                                  )}
                                </div>

                                <span
                                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                                    service.isActive
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {service.isActive
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Pricing
                                  </p>

                                  <p className="mt-1 text-sm font-medium text-gray-900">
                                    {formatPricingType(
                                      service.pricingType
                                    )}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-gray-500">
                                    Base Price
                                  </p>

                                  <p className="mt-1 text-sm font-semibold text-[#061F35]">
                                    {formatCurrency(
                                      service.basePrice
                                    )}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-gray-500">
                                    Duration
                                  </p>

                                  <p className="mt-1 text-sm font-medium text-gray-900">
                                    {formatDuration(
                                      service.duration
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    openEdit(
                                      service
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
                                    service.id
                                  }
                                  onClick={() =>
                                    handleToggleStatus(
                                      service
                                    )
                                  }
                                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-50 ${
                                    service.isActive
                                      ? "bg-gray-100 text-gray-700"
                                      : "bg-green-600 text-white"
                                  }`}
                                >
                                  {updatingStatus ===
                                  service.id
                                    ? "Updating..."
                                    : service.isActive
                                    ? "Disable"
                                    : "Enable"}
                                </button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </section>
                  );
                })}
            </div>
          )}

        {/* Important note */}
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="text-xs leading-5 text-blue-800">
            <span className="font-semibold">
              Service catalog:
            </span>{" "}
            Services are not deleted. Deactivating a
            service prevents it from being used for
            new bookings while preserving existing
            booking history.
          </p>
        </div>
      </div>

      {/* Edit modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* Modal header */}
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Edit Service
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-[#061F35]">
                    {editingService.name}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeEdit}
                  disabled={saving}
                  className="rounded-lg p-2 text-xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleUpdate}
              className="space-y-5 p-6"
            >
              <div>
                <label
                  htmlFor="service-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Service Name
                </label>

                <input
                  id="service-name"
                  name="name"
                  type="text"
                  defaultValue={
                    editingService.name
                  }
                  required
                  minLength={2}
                  maxLength={100}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-[#061F35]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="service-description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="service-description"
                  name="description"
                  defaultValue={
                    editingService.description ??
                    ""
                  }
                  rows={4}
                  maxLength={1000}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-[#061F35]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="service-pricing-type"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Pricing Type
                </label>

                <select
                  id="service-pricing-type"
                  name="pricingType"
                  defaultValue={
                    editingService.pricingType
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-[#061F35]/10"
                >
                  <option value="FIXED">
                    Fixed
                  </option>

                  <option value="CALCULATED">
                    Calculated
                  </option>

                  <option value="QUOTE">
                    Quote
                  </option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="service-base-price"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Base Price (KSh)
                  </label>

                  <input
                    id="service-base-price"
                    name="basePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={
                      editingService.basePrice ??
                      ""
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-[#061F35]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="service-duration"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Duration (minutes)
                  </label>

                  <input
                    id="service-duration"
                    name="duration"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={
                      editingService.duration ??
                      ""
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-[#061F35]/10"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  disabled={saving}
                  onClick={closeEdit}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#061F35] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#082B49] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
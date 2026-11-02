

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
    shortDescription: string;
    symbol: string;
    card: string;
    border: string;
    accent: string;
    icon: string;
    badge: string;
    button: string;
    selected: string;
  }
> = {
  CLEANING: {
    title: "Cleaning",
    description:
      "A cleaner, healthier space starts with the right care. Explore and manage professional cleaning services offered through HomeServe.",
    shortDescription: "Fresh spaces. Professional care.",
    symbol: "✦",
    card: "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
    border: "border-emerald-200",
    accent: "text-emerald-700",
    icon: "bg-emerald-100 text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
    button:
      "border-emerald-200 text-emerald-800 hover:bg-emerald-50",
    selected:
      "border-emerald-400 ring-2 ring-emerald-100",
  },
  MOVING: {
    title: "Moving",
    description:
      "From packing to transportation, make every move simpler. Manage the services that help customers move with confidence.",
    shortDescription: "Every move, made easier.",
    symbol: "↗",
    card: "bg-gradient-to-br from-amber-50 via-white to-orange-50",
    border: "border-amber-200",
    accent: "text-amber-700",
    icon: "bg-amber-100 text-amber-700",
    badge: "bg-amber-100 text-amber-700",
    button:
      "border-amber-200 text-amber-800 hover:bg-amber-50",
    selected:
      "border-amber-400 ring-2 ring-amber-100",
  },
  ELECTRICAL: {
    title: "Electrical",
    description:
      "Reliable electrical solutions for safer, smarter spaces. Maintain the services customers depend on for installations and repairs.",
    shortDescription: "Powering safer spaces.",
    symbol: "ϟ",
    card: "bg-gradient-to-br from-indigo-50 via-white to-violet-50",
    border: "border-indigo-200",
    accent: "text-indigo-700",
    icon: "bg-indigo-100 text-indigo-700",
    badge: "bg-indigo-100 text-indigo-700",
    button:
      "border-indigo-200 text-indigo-800 hover:bg-indigo-50",
    selected:
      "border-indigo-400 ring-2 ring-indigo-100",
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

  return `KSh ${numericValue.toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatDuration(duration: number | null) {
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

function formatPricingType(pricingType: PricingType) {
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

function pricingTypeClass(pricingType: PricingType) {
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
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState<"ALL" | ServiceCategory>("ALL");

  const [editingService, setEditingService] =
    useState<Service | null>(null);

  const [saving, setSaving] = useState(false);
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
        (service) => service.category === "CLEANING"
      ),
      MOVING: services.filter(
        (service) => service.category === "MOVING"
      ),
      ELECTRICAL: services.filter(
        (service) => service.category === "ELECTRICAL"
      ),
    };
  }, [services]);

  const visibleServices = useMemo(() => {
    if (selectedCategory === "ALL") {
      return services;
    }

    return services.filter(
      (service) => service.category === selectedCategory
    );
  }, [services, selectedCategory]);

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

      const formData = new FormData(event.currentTarget);

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
        setError("Service name is required.");
        return;
      }

      if (
        basePrice !== null &&
        (!Number.isFinite(basePrice) || basePrice < 0)
      ) {
        setError("Please enter a valid base price.");
        return;
      }

      if (
        duration !== null &&
        (!Number.isInteger(duration) || duration <= 0)
      ) {
        setError(
          "Duration must be a positive whole number."
        );
        return;
      }

      const updatedService = await updateService(
        editingService.id,
        {
          name,
          description: description || null,
          pricingType,
          basePrice,
          duration,
        }
      );

      setServices((currentServices) =>
        currentServices.map((service) =>
          service.id === updatedService.id
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

  async function handleToggleStatus(service: Service) {
    try {
      setUpdatingStatus(service.id);
      setError("");
      setSuccessMessage("");

      const updatedService = await updateServiceStatus(
        service.id,
        !service.isActive
      );

      setServices((currentServices) =>
        currentServices.map((currentService) =>
          currentService.id === updatedService.id
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
      <div className="space-y-6 sm:space-y-8">

        {/* Premium page introduction */}
        {/* Page Heading */}
<div className="rounded-none border border-[#061F35] bg-[#061F35] px-4 py-4 sm:px-5 sm:py-5">
  <div className="flex flex-col gap-2">
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">
      HomeServe Management
    </p>

    <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
      Our Services
    </h1>

    <p className="max-w-2xl text-xs leading-relaxed text-blue-100 sm:text-sm">
      Manage service offerings, pricing, availability and durations across
      HomeServe.
    </p>
  </div>
</div>

        {/* Feedback messages */}
        {successMessage && (
          <div
            role="status"
            className="rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-xs text-green-700 sm:px-4 sm:text-sm"
          >
            {successMessage}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs text-red-700 sm:px-4 sm:text-sm"
          >
            {error}
          </div>
        )}

        {/* Category overview */}
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#061F35] sm:text-lg">
                Service Categories
              </h2>
              <p className="mt-1 text-[11px] text-gray-500 sm:text-xs">
                Select a category to view its services.
              </p>
            </div>

            <span className="shrink-0 text-[10px] font-medium text-gray-400 sm:text-xs">
              {services.length} services
            </span>
          </div>

          {!loading && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {categories.map((category) => {
                const config = categoryConfig[category];
                const categoryServices =
                  groupedServices[category];

                const activeCount =
                  categoryServices.filter(
                    (service) => service.isActive
                  ).length;

                const isSelected =
                  selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        isSelected ? "ALL" : category
                      )
                    }
                    className={`group relative min-w-0 overflow-hidden rounded-2xl border p-3 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                      config.card
                    } ${
                      isSelected
                        ? config.selected
                        : config.border
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-xl sm:h-11 sm:w-11 sm:text-2xl ${config.icon}`}
                      >
                        {config.symbol}
                      </span>

                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-semibold sm:text-[10px] ${config.badge}`}
                      >
                        {activeCount} active
                      </span>
                    </div>

                    <div className="mt-4">
                      <p
                        className={`text-xs font-semibold sm:text-sm ${config.accent}`}
                      >
                        {config.title}
                      </p>

                      <p className="mt-1 text-2xl font-bold tracking-tight text-[#061F35] sm:text-3xl">
                        {categoryServices.length}
                      </p>

                      <p className="mt-1 text-[9px] leading-4 text-gray-500 sm:text-xs">
                        {config.shortDescription}
                      </p>
                    </div>

                    <div
                      className={`mt-3 flex items-center justify-between border-t border-black/5 pt-2 text-[10px] font-semibold sm:mt-4 sm:pt-3 sm:text-xs ${config.accent}`}
                    >
                      <span>
                        {isSelected ? "Selected" : "View category"}
                      </span>
                      <span className="text-sm transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Service catalogue heading and filters */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-[#061F35] sm:text-lg">
                Service Catalogue
              </h2>
              <p className="mt-1 text-[11px] text-gray-500 sm:text-xs">
                Manage individual offerings, prices and availability.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-3 py-2 text-[10px] font-medium text-gray-500 sm:self-auto sm:text-xs">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {services.filter((service) => service.isActive).length} active
              <span className="text-gray-300">/</span>
              {services.length} total
            </div>
          </div>

          {/* Category filters */}
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                selectedCategory === "ALL"
                  ? "bg-[#061F35] text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              All Services
            </button>

            {categories.map((category) => {
              const config = categoryConfig[category];
              const isSelected =
                selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                    isSelected
                      ? `${config.badge} ${config.border}`
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {config.title}
                </button>
              );
            })}
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Loading services...
          </div>
        )}

        {/* Empty state */}
        {!loading && visibleServices.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-xl text-gray-400">
              ✦
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-700">
              No services found
            </p>
            <p className="mt-1 text-xs text-gray-500">
              There are currently no services in this category.
            </p>
          </div>
        )}

        {/* Services by category */}
        {!loading && visibleServices.length > 0 && (
          <div className="space-y-7 sm:space-y-9">
            {categories
              .filter(
                (category) =>
                  selectedCategory === "ALL" ||
                  selectedCategory === category
              )
              .map((category) => {
                const categoryServices =
                  groupedServices[category];

                if (categoryServices.length === 0) {
                  return null;
                }

                const config = categoryConfig[category];

                return (
                  <section
                    key={category}
                    className="space-y-3 sm:space-y-4"
                  >
                    {/* Category section heading */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${config.icon}`}
                      >
                        {config.symbol}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-[#061F35] sm:text-base">
                            {config.title}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${config.badge}`}
                          >
                            {categoryServices.length} offerings
                          </span>
                        </div>
                        <p className="mt-0.5 text-[10px] leading-4 text-gray-500 sm:text-xs">
                          {config.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Desktop table */}
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
                            {categoryServices.map((service) => (
                              <tr
                                key={service.id}
                                className="transition hover:bg-gray-50"
                              >
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={`h-9 w-1 shrink-0 rounded-full ${
                                        category === "CLEANING"
                                          ? "bg-emerald-400"
                                          : category === "MOVING"
                                            ? "bg-amber-400"
                                            : "bg-indigo-400"
                                      }`}
                                    />
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {service.name}
                                      </p>
                                      {service.description && (
                                        <p className="mt-1 max-w-md text-xs text-gray-500">
                                          {service.description}
                                        </p>
                                      )}
                                    </div>
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
                                        openEdit(service)
                                      }
                                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-[#061F35] transition hover:bg-gray-50"
                                    >
                                      Edit
                                    </button>

                                    <button
                                      type="button"
                                      disabled={
                                        updatingStatus === service.id
                                      }
                                      onClick={() =>
                                        handleToggleStatus(service)
                                      }
                                      className={`rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                        service.isActive
                                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                          : "bg-green-600 text-white hover:bg-green-700"
                                      }`}
                                    >
                                      {updatingStatus === service.id
                                        ? "Updating..."
                                        : service.isActive
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
                    </div>

                    {/* Mobile and tablet service cards */}
                    <div className="grid grid-cols-2 gap-2.5 md:hidden">
                      {categoryServices.map((service) => (
                        <article
                          key={service.id}
                          className={`relative flex min-w-0 flex-col overflow-hidden rounded-xl border p-3 shadow-sm transition duration-200 hover:shadow-md sm:p-4 ${config.card} ${config.border}`}
                        >
                          {/* Category colour accent */}
                          <div
                            className={`absolute left-0 top-0 h-1 w-full ${
                              category === "CLEANING"
                                ? "bg-emerald-500"
                                : category === "MOVING"
                                  ? "bg-amber-500"
                                  : "bg-indigo-500"
                            }`}
                          />

                          <div className="flex min-w-0 items-start justify-between gap-1 pt-1">
                            <span className="min-w-0 break-words text-xs font-bold leading-5 text-[#061F35] sm:text-sm">
                              {service.name}
                            </span>

                            <span
                              className={`shrink-0 rounded-full px-1.5 py-1 text-[8px] font-semibold sm:px-2 sm:text-[9px] ${
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

                          {service.description && (
                            <p className="mt-1 line-clamp-2 break-words text-[10px] leading-4 text-gray-500 sm:text-xs">
                              {service.description}
                            </p>
                          )}

                          <div className="mt-3 space-y-2 border-t border-black/5 pt-3">
                            <div className="min-w-0">
                              <p className="text-[9px] font-medium uppercase tracking-wide text-gray-500 sm:text-[10px]">
                                Pricing
                              </p>
                              <span
                                className={`mt-1 inline-flex max-w-full rounded-full px-2 py-1 text-[9px] font-medium sm:text-[10px] ${pricingTypeClass(
                                  service.pricingType
                                )}`}
                              >
                                {formatPricingType(
                                  service.pricingType
                                )}
                              </span>
                            </div>

                            <div className="min-w-0">
                              <p className="text-[9px] font-medium uppercase tracking-wide text-gray-500 sm:text-[10px]">
                                Base price
                              </p>
                              <p className={`mt-0.5 break-words text-xs font-bold sm:text-sm ${config.accent}`}>
                                {formatCurrency(
                                  service.basePrice
                                )}
                              </p>
                            </div>

                            <div className="min-w-0">
                              <p className="text-[9px] font-medium uppercase tracking-wide text-gray-500 sm:text-[10px]">
                                Duration
                              </p>
                              <p className="mt-0.5 break-words text-[11px] font-medium text-gray-700 sm:text-xs">
                                {formatDuration(
                                  service.duration
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="mt-auto flex flex-col gap-1.5 pt-3">
                            <button
                              type="button"
                              onClick={() => openEdit(service)}
                              className={`w-full rounded-lg border bg-white/70 px-2 py-2 text-[10px] font-semibold transition sm:text-xs ${config.button}`}
                            >
                              Edit service
                            </button>

                            <button
                              type="button"
                              disabled={
                                updatingStatus === service.id
                              }
                              onClick={() =>
                                handleToggleStatus(service)
                              }
                              className={`w-full rounded-lg px-2 py-2 text-[10px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs ${
                                service.isActive
                                  ? "bg-white/80 text-gray-700 hover:bg-white"
                                  : "bg-green-600 text-white hover:bg-green-700"
                              }`}
                            >
                              {updatingStatus === service.id
                                ? "Updating..."
                                : service.isActive
                                  ? "Disable"
                                  : "Enable"}
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
          </div>
        )}

        {/* Service catalogue note */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3 sm:px-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm text-blue-700">
            i
          </span>
          <p className="text-[10px] leading-5 text-blue-800 sm:text-xs">
            <span className="font-semibold">
              Good to know:
            </span>{" "}
            Services are not deleted. Deactivating a service
            prevents it from being used for new bookings while
            preserving existing booking history.
          </p>
        </div>
      </div>

      {/* Edit service modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
          <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-100 bg-white px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 sm:text-xs">
                  Service Management
                </p>
                <h2 className="mt-1 break-words text-base font-bold text-[#061F35] sm:text-lg">
                  Edit {editingService.name}
                </h2>
                <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                  Update the service details and pricing.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="shrink-0 rounded-lg p-2 text-xl leading-none text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Edit form */}
            <form
              onSubmit={handleUpdate}
              className="space-y-4 p-4 sm:space-y-5 sm:p-6"
            >
              <div>
                <label
                  htmlFor="service-name"
                  className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm"
                >
                  Service Name
                </label>
                <input
                  id="service-name"
                  name="name"
                  type="text"
                  defaultValue={editingService.name}
                  required
                  minLength={2}
                  maxLength={100}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-[#061F35]/10 sm:px-4 sm:py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="service-description"
                  className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm"
                >
                  Description
                </label>
                <textarea
                  id="service-description"
                  name="description"
                  defaultValue={
                    editingService.description ?? ""
                  }
                  rows={4}
                  maxLength={1000}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-[#061F35]/10 sm:px-4 sm:py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="service-pricing-type"
                  className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm"
                >
                  Pricing Type
                </label>
                <select
                  id="service-pricing-type"
                  name="pricingType"
                  defaultValue={editingService.pricingType}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-[#061F35]/10 sm:px-4 sm:py-3"
                >
                  <option value="FIXED">Fixed</option>
                  <option value="CALCULATED">Calculated</option>
                  <option value="QUOTE">Quote</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="min-w-0">
                  <label
                    htmlFor="service-base-price"
                    className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm"
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
                      editingService.basePrice ?? ""
                    }
                    className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-[#061F35]/10 sm:px-4 sm:py-3"
                  />
                </div>

                <div className="min-w-0">
                  <label
                    htmlFor="service-duration"
                    className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm"
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
                      editingService.duration ?? ""
                    }
                    className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#061F35] focus:ring-2 focus:ring-[#061F35]/10 sm:px-4 sm:py-3"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end sm:gap-3 sm:pt-5">
                <button
                  type="button"
                  disabled={saving}
                  onClick={closeEdit}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-lg bg-[#061F35] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#082B49] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

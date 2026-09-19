"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import { useSearchParams } from "next/navigation";

import BookingForm from "@/components/BookingForm";
import { getServicesByCategory } from "@/lib/services";
import type { Service } from "@/types/service";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/components/AuthProvider";

function ElectricalBookingContent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");

  const { user, loading: authLoading } =
    useAuth();

  const [service, setService] =
    useState<Service | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadService() {
      if (!serviceId) {
        setError(
          "No electrical service was selected."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const services =
          await getServicesByCategory(
            "electrical"
          );

        const selectedService =
          services.find(
            (item) => item.id === serviceId
          );

        if (!selectedService) {
          setError(
            "The selected electrical service was not found."
          );
          setLoading(false);
          return;
        }

        setService(selectedService);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load the electrical service."
        );
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [serviceId]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />

          <p className="text-sm text-slate-600">
            Loading booking...
          </p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    const content = (
      <div className="flex min-h-full items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-600">
            !
          </div>

          <h1 className="mt-5 text-xl font-bold text-[#061F35]">
            Unable to load booking
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error ||
              "The selected service could not be found."}
          </p>
        </div>
      </div>
    );

    return user ? (
      <DashboardShell>
        {content}
      </DashboardShell>
    ) : (
      content
    );
  }

  /*
   * Preserve the selected electrical service when
   * the customer temporarily leaves this page to
   * add an address.
   */
  const returnTo =
    `/book/electrical?service=${encodeURIComponent(
      service.id
    )}`;

  const content = (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Page header */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
            Electrical Services
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#061F35] sm:text-3xl">
            Book an Electrical Service
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Tell us what electrical service you need
            and provide a convenient date and location
            for our team.
          </p>
        </div>

        <BookingForm
          category="electrical"
          service={service}
          returnTo={returnTo}
        />

      </div>
    </div>
  );

  /*
   * Authenticated users keep the normal dashboard
   * layout.
   *
   * Unauthenticated users must be allowed to reach
   * BookingForm so it can display the login-required
   * notice instead of being redirected immediately.
   */
  return user ? (
    <DashboardShell>
      {content}
    </DashboardShell>
  ) : (
    content
  );
}

export default function ElectricalBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />

            <p className="text-sm text-slate-600">
              Loading booking...
            </p>
          </div>
        </div>
      }
    >
      <ElectricalBookingContent />
    </Suspense>
  );
}
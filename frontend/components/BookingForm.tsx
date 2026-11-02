
"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/AuthProvider";
import type { Service } from "@/types/service";
import type { Address } from "@/lib/addresses";
import { getAddresses } from "@/lib/addresses";
import { createBooking } from "@/lib/bookings";

import {
  calculateCleaningPrice,
  calculateMovingPrice,
  calculateElectricalPrice,
} from "@/lib/pricing";

import type { PricingResult } from "@/types/pricing";

type BookingCategory = "cleaning" | "moving" | "electrical";

type BookingFormProps = {
  category: BookingCategory;
  service: Service;
  returnTo?: string;
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#061F35] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const selectClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#061F35] outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const textareaClass =
  "w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#061F35] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

export default function BookingForm({
  category,
  service,
  returnTo,
}: BookingFormProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [authRequired, setAuthRequired] = useState(false);

  const [pricing, setPricing] = useState<PricingResult | null>(null);
  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const [pricingError, setPricingError] = useState("");

  // Shared booking fields
  const [addressId, setAddressId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [notes, setNotes] = useState("");

  // Cleaning
  const [cleaningPropertyType, setCleaningPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [squareMeters, setSquareMeters] = useState("");
  const [cleaningType, setCleaningType] = useState("");
  const [cleaningRequirements, setCleaningRequirements] = useState("");

  // Moving
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [movingPropertyType, setMovingPropertyType] = useState("");
  const [truckSize, setTruckSize] = useState("");
  const [numberOfMovers, setNumberOfMovers] = useState("");
  const [packingRequired, setPackingRequired] = useState(false);
  const [specialItems, setSpecialItems] = useState("");
  const [estimatedDistanceKm, setEstimatedDistanceKm] = useState("");

  // Electrical
  const [electricalPropertyType, setElectricalPropertyType] = useState("");
  const [numberOfFloors, setNumberOfFloors] = useState("");
  const [electricalBedrooms, setElectricalBedrooms] = useState("");
  const [newInstallation, setNewInstallation] = useState(false);
  const [rewiring, setRewiring] = useState(false);
  const [numberOfSockets, setNumberOfSockets] = useState("");
  const [numberOfLights, setNumberOfLights] = useState("");
  const [distributionBoard, setDistributionBoard] = useState(false);
  const [electricalRequirements, setElectricalRequirements] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setAuthRequired(true);
      setLoadingAddresses(false);
      return;
    }

    async function loadAddresses() {
      try {
        setLoadingAddresses(true);
        setError("");

        const data = await getAddresses();
        setAddresses(data);

        if (data.length > 0) {
          setAddressId(data[0].id);
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load your addresses.";

        if (message.toLowerCase().includes("authentication required")) {
          setAuthRequired(true);
          return;
        }

        setError(message);
      } finally {
        setLoadingAddresses(false);
      }
    }

    loadAddresses();
  }, [authLoading, user]);

  const today = new Date().toLocaleDateString("en-CA");

  function getBookingType(): "INSTANT" | "QUOTE_REQUEST" {
    return service.pricingType === "QUOTE" ? "QUOTE_REQUEST" : "INSTANT";
  }

  async function handleCalculatePrice() {
    setPricing(null);
    setPricingError("");
    setError("");

    try {
      setCalculatingPrice(true);

      if (category === "cleaning") {
        const result = await calculateCleaningPrice({
          serviceId: service.id,
          propertyType: cleaningPropertyType,
          bedrooms: bedrooms ? Number(bedrooms) : undefined,
          bathrooms: bathrooms ? Number(bathrooms) : undefined,
          squareMeters: squareMeters ? Number(squareMeters) : undefined,
          cleaningType,
          additionalRequirements: cleaningRequirements || undefined,
        });

        setPricing(result);
      }

      if (category === "moving") {
        const result = await calculateMovingPrice({
          serviceId: service.id,
          pickupAddress,
          destinationAddress,
          propertyType: movingPropertyType,
          truckSize: truckSize || undefined,
          numberOfMovers: numberOfMovers ? Number(numberOfMovers) : undefined,
          packingRequired,
          estimatedDistanceKm: estimatedDistanceKm
            ? Number(estimatedDistanceKm)
            : undefined,
          specialItems: specialItems || undefined,
        });

        setPricing(result);
      }

      if (category === "electrical") {
        const result = await calculateElectricalPrice({
          serviceId: service.id,
          propertyType: electricalPropertyType,
          numberOfFloors: numberOfFloors ? Number(numberOfFloors) : undefined,
          bedrooms: electricalBedrooms ? Number(electricalBedrooms) : undefined,
          newInstallation,
          rewiring,
          numberOfSockets: numberOfSockets ? Number(numberOfSockets) : undefined,
          numberOfLights: numberOfLights ? Number(numberOfLights) : undefined,
          distributionBoard,
          additionalRequirements: electricalRequirements || undefined,
        });

        setPricing(result);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to calculate price.";

      if (message.toLowerCase().includes("authentication required")) {
        setAuthRequired(true);
        return;
      }

      setPricingError(message);
    } finally {
      setCalculatingPrice(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!addressId) {
      setError("Please select a service address.");
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      setError("Please select your preferred date and time.");
      return;
    }

    if (service.pricingType === "CALCULATED" && !pricing) {
      setError("Please calculate your price before confirming the booking.");
      return;
    }

    try {
      setSubmitting(true);

      const commonData = {
        serviceId: service.id,
        addressId,
        bookingType: getBookingType(),
        scheduledDate: new Date(`${scheduledDate}T00:00:00`).toISOString(),
        scheduledTime,
        notes: notes || undefined,
      };

      if (category === "cleaning") {
        await createBooking({
          ...commonData,
          cleaningRequest: {
            propertyType: cleaningPropertyType,
            bedrooms: bedrooms ? Number(bedrooms) : undefined,
            bathrooms: bathrooms ? Number(bathrooms) : undefined,
            squareMeters: squareMeters ? Number(squareMeters) : undefined,
            cleaningType,
            additionalRequirements: cleaningRequirements || undefined,
          },
        });
      }

      if (category === "moving") {
        await createBooking({
          ...commonData,
          movingRequest: {
            pickupAddress,
            destinationAddress,
            propertyType: movingPropertyType,
            truckSize: truckSize || undefined,
            numberOfMovers: numberOfMovers ? Number(numberOfMovers) : undefined,
            packingRequired,
            specialItems: specialItems || undefined,
            estimatedDistanceKm: estimatedDistanceKm
              ? Number(estimatedDistanceKm)
              : undefined,
          },
        });
      }

      if (category === "electrical") {
        await createBooking({
          ...commonData,
          electricalRequest: {
            propertyType: electricalPropertyType,
            numberOfFloors: numberOfFloors ? Number(numberOfFloors) : undefined,
            bedrooms: electricalBedrooms ? Number(electricalBedrooms) : undefined,
            newInstallation,
            rewiring,
            numberOfSockets: numberOfSockets ? Number(numberOfSockets) : undefined,
            numberOfLights: numberOfLights ? Number(numberOfLights) : undefined,
            distributionBoard,
            additionalRequirements: electricalRequirements || undefined,
          },
        });
      }

      router.push("/bookings");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create booking.";

      if (message.toLowerCase().includes("authentication required")) {
        setAuthRequired(true);
        return;
      }

      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  // Authentication checkpoint
  if (authRequired) {
    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : `/book/${category}?service=${service.id}`;

    const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
    const registerUrl = `/register?redirect=${encodeURIComponent(currentPath)}`;

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="bg-[#061F35] px-7 py-7 text-center text-white">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-200">
              <LockIcon />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
              HomeServe
            </p>
            <h1 className="mt-2 text-2xl font-bold">Login required</h1>
          </div>

          <div className="p-7 text-center">
            <p className="text-sm leading-6 text-slate-600">
              Sign in to continue booking{" "}
              <span className="font-bold text-[#061F35]">{service.name}</span>.
              Your account helps us manage your service address and appointment.
            </p>

            <Link
              href={loginUrl}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Continue to Login
            </Link>

            <p className="mt-5 text-sm text-slate-500">
              Don't have an account?{" "}
              <Link href={registerUrl} className="font-bold text-blue-600 hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <LoadingScreen message="Checking your account..." />
    );
  }

  const pricingLabel =
    service.pricingType === "QUOTE"
      ? "Quote required"
      : service.pricingType === "CALCULATED"
        ? "Calculated pricing"
        : "Instant booking";

  return (
    <div className="min-h-screen bg-[#F3F6FA] px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        {/* Compact welcome banner */}
        <div className="mb-5 overflow-hidden rounded-2xl bg-[#061F35] px-5 py-5 text-white shadow-lg sm:px-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-300">
                Homeserve / Booking
              </p>
              <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                Let's get your service scheduled.
              </h1>
              <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                Complete the details below to arrange your service.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-100 sm:self-center">
              <ShieldIcon />
              Secure booking
            </div>
          </div>
        </div>

        {/* Booking progress */}
        <div className="mb-5 grid grid-cols-3 gap-2">
          <ProgressItem number="01" label="Your details" active />
          <ProgressItem number="02" label="Schedule" />
          <ProgressItem number="03" label="Confirmation" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Selected service */}
          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ServiceIcon category={category} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                    Selected service
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-[#061F35]">
                    {service.name}
                  </h2>
                  {service.description && (
                    <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                      {service.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                  {pricingLabel}
                </span>
                {service.duration && (
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    {service.duration} min
                  </span>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertIcon />
              <span>{error}</span>
            </div>
          )}

          {/* Address */}
          <FormSection
            number="01"
            title="Where should we serve you?"
            description="Choose the address where the service will take place."
            tone="blue"
          >
            {loadingAddresses ? (
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                <Spinner />
                Loading your saved addresses...
              </div>
            ) : addresses.length === 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="text-amber-600">
                    <MapPinIcon />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-900">
                      No saved address found
                    </p>
                    <p className="mt-1 text-xs leading-5 text-amber-800">
                      Add a service address before continuing with your booking.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          returnTo
                            ? `/addresses?returnTo=${encodeURIComponent(returnTo)}`
                            : "/addresses"
                        )
                      }
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-700"
                    >
                      Add an address
                      <ArrowRightIcon />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <Field label="Service location" hint="Select one of your saved addresses.">
                  <select
                    value={addressId}
                    onChange={(e) => setAddressId(e.target.value)}
                    className={selectClass}
                    required
                  >
                    <option value="">Select your service address</option>
                    {addresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.label} — {address.addressLine}, {address.city}
                      </option>
                    ))}
                  </select>
                </Field>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      returnTo
                        ? `/addresses?returnTo=${encodeURIComponent(returnTo)}`
                        : "/addresses"
                    )
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                >
                  <PlusIcon />
                  Add address
                </button>
              </div>
            )}
          </FormSection>

          {/* Service-specific details */}
          <FormSection
            number="02"
            title="Tell us about the service"
            description="These details help us understand the work and prepare appropriately."
            tone="violet"
          >
            {category === "cleaning" && (
              <CleaningFields
                propertyType={cleaningPropertyType}
                setPropertyType={setCleaningPropertyType}
                bedrooms={bedrooms}
                setBedrooms={setBedrooms}
                bathrooms={bathrooms}
                setBathrooms={setBathrooms}
                squareMeters={squareMeters}
                setSquareMeters={setSquareMeters}
                cleaningType={cleaningType}
                setCleaningType={setCleaningType}
                requirements={cleaningRequirements}
                setRequirements={setCleaningRequirements}
              />
            )}

            {category === "moving" && (
              <MovingFields
                pickupAddress={pickupAddress}
                setPickupAddress={setPickupAddress}
                destinationAddress={destinationAddress}
                setDestinationAddress={setDestinationAddress}
                propertyType={movingPropertyType}
                setPropertyType={setMovingPropertyType}
                truckSize={truckSize}
                setTruckSize={setTruckSize}
                numberOfMovers={numberOfMovers}
                setNumberOfMovers={setNumberOfMovers}
                packingRequired={packingRequired}
                setPackingRequired={setPackingRequired}
                specialItems={specialItems}
                setSpecialItems={setSpecialItems}
                estimatedDistanceKm={estimatedDistanceKm}
                setEstimatedDistanceKm={setEstimatedDistanceKm}
              />
            )}

            {category === "electrical" && (
              <ElectricalFields
                propertyType={electricalPropertyType}
                setPropertyType={setElectricalPropertyType}
                numberOfFloors={numberOfFloors}
                setNumberOfFloors={setNumberOfFloors}
                bedrooms={electricalBedrooms}
                setBedrooms={setElectricalBedrooms}
                newInstallation={newInstallation}
                setNewInstallation={setNewInstallation}
                rewiring={rewiring}
                setRewiring={setRewiring}
                numberOfSockets={numberOfSockets}
                setNumberOfSockets={setNumberOfSockets}
                numberOfLights={numberOfLights}
                setNumberOfLights={setNumberOfLights}
                distributionBoard={distributionBoard}
                setDistributionBoard={setDistributionBoard}
                requirements={electricalRequirements}
                setRequirements={setElectricalRequirements}
              />
            )}
          </FormSection>

          {/* Pricing */}
          {service.pricingType === "CALCULATED" && (
            <FormSection
              number="03"
              title="Estimate your service cost"
              description="Calculate an estimate using the service details you have provided."
              tone="emerald"
            >
              <div className="flex flex-col gap-4 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <CalculatorIcon />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#061F35]">
                      Calculate your estimated price
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      You can recalculate after changing your service details.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCalculatePrice}
                  disabled={calculatingPrice}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {calculatingPrice ? (
                    <>
                      <Spinner light />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <CalculatorIcon />
                      {pricing ? "Recalculate price" : "Calculate price"}
                    </>
                  )}
                </button>
              </div>

              {pricingError && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4"
                >
                  <p className="text-sm font-bold text-red-700">
                    Unable to calculate price
                  </p>
                  <p className="mt-1 text-sm text-red-600">{pricingError}</p>
                </div>
              )}

              {pricing && <PricingSummary pricing={pricing} />}
            </FormSection>
          )}

          {service.pricingType === "QUOTE" && (
            <FormSection
              number="03"
              title="Personalized quote"
              description="This service requires a review before a final price can be provided."
              tone="amber"
            >
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600">
                  <QuoteIcon />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900">
                    A personalized quote will be prepared
                  </p>
                  <p className="mt-1 text-xs leading-5 text-amber-800">
                    Submit your request and our team will review your requirements
                    and provide a price.
                  </p>
                </div>
              </div>
            </FormSection>
          )}

          {/* Schedule */}
          <FormSection
            number="04"
            title="Choose your preferred schedule"
            description="Select the date and time that work best for you."
            tone="indigo"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Preferred date" hint="Choose a date from today onwards.">
                <div className="relative">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={today}
                    className={inputClass}
                    required
                  />
                </div>
              </Field>

              <Field label="Preferred time" hint="Choose the time you would prefer.">
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className={inputClass}
                  required
                />
              </Field>
            </div>
          </FormSection>

          {/* Notes */}
          <FormSection
            number="05"
            title="Anything else we should know?"
            description="Share additional information that may help us prepare for your service."
            tone="slate"
          >
            <Field label="Additional notes" hint="Optional · Maximum 1,000 characters">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="Add access instructions, special requests or other useful information..."
                className={textareaClass}
              />
              <p className="mt-1 text-right text-[11px] text-slate-400">
                {notes.length}/1000
              </p>
            </Field>
          </FormSection>

          {/* Final action */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShieldIcon />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#061F35]">
                    Review before submitting
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Make sure your service details, address and preferred schedule
                    are correct before continuing.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  submitting ||
                  loadingAddresses ||
                  addresses.length === 0 ||
                  (service.pricingType === "CALCULATED" && !pricing)
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B72E7] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition hover:bg-[#095FBF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Spinner light />
                    Creating your booking...
                  </>
                ) : (
                  <>
                    {service.pricingType === "QUOTE"
                      ? "Submit quote request"
                      : "Confirm booking"}
                    <ArrowRightIcon />
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
                {service.pricingType === "CALCULATED"
                  ? "You must calculate your estimated price before confirming."
                  : "You can review your booking details after submission."}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   Shared layout components
-------------------------------------------------- */

function FormSection({
  number,
  title,
  description,
  tone,
  children,
}: {
  number: string;
  title: string;
  description: string;
  tone: "blue" | "violet" | "emerald" | "amber" | "indigo" | "slate";
  children: ReactNode;
}) {
  const tones = {
    blue: "border-t-blue-500 bg-blue-50 text-blue-600",
    violet: "border-t-violet-500 bg-violet-50 text-violet-600",
    emerald: "border-t-emerald-500 bg-emerald-50 text-emerald-600",
    amber: "border-t-amber-500 bg-amber-50 text-amber-600",
    indigo: "border-t-indigo-500 bg-indigo-50 text-indigo-600",
    slate: "border-t-slate-400 bg-slate-100 text-slate-600",
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 border-t-4 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${tones[tone]}`}
        >
          {number}
        </div>
        <div>
          <h2 className="text-base font-bold text-[#061F35] sm:text-lg">
            {title}
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function ProgressItem({
  number,
  label,
  active = false,
}: {
  number: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3 py-3 ${
        active
          ? "border-blue-200 bg-blue-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold ${
          active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
        }`}
      >
        {number}
      </span>
      <span
        className={`text-[10px] font-bold sm:text-xs ${
          active ? "text-blue-800" : "text-slate-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-xs font-bold text-[#061F35] sm:text-sm">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <Spinner />
        <p className="text-sm font-semibold text-[#061F35]">{message}</p>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   Pricing summary
-------------------------------------------------- */

function PricingSummary({ pricing }: { pricing: PricingResult }) {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-200">
      <div className="bg-[#061F35] px-5 py-5 text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200">
              Estimated service price
            </p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight">
              KSh {pricing.totalAmount.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-blue-100">{pricing.serviceName}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
            <CalculatorIcon />
          </div>
        </div>
      </div>

      <div className="bg-white p-5">
        <h3 className="text-sm font-bold text-[#061F35]">Price breakdown</h3>

        <div className="mt-4 space-y-3">
          {pricing.breakdown.map((item, index) => (
            <div
              key={`${item.item}-${index}`}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-700">{item.item}</p>
                {item.quantity !== 1 && (
                  <p className="mt-0.5 text-xs text-slate-400">
                    {item.quantity} × KSh {item.unitPrice.toLocaleString()}
                  </p>
                )}
              </div>
              <p className="shrink-0 font-semibold text-slate-700">
                KSh {item.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="my-4 border-t border-dashed border-slate-200" />

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-[#061F35]">
            Estimated total
          </span>
          <span className="text-xl font-extrabold text-emerald-700">
            KSh {pricing.totalAmount.toLocaleString()}
          </span>
        </div>

        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-800">
          This is an estimated price based on the information provided. The
          final price may vary if additional requirements are identified.
        </p>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   Cleaning fields
-------------------------------------------------- */

function CleaningFields({
  propertyType,
  setPropertyType,
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  squareMeters,
  setSquareMeters,
  cleaningType,
  setCleaningType,
  requirements,
  setRequirements,
}: {
  propertyType: string;
  setPropertyType: (value: string) => void;
  bedrooms: string;
  setBedrooms: (value: string) => void;
  bathrooms: string;
  setBathrooms: (value: string) => void;
  squareMeters: string;
  setSquareMeters: (value: string) => void;
  cleaningType: string;
  setCleaningType: (value: string) => void;
  requirements: string;
  setRequirements: (value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Property type">
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className={selectClass}
            required
          >
            <option value="">Select property type</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Villa">Villa</option>
            <option value="Office">Office</option>
            <option value="Other">Other</option>
          </select>
        </Field>

        <Field label="Cleaning type" hint="Describe the cleaning service you need.">
          <input
            value={cleaningType}
            onChange={(e) => setCleaningType(e.target.value)}
            placeholder="e.g. General cleaning"
            className={inputClass}
            required
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Field label="Bedrooms">
          <input
            type="number"
            min="0"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            placeholder="e.g. 3"
            className={inputClass}
          />
        </Field>

        <Field label="Bathrooms">
          <input
            type="number"
            min="0"
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            placeholder="e.g. 2"
            className={inputClass}
          />
        </Field>

        <div className="col-span-2 sm:col-span-1">
          <Field label="Size (m²)">
            <input
              type="number"
              min="1"
              value={squareMeters}
              onChange={(e) => setSquareMeters(e.target.value)}
              placeholder="e.g. 120"
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <Field label="Cleaning requirements" hint="Optional · Maximum 1,000 characters">
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Tell us about areas that need special attention..."
          className={textareaClass}
        />
      </Field>
    </div>
  );
}

/* --------------------------------------------------
   Moving fields
-------------------------------------------------- */

function MovingFields({
  pickupAddress,
  setPickupAddress,
  destinationAddress,
  setDestinationAddress,
  propertyType,
  setPropertyType,
  truckSize,
  setTruckSize,
  numberOfMovers,
  setNumberOfMovers,
  packingRequired,
  setPackingRequired,
  specialItems,
  setSpecialItems,
  estimatedDistanceKm,
  setEstimatedDistanceKm,
}: {
  pickupAddress: string;
  setPickupAddress: (value: string) => void;
  destinationAddress: string;
  setDestinationAddress: (value: string) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  truckSize: string;
  setTruckSize: (value: string) => void;
  numberOfMovers: string;
  setNumberOfMovers: (value: string) => void;
  packingRequired: boolean;
  setPackingRequired: (value: boolean) => void;
  specialItems: string;
  setSpecialItems: (value: string) => void;
  estimatedDistanceKm: string;
  setEstimatedDistanceKm: (value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Pickup address">
          <input
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            placeholder="Where should we pick up?"
            className={inputClass}
            required
          />
        </Field>

        <Field label="Destination address">
          <input
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            placeholder="Where are you moving to?"
            className={inputClass}
            required
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Property type">
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className={selectClass}
            required
          >
            <option value="">Select property type</option>
            <option value="Bedsitter">Bedsitter</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Office">Office</option>
            <option value="Other">Other</option>
          </select>
        </Field>

        <Field label="Truck size">
          <select
            value={truckSize}
            onChange={(e) => setTruckSize(e.target.value)}
            className={selectClass}
          >
            <option value="">Select truck size</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Number of movers">
          <input
            type="number"
            min="1"
            value={numberOfMovers}
            onChange={(e) => setNumberOfMovers(e.target.value)}
            placeholder="e.g. 2"
            className={inputClass}
          />
        </Field>

        <Field label="Estimated distance (km)">
          <input
            type="number"
            min="1"
            value={estimatedDistanceKm}
            onChange={(e) => setEstimatedDistanceKm(e.target.value)}
            placeholder="e.g. 15"
            className={inputClass}
          />
        </Field>
      </div>

      <CheckboxField
        checked={packingRequired}
        onChange={setPackingRequired}
        label="I need packing assistance"
        description="Include help with packing items before transportation."
        tone="blue"
      />

      <Field label="Special items" hint="Optional">
        <textarea
          value={specialItems}
          onChange={(e) => setSpecialItems(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Pianos, fragile items, large furniture, etc."
          className={textareaClass}
        />
      </Field>
    </div>
  );
}

/* --------------------------------------------------
   Electrical fields
-------------------------------------------------- */

function ElectricalFields({
  propertyType,
  setPropertyType,
  numberOfFloors,
  setNumberOfFloors,
  bedrooms,
  setBedrooms,
  newInstallation,
  setNewInstallation,
  rewiring,
  setRewiring,
  numberOfSockets,
  setNumberOfSockets,
  numberOfLights,
  setNumberOfLights,
  distributionBoard,
  setDistributionBoard,
  requirements,
  setRequirements,
}: {
  propertyType: string;
  setPropertyType: (value: string) => void;
  numberOfFloors: string;
  setNumberOfFloors: (value: string) => void;
  bedrooms: string;
  setBedrooms: (value: string) => void;
  newInstallation: boolean;
  setNewInstallation: (value: boolean) => void;
  rewiring: boolean;
  setRewiring: (value: boolean) => void;
  numberOfSockets: string;
  setNumberOfSockets: (value: string) => void;
  numberOfLights: string;
  setNumberOfLights: (value: string) => void;
  distributionBoard: boolean;
  setDistributionBoard: (value: boolean) => void;
  requirements: string;
  setRequirements: (value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Property type">
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className={selectClass}
            required
          >
            <option value="">Select property type</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Villa">Villa</option>
            <option value="Office">Office</option>
            <option value="Other">Other</option>
          </select>
        </Field>

        <Field label="Number of floors">
          <input
            type="number"
            min="1"
            value={numberOfFloors}
            onChange={(e) => setNumberOfFloors(e.target.value)}
            placeholder="e.g. 2"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Field label="Bedrooms">
          <input
            type="number"
            min="0"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            placeholder="e.g. 3"
            className={inputClass}
          />
        </Field>

        <Field label="Sockets">
          <input
            type="number"
            min="0"
            value={numberOfSockets}
            onChange={(e) => setNumberOfSockets(e.target.value)}
            placeholder="e.g. 12"
            className={inputClass}
          />
        </Field>

        <div className="col-span-2 sm:col-span-1">
          <Field label="Lights">
            <input
              type="number"
              min="0"
              value={numberOfLights}
              onChange={(e) => setNumberOfLights(e.target.value)}
              placeholder="e.g. 10"
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold text-[#061F35]">
          Type of electrical work
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <CheckboxField
            checked={newInstallation}
            onChange={setNewInstallation}
            label="New installation"
            tone="violet"
          />
          <CheckboxField
            checked={rewiring}
            onChange={setRewiring}
            label="Rewiring"
            tone="blue"
          />
          <CheckboxField
            checked={distributionBoard}
            onChange={setDistributionBoard}
            label="Distribution board"
            tone="amber"
          />
        </div>
      </div>

      <Field label="Electrical requirements" hint="Optional · Maximum 1,000 characters">
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="Describe the electrical work you need..."
          className={textareaClass}
        />
      </Field>
    </div>
  );
}

/* --------------------------------------------------
   Reusable checkbox
-------------------------------------------------- */

function CheckboxField({
  checked,
  onChange,
  label,
  description,
  tone = "blue",
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
  tone?: "blue" | "violet" | "amber";
}) {
  const tones = {
    blue: "border-blue-100 bg-blue-50/60",
    violet: "border-violet-100 bg-violet-50/60",
    amber: "border-amber-100 bg-amber-50/60",
  };

  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition hover:shadow-sm ${tones[tone]}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
      />
      <span className="min-w-0">
        <span className="block text-xs font-bold text-[#061F35]">{label}</span>
        {description && (
          <span className="mt-1 block text-[11px] leading-5 text-slate-500">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

/* --------------------------------------------------
   Icons and small UI elements
-------------------------------------------------- */

function Spinner({ light = false }: { light?: boolean }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 ${
        light
          ? "border-white/40 border-t-white"
          : "border-blue-200 border-t-blue-600"
      }`}
      aria-hidden="true"
    />
  );
}

function ServiceIcon({ category }: { category: BookingCategory }) {
  if (category === "cleaning") return <CleaningIcon />;
  if (category === "moving") return <MovingIcon />;
  return <ElectricalIcon />;
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5m0 3h.01" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <path d="M8 6h8v4H8zM8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <path d="M4 5h16v14H4z" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  );
}

function CleaningIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
      <path d="m5 20 4-4m-1-5 5-5 6 6-5 5-6-6Z" />
      <path d="m14 3 .5 2.5L17 6l-2.5.5L14 9l-.5-2.5L11 6l2.5-.5L14 3Z" />
      <path d="m19 13 .4 1.6L21 15l-1.6.4L19 17l-.4-1.6L17 15l1.6-.4L19 13Z" />
    </svg>
  );
}

function MovingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
      <path d="M3 7h11v11H3zM14 11h4l3 3v4h-7z" />
      <circle cx="7.5" cy="19" r="1.5" />
      <circle cx="17.5" cy="19" r="1.5" />
    </svg>
  );
}

function ElectricalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
      <path d="m13 2-9 12h7l-1 8 10-13h-7l0-7Z" />
    </svg>
  );
}

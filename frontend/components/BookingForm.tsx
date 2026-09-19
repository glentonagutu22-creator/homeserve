"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
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

type BookingCategory =
  | "cleaning"
  | "moving"
  | "electrical";

type BookingFormProps = {
  category: BookingCategory;
  service: Service;
  returnTo?: string;
};

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-[#061F35] placeholder:text-slate-500 placeholder:opacity-100 focus:border-[#0B72E7] focus:outline-none focus:ring-4 focus:ring-blue-100";

const selectClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-[#061F35] focus:border-[#0B72E7] focus:outline-none focus:ring-4 focus:ring-blue-100";

const textareaClass =
  "w-full resize-none rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-[#061F35] placeholder:text-slate-500 placeholder:opacity-100 focus:border-[#0B72E7] focus:outline-none focus:ring-4 focus:ring-blue-100";

export default function BookingForm({
  category,
  service,
  returnTo,
}: BookingFormProps) {
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] =
    useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [authRequired, setAuthRequired] =
    useState(false);

  // Pricing
  const [pricing, setPricing] =
    useState<PricingResult | null>(null);
  const [calculatingPrice, setCalculatingPrice] =
    useState(false);
  const [pricingError, setPricingError] =
    useState("");

  // Shared booking fields
  const [addressId, setAddressId] = useState("");
  const [scheduledDate, setScheduledDate] =
    useState("");
  const [scheduledTime, setScheduledTime] =
    useState("");
  const [notes, setNotes] = useState("");

  // Cleaning
  const [cleaningPropertyType, setCleaningPropertyType] =
    useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [squareMeters, setSquareMeters] = useState("");
  const [cleaningType, setCleaningType] = useState("");
  const [cleaningRequirements, setCleaningRequirements] =
    useState("");

  // Moving
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] =
    useState("");
  const [movingPropertyType, setMovingPropertyType] =
    useState("");
  const [truckSize, setTruckSize] = useState("");
  const [numberOfMovers, setNumberOfMovers] =
    useState("");
  const [packingRequired, setPackingRequired] =
    useState(false);
  const [specialItems, setSpecialItems] = useState("");
  const [estimatedDistanceKm, setEstimatedDistanceKm] =
    useState("");

  // Electrical
  const [
    electricalPropertyType,
    setElectricalPropertyType,
  ] = useState("");
  const [numberOfFloors, setNumberOfFloors] =
    useState("");
  const [electricalBedrooms, setElectricalBedrooms] =
    useState("");
  const [newInstallation, setNewInstallation] =
    useState(false);
  const [rewiring, setRewiring] = useState(false);
  const [numberOfSockets, setNumberOfSockets] =
    useState("");
  const [numberOfLights, setNumberOfLights] =
    useState("");
  const [distributionBoard, setDistributionBoard] =
    useState(false);
  const [
    electricalRequirements,
    setElectricalRequirements,
  ] = useState("");

  useEffect(() => {
    // Wait until AuthProvider has finished checking
    // the current authentication session.
    if (authLoading) {
      return;
    }

    // If there is no authenticated user, show the
    // existing login-required notice.
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

        if (
          message
            .toLowerCase()
            .includes("authentication required")
        ) {
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

  function getBookingType():
    | "INSTANT"
    | "QUOTE_REQUEST" {
    return service.pricingType === "QUOTE"
      ? "QUOTE_REQUEST"
      : "INSTANT";
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
          bedrooms: bedrooms
            ? Number(bedrooms)
            : undefined,
          bathrooms: bathrooms
            ? Number(bathrooms)
            : undefined,
          squareMeters: squareMeters
            ? Number(squareMeters)
            : undefined,
          cleaningType,
          additionalRequirements:
            cleaningRequirements || undefined,
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
          numberOfMovers: numberOfMovers
            ? Number(numberOfMovers)
            : undefined,
          packingRequired,
          estimatedDistanceKm:
            estimatedDistanceKm
              ? Number(estimatedDistanceKm)
              : undefined,
          specialItems:
            specialItems || undefined,
        });

        setPricing(result);
      }

      if (category === "electrical") {
        const result = await calculateElectricalPrice({
          serviceId: service.id,
          propertyType: electricalPropertyType,
          numberOfFloors: numberOfFloors
            ? Number(numberOfFloors)
            : undefined,
          bedrooms: electricalBedrooms
            ? Number(electricalBedrooms)
            : undefined,
          newInstallation,
          rewiring,
          numberOfSockets: numberOfSockets
            ? Number(numberOfSockets)
            : undefined,
          numberOfLights: numberOfLights
            ? Number(numberOfLights)
            : undefined,
          distributionBoard,
          additionalRequirements:
            electricalRequirements || undefined,
        });

        setPricing(result);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to calculate price.";

      if (
        message
          .toLowerCase()
          .includes("authentication required")
      ) {
        setAuthRequired(true);
        return;
      }

      setPricingError(message);
    } finally {
      setCalculatingPrice(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!addressId) {
      setError("Please select a service address.");
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      setError(
        "Please select your preferred date and time."
      );
      return;
    }

    if (
      service.pricingType === "CALCULATED" &&
      !pricing
    ) {
      setError(
        "Please calculate your price before confirming the booking."
      );
      return;
    }

    try {
      setSubmitting(true);

      const commonData = {
        serviceId: service.id,
        addressId,
        bookingType: getBookingType(),
        scheduledDate: new Date(
          `${scheduledDate}T00:00:00`
        ).toISOString(),
        scheduledTime,
        notes: notes || undefined,
      };

      if (category === "cleaning") {
        await createBooking({
          ...commonData,

          cleaningRequest: {
            propertyType: cleaningPropertyType,
            bedrooms: bedrooms
              ? Number(bedrooms)
              : undefined,
            bathrooms: bathrooms
              ? Number(bathrooms)
              : undefined,
            squareMeters: squareMeters
              ? Number(squareMeters)
              : undefined,
            cleaningType,
            additionalRequirements:
              cleaningRequirements || undefined,
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
            numberOfMovers: numberOfMovers
              ? Number(numberOfMovers)
              : undefined,
            packingRequired,
            specialItems:
              specialItems || undefined,
            estimatedDistanceKm:
              estimatedDistanceKm
                ? Number(estimatedDistanceKm)
                : undefined,
          },
        });
      }

      if (category === "electrical") {
        await createBooking({
          ...commonData,

          electricalRequest: {
            propertyType:
              electricalPropertyType,
            numberOfFloors: numberOfFloors
              ? Number(numberOfFloors)
              : undefined,
            bedrooms: electricalBedrooms
              ? Number(electricalBedrooms)
              : undefined,
            newInstallation,
            rewiring,
            numberOfSockets: numberOfSockets
              ? Number(numberOfSockets)
              : undefined,
            numberOfLights: numberOfLights
              ? Number(numberOfLights)
              : undefined,
            distributionBoard,
            additionalRequirements:
              electricalRequirements || undefined,
          },
        });
      }

      router.push("/bookings");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create booking.";

      if (
        message
          .toLowerCase()
          .includes("authentication required")
      ) {
        setAuthRequired(true);
        return;
      }

      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * Authentication checkpoint
   */
  if (authRequired) {
    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname +
          window.location.search
        : `/book/${category}?service=${service.id}`;

    const loginUrl =
      `/login?redirect=${encodeURIComponent(
        currentPath
      )}`;

    const registerUrl =
      `/register?redirect=${encodeURIComponent(
        currentPath
      )}`;

    return (
      <div className="min-h-screen bg-[#061F35] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl sm:p-9">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7 text-[#0B72E7]"
              >
                <rect
                  width="16"
                  height="11"
                  x="4"
                  y="10"
                  rx="2"
                />

                <path d="M8 10V7a4 4 0 0 1 8 0v3" />

                <path d="M12 14v3" />
              </svg>
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#061F35]">
              Login required to continue
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">
              Before booking{" "}
              <span className="font-semibold text-[#061F35]">
                {service.name}
              </span>
              , please sign in to your HomeServe
              account.
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your account helps us securely manage
              your booking, service address, and
              appointment details.
            </p>

            <Link
              href={loginUrl}
              className="mt-7 flex w-full items-center justify-center rounded-xl bg-[#0B72E7] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-[#095FBF]"
            >
              Continue to Login
            </Link>

            <p className="mt-5 text-sm text-slate-500">
              Don't have a HomeServe account?{" "}
              <Link
                href={registerUrl}
                className="font-semibold text-[#0B72E7] hover:underline"
              >
                Create an account
              </Link>
            </p>

            <div className="mt-7 border-t border-slate-100 pt-5">
              <p className="text-xs leading-5 text-slate-400">
                Your account information is used to
                securely associate your booking with
                you.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Authentication is still being checked.
   * Do not attempt to load addresses or show the
   * booking form until AuthProvider finishes.
   */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#061F35] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="rounded-2xl bg-white px-6 py-5 text-center shadow-2xl">
            <p className="text-sm font-medium text-[#061F35]">
              Checking your account...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#061F35] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-300">
            HomeServe Booking
          </p>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Book Your Service
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
            Provide a few details about your service
            and choose your preferred schedule.
          </p>
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-[#EAF6FF] p-5 shadow-2xl sm:p-8"
        >
          {/* Selected Service */}
          <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Selected Service
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#061F35]">
              {service.name}
            </h2>

            {service.description && (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {service.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {service.pricingType === "QUOTE"
                  ? "Quote Required"
                  : service.pricingType === "CALCULATED"
                  ? "Price Calculated"
                  : "Instant Booking"}
              </span>

              {service.duration && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Approx. {service.duration} minutes
                </span>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Address */}
          <section className="mb-8">
            <SectionTitle
              number="01"
              title="Service Address"
            />

            {loadingAddresses ? (
              <div className="rounded-xl bg-white px-4 py-3 text-sm text-slate-500">
                Loading your saved addresses...
              </div>
            ) : addresses.length === 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-800">
                  You don't have a saved address yet.
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
                  className="mt-3 text-sm font-semibold text-amber-900 underline"
                >
                  Add an address
                </button>
              </div>
            ) : (
              <select
                value={addressId}
                onChange={(e) =>
                  setAddressId(e.target.value)
                }
                className={selectClass}
                required
              >
                <option
                  value=""
                  className="text-slate-500"
                >
                  Select your service address
                </option>

                {addresses.map((address) => (
                  <option
                    key={address.id}
                    value={address.id}
                    className="text-[#061F35]"
                  >
                    {address.label} —{" "}
                    {address.addressLine},{" "}
                    {address.city}
                  </option>
                ))}
              </select>
            )}
          </section>

          {/* Service Details */}
          <section className="mb-8">
            <SectionTitle
              number="02"
              title="Service Details"
            />

            {category === "cleaning" && (
              <CleaningFields
                propertyType={cleaningPropertyType}
                setPropertyType={
                  setCleaningPropertyType
                }
                bedrooms={bedrooms}
                setBedrooms={setBedrooms}
                bathrooms={bathrooms}
                setBathrooms={setBathrooms}
                squareMeters={squareMeters}
                setSquareMeters={setSquareMeters}
                cleaningType={cleaningType}
                setCleaningType={setCleaningType}
                requirements={cleaningRequirements}
                setRequirements={
                  setCleaningRequirements
                }
              />
            )}

            {category === "moving" && (
              <MovingFields
                pickupAddress={pickupAddress}
                setPickupAddress={setPickupAddress}
                destinationAddress={
                  destinationAddress
                }
                setDestinationAddress={
                  setDestinationAddress
                }
                propertyType={movingPropertyType}
                setPropertyType={
                  setMovingPropertyType
                }
                truckSize={truckSize}
                setTruckSize={setTruckSize}
                numberOfMovers={numberOfMovers}
                setNumberOfMovers={
                  setNumberOfMovers
                }
                packingRequired={packingRequired}
                setPackingRequired={
                  setPackingRequired
                }
                specialItems={specialItems}
                setSpecialItems={setSpecialItems}
                estimatedDistanceKm={
                  estimatedDistanceKm
                }
                setEstimatedDistanceKm={
                  setEstimatedDistanceKm
                }
              />
            )}

            {category === "electrical" && (
              <ElectricalFields
                propertyType={
                  electricalPropertyType
                }
                setPropertyType={
                  setElectricalPropertyType
                }
                numberOfFloors={numberOfFloors}
                setNumberOfFloors={
                  setNumberOfFloors
                }
                bedrooms={electricalBedrooms}
                setBedrooms={
                  setElectricalBedrooms
                }
                newInstallation={newInstallation}
                setNewInstallation={
                  setNewInstallation
                }
                rewiring={rewiring}
                setRewiring={setRewiring}
                numberOfSockets={numberOfSockets}
                setNumberOfSockets={
                  setNumberOfSockets
                }
                numberOfLights={numberOfLights}
                setNumberOfLights={
                  setNumberOfLights
                }
                distributionBoard={
                  distributionBoard
                }
                setDistributionBoard={
                  setDistributionBoard
                }
                requirements={
                  electricalRequirements
                }
                setRequirements={
                  setElectricalRequirements
                }
              />
            )}
          </section>

          {/* Pricing */}
          {service.pricingType === "CALCULATED" && (
            <section className="mb-8">
              <SectionTitle
                number="03"
                title="Service Pricing"
              />

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-[#061F35]">
                      Calculate your estimated price
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      We'll calculate the price using
                      the service details you provided.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCalculatePrice}
                    disabled={calculatingPrice}
                    className="rounded-xl bg-[#061F35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#082B49] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {calculatingPrice
                      ? "Calculating..."
                      : pricing
                      ? "Recalculate Price"
                      : "Calculate Price"}
                  </button>
                </div>

                {pricingError && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-semibold text-red-700">
                      Unable to calculate price
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                      {pricingError}
                    </p>
                  </div>
                )}

                {pricing && (
                  <PricingSummary pricing={pricing} />
                )}
              </div>
            </section>
          )}

          {/* Quote information */}
          {service.pricingType === "QUOTE" && (
            <section className="mb-8">
              <SectionTitle
                number="03"
                title="Quote Request"
              />

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="font-bold text-amber-900">
                  Personalized quote required
                </h3>

                <p className="mt-2 text-sm leading-6 text-amber-800">
                  This service requires a personalized
                  quote. Submit your request and our
                  team will review your requirements and
                  provide a price.
                </p>
              </div>
            </section>
          )}

          {/* Schedule */}
          <section className="mb-8">
            <SectionTitle
              number="04"
              title="Preferred Schedule"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Preferred Date">
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) =>
                    setScheduledDate(
                      e.target.value
                    )
                  }
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  className={inputClass}
                  required
                />
              </Field>

              <Field label="Preferred Time">
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) =>
                    setScheduledTime(
                      e.target.value
                    )
                  }
                  className={inputClass}
                  required
                />
              </Field>
            </div>
          </section>

          {/* Additional Notes */}
          <section className="mb-8">
            <SectionTitle
              number="05"
              title="Additional Notes"
            />

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              maxLength={1000}
              rows={4}
              placeholder="Anything else we should know about your service?"
              className={textareaClass}
            />
          </section>

          {/* Submit */}
          <div className="border-t border-blue-200 pt-6">
            <button
              type="submit"
              disabled={
                submitting ||
                loadingAddresses ||
                addresses.length === 0 ||
                (service.pricingType === "CALCULATED" &&
                  !pricing)
              }
              className="w-full rounded-xl bg-[#0B72E7] px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#095FBF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Creating Booking..."
                : service.pricingType === "QUOTE"
                ? "Request a Quote"
                : "Confirm Booking"}
            </button>

            <p className="mt-3 text-center text-xs text-slate-500">
              {service.pricingType === "CALCULATED"
                ? "Calculate your price before confirming your booking."
                : "You can review your booking details after submission."}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================================================== */
/* Shared UI                                          */
/* ================================================== */

function SectionTitle({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#061F35] text-xs font-bold text-white">
        {number}
      </span>

      <h2 className="text-lg font-bold text-[#061F35]">
        {title}
      </h2>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#061F35]">
        {label}
      </label>

      {children}
    </div>
  );
}

/* ================================================== */
/* Pricing Summary                                    */
/* ================================================== */

function PricingSummary({
  pricing,
}: {
  pricing: PricingResult;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-blue-100 shadow-sm">
      <div className="bg-[#061F35] px-5 py-5 text-white">
        <p className="text-sm font-medium text-blue-200">
          Estimated Price
        </p>

        <p className="mt-1 text-3xl font-bold">
          KSh {pricing.totalAmount.toLocaleString()}
        </p>

        <p className="mt-1 text-sm text-blue-100">
          {pricing.serviceName}
        </p>
      </div>

      <div className="bg-white p-5">
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
          This is an estimated price based on the
          information provided. The final price may
          vary if additional requirements are
          identified.
        </p>
      </div>
    </div>
  );
}

/* ================================================== */
/* Cleaning                                           */
/* ================================================== */

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
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Property Type">
          <select
            value={propertyType}
            onChange={(e) =>
              setPropertyType(e.target.value)
            }
            className={selectClass}
            required
          >
            <option
              value=""
              className="text-slate-500"
            >
              Select property type
            </option>

            <option value="Apartment">
              Apartment
            </option>
            <option value="House">House</option>
            <option value="Villa">Villa</option>
            <option value="Office">Office</option>
            <option value="Other">Other</option>
          </select>
        </Field>

        <Field label="Cleaning Type">
          <input
            value={cleaningType}
            onChange={(e) =>
              setCleaningType(e.target.value)
            }
            placeholder="e.g. General cleaning"
            className={inputClass}
            required
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Bedrooms">
          <input
            type="number"
            min="0"
            value={bedrooms}
            onChange={(e) =>
              setBedrooms(e.target.value)
            }
            placeholder="e.g. 3"
            className={inputClass}
          />
        </Field>

        <Field label="Bathrooms">
          <input
            type="number"
            min="0"
            value={bathrooms}
            onChange={(e) =>
              setBathrooms(e.target.value)
            }
            placeholder="e.g. 2"
            className={inputClass}
          />
        </Field>

        <Field label="Size (m²)">
          <input
            type="number"
            min="1"
            value={squareMeters}
            onChange={(e) =>
              setSquareMeters(e.target.value)
            }
            placeholder="e.g. 120"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Cleaning Requirements">
        <textarea
          value={requirements}
          onChange={(e) =>
            setRequirements(e.target.value)
          }
          rows={3}
          maxLength={1000}
          placeholder="Tell us about any areas that need special attention..."
          className={textareaClass}
        />
      </Field>
    </div>
  );
}

/* ================================================== */
/* Moving                                             */
/* ================================================== */

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
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Pickup Address">
          <input
            value={pickupAddress}
            onChange={(e) =>
              setPickupAddress(e.target.value)
            }
            placeholder="Where should we pick up?"
            className={inputClass}
            required
          />
        </Field>

        <Field label="Destination Address">
          <input
            value={destinationAddress}
            onChange={(e) =>
              setDestinationAddress(e.target.value)
            }
            placeholder="Where are you moving to?"
            className={inputClass}
            required
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Property Type">
          <select
            value={propertyType}
            onChange={(e) =>
              setPropertyType(e.target.value)
            }
            className={selectClass}
            required
          >
            <option
              value=""
              className="text-slate-500"
            >
              Select property type
            </option>

            <option value="Bedsitter">
              Bedsitter
            </option>
            <option value="Apartment">
              Apartment
            </option>
            <option value="House">House</option>
            <option value="Office">Office</option>
            <option value="Other">Other</option>
          </select>
        </Field>

        <Field label="Truck Size">
          <select
            value={truckSize}
            onChange={(e) =>
              setTruckSize(e.target.value)
            }
            className={selectClass}
          >
            <option
              value=""
              className="text-slate-500"
            >
              Select truck size
            </option>

            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Number of Movers">
          <input
            type="number"
            min="1"
            value={numberOfMovers}
            onChange={(e) =>
              setNumberOfMovers(e.target.value)
            }
            placeholder="e.g. 2"
            className={inputClass}
          />
        </Field>

        <Field label="Estimated Distance (km)">
          <input
            type="number"
            min="1"
            value={estimatedDistanceKm}
            onChange={(e) =>
              setEstimatedDistanceKm(e.target.value)
            }
            placeholder="e.g. 15"
            className={inputClass}
          />
        </Field>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-4">
        <input
          type="checkbox"
          checked={packingRequired}
          onChange={(e) =>
            setPackingRequired(e.target.checked)
          }
          className="h-4 w-4 accent-[#0B72E7]"
        />

        <span className="text-sm font-semibold text-[#061F35]">
          I need packing assistance
        </span>
      </label>

      <Field label="Special Items">
        <textarea
          value={specialItems}
          onChange={(e) =>
            setSpecialItems(e.target.value)
          }
          rows={3}
          maxLength={1000}
          placeholder="Pianos, fragile items, large furniture, etc."
          className={textareaClass}
        />
      </Field>
    </div>
  );
}

/* ================================================== */
/* Electrical                                         */
/* ================================================== */

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
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Property Type">
          <select
            value={propertyType}
            onChange={(e) =>
              setPropertyType(e.target.value)
            }
            className={selectClass}
            required
          >
            <option
              value=""
              className="text-slate-500"
            >
              Select property type
            </option>

            <option value="Apartment">
              Apartment
            </option>
            <option value="House">House</option>
            <option value="Villa">Villa</option>
            <option value="Office">Office</option>
            <option value="Other">Other</option>
          </select>
        </Field>

        <Field label="Number of Floors">
          <input
            type="number"
            min="1"
            value={numberOfFloors}
            onChange={(e) =>
              setNumberOfFloors(e.target.value)
            }
            placeholder="e.g. 2"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Bedrooms">
          <input
            type="number"
            min="0"
            value={bedrooms}
            onChange={(e) =>
              setBedrooms(e.target.value)
            }
            placeholder="e.g. 3"
            className={inputClass}
          />
        </Field>

        <Field label="Number of Sockets">
          <input
            type="number"
            min="0"
            value={numberOfSockets}
            onChange={(e) =>
              setNumberOfSockets(e.target.value)
            }
            placeholder="e.g. 12"
            className={inputClass}
          />
        </Field>

        <Field label="Number of Lights">
          <input
            type="number"
            min="0"
            value={numberOfLights}
            onChange={(e) =>
              setNumberOfLights(e.target.value)
            }
            placeholder="e.g. 10"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <CheckboxField
          checked={newInstallation}
          onChange={setNewInstallation}
          label="New installation"
        />

        <CheckboxField
          checked={rewiring}
          onChange={setRewiring}
          label="Rewiring"
        />

        <CheckboxField
          checked={distributionBoard}
          onChange={setDistributionBoard}
          label="Distribution board"
        />
      </div>

      <Field label="Electrical Requirements">
        <textarea
          value={requirements}
          onChange={(e) =>
            setRequirements(e.target.value)
          }
          rows={4}
          maxLength={1000}
          placeholder="Describe the electrical work you need..."
          className={textareaClass}
        />
      </Field>
    </div>
  );
}

/* ================================================== */
/* Checkbox                                           */
/* ================================================== */

function CheckboxField({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(e.target.checked)
        }
        className="h-4 w-4 accent-[#0B72E7]"
      />

      <span className="text-sm font-semibold text-[#061F35]">
        {label}
      </span>
    </label>
  );
}
"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Address,
  CreateAddressData,
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "@/lib/addresses";
import DashboardShell from "@/components/dashboard/DashboardShell";

const emptyForm: CreateAddressData = {
  label: "",
  addressLine: "",
  city: "",
  county: "",
};

function AddressesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const returnTo = searchParams.get("returnTo");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] =
    useState<CreateAddressData>(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  async function loadAddresses() {
    try {
      setLoading(true);
      setError(null);

      const data = await getAddresses();

      setAddresses(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load addresses."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  function handleChange(
    field: keyof CreateAddressData,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startEditing(address: Address) {
    setEditingId(address.id);

    setForm({
      label: address.label,
      addressLine: address.addressLine,
      city: address.city,
      county: address.county,
      latitude:
        address.latitude ?? undefined,
      longitude:
        address.longitude ?? undefined,
    });

    setError(null);
    setSuccess(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (editingId) {
        const updated = await updateAddress(
          editingId,
          form
        );

        setAddresses((current) =>
          current.map((address) =>
            address.id === editingId
              ? updated
              : address
          )
        );

        setSuccess("Address updated successfully.");

        setEditingId(null);
        setForm(emptyForm);
      } else {
        const created =
          await createAddress(form);

        setAddresses((current) => [
          created,
          ...current,
        ]);

        /*
         * If the user came here from a booking form,
         * return them to that booking form after
         * successfully creating the address.
         */
        if (returnTo) {
          router.push(returnTo);
          return;
        }

        setSuccess("Address added successfully.");
        setForm(emptyForm);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save address."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError(null);
      setSuccess(null);

      await deleteAddress(id);

      setAddresses((current) =>
        current.filter(
          (address) => address.id !== id
        )
      );

      setSuccess("Address deleted successfully.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete address."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function handleBackToBooking() {
    if (returnTo) {
      router.push(returnTo);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <DashboardShell>
      <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                My Addresses
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage the addresses you use for your
                HomeServe bookings.
              </p>
            </div>

            {returnTo && (
              <button
                type="button"
                onClick={handleBackToBooking}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Back to Booking
              </button>
            )}
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Address Form */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId
                  ? "Edit Address"
                  : "Add New Address"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? "Update your address details below."
                  : "Add an address where HomeServe can provide your service."}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid gap-5 md:grid-cols-2">

                {/* Label */}
                <div>
                  <label
                    htmlFor="label"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Address Label
                  </label>

                  <input
                    id="label"
                    type="text"
                    value={form.label}
                    onChange={(event) =>
                      handleChange(
                        "label",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Home, Office"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Address Line */}
                <div>
                  <label
                    htmlFor="addressLine"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Address
                  </label>

                  <input
                    id="addressLine"
                    type="text"
                    value={form.addressLine}
                    onChange={(event) =>
                      handleChange(
                        "addressLine",
                        event.target.value
                      )
                    }
                    placeholder="e.g. P.O. Box 123, Main Street"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    City / Town
                  </label>

                  <input
                    id="city"
                    type="text"
                    value={form.city}
                    onChange={(event) =>
                      handleChange(
                        "city",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Nairobi"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* County */}
                <div>
                  <label
                    htmlFor="county"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    County
                  </label>

                  <input
                    id="county"
                    type="text"
                    value={form.county}
                    onChange={(event) =>
                      handleChange(
                        "county",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Nairobi County"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Latitude */}
                <div>
                  <label
                    htmlFor="latitude"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Latitude
                    <span className="ml-1 text-xs text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="latitude"
                    type="number"
                    step="any"
                    value={
                      form.latitude ?? ""
                    }
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        latitude:
                          event.target.value
                            ? Number(
                                event.target.value
                              )
                            : undefined,
                      }))
                    }
                    placeholder="-1.286389"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Longitude */}
                <div>
                  <label
                    htmlFor="longitude"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Longitude
                    <span className="ml-1 text-xs text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="longitude"
                    type="number"
                    step="any"
                    value={
                      form.longitude ?? ""
                    }
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        longitude:
                          event.target.value
                            ? Number(
                                event.target.value
                              )
                            : undefined,
                      }))
                    }
                    placeholder="36.817223"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Address"
                      : "Add Address"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Saved Addresses */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Saved Addresses
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your saved service locations.
              </p>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                <p className="text-sm text-slate-500">
                  Loading addresses...
                </p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <h3 className="text-base font-semibold text-slate-900">
                  No saved addresses
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Add your first address above to use
                  it when booking a HomeServe service.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {addresses.map((address) => (
                  <article
                    key={address.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {address.label}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {address.addressLine}
                          <br />
                          {address.city}
                          {address.county
                            ? `, ${address.county}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    {(address.latitude !== null &&
                      address.latitude !== undefined) ||
                    (address.longitude !== null &&
                      address.longitude !== undefined) ? (
                      <div className="mt-3 text-xs text-slate-400">
                        Coordinates:{" "}
                        {address.latitude ?? "—"},{" "}
                        {address.longitude ?? "—"}
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          startEditing(address)
                        }
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(address.id)
                        }
                        disabled={
                          deletingId === address.id
                        }
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === address.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                      {returnTo && (
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `${returnTo}${returnTo.includes("?") ? "&" : "?"}addressId=${address.id}`
                            )
                          }
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                          Use This Address
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}

export default function AddressesPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell>
          <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                <p className="text-sm text-slate-500">
                  Loading addresses...
                </p>
              </div>
            </div>
          </main>
        </DashboardShell>
      }
    >
      <AddressesContent />
    </Suspense>
  );
}
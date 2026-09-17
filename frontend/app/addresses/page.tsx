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

          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                  Customer Account
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#061F35] sm:text-3xl">
                  My Addresses
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Save the locations where you need
                  HomeServe services. Your saved addresses
                  can be selected when making a booking.
                </p>
              </div>

              {returnTo && (
                <button
                  type="button"
                  onClick={handleBackToBooking}
                  className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                >
                  <span>←</span>
                  Back to booking
                </button>
              )}

            </div>

            {/* Booking context */}
            {returnTo && (
              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                <p className="text-sm text-blue-800">
                  Add your service address below and
                  you'll automatically return to your
                  booking.
                </p>
              </div>
            )}
          </div>

          {/* =====================================================
              CONTENT
          ===================================================== */}

          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

            {/* =================================================
                ADDRESS FORM
            ================================================= */}

            <section className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  {editingId
                    ? "Edit Address"
                    : "New Address"}
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#061F35] sm:text-2xl">
                  {editingId
                    ? "Update your address"
                    : "Add an address"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {editingId
                    ? "Update the details of your saved service location."
                    : "Save a location for faster and easier bookings."}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-4"
              >

                {/* Label */}
                <div>
                  <label
                    htmlFor="label"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Label
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
                    placeholder="e.g. Home"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="addressLine"
                    className="mb-2 block text-sm font-semibold text-slate-700"
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
                    placeholder="Street, building or estate"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-semibold text-slate-700"
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
                    placeholder="e.g. Chuka"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* County */}
                <div>
                  <label
                    htmlFor="county"
                    className="mb-2 block text-sm font-semibold text-slate-700"
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
                    placeholder="e.g. Tharaka-Nithi"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Messages */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  )}

                </div>
              </form>
            </section>

            {/* =================================================
                SAVED ADDRESSES
            ================================================= */}

            <section>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                    Saved Locations
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-[#061F35] sm:text-2xl">
                    Your addresses
                  </h2>
                </div>

                <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  {addresses.length}{" "}
                  {addresses.length === 1
                    ? "address"
                    : "addresses"}
                </span>
              </div>

              {/* Loading */}
              {loading ? (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                  <p className="text-sm text-slate-500">
                    Loading your addresses...
                  </p>
                </div>
              ) : addresses.length === 0 ? (
                /* Empty */
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm sm:p-10">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600">
                    +
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#061F35]">
                    No saved addresses
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Add your first service location
                    using the form.
                  </p>

                </div>
              ) : (
                /* Address cards */
                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                  {addresses.map((address) => (
                    <article
                      key={address.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                    >

                      {/* Card header */}
                      <div className="flex items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
                          ⌂
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-bold text-[#061F35]">
                            {address.label}
                          </h3>

                          <p className="mt-0.5 text-xs text-slate-400">
                            Service location
                          </p>
                        </div>

                      </div>

                      {/* Address */}
                      <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                        <p>{address.addressLine}</p>

                        <p>
                          {address.city},{" "}
                          {address.county}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            startEditing(address)
                          }
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
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
                          className="flex-1 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === address.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>
                    </article>
                  ))}

                </div>
              )}

            </section>
          </div>
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
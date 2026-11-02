
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
  const [form, setForm] = useState<CreateAddressData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      latitude: address.latitude ?? undefined,
      longitude: address.longitude ?? undefined,
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (editingId) {
        const updated = await updateAddress(editingId, form);

        setAddresses((current) =>
          current.map((address) =>
            address.id === editingId ? updated : address
          )
        );

        setSuccess("Address updated successfully.");

        setEditingId(null);
        setForm(emptyForm);
      } else {
        const created = await createAddress(form);

        setAddresses((current) => [created, ...current]);

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
        current.filter((address) => address.id !== id)
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
      <main className="min-h-full bg-slate-50 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-5 sm:space-y-7">

          {/* Page heading */}
          <div className="border border-[#061F35] bg-[#061F35] px-4 py-4 sm:px-5 sm:py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">
                  Customer Account
                </p>

                <h1 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                  My Addresses
                </h1>

                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-blue-100 sm:text-sm">
                  Manage your saved service locations for faster and easier
                  bookings.
                </p>
              </div>

              {returnTo && (
                <button
                  type="button"
                  onClick={handleBackToBooking}
                  className="w-fit shrink-0 border border-white/30 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  ← Back to booking
                </button>
              )}
            </div>
          </div>

          {/* Booking context */}
          {returnTo && (
            <div className="flex items-start gap-3 border border-blue-200 bg-blue-50 px-3 py-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-blue-100 text-xs font-bold text-blue-700">
                i
              </span>

              <p className="text-xs leading-relaxed text-blue-800">
                Add your service address below and you'll automatically return
                to your booking.
              </p>
            </div>
          )}

          {/* Feedback messages */}
          {error && (
            <div className="flex items-start gap-2 border border-red-200 bg-red-50 px-3 py-3 text-xs text-red-700">
              <span className="font-bold">!</span>
              <p className="min-w-0 flex-1">{error}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                className="shrink-0 font-bold"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 border border-green-200 bg-green-50 px-3 py-3 text-xs text-green-700">
              <span className="font-bold">✓</span>
              <p className="min-w-0 flex-1">{success}</p>
              <button
                type="button"
                onClick={() => setSuccess(null)}
                className="shrink-0 font-bold"
                aria-label="Dismiss success message"
              >
                ✕
              </button>
            </div>
          )}

          {/* Main content */}
          <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-6">

            {/* Address form */}
            <section className="h-fit border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="border-b border-slate-100 pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                  {editingId ? "Edit Address" : "New Address"}
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#061F35]">
                  {editingId ? "Update your address" : "Add an address"}
                </h2>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {editingId
                    ? "Update the details of your saved service location."
                    : "Save a location for faster and easier bookings."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <div>
                  <label
                    htmlFor="label"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                  >
                    Address label
                  </label>

                  <input
                    id="label"
                    type="text"
                    value={form.label}
                    onChange={(event) =>
                      handleChange("label", event.target.value)
                    }
                    placeholder="e.g. Home"
                    required
                    className="w-full border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="addressLine"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                  >
                    Street / Building / Estate
                  </label>

                  <input
                    id="addressLine"
                    type="text"
                    value={form.addressLine}
                    onChange={(event) =>
                      handleChange("addressLine", event.target.value)
                    }
                    placeholder="Street, building or estate"
                    required
                    className="w-full border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <label
                      htmlFor="city"
                      className="mb-1.5 block text-xs font-semibold text-slate-700"
                    >
                      City / Town
                    </label>

                    <input
                      id="city"
                      type="text"
                      value={form.city}
                      onChange={(event) =>
                        handleChange("city", event.target.value)
                      }
                      placeholder="e.g. Chuka"
                      required
                      className="w-full min-w-0 border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="min-w-0">
                    <label
                      htmlFor="county"
                      className="mb-1.5 block text-xs font-semibold text-slate-700"
                    >
                      County
                    </label>

                    <input
                      id="county"
                      type="text"
                      value={form.county}
                      onChange={(event) =>
                        handleChange("county", event.target.value)
                      }
                      placeholder="e.g. Tharaka-Nithi"
                      required
                      className="w-full min-w-0 border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#061F35] px-3 py-3 text-xs font-bold text-white transition hover:bg-[#082B49] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Update Address"
                        : "Add Address"}
                  </button>

                  {editingId ? (
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  ) : (
                    <div className="flex items-center justify-center border border-slate-100 bg-slate-50 px-2 text-center">
                      <span className="text-[10px] text-slate-400">
                        Saved for future bookings
                      </span>
                    </div>
                  )}
                </div>
              </form>
            </section>

            {/* Saved addresses */}
            <section className="min-w-0">
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                    Saved Locations
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-[#061F35]">
                    Your addresses
                  </h2>
                </div>

                <span className="shrink-0 border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-[10px] font-semibold text-blue-700">
                  {addresses.length}{" "}
                  {addresses.length === 1 ? "address" : "addresses"}
                </span>
              </div>

              {/* Loading */}
              {loading ? (
                <div className="flex min-h-40 flex-col items-center justify-center gap-3 border border-slate-200 bg-white p-6">
                  <div className="h-6 w-6 animate-spin border-2 border-slate-200 border-t-blue-600" />
                  <p className="text-xs text-slate-500">
                    Loading your addresses...
                  </p>
                </div>
              ) : addresses.length === 0 ? (
                /* Empty state */
                <div className="border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center border border-blue-100 bg-blue-50 text-xl font-bold text-blue-600">
                    +
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-[#061F35]">
                    No saved addresses
                  </h3>

                  <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                    Add your first service location using the form.
                  </p>
                </div>
              ) : (
                /* Two-column address cards on mobile */
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                  {addresses.map((address) => (
                    <article
                      key={address.id}
                      className="flex min-w-0 flex-col border border-slate-200 bg-white p-3 shadow-sm transition hover:border-blue-200 sm:p-4"
                    >
                      <div className="flex min-w-0 items-start gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-blue-50 text-base text-blue-600 sm:h-10 sm:w-10">
                          ⌂
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-xs font-bold leading-snug text-[#061F35] sm:text-sm">
                            {address.label}
                          </h3>

                          <p className="mt-0.5 text-[9px] text-slate-400 sm:text-[10px]">
                            Service location
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 min-w-0 flex-1 border-t border-slate-100 pt-3">
                        <p className="break-words text-[10px] leading-relaxed text-slate-600 sm:text-xs">
                          {address.addressLine}
                        </p>

                        <p className="mt-1 break-words text-[10px] font-medium leading-relaxed text-slate-700 sm:text-xs">
                          {address.city}, {address.county}
                        </p>
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => startEditing(address)}
                          className="border border-slate-200 px-2 py-2 text-[10px] font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:text-xs"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(address.id)}
                          disabled={deletingId === address.id}
                          className="border border-red-200 px-2 py-2 text-[10px] font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
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
          <main className="min-h-full bg-slate-50 px-3 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-40 max-w-6xl flex-col items-center justify-center gap-3 border border-slate-200 bg-white p-8">
              <div className="h-6 w-6 animate-spin border-2 border-slate-200 border-t-blue-600" />
              <p className="text-xs text-slate-500">
                Loading addresses...
              </p>
            </div>
          </main>
        </DashboardShell>
      }
    >
      <AddressesContent />
    </Suspense>
  );
}

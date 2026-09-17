"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Settings,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import SettingsShell from "@/components/settings/SettingsShell";
import SettingSection from "@/components/settings/SettingsSection";
import SettingInput from "@/components/settings/SettingsInput";
import SettingToggle from "@/components/settings/SettingsToggle";

import {
  getSystemSettings,
  updateSystemSetting,
} from "@/lib/settings";

import type { SystemSetting } from "@/types/settings";

const sections = [
  { id: "business", label: "Business" },
  { id: "booking", label: "Booking" },
  { id: "payment", label: "Payments" },
  { id: "notification", label: "Notifications" },
  { id: "staff", label: "Staff" },
  { id: "security", label: "Security" },
  { id: "system", label: "System" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const data = await getSystemSettings();

      setSettings(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load system settings."
      );
    } finally {
      setLoading(false);
    }
  }

  const settingMap = useMemo(() => {
    return Object.fromEntries(
      settings.map((setting) => [setting.key, setting])
    );
  }, [settings]);

  function getValue(key: string): string {
    return settingMap[key]?.value ?? "";
  }

  function getBoolean(key: string): boolean {
    return getValue(key).toLowerCase() === "true";
  }

  function updateLocalValue(
    key: string,
    value: string
  ) {
    setSettings((current) =>
      current.map((setting) =>
        setting.key === key
          ? {
              ...setting,
              value,
            }
          : setting
      )
    );
  }

  async function saveSetting(
    key: string,
    value: string
  ) {
    try {
      setSavingKey(key);
      setSuccess("");
      setError("");

      await updateSystemSetting(key, value);

      setSuccess("Settings saved successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save setting."
      );
    } finally {
      setSavingKey(null);
    }
  }

  function SettingSaveButton({
    settingKey,
  }: {
    settingKey: string;
  }) {
    const isSaving = savingKey === settingKey;

    return (
      <button
        type="button"
        onClick={() =>
          saveSetting(
            settingKey,
            getValue(settingKey)
          )
        }
        disabled={isSaving}
        className="inline-flex items-center gap-2 rounded-lg bg-[#061F35] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#082B49] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save
          </>
        )}
      </button>
    );
  }

  function BooleanSetting({
    settingKey,
    label,
    description,
  }: {
    settingKey: string;
    label: string;
    description: string;
  }) {
    const enabled = getBoolean(settingKey);
    const isSaving = savingKey === settingKey;

    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SettingToggle
            label={label}
            description={description}
            enabled={enabled}
            disabled={isSaving}
            onChange={(value: boolean) => {
              const newValue = value
                ? "true"
                : "false";

              updateLocalValue(
                settingKey,
                newValue
              );

              saveSetting(
                settingKey,
                newValue
              );
            }}
          />

          {isSaving && (
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading settings...
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3">
                <Settings className="h-6 w-6 text-[#061F35]" />
              </div>

              <h1 className="text-2xl font-bold text-[#061F35]">
                System Settings
              </h1>
            </div>

            <p className="text-sm text-gray-600">
              Configure HomeServe platform-wide business,
              booking, payment, staff, notification and
              system behavior.
            </p>
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {success}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {/* SETTINGS */}
        <SettingsShell
          title="HomeServe Configuration"
          description="Manage the platform's global configuration."
          sections={sections}
        >
          {(activeSection) => (
            <div className="space-y-6">

              {/* ================= BUSINESS ================= */}

              {activeSection === "business" && (
                <SettingSection
                  title="Business Information"
                  description="Basic information displayed throughout the HomeServe platform."
                >
                  <div className="space-y-5">

                    {/* Business Name */}
                    <div>
                      <SettingInput
                        label="Business Name"
                        description="The name displayed to customers."
                        value={getValue("business.name")}
                        onChange={(value: string) =>
                          updateLocalValue(
                            "business.name",
                            value
                          )
                        }
                      />

                      <div className="mt-3">
                        <SettingSaveButton
                          settingKey="business.name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <SettingInput
                        label="Support Email"
                        type="email"
                        description="Primary email customers can use to contact HomeServe."
                        value={getValue("business.email")}
                        onChange={(value: string) =>
                          updateLocalValue(
                            "business.email",
                            value
                          )
                        }
                      />

                      <div className="mt-3">
                        <SettingSaveButton
                          settingKey="business.email"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <SettingInput
                        label="Support Phone"
                        type="tel"
                        description="Primary customer support telephone number."
                        value={getValue("business.phone")}
                        onChange={(value: string) =>
                          updateLocalValue(
                            "business.phone",
                            value
                          )
                        }
                      />

                      <div className="mt-3">
                        <SettingSaveButton
                          settingKey="business.phone"
                        />
                      </div>
                    </div>

                    {/* Timezone */}
                    <div>
                      <SettingInput
                        label="Business Timezone"
                        description="Timezone used for bookings and platform operations."
                        value={getValue("business.timezone")}
                        onChange={(value: string) =>
                          updateLocalValue(
                            "business.timezone",
                            value
                          )
                        }
                      />

                      <div className="mt-3">
                        <SettingSaveButton
                          settingKey="business.timezone"
                        />
                      </div>
                    </div>

                  </div>
                </SettingSection>
              )}

              {/* ================= BOOKING ================= */}

              {activeSection === "booking" && (
                <SettingSection
                  title="Booking Rules"
                  description="Control how customers create and manage service bookings."
                >
                  <div className="space-y-6">

                    {/* Minimum Lead Time */}
                    <div>
                      <SettingInput
                        label="Minimum Lead Time"
                        type="number"
                        description="Minimum number of hours required before a booking can be scheduled."
                        value={getValue(
                          "booking.minimumLeadTime"
                        )}
                        onChange={(value: string) =>
                          updateLocalValue(
                            "booking.minimumLeadTime",
                            value
                          )
                        }
                      />

                      <div className="mt-3">
                        <SettingSaveButton
                          settingKey="booking.minimumLeadTime"
                        />
                      </div>
                    </div>

                    {/* Cancellation Window */}
                    <div>
                      <SettingInput
                        label="Cancellation Window"
                        type="number"
                        description="Number of hours before the scheduled service when cancellation rules apply."
                        value={getValue(
                          "booking.cancellationWindow"
                        )}
                        onChange={(value: string) =>
                          updateLocalValue(
                            "booking.cancellationWindow",
                            value
                          )
                        }
                      />

                      <div className="mt-3">
                        <SettingSaveButton
                          settingKey="booking.cancellationWindow"
                        />
                      </div>
                    </div>

                    {/* Require Address */}
                    <BooleanSetting
                      settingKey="booking.requireAddress"
                      label="Require Customer Address"
                      description="Require customers to provide an address before completing a booking."
                    />

                    {/* Allow Bookings */}
                    <BooleanSetting
                      settingKey="system.allowNewBookings"
                      label="Allow New Bookings"
                      description="When disabled, customers cannot create new bookings."
                    />

                  </div>
                </SettingSection>
              )}

              {/* ================= PAYMENT ================= */}

              {activeSection === "payment" && (
                <SettingSection
                  title="Payment Configuration"
                  description="Configure supported payment methods and payment requirements."
                >
                  <div className="space-y-6">

                    {/* Currency */}
                    <div>
                      <SettingInput
                        label="Currency"
                        description="Currency used throughout the platform."
                        value={getValue(
                          "payment.currency"
                        )}
                        onChange={(value: string) =>
                          updateLocalValue(
                            "payment.currency",
                            value
                          )
                        }
                      />

                      <div className="mt-3">
                        <SettingSaveButton
                          settingKey="payment.currency"
                        />
                      </div>
                    </div>

                    {/* Require Payment */}
                    <BooleanSetting
                      settingKey="payment.requirePayment"
                      label="Require Payment"
                      description="Require customers to make payment before completing the booking process."
                    />

                    {/* M-Pesa */}
                    <BooleanSetting
                      settingKey="payment.mpesaEnabled"
                      label="M-Pesa"
                      description="Allow customers to use M-Pesa payments."
                    />

                    {/* Card */}
                    <BooleanSetting
                      settingKey="payment.cardEnabled"
                      label="Card Payments"
                      description="Allow customers to pay using supported card payments."
                    />

                    {/* Cash */}
                    <BooleanSetting
                      settingKey="payment.cashEnabled"
                      label="Cash Payments"
                      description="Allow customers to select cash as a payment method."
                    />

                  </div>
                </SettingSection>
              )}

              {/* ================= NOTIFICATIONS ================= */}

              {activeSection === "notification" && (
                <SettingSection
                  title="Platform Notifications"
                  description="Control automated notification features across HomeServe."
                >
                  <div className="space-y-5">

                    <BooleanSetting
                      settingKey="notification.bookingConfirmation"
                      label="Booking Confirmation"
                      description="Send notifications when a booking is successfully created."
                    />

                    <BooleanSetting
                      settingKey="notification.bookingReminder"
                      label="Booking Reminders"
                      description="Enable reminders for upcoming bookings."
                    />

                    <BooleanSetting
                      settingKey="notification.quoteNotification"
                      label="Quote Notifications"
                      description="Enable notifications related to customer quotes."
                    />

                    <BooleanSetting
                      settingKey="notification.paymentNotification"
                      label="Payment Notifications"
                      description="Enable notifications related to payment events."
                    />

                  </div>
                </SettingSection>
              )}

              {/* ================= STAFF ================= */}

              {activeSection === "staff" && (
                <SettingSection
                  title="Staff Configuration"
                  description="Configure staff availability and workflow behavior."
                >
                  <div className="space-y-5">

                    <BooleanSetting
                      settingKey="staff.requireAvailability"
                      label="Require Staff Availability"
                      description="Only allow staff assignments when the staff member is available."
                    />

                    <BooleanSetting
                      settingKey="staff.allowSelfStatusUpdate"
                      label="Allow Staff Status Updates"
                      description="Allow staff members to update their own booking progress."
                    />

                  </div>
                </SettingSection>
              )}

              {/* ================= SECURITY ================= */}

              {activeSection === "security" && (
                <SettingSection
                  title="Security Configuration"
                  description="Configure platform authentication and administrative security policies."
                >
                  <div className="space-y-6">

                    {/* Session Duration */}
                    <div>
                      <SettingInput
                        label="Session Duration"
                        type="number"
                        description="Duration of an authenticated session in hours."
                        value={getValue(
                          "security.sessionDuration"
                        )}
                        onChange={(value: string) =>
                          updateLocalValue(
                            "security.sessionDuration",
                            value
                          )
                        }
                      />

                      <div className="mt-3">
                        <SettingSaveButton
                          settingKey="security.sessionDuration"
                        />
                      </div>
                    </div>

                    {/* 2FA */}
                    <BooleanSetting
                      settingKey="security.requireTwoFactorForAdmins"
                      label="Require Two-Factor Authentication for Admins"
                      description="Configuration flag for the future administrator 2FA system."
                    />

                  </div>
                </SettingSection>
              )}

              {/* ================= SYSTEM ================= */}

              {activeSection === "system" && (
                <SettingSection
                  title="System Controls"
                  description="Global controls affecting HomeServe availability."
                >
                  <div className="space-y-5">

                    {/* Maintenance */}
                    <BooleanSetting
                      settingKey="system.maintenanceMode"
                      label="Maintenance Mode"
                      description="Place the platform into maintenance mode."
                    />

                    {/* New Bookings */}
                    <BooleanSetting
                      settingKey="system.allowNewBookings"
                      label="Allow New Bookings"
                      description="Enable or disable new customer bookings."
                    />

                  </div>
                </SettingSection>
              )}

            </div>
          )}
        </SettingsShell>
      </div>
    </DashboardShell>
  );
}
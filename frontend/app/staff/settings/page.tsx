"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  MessageSquare,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lock,
  BriefcaseBusiness,
  Clock3,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import SettingsShell from "@/components/settings/SettingsShell";
import SettingSection from "@/components/settings/SettingsSection";
import SettingInput from "@/components/settings/SettingsInput";
import SettingToggle from "@/components/settings/SettingsToggle";

import {
  getMySettings,
  updateMySettings,
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
} from "@/lib/settings";

import {
  getMyStaffProfile,
  updateMyAvailability,
} from "@/lib/staff";

import type {
  UserSetting,
  UserProfile,
} from "@/types/settings";

import type { Staff } from "@/types/staff";

const sections = [
  { id: "profile", label: "Profile" },
  { id: "work", label: "Work" },
  { id: "preferences", label: "Preferences" },
  { id: "notifications", label: "Notifications" },
  { id: "availability", label: "Availability" },
  { id: "security", label: "Security" },
];

export default function StaffSettingsPage() {
  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [settings, setSettings] =
    useState<UserSetting | null>(null);

  const [staffProfile, setStaffProfile] =
    useState<Staff | null>(null);

  const [loading, setLoading] = useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [savingSettings, setSavingSettings] =
    useState(false);

  const [savingAvailability, setSavingAvailability] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const [
        profileData,
        settingsData,
        staffData,
      ] = await Promise.all([
        getMyProfile(),
        getMySettings(),
        getMyStaffProfile(),
      ]);

      setProfile(profileData);
      setSettings(settingsData);
      setStaffProfile(staffData);

      setName(profileData.name);
      setPhone(profileData.phone ?? "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load your settings."
      );
    } finally {
      setLoading(false);
    }
  }

  function showSuccess(message: string) {
    setSuccess(message);
    setError("");

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  }

  function showError(message: string) {
    setError(message);
    setSuccess("");
  }

  async function saveProfile() {
    try {
      setSavingProfile(true);

      const updated = await updateMyProfile({
        name,
        phone: phone.trim() || null,
      });

      setProfile(updated);

      showSuccess(
        "Profile updated successfully."
      );
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : "Failed to update your profile."
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function updateSetting(
    field: keyof UserSetting,
    value: string | boolean
  ) {
    if (!settings) return;

    try {
      setSavingSettings(true);

      const updated =
        await updateMySettings({
          [field]: value,
        });

      setSettings(updated);

      showSuccess(
        "Settings updated successfully."
      );
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : "Failed to update setting."
      );
    } finally {
      setSavingSettings(false);
    }
  }

  async function saveAvailability(
    available: boolean
  ) {
    try {
      setSavingAvailability(true);

      const updated =
        await updateMyAvailability(
          available
        );

      setStaffProfile(updated);

      showSuccess(
        available
          ? "You are now available for assignments."
          : "You are now unavailable for assignments."
      );
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : "Failed to update availability."
      );
    } finally {
      setSavingAvailability(false);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword) {
      showError(
        "Enter your current password."
      );
      return;
    }

    if (!newPassword) {
      showError(
        "Enter a new password."
      );
      return;
    }

    if (newPassword.length < 8) {
      showError(
        "Your new password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      await changeMyPassword(
        currentPassword,
        newPassword,
        confirmPassword
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showSuccess(
        "Password changed successfully."
      );
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : "Failed to change your password."
      );
    } finally {
      setChangingPassword(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading your settings...
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (
    !profile ||
    !settings ||
    !staffProfile
  ) {
    return (
      <DashboardShell>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
          Unable to load your staff settings.
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">

        {/* HEADER */}

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-3">
            <BriefcaseBusiness className="h-6 w-6 text-[#061F35]" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#061F35]">
              Staff Settings
            </h1>

            <p className="text-sm text-gray-600">
              Manage your staff profile, work preferences,
              availability, notifications and security.
            </p>
          </div>
        </div>

        {/* SUCCESS */}

        {success && (
          <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {success}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        <SettingsShell
          title="Staff Account Settings"
          description="Customize your HomeServe staff account and work preferences."
          sections={sections}
        >
          {(activeSection) => (
            <div className="space-y-6">

              {/* ================= PROFILE ================= */}

              {activeSection === "profile" && (
                <SettingSection
                  title="Profile Information"
                  description="Update the personal information associated with your staff account."
                >
                  <div className="space-y-5">

                    <SettingInput
                      label="Full Name"
                      value={name}
                      onChange={(value: string) =>
                        setName(value)
                      }
                    />

                    <SettingInput
                      label="Email Address"
                      type="email"
                      value={profile.email}
                      disabled
                      onChange={() => {}}
                      description="Your staff account email is used for authentication and cannot be changed here."
                    />

                    <SettingInput
                      label="Phone Number"
                      type="tel"
                      value={phone}
                      onChange={(value: string) =>
                        setPhone(value)
                      }
                    />

                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <User className="h-5 w-5 text-gray-500" />

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Account Role
                        </p>

                        <p className="text-sm text-gray-600">
                          {profile.role}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={saveProfile}
                      disabled={savingProfile}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#061F35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#082B49] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingProfile ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Profile
                        </>
                      )}
                    </button>

                  </div>
                </SettingSection>
              )}

              {/* ================= WORK ================= */}

              {activeSection === "work" && (
                <SettingSection
                  title="Work Information"
                  description="Information about your HomeServe staff role."
                >
                  <div className="space-y-5">

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                      <div className="flex items-start gap-4">

                        <div className="rounded-lg bg-blue-50 p-3">
                          <BriefcaseBusiness className="h-5 w-5 text-[#061F35]" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Staff Type
                          </p>

                          <p className="mt-1 text-lg font-bold text-[#061F35]">
                            {staffProfile.staffType}
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            Your staff type determines which
                            service categories you can be assigned.
                          </p>
                        </div>

                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                      <div className="flex items-start gap-4">

                        <div className="rounded-lg bg-blue-50 p-3">
                          <Clock3 className="h-5 w-5 text-[#061F35]" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Availability Status
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            {staffProfile.isAvailable
                              ? "Available for assignments"
                              : "Currently unavailable for assignments"}
                          </p>
                        </div>

                      </div>
                    </div>

                    <p className="text-sm text-gray-500">
                      Staff type and other employment information
                      are managed by HomeServe administrators.
                    </p>

                  </div>
                </SettingSection>
              )}

              {/* ================= PREFERENCES ================= */}

              {activeSection === "preferences" && (
                <SettingSection
                  title="Preferences"
                  description="Choose how HomeServe displays information for your account."
                >
                  <div className="space-y-5">

                    <SettingInput
                      label="Language"
                      description="Your preferred language."
                      value={settings.language}
                      onChange={(value: string) =>
                        updateSetting(
                          "language",
                          value
                        )
                      }
                    />

                    <SettingInput
                      label="Currency"
                      description="Currency used when displaying prices."
                      value={settings.currency}
                      onChange={(value: string) =>
                        updateSetting(
                          "currency",
                          value
                        )
                      }
                    />

                    <SettingInput
                      label="Timezone"
                      description="Timezone used for dates and booking times."
                      value={settings.timezone}
                      onChange={(value: string) =>
                        updateSetting(
                          "timezone",
                          value
                        )
                      }
                    />

                  </div>
                </SettingSection>
              )}

              {/* ================= NOTIFICATIONS ================= */}

              {activeSection === "notifications" && (
                <SettingSection
                  title="Notifications"
                  description="Control the HomeServe notifications you receive."
                >
                  <div className="space-y-6">

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-[#061F35]" />

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Email Notifications
                        </h3>

                        <p className="text-sm text-gray-600">
                          Choose which events should generate
                          email notifications.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">

                      <SettingToggle
                        label="Booking Updates"
                        description="Receive emails about booking assignments and status changes."
                        enabled={
                          settings.emailBookingUpdates
                        }
                        disabled={savingSettings}
                        onChange={(value: boolean) =>
                          updateSetting(
                            "emailBookingUpdates",
                            value
                          )
                        }
                      />

                      <SettingToggle
                        label="Quote Updates"
                        description="Receive notifications about quote changes."
                        enabled={
                          settings.emailQuoteUpdates
                        }
                        disabled={savingSettings}
                        onChange={(value: boolean) =>
                          updateSetting(
                            "emailQuoteUpdates",
                            value
                          )
                        }
                      />

                      <SettingToggle
                        label="Payment Updates"
                        description="Receive notifications about payment events."
                        enabled={
                          settings.emailPaymentUpdates
                        }
                        disabled={savingSettings}
                        onChange={(value: boolean) =>
                          updateSetting(
                            "emailPaymentUpdates",
                            value
                          )
                        }
                      />

                      <SettingToggle
                        label="Service Updates"
                        description="Receive important HomeServe service updates."
                        enabled={
                          settings.emailServiceUpdates
                        }
                        disabled={savingSettings}
                        onChange={(value: boolean) =>
                          updateSetting(
                            "emailServiceUpdates",
                            value
                          )
                        }
                      />

                      <SettingToggle
                        label="System Announcements"
                        description="Receive important platform announcements."
                        enabled={
                          settings.emailSystemAnnouncements
                        }
                        disabled={savingSettings}
                        onChange={(value: boolean) =>
                          updateSetting(
                            "emailSystemAnnouncements",
                            value
                          )
                        }
                      />

                    </div>

                    <div className="border-t border-gray-200 pt-6">

                      <div className="mb-4 flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-[#061F35]" />

                        <div>
                          <h3 className="font-semibold text-gray-900">
                            SMS Notifications
                          </h3>

                          <p className="text-sm text-gray-600">
                            Control important SMS notifications.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">

                        <SettingToggle
                          label="Booking Updates"
                          description="Receive SMS notifications about booking changes."
                          enabled={
                            settings.smsBookingUpdates
                          }
                          disabled={savingSettings}
                          onChange={(value: boolean) =>
                            updateSetting(
                              "smsBookingUpdates",
                              value
                            )
                          }
                        />

                        <SettingToggle
                          label="Quote Updates"
                          description="Receive SMS notifications about quote changes."
                          enabled={
                            settings.smsQuoteUpdates
                          }
                          disabled={savingSettings}
                          onChange={(value: boolean) =>
                            updateSetting(
                              "smsQuoteUpdates",
                              value
                            )
                          }
                        />

                        <SettingToggle
                          label="Payment Updates"
                          description="Receive SMS notifications about payment events."
                          enabled={
                            settings.smsPaymentUpdates
                          }
                          disabled={savingSettings}
                          onChange={(value: boolean) =>
                            updateSetting(
                              "smsPaymentUpdates",
                              value
                            )
                          }
                        />

                      </div>
                    </div>

                  </div>
                </SettingSection>
              )}

              {/* ================= AVAILABILITY ================= */}

              {activeSection === "availability" && (
                <SettingSection
                  title="Availability"
                  description="Control whether HomeServe can assign new bookings to you."
                >
                  <div className="space-y-6">

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                      <div className="flex items-start gap-4">

                        <div className="rounded-lg bg-blue-50 p-3">
                          <Clock3 className="h-5 w-5 text-[#061F35]" />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            Assignment Availability
                          </h3>

                          <p className="mt-1 text-sm leading-6 text-gray-600">
                            When you're unavailable, administrators
                            should not assign new bookings to you.
                            Existing assignments are not automatically
                            cancelled.
                          </p>
                        </div>

                      </div>
                    </div>

                    <SettingToggle
                      label="Available for Assignments"
                      description={
                        staffProfile.isAvailable
                          ? "You are currently available for new staff assignments."
                          : "You are currently unavailable for new staff assignments."
                      }
                      enabled={
                        staffProfile.isAvailable
                      }
                      disabled={savingAvailability}
                      onChange={(value: boolean) =>
                        saveAvailability(value)
                      }
                    />

                  </div>
                </SettingSection>
              )}

              {/* ================= SECURITY ================= */}

              {activeSection === "security" && (
                <SettingSection
                  title="Account Security"
                  description="Change your staff account password."
                >
                  <div className="space-y-5">

                    <SettingInput
                      label="Current Password"
                      type="password"
                      value={currentPassword}
                      onChange={(value: string) =>
                        setCurrentPassword(value)
                      }
                    />

                    <SettingInput
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(value: string) =>
                        setNewPassword(value)
                      }
                    />

                    <SettingInput
                      label="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(value: string) =>
                        setConfirmPassword(value)
                      }
                    />

                    <button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={changingPassword}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#061F35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#082B49] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {changingPassword ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" />
                          Change Password
                        </>
                      )}
                    </button>

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
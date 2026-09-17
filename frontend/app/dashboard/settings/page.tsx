"use client";

import { useEffect, useState } from "react";
import {
  User,
  Globe,
  Mail,
  MessageSquare,
  Shield,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lock,
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
  deleteMyAccount,
} from "@/lib/settings";

import type {
  UserSetting,
  UserProfile,
} from "@/types/settings";

const sections = [
  { id: "profile", label: "Profile" },
  { id: "preferences", label: "Preferences" },
  { id: "email", label: "Email" },
  { id: "sms", label: "SMS" },
  { id: "marketing", label: "Marketing" },
  { id: "security", label: "Security" },
  { id: "account", label: "Account" },
];

export default function CustomerSettingsPage() {
  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [settings, setSettings] =
    useState<UserSetting | null>(null);

  const [loading, setLoading] = useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [savingSettings, setSavingSettings] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [deletingAccount, setDeletingAccount] =
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

      const [profileData, settingsData] =
        await Promise.all([
          getMyProfile(),
          getMySettings(),
        ]);

      setProfile(profileData);
      setSettings(settingsData);

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

      showSuccess("Profile updated successfully.");
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

      showSuccess("Settings updated successfully.");
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

   async function handleChangePassword() {
  if (!currentPassword) {
    showError("Enter your current password.");
    return;
  }

  if (!newPassword) {
    showError("Enter a new password.");
    return;
  }

  if (newPassword.length < 8) {
    showError(
      "Your new password must be at least 8 characters."
    );
    return;
  }

  if (newPassword !== confirmPassword) {
    showError("Passwords do not match.");
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

    showSuccess("Password changed successfully.");
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

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your HomeServe account? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingAccount(true);

      await deleteMyAccount();

      window.location.href = "/register";
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : "Failed to delete your account."
      );

      setDeletingAccount(false);
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

  if (!profile || !settings) {
    return (
      <DashboardShell>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
          Unable to load your settings.
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
            <User className="h-6 w-6 text-[#061F35]" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#061F35]">
              Settings
            </h1>

            <p className="text-sm text-gray-600">
              Manage your HomeServe profile,
              preferences, notifications and security.
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
          title="Account Settings"
          description="Customize your HomeServe account and communication preferences."
          sections={sections}
        >
          {(activeSection) => (
            <div className="space-y-6">

              {/* ================= PROFILE ================= */}

              {activeSection === "profile" && (
                <SettingSection
                  title="Profile Information"
                  description="Update the personal information associated with your HomeServe account."
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
  description="Your email address is used for account authentication and cannot be changed here."
/>

                    <SettingInput
                      label="Phone Number"
                      type="tel"
                      value={phone}
                      onChange={(value: string) =>
                        setPhone(value)
                      }
                    />

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

              {/* ================= EMAIL ================= */}

              {activeSection === "email" && (
                <SettingSection
                  title="Email Notifications"
                  description="Choose which HomeServe events you want to receive by email."
                >
                  <div className="space-y-4">

                    <SettingToggle
                      label="Booking Updates"
                      description="Receive emails about booking creation, status changes and cancellations."
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
                      description="Receive notifications when quotes are created or updated."
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
                      description="Receive notifications about payment status and transactions."
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
                      description="Receive important updates related to HomeServe services."
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
                      description="Receive important platform announcements and service notices."
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
                </SettingSection>
              )}

              {/* ================= SMS ================= */}

              {activeSection === "sms" && (
                <SettingSection
                  title="SMS Notifications"
                  description="Choose which important HomeServe events you want to receive by SMS."
                >
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
                </SettingSection>
              )}

              {/* ================= MARKETING ================= */}

              {activeSection === "marketing" && (
                <SettingSection
                  title="Marketing Communications"
                  description="Control optional promotional communications from HomeServe."
                >
                  <SettingToggle
                    label="Marketing Notifications"
                    description="Receive optional information about promotions, offers and new services."
                    enabled={
                      settings.marketingNotifications
                    }
                    disabled={savingSettings}
                    onChange={(value: boolean) =>
                      updateSetting(
                        "marketingNotifications",
                        value
                      )
                    }
                  />
                </SettingSection>
              )}

              {/* ================= SECURITY ================= */}

              {activeSection === "security" && (
                <SettingSection
                  title="Account Security"
                  description="Change your account password."
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

              {/* ================= ACCOUNT ================= */}

              {activeSection === "account" && (
                <SettingSection
                  title="Account Management"
                  description="Manage your HomeServe account."
                >
                  <div className="rounded-xl border border-red-200 bg-red-50 p-5">

                    <div className="flex items-start gap-4">

                      <div className="rounded-lg bg-red-100 p-3">
                        <Trash2 className="h-5 w-5 text-red-700" />
                      </div>

                      <div className="flex-1">

                        <h3 className="font-semibold text-red-900">
                          Delete Account
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-red-800">
                          Permanently delete your HomeServe
                          account. This action cannot be
                          undone.
                        </p>

                        <button
                          type="button"
                          onClick={handleDeleteAccount}
                          disabled={deletingAccount}
                          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingAccount ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                              Delete My Account
                            </>
                          )}
                        </button>

                      </div>
                    </div>

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
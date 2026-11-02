
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
  Settings,
  Bell,
  Smartphone,
  Megaphone,
  ShieldCheck,
  UserRound,
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

function SectionHeading({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
      >
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">
          {title}
        </h3>
        <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500 sm:text-xs">
          {description}
        </p>
      </div>
    </div>
  );
}

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

      const updated = await updateMySettings({
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
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-700" />
            <p className="mt-3 text-xs text-slate-500">
              Loading your settings...
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!profile || !settings) {
    return (
      <DashboardShell>
        <div className="border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          Unable to load your settings.
        </div>
      </DashboardShell>
    );
  }

  const firstName = profile.name?.split(" ")[0] || "there";

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-5 px-3 py-4 pb-24 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8 lg:pb-8">

        {/* COMPACT WELCOME BANNER */}
        <section className="relative overflow-hidden border-l-4 border-sky-400 bg-[#061F35] px-4 py-3.5 shadow-sm sm:px-5">
          <div className="pointer-events-none absolute -right-6 -top-10 h-28 w-28 rounded-full border-[16px] border-white/[0.04]" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-sky-300 sm:text-[10px]">
                Customer account
              </p>

              <h1 className="mt-1 text-lg font-extrabold text-white sm:text-xl">
                Your Settings, {firstName}
              </h1>

              <p className="mt-1 text-[11px] text-slate-300 sm:text-xs">
                Personalize your HomeServe experience.
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-sky-200">
              <Settings size={21} />
            </div>
          </div>
        </section>

        {/* PAGE INTRODUCTION */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <User size={20} />
          </div>

          <div>
            <h2 className="text-base font-extrabold text-[#061F35] sm:text-lg">
              Account Settings
            </h2>

            <p className="text-[10px] text-slate-500 sm:text-xs">
              Manage your profile, preferences, notifications and security.
            </p>
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="flex items-start gap-3 border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-800">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <SettingsShell
          title="Account Settings"
          description="Customize your HomeServe account and communication preferences."
          sections={sections}
        >
          {(activeSection) => (
            <div className="min-w-0 space-y-5">

              {/* PROFILE */}
              {activeSection === "profile" && (
                <div className="border border-violet-100 bg-white shadow-sm">
                  <div className="border-b border-violet-100 bg-violet-50 px-4 py-4 sm:px-5">
                    <SectionHeading
                      icon={UserRound}
                      title="Profile Information"
                      description="Update the personal information associated with your HomeServe account."
                      color="bg-violet-100 text-violet-700"
                    />
                  </div>

                  <div className="space-y-5 p-4 sm:p-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <SettingInput
                          label="Full Name"
                          value={name}
                          onChange={(value: string) =>
                            setName(value)
                          }
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <SettingInput
                          label="Email Address"
                          type="email"
                          value={profile.email}
                          disabled
                          onChange={() => {}}
                          description="Your email address cannot be changed here."
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <SettingInput
                          label="Phone Number"
                          type="tel"
                          value={phone}
                          onChange={(value: string) =>
                            setPhone(value)
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={saveProfile}
                        disabled={savingProfile}
                        className="inline-flex items-center justify-center gap-2 bg-violet-700 px-5 py-3 text-xs font-bold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={15} />
                            Save Profile
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PREFERENCES */}
              {activeSection === "preferences" && (
                <div className="border border-sky-100 bg-white shadow-sm">
                  <div className="border-b border-sky-100 bg-sky-50 px-4 py-4 sm:px-5">
                    <SectionHeading
                      icon={Globe}
                      title="Preferences"
                      description="Choose how HomeServe displays information for your account."
                      color="bg-sky-100 text-sky-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 sm:p-5">
                    <div className="col-span-2 sm:col-span-1">
                      <SettingInput
                        label="Language"
                        description="Your preferred language."
                        value={settings.language}
                        onChange={(value: string) =>
                          updateSetting("language", value)
                        }
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <SettingInput
                        label="Currency"
                        description="Currency used when displaying prices."
                        value={settings.currency}
                        onChange={(value: string) =>
                          updateSetting("currency", value)
                        }
                      />
                    </div>

                    <div className="col-span-2">
                      <SettingInput
                        label="Timezone"
                        description="Timezone used for dates and booking times."
                        value={settings.timezone}
                        onChange={(value: string) =>
                          updateSetting("timezone", value)
                        }
                      />
                    </div>

                    {savingSettings && (
                      <p className="col-span-2 flex items-center gap-2 text-[10px] text-sky-700">
                        <Loader2 size={13} className="animate-spin" />
                        Updating preferences...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* EMAIL NOTIFICATIONS */}
              {activeSection === "email" && (
                <div className="border border-blue-100 bg-white shadow-sm">
                  <div className="border-b border-blue-100 bg-blue-50 px-4 py-4 sm:px-5">
                    <SectionHeading
                      icon={Mail}
                      title="Email Notifications"
                      description="Choose which HomeServe events you want to receive by email."
                      color="bg-blue-100 text-blue-700"
                    />
                  </div>

                  <div className="space-y-3 p-4 sm:p-5">
                    <SettingToggle
                      label="Booking Updates"
                      description="Receive emails about booking creation, status changes and cancellations."
                      enabled={settings.emailBookingUpdates}
                      disabled={savingSettings}
                      onChange={(value: boolean) =>
                        updateSetting("emailBookingUpdates", value)
                      }
                    />

                    <SettingToggle
                      label="Quote Updates"
                      description="Receive notifications when quotes are created or updated."
                      enabled={settings.emailQuoteUpdates}
                      disabled={savingSettings}
                      onChange={(value: boolean) =>
                        updateSetting("emailQuoteUpdates", value)
                      }
                    />

                    <SettingToggle
                      label="Payment Updates"
                      description="Receive notifications about payment status and transactions."
                      enabled={settings.emailPaymentUpdates}
                      disabled={savingSettings}
                      onChange={(value: boolean) =>
                        updateSetting("emailPaymentUpdates", value)
                      }
                    />

                    <SettingToggle
                      label="Service Updates"
                      description="Receive important updates related to HomeServe services."
                      enabled={settings.emailServiceUpdates}
                      disabled={savingSettings}
                      onChange={(value: boolean) =>
                        updateSetting("emailServiceUpdates", value)
                      }
                    />

                    <SettingToggle
                      label="System Announcements"
                      description="Receive important platform announcements and service notices."
                      enabled={settings.emailSystemAnnouncements}
                      disabled={savingSettings}
                      onChange={(value: boolean) =>
                        updateSetting("emailSystemAnnouncements", value)
                      }
                    />
                  </div>
                </div>
              )}

              {/* SMS NOTIFICATIONS */}
              {activeSection === "sms" && (
                <div className="border border-emerald-100 bg-white shadow-sm">
                  <div className="border-b border-emerald-100 bg-emerald-50 px-4 py-4 sm:px-5">
                    <SectionHeading
                      icon={Smartphone}
                      title="SMS Notifications"
                      description="Choose which important HomeServe events you want to receive by SMS."
                      color="bg-emerald-100 text-emerald-700"
                    />
                  </div>

                  <div className="space-y-3 p-4 sm:p-5">
                    <SettingToggle
                      label="Booking Updates"
                      description="Receive SMS notifications about booking changes."
                      enabled={settings.smsBookingUpdates}
                      disabled={savingSettings}
                      onChange={(value: boolean) =>
                        updateSetting("smsBookingUpdates", value)
                      }
                    />

                    <SettingToggle
                      label="Quote Updates"
                      description="Receive SMS notifications about quote changes."
                      enabled={settings.smsQuoteUpdates}
                      disabled={savingSettings}
                      onChange={(value: boolean) =>
                        updateSetting("smsQuoteUpdates", value)
                      }
                    />

                    <SettingToggle
                      label="Payment Updates"
                      description="Receive SMS notifications about payment events."
                      enabled={settings.smsPaymentUpdates}
                      disabled={savingSettings}
                      onChange={(value: boolean) =>
                        updateSetting("smsPaymentUpdates", value)
                      }
                    />
                  </div>
                </div>
              )}

              {/* MARKETING */}
              {activeSection === "marketing" && (
                <div className="border border-orange-100 bg-white shadow-sm">
                  <div className="border-b border-orange-100 bg-orange-50 px-4 py-4 sm:px-5">
                    <SectionHeading
                      icon={Megaphone}
                      title="Marketing Communications"
                      description="Control optional promotional communications from HomeServe."
                      color="bg-orange-100 text-orange-700"
                    />
                  </div>

                  <div className="p-4 sm:p-5">
                    <SettingToggle
                      label="Marketing Notifications"
                      description="Receive optional information about promotions, offers and new services."
                      enabled={settings.marketingNotifications}
                      disabled={savingSettings}
                      onChange={(value: boolean) =>
                        updateSetting("marketingNotifications", value)
                      }
                    />
                  </div>
                </div>
              )}

              {/* SECURITY */}
              {activeSection === "security" && (
                <div className="border border-indigo-100 bg-white shadow-sm">
                  <div className="border-b border-indigo-100 bg-indigo-50 px-4 py-4 sm:px-5">
                    <SectionHeading
                      icon={Shield}
                      title="Account Security"
                      description="Protect your account by keeping your password secure."
                      color="bg-indigo-100 text-indigo-700"
                    />
                  </div>

                  <div className="space-y-5 p-4 sm:p-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <SettingInput
                          label="Current Password"
                          type="password"
                          value={currentPassword}
                          onChange={(value: string) =>
                            setCurrentPassword(value)
                          }
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <SettingInput
                          label="New Password"
                          type="password"
                          value={newPassword}
                          onChange={(value: string) =>
                            setNewPassword(value)
                          }
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <SettingInput
                          label="Confirm New Password"
                          type="password"
                          value={confirmPassword}
                          onChange={(value: string) =>
                            setConfirmPassword(value)
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={handleChangePassword}
                        disabled={changingPassword}
                        className="inline-flex items-center justify-center gap-2 bg-indigo-700 px-5 py-3 text-xs font-bold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {changingPassword ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            Changing Password...
                          </>
                        ) : (
                          <>
                            <Lock size={15} />
                            Change Password
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ACCOUNT MANAGEMENT */}
              {activeSection === "account" && (
                <div className="border border-red-200 bg-white shadow-sm">
                  <div className="border-b border-red-100 bg-red-50 px-4 py-4 sm:px-5">
                    <SectionHeading
                      icon={ShieldCheck}
                      title="Account Management"
                      description="Manage your HomeServe account and account deletion."
                      color="bg-red-100 text-red-700"
                    />
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="border border-red-200 bg-red-50/70 p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                          <Trash2 size={19} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-extrabold text-red-950">
                            Delete Account
                          </h3>

                          <p className="mt-1 text-[11px] leading-relaxed text-red-800 sm:text-xs">
                            Permanently delete your HomeServe account.
                            This action cannot be undone.
                          </p>

                          <button
                            type="button"
                            onClick={handleDeleteAccount}
                            disabled={deletingAccount}
                            className="mt-4 inline-flex items-center justify-center gap-2 border border-red-300 bg-white px-4 py-2.5 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingAccount ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 size={14} />
                                Delete My Account
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </SettingsShell>
      </div>
    </DashboardShell>
  );
}

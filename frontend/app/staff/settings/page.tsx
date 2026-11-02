
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
  ShieldCheck,
  Settings,
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSetting | null>(null);
  const [staffProfile, setStaffProfile] = useState<Staff | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const [profileData, settingsData, staffData] =
        await Promise.all([
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
      setError("");

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
      setError("");

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

  async function saveAvailability(available: boolean) {
    try {
      setSavingAvailability(true);
      setError("");

      const updated = await updateMyAvailability(available);

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
      showError("Enter your current password.");
      return;
    }

    if (!newPassword) {
      showError("Enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      showError("Your new password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    try {
      setChangingPassword(true);
      setError("");

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

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-[#061F35]" />
            Loading your settings...
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!profile || !settings || !staffProfile) {
    return (
      <DashboardShell>
        <div className="border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          Unable to load your staff settings.
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-5">
        {/* Compact page banner */}
        <section className="relative overflow-hidden bg-[#061F35] px-4 py-5 text-white sm:px-6 sm:py-6">
          <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full border-[20px] border-white/[0.04]" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 bg-white/10">
              <Settings className="h-5 w-5 text-blue-100" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
                Staff Workspace
              </p>

              <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                Account Settings
              </h1>

              <p className="mt-1 text-xs leading-5 text-blue-100/80 sm:text-sm">
                Manage your profile, work preferences and account security.
              </p>
            </div>
          </div>
        </section>

        {/* Feedback messages */}
        {success && (
          <div className="flex items-start gap-3 border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800 sm:text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {success}
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-800 sm:text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <SettingsShell
          title="Staff Account Settings"
          description="Customize your HomeServe staff account and work preferences."
          sections={sections}
        >
          {(activeSection) => (
            <div className="space-y-5">
              {/* PROFILE */}
              {activeSection === "profile" && (
                <SettingSection
                  title="Profile Information"
                  description="Update the personal information associated with your staff account."
                >
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 sm:col-span-1">
                        <SettingInput
                          label="Full Name"
                          value={name}
                          onChange={(value: string) => setName(value)}
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <SettingInput
                          label="Phone Number"
                          type="tel"
                          value={phone}
                          onChange={(value: string) => setPhone(value)}
                        />
                      </div>

                      <div className="col-span-2">
                        <SettingInput
                          label="Email Address"
                          type="email"
                          value={profile.email}
                          disabled
                          onChange={() => {}}
                          description="Your staff account email is used for authentication and cannot be changed here."
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border border-slate-200 bg-slate-50 p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-white">
                        <User className="h-4 w-4 text-blue-700" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Account Role
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#061F35]">
                          {profile.role}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={saveProfile}
                      disabled={savingProfile}
                      className="inline-flex h-10 w-full items-center justify-center gap-2 bg-[#061F35] px-5 text-xs font-bold text-white transition hover:bg-[#082B49] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-sm"
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

              {/* WORK */}
              {activeSection === "work" && (
                <SettingSection
                  title="Work Information"
                  description="Information about your HomeServe staff role."
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 border border-slate-200 bg-slate-50 p-4 sm:col-span-1">
                      <div className="flex items-center gap-2">
                        <BriefcaseBusiness className="h-4 w-4 text-blue-700" />
                        <p className="text-xs font-bold text-[#061F35]">
                          Staff Type
                        </p>
                      </div>

                      <p className="mt-3 text-sm font-bold text-[#061F35]">
                        {staffProfile.staffType}
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-slate-500">
                        Your staff type determines which service categories you can be assigned.
                      </p>
                    </div>

                    <div className="col-span-2 border border-slate-200 bg-slate-50 p-4 sm:col-span-1">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-blue-700" />
                        <p className="text-xs font-bold text-[#061F35]">
                          Availability Status
                        </p>
                      </div>

                      <p className="mt-3 text-sm font-bold text-[#061F35]">
                        {staffProfile.isAvailable
                          ? "Available"
                          : "Unavailable"}
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-slate-500">
                        {staffProfile.isAvailable
                          ? "You can currently receive new assignments."
                          : "You are not currently available for new assignments."}
                      </p>
                    </div>

                    <div className="col-span-2 flex items-start gap-3 border border-blue-100 bg-blue-50/60 p-3">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                      <p className="text-xs leading-5 text-slate-600">
                        Staff type and employment information are managed by HomeServe administrators.
                      </p>
                    </div>
                  </div>
                </SettingSection>
              )}

              {/* PREFERENCES */}
              {activeSection === "preferences" && (
                <SettingSection
                  title="Preferences"
                  description="Choose how HomeServe displays information for your account."
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <SettingInput
                      label="Language"
                      description="Your preferred language."
                      value={settings.language}
                      onChange={(value: string) =>
                        updateSetting("language", value)
                      }
                    />

                    <SettingInput
                      label="Currency"
                      description="Currency used when displaying prices."
                      value={settings.currency}
                      onChange={(value: string) =>
                        updateSetting("currency", value)
                      }
                    />

                    <div className="sm:col-span-2">
                      <SettingInput
                        label="Timezone"
                        description="Timezone used for dates and booking times."
                        value={settings.timezone}
                        onChange={(value: string) =>
                          updateSetting("timezone", value)
                        }
                      />
                    </div>
                  </div>

                  {savingSettings && (
                    <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving preference...
                    </p>
                  )}
                </SettingSection>
              )}

              {/* NOTIFICATIONS */}
              {activeSection === "notifications" && (
                <SettingSection
                  title="Notifications"
                  description="Control the HomeServe notifications you receive."
                >
                  <div className="space-y-5">
                    <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-50">
                        <Mail className="h-4 w-4 text-blue-700" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-[#061F35]">
                          Email Notifications
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Choose which events should generate email notifications.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <SettingToggle
                        label="Booking Updates"
                        description="Receive emails about booking assignments and status changes."
                        enabled={settings.emailBookingUpdates}
                        disabled={savingSettings}
                        onChange={(value: boolean) =>
                          updateSetting("emailBookingUpdates", value)
                        }
                      />

                      <SettingToggle
                        label="Quote Updates"
                        description="Receive notifications about quote changes."
                        enabled={settings.emailQuoteUpdates}
                        disabled={savingSettings}
                        onChange={(value: boolean) =>
                          updateSetting("emailQuoteUpdates", value)
                        }
                      />

                      <SettingToggle
                        label="Payment Updates"
                        description="Receive notifications about payment events."
                        enabled={settings.emailPaymentUpdates}
                        disabled={savingSettings}
                        onChange={(value: boolean) =>
                          updateSetting("emailPaymentUpdates", value)
                        }
                      />

                      <SettingToggle
                        label="Service Updates"
                        description="Receive important HomeServe service updates."
                        enabled={settings.emailServiceUpdates}
                        disabled={savingSettings}
                        onChange={(value: boolean) =>
                          updateSetting("emailServiceUpdates", value)
                        }
                      />

                      <SettingToggle
                        label="System Announcements"
                        description="Receive important platform announcements."
                        enabled={settings.emailSystemAnnouncements}
                        disabled={savingSettings}
                        onChange={(value: boolean) =>
                          updateSetting("emailSystemAnnouncements", value)
                        }
                      />
                    </div>

                    <div className="border-t border-slate-200 pt-5">
                      <div className="mb-4 flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-50">
                          <MessageSquare className="h-4 w-4 text-blue-700" />
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-[#061F35]">
                            SMS Notifications
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            Control important SMS notifications.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
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

                    {savingSettings && (
                      <p className="flex items-center gap-2 text-xs text-slate-500">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Saving notification preference...
                      </p>
                    )}
                  </div>
                </SettingSection>
              )}

              {/* AVAILABILITY */}
              {activeSection === "availability" && (
                <SettingSection
                  title="Availability"
                  description="Control whether HomeServe can assign new bookings to you."
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 border border-blue-100 bg-blue-50/60 p-4">
                      <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

                      <div>
                        <h3 className="text-sm font-bold text-[#061F35]">
                          Assignment Availability
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          When you're unavailable, administrators should not assign new bookings to you. Existing assignments are not automatically cancelled.
                        </p>
                      </div>
                    </div>

                    <SettingToggle
                      label="Available for Assignments"
                      description={
                        staffProfile.isAvailable
                          ? "You are currently available for new staff assignments."
                          : "You are currently unavailable for new staff assignments."
                      }
                      enabled={staffProfile.isAvailable}
                      disabled={savingAvailability}
                      onChange={(value: boolean) =>
                        saveAvailability(value)
                      }
                    />

                    {savingAvailability && (
                      <p className="flex items-center gap-2 text-xs text-slate-500">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Updating availability...
                      </p>
                    )}
                  </div>
                </SettingSection>
              )}

              {/* SECURITY */}
              {activeSection === "security" && (
                <SettingSection
                  title="Account Security"
                  description="Change your staff account password."
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <SettingInput
                          label="Current Password"
                          type="password"
                          value={currentPassword}
                          onChange={(value: string) =>
                            setCurrentPassword(value)
                          }
                        />
                      </div>

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
                    </div>

                    <div className="border border-blue-100 bg-blue-50/60 p-3">
                      <p className="text-xs leading-5 text-slate-600">
                        Your new password must contain at least 8 characters.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={changingPassword}
                      className="inline-flex h-10 w-full items-center justify-center gap-2 bg-[#061F35] px-5 text-xs font-bold text-white transition hover:bg-[#082B49] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-sm"
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

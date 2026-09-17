import { apiRequest } from "./api";

import type {
  SystemSetting,
  UserSetting,
  UserProfile,
} from "@/types/settings";

// =========================================================
// RESPONSE TYPES
// =========================================================

interface SystemSettingsResponse {
  success: boolean;
  settings: SystemSetting[];
}

interface SystemSettingResponse {
  success: boolean;
  setting: SystemSetting;
}

interface UserSettingsResponse {
  success: boolean;
  settings: UserSetting;
}

interface UserProfileResponse {
  success: boolean;
  profile: UserProfile;
}

interface UpdateSystemSettingsResponse {
  success: boolean;
  message: string;
  settings: SystemSetting[];
}

interface UpdateSystemSettingResponse {
  success: boolean;
  message: string;
  setting: SystemSetting;
}

interface UpdateUserSettingsResponse {
  success: boolean;
  message: string;
  settings: UserSetting;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  profile: UserProfile;
}

interface MessageResponse {
  success: boolean;
  message: string;
}

// =========================================================
// SYSTEM SETTINGS
// =========================================================

export async function getSystemSettings(): Promise<
  SystemSetting[]
> {
  const response =
    await apiRequest<SystemSettingsResponse>(
      "/settings"
    );

  return response.settings;
}

export async function getSystemSettingsByCategory(
  category: string
): Promise<SystemSetting[]> {
  const response =
    await apiRequest<SystemSettingsResponse>(
      `/settings/category/${category}`
    );

  return response.settings;
}

export async function getSystemSetting(
  key: string
): Promise<SystemSetting> {
  const response =
    await apiRequest<SystemSettingResponse>(
      `/settings/${key}`
    );

  return response.setting;
}

export async function updateSystemSetting(
  key: string,
  value: string
): Promise<SystemSetting> {
  const response =
    await apiRequest<UpdateSystemSettingResponse>(
      `/settings/${key}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          value,
        }),
      }
    );

  return response.setting;
}

export async function updateSystemSettings(
  settings: {
    key: string;
    value: string;
  }[]
): Promise<SystemSetting[]> {
  const response =
    await apiRequest<UpdateSystemSettingsResponse>(
      "/settings",
      {
        method: "PATCH",
        body: JSON.stringify({
          settings,
        }),
      }
    );

  return response.settings;
}

// =========================================================
// PERSONAL SETTINGS
// =========================================================

export async function getMySettings(): Promise<UserSetting> {
  const response =
    await apiRequest<UserSettingsResponse>(
      "/settings/me"
    );

  return response.settings;
}

export async function updateMySettings(
  settings: Partial<
    Omit<
      UserSetting,
      | "id"
      | "userId"
      | "createdAt"
      | "updatedAt"
    >
  >
): Promise<UserSetting> {
  const response =
    await apiRequest<UpdateUserSettingsResponse>(
      "/settings/me",
      {
        method: "PATCH",
        body: JSON.stringify(settings),
      }
    );

  return response.settings;
}

// =========================================================
// PROFILE
// =========================================================

export async function getMyProfile(): Promise<UserProfile> {
  const response =
    await apiRequest<UserProfileResponse>(
      "/settings/me/profile"
    );

  return response.profile;
}

export async function updateMyProfile(
  profile: {
    name?: string;
    phone?: string | null;
  }
): Promise<UserProfile> {
  const response =
    await apiRequest<UpdateProfileResponse>(
      "/settings/me/profile",
      {
        method: "PATCH",
        body: JSON.stringify(profile),
      }
    );

  return response.profile;
}

// =========================================================
// PASSWORD
// =========================================================

export async function changeMyPassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<void> {
  await apiRequest<MessageResponse>(
    "/settings/me/password",
    {
      method: "PATCH",
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    }
  );
}

// =========================================================
// ACCOUNT
// =========================================================

export async function deleteMyAccount(): Promise<void> {
  await apiRequest<MessageResponse>(
    "/settings/me/account",
    {
      method: "DELETE",
    }
  );
}
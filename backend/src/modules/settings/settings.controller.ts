import { Request, Response } from "express";

import {
  getAllSettings,
  getSettingsByCategory,
  getSettingByKey,
  updateSetting,
  updateSettings,
  getUserSettings,
  updateUserSettings,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUserAccount,
} from "./settings.service";

// =========================================================
// SYSTEM SETTINGS
// =========================================================

export async function getAllSettingsController(
  _req: Request,
  res: Response
) {
  const settings =
    await getAllSettings();

  return res.status(200).json({
    success: true,
    settings,
  });
}

export async function getSettingsCategoryController(
  req: Request,
  res: Response
) {
  const settings =
    await getSettingsByCategory(
      String(req.params.category)
    );

  return res.status(200).json({
    success: true,
    settings,
  });
}

export async function getSettingController(
  req: Request,
  res: Response
) {
  const setting =
    await getSettingByKey(
      String(req.params.key)
    );

  return res.status(200).json({
    success: true,
    setting,
  });
}

export async function updateSettingController(
  req: Request,
  res: Response
) {
  const setting =
    await updateSetting(
      String(req.params.key),
      req.body.value
    );

  return res.status(200).json({
    success: true,
    message:
      "Setting updated successfully",
    setting,
  });
}

export async function updateSettingsController(
  req: Request,
  res: Response
) {
  const settings =
    await updateSettings(
      req.body.settings
    );

  return res.status(200).json({
    success: true,
    message:
      "Settings updated successfully",
    settings,
  });
}

// =========================================================
// USER SETTINGS
// =========================================================

export async function getMySettingsController(
  req: Request,
  res: Response
) {
  const settings =
    await getUserSettings(
      req.user!.userId
    );

  return res.status(200).json({
    success: true,
    settings,
  });
}

export async function updateMySettingsController(
  req: Request,
  res: Response
) {
  const settings =
    await updateUserSettings(
      req.user!.userId,
      req.body
    );

  return res.status(200).json({
    success: true,
    message:
      "Personal settings updated successfully",
    settings,
  });
}

// =========================================================
// PROFILE
// =========================================================

export async function getMyProfileController(
  req: Request,
  res: Response
) {
  const profile =
    await getUserProfile(
      req.user!.userId
    );

  return res.status(200).json({
    success: true,
    profile,
  });
}

export async function updateMyProfileController(
  req: Request,
  res: Response
) {
  const profile =
    await updateUserProfile(
      req.user!.userId,
      req.body
    );

  return res.status(200).json({
    success: true,
    message:
      "Profile updated successfully",
    profile,
  });
}

// =========================================================
// PASSWORD
// =========================================================

export async function changeMyPasswordController(
  req: Request,
  res: Response
) {
  await changePassword(
    req.user!.userId,
    req.body.currentPassword,
    req.body.newPassword
  );

  return res.status(200).json({
    success: true,
    message:
      "Password changed successfully",
  });
}

// =========================================================
// ACCOUNT
// =========================================================

export async function deleteMyAccountController(
  req: Request,
  res: Response
) {
  await deleteUserAccount(
    req.user!.userId
  );

  res.clearCookie("accessToken");

  return res.status(200).json({
    success: true,
    message:
      "Account deleted successfully",
  });
}
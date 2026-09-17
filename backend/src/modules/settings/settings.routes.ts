import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../middleware/asyncHandler";

import { UserRole } from "../../generated/prisma/client";

import {
  getAllSettingsController,
  getSettingsCategoryController,
  getSettingController,
  updateSettingController,
  updateSettingsController,

  getMySettingsController,
  updateMySettingsController,

  getMyProfileController,
  updateMyProfileController,

  changeMyPasswordController,
  deleteMyAccountController,
} from "./settings.controller";

import {
  settingKeySchema,
  settingCategorySchema,
  updateSettingSchema,
  updateSettingsSchema,
  updateUserSettingsSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "./settings.validator";

const router = Router();

// =========================================================
// PERSONAL SETTINGS
// =========================================================

router.get(
  "/me",
  authenticate,
  asyncHandler(getMySettingsController)
);

router.patch(
  "/me",
  authenticate,
  validate(updateUserSettingsSchema),
  asyncHandler(updateMySettingsController)
);

// =========================================================
// PROFILE
// =========================================================

router.get(
  "/me/profile",
  authenticate,
  asyncHandler(getMyProfileController)
);

router.patch(
  "/me/profile",
  authenticate,
  validate(updateProfileSchema),
  asyncHandler(updateMyProfileController)
);

// =========================================================
// PASSWORD
// =========================================================

router.patch(
  "/me/password",
  authenticate,
  validate(changePasswordSchema),
  asyncHandler(changeMyPasswordController)
);

// =========================================================
// ACCOUNT
// =========================================================

router.delete(
  "/me/account",
  authenticate,
  asyncHandler(deleteMyAccountController)
);

// =========================================================
// ADMIN PLATFORM SETTINGS
// =========================================================

router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(
    getAllSettingsController
  )
);

router.get(
  "/category/:category",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(
    settingCategorySchema,
    "params"
  ),
  asyncHandler(
    getSettingsCategoryController
  )
);

router.get(
  "/:key",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(
    settingKeySchema,
    "params"
  ),
  asyncHandler(getSettingController)
);

router.patch(
  "/:key",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(
    settingKeySchema,
    "params"
  ),
  validate(updateSettingSchema),
  asyncHandler(updateSettingController)
);

router.patch(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateSettingsSchema),
  asyncHandler(updateSettingsController)
);

export default router;
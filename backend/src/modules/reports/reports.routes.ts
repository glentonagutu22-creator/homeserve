import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { asyncHandler } from "../../middleware/asyncHandler";

import { UserRole } from "../../generated/prisma/client";

import {
  getReportsController,
} from "./reports.controller";

const router = Router();

// =====================================================
// ADMIN REPORTS
// =====================================================

/**
 * Get platform reports
 *
 * GET /api/reports
 */
router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(getReportsController)
);

export default router;
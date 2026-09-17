import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../middleware/asyncHandler";

import { UserRole } from "../../generated/prisma/client";

import {
  getAllPayments,
  getPayment,
  updateStatus,
} from "./payment.controller";

import {
  paymentIdSchema,
  updatePaymentStatusSchema,
} from "./payment.validator";

const router = Router();

// =====================================================
// ADMIN PAYMENT MANAGEMENT
// =====================================================

/**
 * Get all payments
 *
 * GET /api/payments
 */
router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(getAllPayments)
);

/**
 * Get a single payment
 *
 * GET /api/payments/:id
 */
router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(paymentIdSchema, "params"),
  asyncHandler(getPayment)
);

/**
 * Update payment status
 *
 * PATCH /api/payments/:id/status
 */
router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(paymentIdSchema, "params"),
  validate(updatePaymentStatusSchema),
  asyncHandler(updateStatus)
);

export default router;
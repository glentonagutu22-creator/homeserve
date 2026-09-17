import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../middleware/asyncHandler";
import { UserRole } from "../../generated/prisma/client";

import {
  calculateCleaning,
  calculateMoving,
  calculateElectrical,
  getRules,
  getRule,
  createRule,
  updateRule,
  updateRuleStatus,
    getServiceCatalog,
  getServiceCatalogItem,
  updateServiceCatalogItem,
  updateServiceCatalogStatus,
} from "./pricing.controller";

import {
  calculateCleaningPriceSchema,
  calculateMovingPriceSchema,
  calculateElectricalPriceSchema,
  pricingRuleIdSchema,
  createPricingRuleSchema,
  updatePricingRuleSchema,
  updatePricingRuleStatusSchema,
  updateServiceSchema,
  updateServiceStatusSchema,
  serviceIdSchema
} from "./pricing.validator";

const router = Router();

// =====================================================
// PRICE CALCULATION
// =====================================================

/**
 * Calculate cleaning price
 *
 * POST /api/pricing/cleaning
 */
router.post(
  "/cleaning",
  authenticate,
  validate(calculateCleaningPriceSchema),
  asyncHandler(calculateCleaning)
);

/**
 * Calculate moving price
 *
 * POST /api/pricing/moving
 */
router.post(
  "/moving",
  authenticate,
  validate(calculateMovingPriceSchema),
  asyncHandler(calculateMoving)
);

/**
 * Calculate electrical price
 *
 * POST /api/pricing/electrical
 */
router.post(
  "/electrical",
  authenticate,
  validate(calculateElectricalPriceSchema),
  asyncHandler(calculateElectrical)
);

// =====================================================
// ADMIN PRICING RULE MANAGEMENT
// =====================================================

/**
 * Get all pricing rules
 *
 * GET /api/pricing/rules
 */
router.get(
  "/rules",
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(getRules)
);

/**
 * Get a single pricing rule
 *
 * GET /api/pricing/rules/:id
 */

router.post(
  "/rules",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createPricingRuleSchema),
  asyncHandler(createRule)
);

// =====================================================
// ADMIN SERVICE CATALOG
// =====================================================

/**
 * Get all services
 *
 * GET /api/pricing/services
 */
router.get(
  "/services",
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(getServiceCatalog)
);

/**
 * Get a single service
 *
 * GET /api/pricing/services/:id
 */
router.get(
  "/services/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(serviceIdSchema, "params"),
  asyncHandler(getServiceCatalogItem)
);

/**
 * Update a service
 *
 * PATCH /api/pricing/services/:id
 */
router.patch(
  "/services/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(serviceIdSchema, "params"),
  validate(updateServiceSchema),
  asyncHandler(updateServiceCatalogItem)
);

/**
 * Activate or deactivate a service
 *
 * PATCH /api/pricing/services/:id/status
 */
router.patch(
  "/services/:id/status",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(serviceIdSchema, "params"),
  validate(updateServiceStatusSchema),
  asyncHandler(updateServiceCatalogStatus)
);


router.get(
  "/rules/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(pricingRuleIdSchema, "params"),
  asyncHandler(getRule)
);

router.patch(
  "/rules/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(pricingRuleIdSchema, "params"),
  validate(updatePricingRuleSchema),
  asyncHandler(updateRule)
);

router.patch(
  "/rules/:id/status",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(pricingRuleIdSchema, "params"),
  validate(updatePricingRuleStatusSchema),
  asyncHandler(updateRuleStatus)
);



export default router;
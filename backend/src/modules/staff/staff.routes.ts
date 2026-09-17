import { Router } from "express";

import {
  create,
  getAll,
  getOne,
  update,
  updateAvailability,
  assign,
  unassign,
  getAssignments,
  getBookingStaff,
  getMe,
getMyAssignments,
updateMyAvailability,
updateMyBookingStatus,
} from "./staff.controller";

import {
  createStaffSchema,
  updateStaffSchema,
  updateAvailabilitySchema,
  staffIdSchema,
  assignStaffSchema,
  assignmentIdSchema,
  staffBookingIdSchema,
  updateStaffBookingStatusSchema
  
} from "./staff.validator";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../middleware/asyncHandler";

import { UserRole } from "../../generated/prisma/client";

const router = Router();

/*
 * =========================================================
 * ADMIN STAFF MANAGEMENT
 * =========================================================
 */

// Create staff
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createStaffSchema),
  asyncHandler(create)
);

// Get all staff
router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(getAll)
);

/*
 * =========================================================
 * STAFF SELF-SERVICE
 * =========================================================
 */

// Get own staff profile
router.get(
  "/me",
  authenticate,
  authorize(UserRole.STAFF),
  asyncHandler(getMe)
);

// Get own assignments
router.get(
  "/me/assignments",
  authenticate,
  authorize(UserRole.STAFF),
  asyncHandler(getMyAssignments)
);

// Update own availability
router.patch(
  "/me/availability",
  authenticate,
  authorize(UserRole.STAFF),
  validate(updateAvailabilitySchema),
  asyncHandler(updateMyAvailability)
);

// Update status of an assigned booking
router.patch(
  "/me/bookings/:id/status",
  authenticate,
  authorize(UserRole.STAFF),
  validate(staffBookingIdSchema, "params"),
  validate(updateStaffBookingStatusSchema),
  asyncHandler(updateMyBookingStatus)
);

// Get one staff member
router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(staffIdSchema, "params"),
  asyncHandler(getOne)
);

// Update staff
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(staffIdSchema, "params"),
  validate(updateStaffSchema),
  asyncHandler(update)
);

// Update availability
router.patch(
  "/:id/availability",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(staffIdSchema, "params"),
  validate(updateAvailabilitySchema),
  asyncHandler(updateAvailability)
);


/*
 * =========================================================
 * STAFF ASSIGNMENTS
 * =========================================================
 */

// Assign staff member to booking
router.post(
  "/:id/assign",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(staffIdSchema, "params"),
  validate(assignStaffSchema),
  asyncHandler(assign)
);

// Get bookings assigned to staff member
router.get(
  "/:id/assignments",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(staffIdSchema, "params"),
  asyncHandler(getAssignments)
);

// Get staff assigned to a booking
router.get(
  "/booking/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(staffBookingIdSchema, "params"),
  asyncHandler(getBookingStaff)
);

// Remove an assignment
router.delete(
  "/assignments/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(assignmentIdSchema, "params"),
  asyncHandler(unassign)
);

export default router;
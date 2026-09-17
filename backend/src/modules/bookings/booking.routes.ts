import { Router } from "express";

import {
  create,
  getMyBookings,
  getMyBooking,
  cancel,
  getAdminBookings,
  getAdminBookingById,
} from "./booking.controller";

import {
  createBookingSchema,
  cancelBookingSchema,
} from "./booking.validator";

import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../middleware/asyncHandler";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";

import { UserRole } from "../../generated/prisma/client";

const router = Router();

/*
|--------------------------------------------------------------------------
| Create booking — Customer
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  validate(createBookingSchema),
  asyncHandler(create)
);

/*
|--------------------------------------------------------------------------
| Admin — Get all bookings
|--------------------------------------------------------------------------
|
| IMPORTANT:
| This route must come before "/:id".
|
*/

router.get(
  "/admin",
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(getAdminBookings)
);

/*
|--------------------------------------------------------------------------
| Admin — Get single booking
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(getAdminBookingById)
);

/*
|--------------------------------------------------------------------------
| Customer — Get my bookings
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  asyncHandler(getMyBookings)
);

/*
|--------------------------------------------------------------------------
| Customer — Get my booking
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  asyncHandler(getMyBooking)
);

/*
|--------------------------------------------------------------------------
| Customer — Cancel booking
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/cancel",
  authenticate,
  validate(cancelBookingSchema),
  asyncHandler(cancel)
);

export default router;
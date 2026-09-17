import { Router } from "express";

import {
  getCustomers,
  getCustomer,
  updateCustomerRole,
  removeCustomer,
  updateProfile,
} from "./user.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { asyncHandler } from "../../middleware/asyncHandler";
import { validate } from "../../middleware/validate";

import {
  customerIdSchema,
  changeCustomerRoleSchema,
} from "./user.validator";

import { UserRole } from "../../generated/prisma/client";

const router = Router();

/*
|--------------------------------------------------------------------------
| Admin — Get all customers
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Authenticated user — Update own profile
|--------------------------------------------------------------------------
*/

router.patch(
  "/me",
  authenticate,
  asyncHandler(updateProfile)
);

router.get(
  "/customers",
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(getCustomers)
);

/*
|--------------------------------------------------------------------------
| Admin — Get single customer
|--------------------------------------------------------------------------
*/

router.get(
  "/customers/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(customerIdSchema, "params"),
  asyncHandler(getCustomer)
);

/*
|--------------------------------------------------------------------------
| Admin — Change customer role
|--------------------------------------------------------------------------
*/

router.patch(
  "/customers/:id/role",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(customerIdSchema, "params"),
  validate(changeCustomerRoleSchema),
  asyncHandler(updateCustomerRole)
);
/*
|--------------------------------------------------------------------------
| Admin — Delete customer
|--------------------------------------------------------------------------
*/

router.delete(
  "/customers/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(customerIdSchema, "params"),
  asyncHandler(removeCustomer)
);
export default router;
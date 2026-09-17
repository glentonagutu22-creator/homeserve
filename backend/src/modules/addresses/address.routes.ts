import { Router } from "express";

import {
  create,
  getMine,
  getOne,
  update,
  remove,
} from "./address.controller";

import {
  createAddressSchema,
  updateAddressSchema,
} from "./address.validator";

import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Address
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  validate(createAddressSchema),
  asyncHandler(create)
);

/*
|--------------------------------------------------------------------------
| Get My Addresses
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  asyncHandler(getMine)
);

/*
|--------------------------------------------------------------------------
| Get One Address
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  asyncHandler(getOne)
);

/*
|--------------------------------------------------------------------------
| Update Address
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  validate(updateAddressSchema),
  asyncHandler(update)
);

/*
|--------------------------------------------------------------------------
| Delete Address
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  asyncHandler(remove)
);

export default router;
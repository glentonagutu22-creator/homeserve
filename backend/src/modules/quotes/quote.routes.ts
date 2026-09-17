import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../middleware/asyncHandler";
import { authorize } from "../../middleware/authorize.middleware";
import { UserRole } from "../../generated/prisma/client";



import {
  create,
  getMyQuotes,
  getMyQuote,
  
  send,
  accept,
  reject,
    getAll,
  getAdmin,
  updateAdmin,
} from "./quote.controller";

import {
  createQuoteSchema,
  updateQuoteSchema,
  quoteIdSchema,
} from "./quote.validator";

const router = Router();

/*
|--------------------------------------------------------------------------
| Create quote
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  validate(createQuoteSchema),
  asyncHandler(create)
);

/*
|--------------------------------------------------------------------------
| Get customer quotes
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  asyncHandler(getMyQuotes)
);

/*
|--------------------------------------------------------------------------
| Admin quote management
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(getAll)
);

router.get(
  "/admin/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(quoteIdSchema, "params"),
  asyncHandler(getAdmin)
);

router.patch(
  "/admin/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(quoteIdSchema, "params"),
  validate(updateQuoteSchema),
  asyncHandler(updateAdmin)
);

/*
|--------------------------------------------------------------------------
| Get single quote
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  validate(quoteIdSchema, "params"),
  asyncHandler(getMyQuote)
);

/*
|--------------------------------------------------------------------------
| Update quote
|--------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
| Send quote
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/send",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(quoteIdSchema, "params"),
  asyncHandler(send)
);
/*
|--------------------------------------------------------------------------
| Accept quote
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/accept",
  authenticate,
  validate(quoteIdSchema, "params"),
  asyncHandler(accept)
);

/*
|--------------------------------------------------------------------------
| Reject quote
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/reject",
  authenticate,
  validate(quoteIdSchema, "params"),
  asyncHandler(reject)
);

export default router;
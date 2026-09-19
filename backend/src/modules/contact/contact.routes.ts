import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";

import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../middleware/asyncHandler";

import {
  createContactMessageController,
  getContactMessagesController,
  getContactMessageController,
  updateContactMessageStatusController,
} from "./contact.controller";

import {
  createContactMessageSchema,
  contactMessageIdSchema,
  updateContactMessageSchema,
} from "./contact.validation";

import { UserRole } from "../../generated/prisma/client";

const router = Router();

/**
 * Public contact form
 */
router.post(
  "/",
  validate(createContactMessageSchema),
  asyncHandler(createContactMessageController)
);

/**
 * Admin contact message management
 */
router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(getContactMessagesController)
);

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(contactMessageIdSchema, "params"),
  asyncHandler(getContactMessageController)
);

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(contactMessageIdSchema, "params"),
  validate(updateContactMessageSchema),
  asyncHandler(updateContactMessageStatusController)
);

export default router;
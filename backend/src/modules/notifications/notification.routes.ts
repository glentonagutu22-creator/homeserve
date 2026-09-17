import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../middleware/asyncHandler";



import {
  getMyNotifications,
  getMyUnreadNotifications,
  getMyUnreadCount,
  markAsRead,
  markAllAsRead,
} from "./notification.controller";

import {
  notificationIdSchema,
} from "./notification.validator";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  asyncHandler(getMyNotifications)
);

router.get(
  "/unread",
  asyncHandler(getMyUnreadNotifications)
);

router.get(
  "/unread-count",
  asyncHandler(getMyUnreadCount)
);

router.patch(
  "/read-all",
  asyncHandler(markAllAsRead)
);

router.patch(
  "/:id/read",
  validate(
    notificationIdSchema,
    "params"
  ),
  asyncHandler(markAsRead)
);

export default router;
import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";

import {
  getNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./notification.service";

export async function getMyNotifications(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    throw new AppError(
      "Authentication required",
      401
    );
  }

  const notifications =
    await getNotifications(req.user.userId);

  res.json({
    success: true,
    notifications,
  });
}

export async function getMyUnreadNotifications(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    throw new AppError(
      "Authentication required",
      401
    );
  }

  const notifications =
    await getUnreadNotifications(
      req.user.userId
    );

  res.json({
    success: true,
    notifications,
  });
}

export async function getMyUnreadCount(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    throw new AppError(
      "Authentication required",
      401
    );
  }

  const count = await getUnreadCount(
    req.user.userId
  );

  res.json({
    success: true,
    count,
  });
}

export async function markAsRead(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    throw new AppError(
      "Authentication required",
      401
    );
  }

    const notificationId = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;

const notification =
  await markNotificationAsRead(
    req.user.userId,
    notificationId
  );

  res.json({
    success: true,
    message: "Notification marked as read",
    notification,
  });
}

export async function markAllAsRead(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    throw new AppError(
      "Authentication required",
      401
    );
  }

  const result =
    await markAllNotificationsAsRead(
      req.user.userId
    );

  res.json({
    success: true,
    message:
      "All notifications marked as read",
    count: result.count,
  });
}
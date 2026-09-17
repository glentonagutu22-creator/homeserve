import { apiRequest } from "./api";

import type {
  Notification,
  NotificationsResponse,
  NotificationResponse,
  NotificationCountResponse,
  MarkAllNotificationsResponse,
} from "@/types/notification";

export async function getNotifications(): Promise<
  Notification[]
> {
  const response =
    await apiRequest<NotificationsResponse>(
      "/notifications"
    );

  return response.notifications;
}

export async function getUnreadNotifications(): Promise<
  Notification[]
> {
  const response =
    await apiRequest<NotificationsResponse>(
      "/notifications/unread"
    );

  return response.notifications;
}

export async function getUnreadNotificationCount(): Promise<number> {
  const response =
    await apiRequest<NotificationCountResponse>(
      "/notifications/unread-count"
    );

  return response.count;
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<Notification> {
  const response =
    await apiRequest<NotificationResponse>(
      `/notifications/${notificationId}/read`,
      {
        method: "PATCH",
      }
    );

  return response.notification;
}

export async function markAllNotificationsAsRead(): Promise<number> {
  const response =
    await apiRequest<MarkAllNotificationsResponse>(
      "/notifications/read-all",
      {
        method: "PATCH",
      }
    );

  return response.count;
}
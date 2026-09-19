export type NotificationType =
  | "BOOKING_CREATED"
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "BOOKING_STARTED"
  | "BOOKING_COMPLETED"
  | "QUOTE_REQUESTED"
  | "QUOTE_SENT"
  | "QUOTE_ACCEPTED"
  | "QUOTE_REJECTED"
  | "QUOTE_EXPIRED"
  | "STAFF_ASSIGNED"
  | "STAFF_UNASSIGNED"
  | "PAYMENT_COMPLETED"
  | "PAYMENT_FAILED"
  | "PAYMENT_REFUNDED"
  | "REVIEW_RECEIVED"
  "CONTACT_MESSAGE";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  relatedEntity: string | null;
  relatedEntityId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  notifications: Notification[];
}

export interface NotificationResponse {
  success: boolean;
  message?: string;
  notification: Notification;
}

export interface NotificationCountResponse {
  success: boolean;
  count: number;
}

export interface MarkAllNotificationsResponse {
  success: boolean;
  message: string;
  count: number;
}
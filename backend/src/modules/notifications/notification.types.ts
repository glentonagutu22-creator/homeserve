import { UserRole } from "../../generated/prisma/client";

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
  | "CONTACT_MESSAGE"
  | "REVIEW_RECEIVED";

export type NotificationEntity =
  | "BOOKING"
  | "QUOTE"
  | "PAYMENT"
  | "STAFF"
  | "CONTACT_MESSAGE"
  | "REVIEW";
  

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntity?: NotificationEntity;
  relatedEntityId?: string;
}

export interface CreateRoleNotificationData {
  role: UserRole;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntity?: NotificationEntity;
  relatedEntityId?: string;
}
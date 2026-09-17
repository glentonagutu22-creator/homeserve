export type SettingCategory =
  | "BUSINESS"
  | "BOOKING"
  | "PAYMENT"
  | "NOTIFICATION"
  | "STAFF"
  | "SECURITY"
  | "SYSTEM";

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  category: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserSetting {
  id: string;
  userId: string;

  language: string;
  currency: string;
  timezone: string;

  emailBookingUpdates: boolean;
  emailQuoteUpdates: boolean;
  emailPaymentUpdates: boolean;
  emailServiceUpdates: boolean;
  emailSystemAnnouncements: boolean;

  smsBookingUpdates: boolean;
  smsQuoteUpdates: boolean;
  smsPaymentUpdates: boolean;

  marketingNotifications: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "STAFF" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}
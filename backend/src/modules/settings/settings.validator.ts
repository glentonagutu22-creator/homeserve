import { z } from "zod";

export const settingKeySchema = z.object({
  key: z
    .string()
    .min(2)
    .max(150)
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Setting key contains invalid characters"
    ),
});

export const settingCategorySchema = z.object({
  category: z
    .string()
    .min(2)
    .max(50)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Invalid setting category"
    ),
});

export const updateSettingSchema = z.object({
  value: z.string().max(5000),
});

export const updateSettingsSchema = z.object({
  settings: z
    .array(
      z.object({
        key: z
          .string()
          .min(2)
          .max(150)
          .regex(
            /^[a-zA-Z0-9._-]+$/,
            "Setting key contains invalid characters"
          ),

        value: z.string().max(5000),
      })
    )
    .min(1)
    .max(100),
});

export const updateUserSettingsSchema = z.object({
  language: z.string().min(2).max(10).optional(),

  currency: z
    .string()
    .min(3)
    .max(10)
    .optional(),

  timezone: z
    .string()
    .min(2)
    .max(100)
    .optional(),

  emailBookingUpdates: z.boolean().optional(),

  emailQuoteUpdates: z.boolean().optional(),

  emailPaymentUpdates: z.boolean().optional(),

  emailServiceUpdates: z.boolean().optional(),

  emailSystemAnnouncements: z.boolean().optional(),

  smsBookingUpdates: z.boolean().optional(),

  smsQuoteUpdates: z.boolean().optional(),

  smsPaymentUpdates: z.boolean().optional(),

  marketingNotifications: z.boolean().optional(),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100)
    .optional(),

  phone: z
    .string()
    .min(10)
    .max(20)
    .nullable()
    .optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1),

    newPassword: z
      .string()
      .min(8)
      .max(100),

    confirmPassword: z
      .string()
      .min(8)
      .max(100),
  })
  .refine(
    (data) =>
      data.newPassword ===
      data.confirmPassword,
    {
      message:
        "Passwords do not match",
      path: ["confirmPassword"],
    }
  );
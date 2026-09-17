import { z } from "zod";

export const createStaffSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(20, "Phone number cannot exceed 20 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),

  staffType: z.enum([
    "CLEANER",
    "MOVER",
    "ELECTRICIAN",
    "SUPERVISOR",
  ]),
});

export const updateStaffSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .optional(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(20, "Phone number cannot exceed 20 characters")
    .optional(),

  staffType: z
    .enum([
      "CLEANER",
      "MOVER",
      "ELECTRICIAN",
      "SUPERVISOR",
    ])
    .optional(),
});

export const updateAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});

export const staffIdSchema = z.object({
  id: z.string().uuid("Invalid staff ID"),
});

export const assignStaffSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
});

export const assignmentIdSchema = z.object({
  id: z.string().uuid("Invalid assignment ID"),
});

export const staffBookingIdSchema = z.object({
  id: z.string().uuid("Invalid booking ID"),
});

export const updateStaffBookingStatusSchema = z.object({
  status: z.enum([
    "IN_PROGRESS",
    "COMPLETED",
  ]),
});
import { z } from "zod";

export const createContactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address"),

  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),

  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(150, "Subject is too long"),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long"),
});

export const contactMessageIdSchema = z.object({
  id: z.string().uuid("Invalid contact message ID"),
});

export const updateContactMessageSchema = z.object({
  status: z.enum([
    "NEW",
    "READ",
    "RESPONDED",
    "CLOSED",
  ]),
});
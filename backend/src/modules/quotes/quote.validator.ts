import { z } from "zod";

/**
 * Create a quote
 *
 * Used when a quote needs to be created for
 * a booking that requires manual pricing.
 */
export const createQuoteSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),

  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  estimatedAmount: z
    .number()
    .positive("Estimated amount must be greater than zero")
    .optional(),

  validUntil: z
    .string()
    .datetime({
      message: "Valid until must be a valid ISO date",
    })
    .optional(),
});

/**
 * Update a quote
 *
 * Used by staff/admin when preparing or modifying
 * a quote before sending it to the customer.
 */
export const updateQuoteSchema = z.object({
  estimatedAmount: z
    .number()
    .positive("Estimated amount must be greater than zero")
    .optional(),

  finalAmount: z
    .number()
    .positive("Final amount must be greater than zero")
    .optional(),

  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  validUntil: z
    .string()
    .datetime({
      message: "Valid until must be a valid ISO date",
    })
    .optional(),
});

/**
 * Quote ID parameter
 */
export const quoteIdSchema = z.object({
  id: z.string().uuid("Invalid quote ID"),
});

/**
 * Booking ID parameter
 *
 * Useful for endpoints such as:
 * GET /api/quotes/booking/:bookingId
 */
export const quoteBookingIdSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
});
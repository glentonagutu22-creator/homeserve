import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Shared fields
|--------------------------------------------------------------------------
*/

const baseBookingSchema = {
  serviceId: z
    .string()
    .uuid("Invalid service ID"),

  addressId: z
    .string()
    .uuid("Invalid address ID"),

  scheduledDate: z
    .string()
    .datetime({
      message: "Scheduled date must be a valid ISO date",
    }),

  scheduledTime: z
    .string()
    .min(1, "Scheduled time is required"),

  notes: z
    .string()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional(),
};

/*
|--------------------------------------------------------------------------
| Cleaning booking
|--------------------------------------------------------------------------
*/

const cleaningRequestSchema = z.object({
  propertyType: z
    .string()
    .min(1, "Property type is required"),

  bedrooms: z
    .number()
    .int()
    .min(0)
    .optional(),

  bathrooms: z
    .number()
    .int()
    .min(0)
    .optional(),

  squareMeters: z
    .number()
    .positive()
    .optional(),

  cleaningType: z
    .string()
    .min(1, "Cleaning type is required"),

  additionalRequirements: z
    .string()
    .max(
      1000,
      "Additional requirements cannot exceed 1000 characters"
    )
    .optional(),
});

/*
|--------------------------------------------------------------------------
| Moving booking
|--------------------------------------------------------------------------
*/

const movingRequestSchema = z.object({
  pickupAddress: z
    .string()
    .min(1, "Pickup address is required"),

  destinationAddress: z
    .string()
    .min(1, "Destination address is required"),

  propertyType: z
    .string()
    .min(1, "Property type is required"),

  truckSize: z
    .string()
    .optional(),

  numberOfMovers: z
    .number()
    .int()
    .min(1)
    .optional(),

  packingRequired: z
    .boolean()
    .default(false),

  specialItems: z
    .string()
    .max(
      1000,
      "Special items description cannot exceed 1000 characters"
    )
    .optional(),

  estimatedDistanceKm: z
    .number()
    .positive()
    .optional(),
});

/*
|--------------------------------------------------------------------------
| Electrical booking
|--------------------------------------------------------------------------
*/

const electricalRequestSchema = z.object({
  propertyType: z
    .string()
    .min(1, "Property type is required"),

  numberOfFloors: z
    .number()
    .int()
    .min(1)
    .optional(),

  bedrooms: z
    .number()
    .int()
    .min(0)
    .optional(),

  newInstallation: z
    .boolean()
    .default(false),

  rewiring: z
    .boolean()
    .default(false),

  numberOfSockets: z
    .number()
    .int()
    .min(0)
    .optional(),

  numberOfLights: z
    .number()
    .int()
    .min(0)
    .optional(),

  distributionBoard: z
    .boolean()
    .default(false),

  additionalRequirements: z
    .string()
    .max(
      1000,
      "Additional requirements cannot exceed 1000 characters"
    )
    .optional(),
});

/*
|--------------------------------------------------------------------------
| Create booking
|--------------------------------------------------------------------------
*/

export const createBookingSchema = z
  .object({
    ...baseBookingSchema,

    bookingType: z.enum([
      "INSTANT",
      "QUOTE_REQUEST",
    ]),

    cleaningRequest: cleaningRequestSchema.optional(),

    movingRequest: movingRequestSchema.optional(),

    electricalRequest:
      electricalRequestSchema.optional(),
  })
  .superRefine((data, ctx) => {
    const requestCount = [
      data.cleaningRequest,
      data.movingRequest,
      data.electricalRequest,
    ].filter(Boolean).length;

    if (requestCount !== 1) {
      ctx.addIssue({
        code: "custom",
        message:
          "Exactly one service-specific request is required",
        path: [
          "serviceRequest",
        ],
      });
    }
  });

/*
|--------------------------------------------------------------------------
| Cancel booking
|--------------------------------------------------------------------------
*/

export const cancelBookingSchema = z.object({
  reason: z
    .string()
    .max(
      500,
      "Cancellation reason cannot exceed 500 characters"
    )
    .optional(),
});
import { z } from "zod";

/**
 * Calculate cleaning price
 */
export const calculateCleaningPriceSchema = z.object({
  serviceId: z.string().uuid("Invalid service ID"),

  propertyType: z
    .string()
    .min(1, "Property type is required"),

  bedrooms: z
    .number()
    .int()
    .min(0, "Bedrooms cannot be negative")
    .optional(),

  bathrooms: z
    .number()
    .int()
    .min(0, "Bathrooms cannot be negative")
    .optional(),

  squareMeters: z
    .number()
    .positive("Square meters must be greater than zero")
    .optional(),

  cleaningType: z
    .string()
    .min(1, "Cleaning type is required"),

  additionalRequirements: z
    .string()
    .max(1000, "Additional requirements cannot exceed 1000 characters")
    .optional(),
});

/**
 * Calculate moving price
 */
export const calculateMovingPriceSchema = z.object({
  serviceId: z.string().uuid("Invalid service ID"),

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
    .min(1, "At least one mover is required")
    .optional(),

  packingRequired: z
    .boolean()
    .default(false),

  estimatedDistanceKm: z
    .number()
    .positive("Distance must be greater than zero")
    .optional(),

  specialItems: z
    .string()
    .max(1000, "Special items cannot exceed 1000 characters")
    .optional(),
});

/**
 * Calculate electrical service price
 */
export const calculateElectricalPriceSchema = z.object({
  serviceId: z.string().uuid("Invalid service ID"),

  propertyType: z
    .string()
    .min(1, "Property type is required"),

  numberOfFloors: z
    .number()
    .int()
    .min(1, "Number of floors must be at least 1")
    .optional(),

  bedrooms: z
    .number()
    .int()
    .min(0, "Bedrooms cannot be negative")
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
    .min(0, "Sockets cannot be negative")
    .optional(),

  numberOfLights: z
    .number()
    .int()
    .min(0, "Lights cannot be negative")
    .optional(),

  distributionBoard: z
    .boolean()
    .default(false),

  additionalRequirements: z
    .string()
    .max(1000, "Additional requirements cannot exceed 1000 characters")
    .optional(),
});
/**
 * Pricing rule ID
 */
export const pricingRuleIdSchema = z.object({
  id: z.string().uuid("Invalid pricing rule ID"),
});

/**
 * Create pricing rule
 */
export const createPricingRuleSchema = z.object({
  category: z.enum([
    "CLEANING",
    "MOVING",
    "ELECTRICAL",
  ]),

  name: z
    .string()
    .min(1, "Pricing rule name is required")
    .max(100, "Pricing rule name cannot exceed 100 characters")
    .transform((value) => value.trim().toUpperCase()),

  description: z
    .string()
    .max(
      500,
      "Description cannot exceed 500 characters"
    )
    .optional(),

  unit: z
    .string()
    .min(1, "Unit is required")
    .max(50, "Unit cannot exceed 50 characters"),

  unitPrice: z
    .number()
    .min(0, "Unit price cannot be negative"),

  isActive: z.boolean().optional(),
});

/**
 * Update pricing rule
 */
export const updatePricingRuleSchema = z
  .object({
    name: z
      .string()
      .min(1, "Pricing rule name is required")
      .max(
        100,
        "Pricing rule name cannot exceed 100 characters"
      )
      .transform((value) =>
        value.trim().toUpperCase()
      )
      .optional(),

    description: z
      .string()
      .max(
        500,
        "Description cannot exceed 500 characters"
      )
      .optional(),

    unit: z
      .string()
      .min(1, "Unit is required")
      .max(
        50,
        "Unit cannot exceed 50 characters"
      )
      .optional(),

    unitPrice: z
      .number()
      .min(0, "Unit price cannot be negative")
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        "At least one field must be provided for update",
    }
  );

/**
 * Update pricing rule status
 */
export const updatePricingRuleStatusSchema =
  z.object({
    isActive: z.boolean(),
  });

  export const updateServiceSchema = z.object({
  name: z.string().min(2).max(100).optional(),

  description: z
    .string()
    .max(1000)
    .nullable()
    .optional(),

  pricingType: z
    .enum([
      "FIXED",
      "CALCULATED",
      "QUOTE",
    ])
    .optional(),

  basePrice: z
    .number()
    .nonnegative()
    .nullable()
    .optional(),

  duration: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional(),
});

export const updateServiceStatusSchema =
  z.object({
    isActive: z.boolean(),
  });
  export const serviceIdSchema = z.object({
  id: z.string().uuid(),
});
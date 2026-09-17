import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Create Address
|--------------------------------------------------------------------------
*/

export const createAddressSchema = z.object({
  label: z
    .string()
    .min(1, "Address label is required")
    .max(50, "Address label cannot exceed 50 characters"),

  addressLine: z
    .string()
    .min(1, "Address line is required")
    .max(255, "Address line cannot exceed 255 characters"),

  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City cannot exceed 100 characters"),

  county: z
    .string()
    .min(1, "County is required")
    .max(100, "County cannot exceed 100 characters"),

  latitude: z
    .number()
    .min(-90)
    .max(90)
    .optional(),

  longitude: z
    .number()
    .min(-180)
    .max(180)
    .optional(),
});

/*
|--------------------------------------------------------------------------
| Update Address
|--------------------------------------------------------------------------
*/

export const updateAddressSchema =
  createAddressSchema.partial();

/*
|--------------------------------------------------------------------------
| Address ID
|--------------------------------------------------------------------------
*/

export const addressIdSchema = z.object({
  id: z.string().uuid("Invalid address ID"),
});
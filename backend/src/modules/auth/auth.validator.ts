import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  email: z
  
   
    .email("Invalid email address")
    .toLowerCase(),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number must not exceed 15 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 4 characters")
    .max(100, "Password must not exceed 100 characters"),
});

export const loginSchema = z.object({
  email: z

    .email("Invalid email address")
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const googleLoginSchema = z.object({
  credential: z
    .string()
    .min(1, "Google credential is required"),
});
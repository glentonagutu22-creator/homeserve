import { z } from "zod";

export const paymentIdSchema = z.object({
  id: z.string().uuid(),
});

export const updatePaymentStatusSchema =
  z.object({
    status: z.enum([
      "PENDING",
      "COMPLETED",
      "FAILED",
      "REFUNDED",
    ]),
  });
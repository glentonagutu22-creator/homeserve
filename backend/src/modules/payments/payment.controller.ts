import {
  Request,
  Response,
} from "express";

import {
  getPayments,
  getPaymentById,
  updatePaymentStatus,
} from "./payment.service";

/**
 * Get all payments.
 */
export async function getAllPayments(
  _req: Request,
  res: Response
) {
  const payments = await getPayments();

  return res.status(200).json({
    success: true,
    payments,
  });
}

/**
 * Get a single payment.
 */
export async function getPayment(
  req: Request,
  res: Response
) {
  const payment =
    await getPaymentById(
      String(req.params.id)
    );

  return res.status(200).json({
    success: true,
    payment,
  });
}

/**
 * Update payment status.
 */
export async function updateStatus(
  req: Request,
  res: Response
) {
  const payment =
    await updatePaymentStatus(
      String(req.params.id),
      req.body.status
    );

  return res.status(200).json({
    success: true,
    message:
      "Payment status updated successfully",
    payment,
  });
}
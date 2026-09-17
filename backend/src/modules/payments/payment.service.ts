import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

import {
  UserRole,
} from "../../generated/prisma/client";

import {
  createNotification,
  createRoleNotification,

  sendPaymentCompletedEmail,
  sendPaymentCompletedSms,

  sendPaymentFailedEmail,
  sendPaymentFailedSms,
} from "../notifications/notification.service";

/**
 * Get all payments.
 *
 * Includes the related booking, customer,
 * service and address so the admin dashboard
 * has enough information to display the
 * payment record.
 */
export async function getPayments() {
  return prisma.payment.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      booking: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },

          service: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },

          address: {
            select: {
              id: true,
              label: true,
              addressLine: true,
              city: true,
              county: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Get a single payment by ID.
 */
export async function getPaymentById(
  paymentId: string
) {
  const payment =
    await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },

      include: {
        booking: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },

            service: {
              select: {
                id: true,
                name: true,
                category: true,
                pricingType: true,
              },
            },

            address: {
              select: {
                id: true,
                label: true,
                addressLine: true,
                city: true,
                county: true,
              },
            },
          },
        },
      },
    });

  if (!payment) {
    throw new AppError(
      "Payment not found",
      404
    );
  }

  return payment;
}

/**
 * Update payment status.
 *
 * Payment amount and transaction reference
 * are deliberately not modified here.
 */
export async function updatePaymentStatus(
  paymentId: string,
  status:
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "REFUNDED"
) {
  const payment =
    await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },

      include: {
        booking: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },

            service: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
    });

  if (!payment) {
    throw new AppError(
      "Payment not found",
      404
    );
  }

  /*
   * Keep payment state transitions sensible.
   *
   * A refunded payment cannot become completed
   * again.
   */
  if (
    payment.status === "REFUNDED" &&
    status !== "REFUNDED"
  ) {
    throw new AppError(
      "A refunded payment cannot be moved to another status",
      400
    );
  }

  /*
   * Once a payment is completed, we don't allow
   * it to be changed back to pending manually.
   *
   * Refunds remain possible.
   */
  if (
    payment.status === "COMPLETED" &&
    status === "PENDING"
  ) {
    throw new AppError(
      "A completed payment cannot be changed back to pending",
      400
    );
  }

  /*
   * Prevent duplicate notifications when the
   * same status is submitted again.
   */
  const statusChanged =
    payment.status !== status;

  const paidAt =
    status === "COMPLETED"
      ? payment.paidAt ?? new Date()
      : status === "REFUNDED"
      ? payment.paidAt
      : null;

  /*
   * Update payment first.
   *
   * Notifications are intentionally sent only
   * after this operation succeeds.
   */
  const updatedPayment =
    await prisma.payment.update({
      where: {
        id: paymentId,
      },

      data: {
        status,
        paidAt,
      },

      include: {
        booking: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },

            service: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
    });

  /*
   |--------------------------------------------------------------------------
   | Payment completed
   |--------------------------------------------------------------------------
   */

  if (
    statusChanged &&
    status === "COMPLETED"
  ) {
    /*
     * Customer - IN APP
     */

    await createNotification({
      userId:
        updatedPayment.booking.user.id,

      type: "PAYMENT_COMPLETED",

      title: "Payment Completed",

      message:
        `Your payment for booking ${updatedPayment.booking.bookingNumber} has been completed successfully.`,

      relatedEntity: "PAYMENT",

      relatedEntityId:
        updatedPayment.id,
    });

    /*
     * Admin - IN APP
     */

    await createRoleNotification({
      role: UserRole.ADMIN,

      type: "PAYMENT_COMPLETED",

      title: "Payment Completed",

      message:
        `Payment for booking ${updatedPayment.booking.bookingNumber} has been completed.`,

      relatedEntity: "PAYMENT",

      relatedEntityId:
        updatedPayment.id,
    });

    /*
     * Customer - EMAIL
     *
     * sendPaymentCompletedEmail expects:
     * - email
     * - name
     * - bookingNumber
     * - amount
     * - paymentMethod
     */

    try {
      await sendPaymentCompletedEmail({
        email:
          updatedPayment.booking.user.email,

        name:
          updatedPayment.booking.user.name,

        bookingNumber:
          updatedPayment.booking.bookingNumber,

        amount:
          updatedPayment.amount.toString(),

        paymentMethod:
          updatedPayment.method,
      });
    } catch (error) {
      console.error(
        "Failed to send payment completed email:",
        error
      );
    }

    /*
     * Customer - SMS
     */

    if (
      updatedPayment.booking.user.phone
    ) {
      try {
        await sendPaymentCompletedSms({
          phone:
            updatedPayment.booking.user.phone,

          bookingNumber:
            updatedPayment.booking.bookingNumber,

          amount:
            updatedPayment.amount.toString(),
        });
      } catch (error) {
        console.error(
          "Failed to send payment completed SMS:",
          error
        );
      }
    }
  }

  /*
   |--------------------------------------------------------------------------
   | Payment failed
   |--------------------------------------------------------------------------
   */

  if (
    statusChanged &&
    status === "FAILED"
  ) {
    /*
     * Customer - IN APP
     */

    await createNotification({
      userId:
        updatedPayment.booking.user.id,

      type: "PAYMENT_FAILED",

      title: "Payment Failed",

      message:
        `Your payment for booking ${updatedPayment.booking.bookingNumber} has failed. Please try again or choose another payment method.`,

      relatedEntity: "PAYMENT",

      relatedEntityId:
        updatedPayment.id,
    });

    /*
     * Admin - IN APP
     */

    await createRoleNotification({
      role: UserRole.ADMIN,

      type: "PAYMENT_FAILED",

      title: "Payment Failed",

      message:
        `Payment for booking ${updatedPayment.booking.bookingNumber} has failed.`,

      relatedEntity: "PAYMENT",

      relatedEntityId:
        updatedPayment.id,
    });

    /*
     * Customer - EMAIL
     *
     * sendPaymentFailedEmail expects:
     * - email
     * - name
     * - bookingNumber
     * - amount
     * - paymentMethod
     */

    try {
      await sendPaymentFailedEmail({
        email:
          updatedPayment.booking.user.email,

        name:
          updatedPayment.booking.user.name,

        bookingNumber:
          updatedPayment.booking.bookingNumber,

        amount:
          updatedPayment.amount.toString(),

        paymentMethod:
          updatedPayment.method,
      });
    } catch (error) {
      console.error(
        "Failed to send payment failed email:",
        error
      );
    }

    /*
     * Customer - SMS
     */

    if (
      updatedPayment.booking.user.phone
    ) {
      try {
        await sendPaymentFailedSms({
          phone:
            updatedPayment.booking.user.phone,

          bookingNumber:
            updatedPayment.booking.bookingNumber,

          amount:
            updatedPayment.amount.toString(),
        });
      } catch (error) {
        console.error(
          "Failed to send payment failed SMS:",
          error
        );
      }
    }
  }

  /*
   |--------------------------------------------------------------------------
   | Payment refunded
   |--------------------------------------------------------------------------
   */

  if (
    statusChanged &&
    status === "REFUNDED"
  ) {
    /*
     * Customer - IN APP
     */

    await createNotification({
      userId:
        updatedPayment.booking.user.id,

      type: "PAYMENT_REFUNDED",

      title: "Payment Refunded",

      message:
        `Your payment for booking ${updatedPayment.booking.bookingNumber} has been refunded.`,

      relatedEntity: "PAYMENT",

      relatedEntityId:
        updatedPayment.id,
    });

    /*
     * Admin - IN APP
     */

    await createRoleNotification({
      role: UserRole.ADMIN,

      type: "PAYMENT_REFUNDED",

      title: "Payment Refunded",

      message:
        `Payment for booking ${updatedPayment.booking.bookingNumber} has been refunded.`,

      relatedEntity: "PAYMENT",

      relatedEntityId:
        updatedPayment.id,
    });
  }

  return updatedPayment;
}
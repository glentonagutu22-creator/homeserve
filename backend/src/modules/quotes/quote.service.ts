import {
  QuoteStatus,
  Prisma,
  UserRole,
} from "../../generated/prisma/client";

import { prisma } from "../../config/prisma";

import { AppError } from "../../utils/AppError";

import {
  createNotification,
  createRoleNotification,

  sendBookingConfirmedEmail,
  sendBookingConfirmedSms,

  sendQuoteSentEmail,
  sendQuoteSentSms,

  sendQuoteAcceptedEmail,
  sendQuoteAcceptedSms,

  sendQuoteRejectedEmail,

  sendQuoteExpiredEmail,
} from "../notifications/notification.service";

/*
|--------------------------------------------------------------------------
| Customer - Create quote
|--------------------------------------------------------------------------
*/

/**
 * Create a quote for a booking.
 *
 * A quote can only be created for a booking that:
 * - exists
 * - belongs to the customer making the request
 * - uses a QUOTE_REQUEST booking type
 * - does not already have a quote
 */
export async function createQuote(
  userId: string,
  data: {
    bookingId: string;
    description?: string;
    estimatedAmount?: number;
    validUntil?: string;
  }
) {
  const booking =
    await prisma.booking.findFirst({
      where: {
        id: data.bookingId,
        userId,
      },

      include: {
        service: true,
        quote: true,
      },
    });

  if (!booking) {
    throw new AppError(
      "Booking not found",
      404
    );
  }

  if (
    booking.bookingType !==
    "QUOTE_REQUEST"
  ) {
    throw new AppError(
      "A quote can only be created for a quote-request booking",
      400
    );
  }

  if (booking.quote) {
    throw new AppError(
      "A quote already exists for this booking",
      409
    );
  }

  const quote =
    await prisma.quote.create({
      data: {
        bookingId: booking.id,

        description:
          data.description,

        estimatedAmount:
          data.estimatedAmount !==
          undefined
            ? new Prisma.Decimal(
                data.estimatedAmount
              )
            : undefined,

        validUntil:
          data.validUntil
            ? new Date(data.validUntil)
            : undefined,

        status:
          QuoteStatus.PENDING,
      },

      include: {
        booking: {
          include: {
            service: true,
            address: true,
          },
        },
      },
    });

  /*
  |--------------------------------------------------------------------------
  | Notify admins
  |--------------------------------------------------------------------------
  */

  await createRoleNotification({
    role: UserRole.ADMIN,

    type: "QUOTE_REQUESTED",

    title: "New Quote Request",

    message:
      `A quote has been requested for booking ${quote.booking.bookingNumber}.`,

    relatedEntity: "QUOTE",

    relatedEntityId:
      quote.id,
  });

  return quote;
}

/*
|--------------------------------------------------------------------------
| Customer - Get single quote
|--------------------------------------------------------------------------
*/

/**
 * Get a customer's quote by ID.
 */
export async function getCustomerQuote(
  userId: string,
  quoteId: string
) {
  const quote =
    await prisma.quote.findFirst({
      where: {
        id: quoteId,

        booking: {
          userId,
        },
      },

      include: {
        booking: {
          include: {
            service: true,
            address: true,
            cleaningRequest: true,
            movingRequest: true,
            electricalRequest: true,
          },
        },
      },
    });

  if (!quote) {
    throw new AppError(
      "Quote not found",
      404
    );
  }

  return quote;
}

/*
|--------------------------------------------------------------------------
| Customer - Get all quotes
|--------------------------------------------------------------------------
*/

/**
 * Get all quotes belonging to a customer.
 */
export async function getCustomerQuotes(
  userId: string
) {
  return prisma.quote.findMany({
    where: {
      booking: {
        userId,
      },
    },

    include: {
      booking: {
        include: {
          service: true,
          address: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

/*
|--------------------------------------------------------------------------
| Customer - Accept quote
|--------------------------------------------------------------------------
*/

/**
 * Customer accepts a quote.
 *
 * SENT → ACCEPTED
 *
 * The associated booking becomes CONFIRMED.
 */
export async function acceptQuote(
  userId: string,
  quoteId: string
) {
  const quote =
    await prisma.quote.findFirst({
      where: {
        id: quoteId,

        booking: {
          userId,
        },
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

            service: true,
          },
        },
      },
    });

  if (!quote) {
    throw new AppError(
      "Quote not found",
      404
    );
  }

  if (
    quote.status !==
    QuoteStatus.SENT
  ) {
    throw new AppError(
      "Only sent quotes can be accepted",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Check expiration
  |--------------------------------------------------------------------------
  */

  if (
    quote.validUntil &&
    quote.validUntil < new Date()
  ) {
    const expiredQuote =
      await prisma.quote.update({
        where: {
          id: quoteId,
        },

        data: {
          status:
            QuoteStatus.EXPIRED,
        },
      });

    /*
    |--------------------------------------------------------------------------
    | Notify customer - IN APP
    |--------------------------------------------------------------------------
    */

    await createNotification({
      userId,

      type: "QUOTE_EXPIRED",

      title: "Quote Expired",

      message:
        `Your quote for booking ${quote.booking.bookingNumber} has expired.`,

      relatedEntity: "QUOTE",

      relatedEntityId:
        expiredQuote.id,
    });

    /*
    |--------------------------------------------------------------------------
    | Notify customer - EMAIL
    |--------------------------------------------------------------------------
    */

    try {
      await sendQuoteExpiredEmail({
        email:
          quote.booking.user.email,

        name:
          quote.booking.user.name,

        bookingNumber:
          quote.booking.bookingNumber,

        serviceName:
          quote.booking.service.name,
      });
    } catch (error) {
      console.error(
        "Failed to send quote expired email:",
        error
      );
    }

    throw new AppError(
      "This quote has expired",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Determine final amount
  |--------------------------------------------------------------------------
  */

  const finalAmount =
    quote.finalAmount ??
    quote.estimatedAmount;

  if (!finalAmount) {
    throw new AppError(
      "The quote does not have a valid amount",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Accept quote + confirm booking
  |--------------------------------------------------------------------------
  */

  const result =
    await prisma.$transaction(
      async (tx) => {
        const updatedQuote =
          await tx.quote.update({
            where: {
              id: quoteId,
            },

            data: {
              status:
                QuoteStatus.ACCEPTED,
            },
          });

        const updatedBooking =
          await tx.booking.update({
            where: {
              id: quote.bookingId,
            },

            data: {
              totalAmount:
                finalAmount,

              status:
                "CONFIRMED",
            },

            include: {
              service: true,

              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                },
              },
            },
          });

        return {
          quote: updatedQuote,
          booking: updatedBooking,
        };
      }
    );

  /*
  |--------------------------------------------------------------------------
  | Notify customer - QUOTE ACCEPTED / IN APP
  |--------------------------------------------------------------------------
  */

  await createNotification({
    userId,

    type: "QUOTE_ACCEPTED",

    title: "Quote Accepted",

    message:
      `You accepted the quote for booking ${result.booking.bookingNumber}. Your booking is now confirmed.`,

    relatedEntity: "QUOTE",

    relatedEntityId:
      result.quote.id,
  });

  /*
  |--------------------------------------------------------------------------
  | Notify customer - QUOTE ACCEPTED / EMAIL
  |--------------------------------------------------------------------------
  */

  try {
await sendQuoteAcceptedEmail({
  email: result.booking.user.email,
  name: result.booking.user.name,
  bookingNumber: result.booking.bookingNumber,
  serviceName: result.booking.service.name,
  amount: finalAmount.toString(),
});
  } catch (error) {
    console.error(
      "Failed to send quote accepted email:",
      error
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Notify customer - QUOTE ACCEPTED / SMS
  |--------------------------------------------------------------------------
  */

  if (
    result.booking.user.phone
  ) {
    try {
      await sendQuoteAcceptedSms({
        phone:
          result.booking.user.phone,

        bookingNumber:
          result.booking.bookingNumber,
      });
    } catch (error) {
      console.error(
        "Failed to send quote accepted SMS:",
        error
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Notify customer - BOOKING CONFIRMED / IN APP
  |--------------------------------------------------------------------------
  */

  await createNotification({
    userId,

    type: "BOOKING_CONFIRMED",

    title: "Booking Confirmed",

    message:
      `Your booking ${result.booking.bookingNumber} has been confirmed.`,

    relatedEntity: "BOOKING",

    relatedEntityId:
      result.booking.id,
  });

  /*
  |--------------------------------------------------------------------------
  | Notify customer - BOOKING CONFIRMED / EMAIL
  |--------------------------------------------------------------------------
  */

  try {
    await sendBookingConfirmedEmail({
      email:
        result.booking.user.email,

      name:
        result.booking.user.name,

      bookingNumber:
        result.booking.bookingNumber,

      serviceName:
        result.booking.service.name,

      scheduledDate:
        result.booking.scheduledDate
          .toISOString(),

      scheduledTime:
        result.booking.scheduledTime,
    });
  } catch (error) {
    console.error(
      "Failed to send booking confirmed email:",
      error
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Notify customer - BOOKING CONFIRMED / SMS
  |--------------------------------------------------------------------------
  */

  if (
    result.booking.user.phone
  ) {
    try {
      await sendBookingConfirmedSms({
        phone:
          result.booking.user.phone,

        bookingNumber:
          result.booking.bookingNumber,

        serviceName:
          result.booking.service.name,
      });
    } catch (error) {
      console.error(
        "Failed to send booking confirmed SMS:",
        error
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Notify admins
  |--------------------------------------------------------------------------
  */

  await createRoleNotification({
    role: UserRole.ADMIN,

    type: "QUOTE_ACCEPTED",

    title: "Quote Accepted",

    message:
      `Customer accepted the quote for booking ${result.booking.bookingNumber}.`,

    relatedEntity: "QUOTE",

    relatedEntityId:
      result.quote.id,
  });

  return result;
}

/*
|--------------------------------------------------------------------------
| Customer - Reject quote
|--------------------------------------------------------------------------
*/

/**
 * Customer rejects a quote.
 *
 * SENT → REJECTED
 *
 * The associated booking becomes CANCELLED.
 */
export async function rejectQuote(
  userId: string,
  quoteId: string
) {
  const quote =
    await prisma.quote.findFirst({
      where: {
        id: quoteId,

        booking: {
          userId,
        },
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

            service: true,
          },
        },
      },
    });

  if (!quote) {
    throw new AppError(
      "Quote not found",
      404
    );
  }

  if (
    quote.status !==
    QuoteStatus.SENT
  ) {
    throw new AppError(
      "Only sent quotes can be rejected",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Reject quote + cancel booking
  |--------------------------------------------------------------------------
  */

  const result =
    await prisma.$transaction(
      async (tx) => {
        const updatedQuote =
          await tx.quote.update({
            where: {
              id: quoteId,
            },

            data: {
              status:
                QuoteStatus.REJECTED,
            },
          });

        const updatedBooking =
          await tx.booking.update({
            where: {
              id: quote.bookingId,
            },

            data: {
              status:
                "CANCELLED",

              notes:
                "Quote rejected by customer.",
            },

            include: {
              service: true,

              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                },
              },
            },
          });

        return {
          quote: updatedQuote,
          booking: updatedBooking,
        };
      }
    );

  /*
  |--------------------------------------------------------------------------
  | Notify customer - IN APP
  |--------------------------------------------------------------------------
  */

  await createNotification({
    userId,

    type: "QUOTE_REJECTED",

    title: "Quote Rejected",

    message:
      `You rejected the quote for booking ${result.booking.bookingNumber}.`,

    relatedEntity: "QUOTE",

    relatedEntityId:
      result.quote.id,
  });

  /*
  |--------------------------------------------------------------------------
  | Notify customer - EMAIL
  |--------------------------------------------------------------------------
  */

  try {
    await sendQuoteRejectedEmail({
      email:
        result.booking.user.email,

      name:
        result.booking.user.name,

      bookingNumber:
        result.booking.bookingNumber,

      serviceName:
        result.booking.service.name,
    });
  } catch (error) {
    console.error(
      "Failed to send quote rejected email:",
      error
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Notify admins
  |--------------------------------------------------------------------------
  */

  await createRoleNotification({
    role: UserRole.ADMIN,

    type: "QUOTE_REJECTED",

    title: "Quote Rejected",

    message:
      `Customer rejected the quote for booking ${result.booking.bookingNumber}.`,

    relatedEntity: "QUOTE",

    relatedEntityId:
      result.quote.id,
  });

  return result;
}

/*
|--------------------------------------------------------------------------
| Admin - Get all quotes
|--------------------------------------------------------------------------
*/

/**
 * Get all quote requests.
 *
 * Admin only.
 */
export async function getAllQuotes() {
  const quotes =
    await prisma.quote.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        booking: {
          include: {
            user: true,
            service: true,
            address: true,
            cleaningRequest: true,
            movingRequest: true,
            electricalRequest: true,
          },
        },
      },
    });

  return quotes;
}

/*
|--------------------------------------------------------------------------
| Admin - Get single quote
|--------------------------------------------------------------------------
*/

/**
 * Get a specific quote including
 * customer and booking details.
 *
 * Admin only.
 */
export async function getAdminQuote(
  quoteId: string
) {
  const quote =
    await prisma.quote.findUnique({
      where: {
        id: quoteId,
      },

      include: {
        booking: {
          include: {
            user: true,
            service: true,
            address: true,
            cleaningRequest: true,
            movingRequest: true,
            electricalRequest: true,
          },
        },
      },
    });

  if (!quote) {
    throw new AppError(
      "Quote not found",
      404
    );
  }

  return quote;
}

/*
|--------------------------------------------------------------------------
| Admin - Update quote
|--------------------------------------------------------------------------
*/

/**
 * Update a quote before it is sent.
 *
 * Admin only.
 *
 * Allowed states:
 * - PENDING
 * - SENT
 */
export async function updateAdminQuote(
  quoteId: string,
  data: {
    estimatedAmount?: number;
    finalAmount?: number;
    description?: string;
    validUntil?: string;
  }
) {
  const quote =
    await prisma.quote.findUnique({
      where: {
        id: quoteId,
      },
    });

  if (!quote) {
    throw new AppError(
      "Quote not found",
      404
    );
  }

  if (
    quote.status ===
      QuoteStatus.ACCEPTED ||
    quote.status ===
      QuoteStatus.REJECTED ||
    quote.status ===
      QuoteStatus.EXPIRED
  ) {
    throw new AppError(
      "This quote can no longer be modified",
      400
    );
  }

  const updatedQuote =
    await prisma.quote.update({
      where: {
        id: quoteId,
      },

      data: {
        estimatedAmount:
          data.estimatedAmount !==
          undefined
            ? new Prisma.Decimal(
                data.estimatedAmount
              )
            : undefined,

        finalAmount:
          data.finalAmount !==
          undefined
            ? new Prisma.Decimal(
                data.finalAmount
              )
            : undefined,

        description:
          data.description,

        validUntil:
          data.validUntil
            ? new Date(
                data.validUntil
              )
            : undefined,
      },

      include: {
        booking: {
          include: {
            user: true,
            service: true,
            address: true,
            cleaningRequest: true,
            movingRequest: true,
            electricalRequest: true,
          },
        },
      },
    });

  return updatedQuote;
}

/*
|--------------------------------------------------------------------------
| Admin - Send quote
|--------------------------------------------------------------------------
*/

/**
 * Send a prepared quote to the customer.
 *
 * PENDING → SENT
 *
 * The booking receives the quoted amount,
 * but remains PENDING until the customer accepts.
 */
export async function sendAdminQuote(
  quoteId: string
) {
  const quote =
    await prisma.quote.findUnique({
      where: {
        id: quoteId,
      },
    });

  if (!quote) {
    throw new AppError(
      "Quote not found",
      404
    );
  }

  if (
    quote.status !==
    QuoteStatus.PENDING
  ) {
    throw new AppError(
      "Only pending quotes can be sent",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Require an amount
  |--------------------------------------------------------------------------
  */

  const quoteAmount =
    quote.finalAmount ??
    quote.estimatedAmount;

  if (!quoteAmount) {
    throw new AppError(
      "A quote must have an amount before it can be sent",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Send quote + update booking price
  |--------------------------------------------------------------------------
  */

  const result =
    await prisma.$transaction(
      async (tx) => {
        const sentQuote =
          await tx.quote.update({
            where: {
              id: quoteId,
            },

            data: {
              status:
                QuoteStatus.SENT,
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

                  service: true,
                  address: true,
                  cleaningRequest: true,
                  movingRequest: true,
                  electricalRequest: true,
                },
              },
            },
          });

        await tx.booking.update({
          where: {
            id: quote.bookingId,
          },

          data: {
            totalAmount:
              quoteAmount,
          },
        });

        return sentQuote;
      }
    );

  /*
  |--------------------------------------------------------------------------
  | Notify customer - IN APP
  |--------------------------------------------------------------------------
  */

  await createNotification({
    userId:
      result.booking.user.id,

    type: "QUOTE_SENT",

    title: "Your Quote Is Ready",

    message:
      `Your quote for booking ${result.booking.bookingNumber} is ready for review.`,

    relatedEntity: "QUOTE",

    relatedEntityId:
      result.id,
  });

  /*
  |--------------------------------------------------------------------------
  | Notify customer - EMAIL
  |--------------------------------------------------------------------------
  */

  try {
    await sendQuoteSentEmail({
      email:
        result.booking.user.email,

      name:
        result.booking.user.name,

      bookingNumber:
        result.booking.bookingNumber,

      serviceName:
        result.booking.service.name,

      amount:
        quoteAmount.toString(),

      validUntil:
        result.validUntil?.toISOString(),
    });
  } catch (error) {
    console.error(
      "Failed to send quote sent email:",
      error
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Notify customer - SMS
  |--------------------------------------------------------------------------
  */

  if (
    result.booking.user.phone
  ) {
    try {
      await sendQuoteSentSms({
        phone:
          result.booking.user.phone,

        bookingNumber:
          result.booking.bookingNumber,

        amount:
          quoteAmount.toString(),
      });
    } catch (error) {
      console.error(
        "Failed to send quote sent SMS:",
        error
      );
    }
  }

  return result;
}
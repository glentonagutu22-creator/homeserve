import {
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
  QuoteStatus,
  ServiceCategory,
} from "../../generated/prisma/client";

import { prisma } from "../../config/prisma";

export async function getReports() {
  const [
    totalBookings,
    completedBookings,
    cancelledBookings,
    pendingBookings,
    confirmedBookings,
    assignedBookings,
    inProgressBookings,
    totalCustomers,
    totalStaff,
    totalServices,
    completedPayments,
    pendingPayments,
    failedPayments,
    refundedPayments,
    quoteCounts,
    bookingsByCategory,
    bookingsByService,
    recentBookings,
  ] = await Promise.all([
    // =====================================================
    // BOOKINGS
    // =====================================================

    prisma.booking.count(),

    prisma.booking.count({
      where: {
        status: BookingStatus.COMPLETED,
      },
    }),

    prisma.booking.count({
      where: {
        status: BookingStatus.CANCELLED,
      },
    }),

    prisma.booking.count({
      where: {
        status: BookingStatus.PENDING,
      },
    }),

    prisma.booking.count({
      where: {
        status: BookingStatus.CONFIRMED,
      },
    }),

    prisma.booking.count({
      where: {
        status: BookingStatus.ASSIGNED,
      },
    }),

    prisma.booking.count({
      where: {
        status: BookingStatus.IN_PROGRESS,
      },
    }),

    // =====================================================
    // USERS
    // =====================================================

    prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    }),

    prisma.user.count({
      where: {
        role: "STAFF",
      },
    }),

    // =====================================================
    // SERVICES
    // =====================================================

    prisma.service.count({
      where: {
        isActive: true,
      },
    }),

    // =====================================================
    // PAYMENTS
    // =====================================================

    prisma.payment.count({
      where: {
        status: PaymentStatus.COMPLETED,
      },
    }),

    prisma.payment.count({
      where: {
        status: PaymentStatus.PENDING,
      },
    }),

    prisma.payment.count({
      where: {
        status: PaymentStatus.FAILED,
      },
    }),

    prisma.payment.count({
      where: {
        status: PaymentStatus.REFUNDED,
      },
    }),

    // =====================================================
    // QUOTES
    // =====================================================

    prisma.quote.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),

    // =====================================================
    // BOOKINGS BY CATEGORY
    // =====================================================

    prisma.booking.groupBy({
      by: ["serviceId"],
      _count: {
        _all: true,
      },
    }),

    // =====================================================
    // BOOKINGS BY SERVICE
    // =====================================================

    prisma.service.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        category: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),

    // =====================================================
    // RECENT BOOKINGS
    // =====================================================

    prisma.booking.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        bookingNumber: true,
        status: true,
        bookingType: true,
        totalAmount: true,
        scheduledDate: true,
        createdAt: true,

        user: {
          select: {
            name: true,
            email: true,
          },
        },

        service: {
          select: {
            name: true,
            category: true,
          },
        },

        payment: {
          select: {
            amount: true,
            status: true,
            method: true,
            paidAt: true,
          },
        },
      },
    }),
  ]);

  // =====================================================
  // REVENUE
  // =====================================================

  const completedPaymentAggregate =
    await prisma.payment.aggregate({
      where: {
        status: PaymentStatus.COMPLETED,
      },
      _sum: {
        amount: true,
      },
    });

  const refundedPaymentAggregate =
    await prisma.payment.aggregate({
      where: {
        status: PaymentStatus.REFUNDED,
      },
      _sum: {
        amount: true,
      },
    });

  // =====================================================
  // CATEGORY COUNTS
  // =====================================================

  const categoryMap: Record<
    ServiceCategory,
    number
  > = {
    [ServiceCategory.CLEANING]: 0,
    [ServiceCategory.MOVING]: 0,
    [ServiceCategory.ELECTRICAL]: 0,
  };

  for (const item of bookingsByCategory) {
    const service = await prisma.service.findUnique({
      where: {
        id: item.serviceId,
      },
      select: {
        category: true,
      },
    });

    if (service) {
      categoryMap[service.category] +=
        item._count._all;
    }
  }

  // =====================================================
  // QUOTE COUNTS
  // =====================================================

  const quoteMap: Record<
    QuoteStatus,
    number
  > = {
    [QuoteStatus.PENDING]: 0,
    [QuoteStatus.SENT]: 0,
    [QuoteStatus.ACCEPTED]: 0,
    [QuoteStatus.REJECTED]: 0,
    [QuoteStatus.EXPIRED]: 0,
  };

  for (const quote of quoteCounts) {
    quoteMap[quote.status] =
      quote._count._all;
  }

  // =====================================================
  // PAYMENT METHOD BREAKDOWN
  // =====================================================

  const paymentsByMethod =
    await prisma.payment.groupBy({
      by: ["method"],
      where: {
        status: PaymentStatus.COMPLETED,
      },
      _count: {
        _all: true,
      },
      _sum: {
        amount: true,
      },
    });

  const paymentMethodMap: Record<
    PaymentMethod,
    {
      count: number;
      amount: number;
    }
  > = {
    [PaymentMethod.MPESA]: {
      count: 0,
      amount: 0,
    },

    [PaymentMethod.CARD]: {
      count: 0,
      amount: 0,
    },

    [PaymentMethod.CASH]: {
      count: 0,
      amount: 0,
    },
  };

  for (const payment of paymentsByMethod) {
    paymentMethodMap[payment.method] = {
      count: payment._count._all,
      amount: Number(payment._sum.amount ?? 0),
    };
  }

  // =====================================================
  // RESULT
  // =====================================================

  return {
    bookings: {
      total: totalBookings,

      byStatus: {
        PENDING: pendingBookings,
        CONFIRMED: confirmedBookings,
        ASSIGNED: assignedBookings,
        IN_PROGRESS: inProgressBookings,
        COMPLETED: completedBookings,
        CANCELLED: cancelledBookings,
      },
    },

    users: {
      customers: totalCustomers,
      staff: totalStaff,
    },

    services: {
      active: totalServices,
    },

    revenue: {
      completed: Number(
        completedPaymentAggregate._sum.amount ?? 0
      ),

      refunded: Number(
        refundedPaymentAggregate._sum.amount ?? 0
      ),

      net: Number(
        completedPaymentAggregate._sum.amount ?? 0
      ) -
        Number(
          refundedPaymentAggregate._sum.amount ?? 0
        ),
    },

    payments: {
      completed: completedPayments,
      pending: pendingPayments,
      failed: failedPayments,
      refunded: refundedPayments,
      byMethod: paymentMethodMap,
    },

    quotes: quoteMap,

    bookingsByCategory: categoryMap,

    bookingsByService:
      bookingsByService.map((service) => ({
        id: service.id,
        name: service.name,
        category: service.category,
        bookings: service._count.bookings,
      })),

    recentBookings: recentBookings.map(
      (booking) => ({
        ...booking,
        totalAmount:
          booking.totalAmount !== null
            ? Number(booking.totalAmount)
            : null,

        payment: booking.payment
          ? {
              ...booking.payment,
              amount: Number(
                booking.payment.amount
              ),
            }
          : null,
      })
    ),
  };
}
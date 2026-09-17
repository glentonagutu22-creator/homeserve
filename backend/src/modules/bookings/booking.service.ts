import { prisma } from "../../config/prisma";
import {
  BookingType,
  PricingType,
  ServiceCategory,
  UserRole,
} from "../../generated/prisma/client";
import { AppError } from "../../utils/AppError";

import {
  calculateCleaningPrice,
  calculateMovingPrice,
  calculateElectricalPrice,
} from "../pricing/pricing.service";

import {
  createRoleNotification,
  createNotification,
  sendBookingCreatedEmail,
  sendBookingCreatedSms,
  sendBookingCancelledEmail,
  sendBookingCancelledSms,
} from "../notifications/notification.service";

interface CreateBookingInput {
  serviceId: string;
  addressId: string;
  bookingType: "INSTANT" | "QUOTE_REQUEST";
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;

  cleaningRequest?: {
    propertyType: string;
    bedrooms?: number;
    bathrooms?: number;
    squareMeters?: number;
    cleaningType: string;
    additionalRequirements?: string;
  };

  movingRequest?: {
    pickupAddress: string;
    destinationAddress: string;
    propertyType: string;
    truckSize?: string;
    numberOfMovers?: number;
    packingRequired?: boolean;
    specialItems?: string;
    estimatedDistanceKm?: number;
  };

  electricalRequest?: {
    propertyType: string;
    numberOfFloors?: number;
    bedrooms?: number;
    newInstallation?: boolean;
    rewiring?: boolean;
    numberOfSockets?: number;
    numberOfLights?: number;
    distributionBoard?: boolean;
    additionalRequirements?: string;
  };
}

/*
|--------------------------------------------------------------------------
| Generate booking number
|--------------------------------------------------------------------------
*/

function generateBookingNumber(): string {
  const timestamp = Date.now()
    .toString()
    .slice(-8);

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `HS-${timestamp}-${random}`;
}

/*
|--------------------------------------------------------------------------
| Create booking
|--------------------------------------------------------------------------
*/

export async function createBooking(
  userId: string,
  data: CreateBookingInput
) {
  /*
  |--------------------------------------------------------------------------
  | Find service
  |--------------------------------------------------------------------------
  */

  const service =
    await prisma.service.findUnique({
      where: {
        id: data.serviceId,
      },
    });

  if (!service) {
    throw new AppError(
      "Service not found",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Check service availability
  |--------------------------------------------------------------------------
  */

  if (!service.isActive) {
    throw new AppError(
      "This service is currently unavailable",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Verify address belongs to customer
  |--------------------------------------------------------------------------
  */

  const address =
    await prisma.address.findFirst({
      where: {
        id: data.addressId,
        userId,
      },
    });

  if (!address) {
    throw new AppError(
      "Address not found or does not belong to you",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Determine expected category
  |--------------------------------------------------------------------------
  */

  let expectedCategory: ServiceCategory;

  if (data.cleaningRequest) {
    expectedCategory =
      ServiceCategory.CLEANING;
  } else if (data.movingRequest) {
    expectedCategory =
      ServiceCategory.MOVING;
  } else {
    expectedCategory =
      ServiceCategory.ELECTRICAL;
  }

  /*
  |--------------------------------------------------------------------------
  | Verify service category
  |--------------------------------------------------------------------------
  */

  if (
    service.category !==
    expectedCategory
  ) {
    throw new AppError(
      "Service does not match the selected booking details",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate booking type against pricing type
  |--------------------------------------------------------------------------
  */

  if (
    service.pricingType ===
      PricingType.QUOTE &&
    data.bookingType !==
      "QUOTE_REQUEST"
  ) {
    throw new AppError(
      "This service requires a quote request",
      400
    );
  }

  if (
    service.pricingType !==
      PricingType.QUOTE &&
    data.bookingType ===
      "QUOTE_REQUEST"
  ) {
    throw new AppError(
      "This service does not require a quote request",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Determine initial amount
  |--------------------------------------------------------------------------
  */

  let totalAmount = null;

  /*
  |--------------------------------------------------------------------------
  | Fixed service pricing
  |--------------------------------------------------------------------------
  */

  if (
    data.bookingType ===
      "INSTANT" &&
    service.pricingType ===
      PricingType.FIXED &&
    service.basePrice !== null
  ) {
    totalAmount =
      service.basePrice;
  }

  /*
  |--------------------------------------------------------------------------
  | Calculate price for calculated services
  |--------------------------------------------------------------------------
  */

  if (
    data.bookingType ===
      "INSTANT" &&
    service.pricingType ===
      PricingType.CALCULATED
  ) {
    /*
    |--------------------------------------------------------------------------
    | Cleaning pricing
    |--------------------------------------------------------------------------
    */

    if (
      service.category ===
      ServiceCategory.CLEANING
    ) {
      if (!data.cleaningRequest) {
        throw new AppError(
          "Cleaning details are required for price calculation",
          400
        );
      }

      const cleaningRequest =
        data.cleaningRequest;

      const pricing =
        await calculateCleaningPrice({
          serviceId:
            data.serviceId,

          propertyType:
            cleaningRequest.propertyType,

          bedrooms:
            cleaningRequest.bedrooms,

          bathrooms:
            cleaningRequest.bathrooms,

          squareMeters:
            cleaningRequest.squareMeters,

          cleaningType:
            cleaningRequest.cleaningType,

          additionalRequirements:
            cleaningRequest.additionalRequirements,
        });

      totalAmount =
        pricing.totalAmount;
    }

    /*
    |--------------------------------------------------------------------------
    | Moving pricing
    |--------------------------------------------------------------------------
    */

    if (
      service.category ===
      ServiceCategory.MOVING
    ) {
      if (!data.movingRequest) {
        throw new AppError(
          "Moving details are required for price calculation",
          400
        );
      }

      const movingRequest =
        data.movingRequest;

      const pricing =
        await calculateMovingPrice({
          serviceId:
            data.serviceId,

          pickupAddress:
            movingRequest.pickupAddress,

          destinationAddress:
            movingRequest.destinationAddress,

          propertyType:
            movingRequest.propertyType,

          truckSize:
            movingRequest.truckSize,

          numberOfMovers:
            movingRequest.numberOfMovers,

          packingRequired:
            movingRequest.packingRequired ??
            false,

          estimatedDistanceKm:
            movingRequest.estimatedDistanceKm,

          specialItems:
            movingRequest.specialItems,
        });

      totalAmount =
        pricing.totalAmount;
    }

    /*
    |--------------------------------------------------------------------------
    | Electrical pricing
    |--------------------------------------------------------------------------
    */

    if (
      service.category ===
      ServiceCategory.ELECTRICAL
    ) {
      if (!data.electricalRequest) {
        throw new AppError(
          "Electrical details are required for price calculation",
          400
        );
      }

      const electricalRequest =
        data.electricalRequest;

      const pricing =
        await calculateElectricalPrice({
          serviceId:
            data.serviceId,

          propertyType:
            electricalRequest.propertyType,

          numberOfFloors:
            electricalRequest.numberOfFloors,

          bedrooms:
            electricalRequest.bedrooms,

          newInstallation:
            electricalRequest.newInstallation ??
            false,

          rewiring:
            electricalRequest.rewiring ??
            false,

          numberOfSockets:
            electricalRequest.numberOfSockets,

          numberOfLights:
            electricalRequest.numberOfLights,

          distributionBoard:
            electricalRequest.distributionBoard ??
            false,

          additionalRequirements:
            electricalRequest.additionalRequirements,
        });

      totalAmount =
        pricing.totalAmount;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Create booking transaction
  |--------------------------------------------------------------------------
  */

  const booking =
    await prisma.$transaction(
      async (tx) => {
        const createdBooking =
          await tx.booking.create({
            data: {
              bookingNumber:
                generateBookingNumber(),

              userId,

              serviceId:
                data.serviceId,

              addressId:
                data.addressId,

              bookingType:
                data.bookingType ===
                "INSTANT"
                  ? BookingType.INSTANT
                  : BookingType.QUOTE_REQUEST,

              scheduledDate:
                new Date(
                  data.scheduledDate
                ),

              scheduledTime:
                data.scheduledTime,

              totalAmount,

              notes:
                data.notes,

              /*
              |--------------------------------------------------------------------------
              | Automatically create quote
              |--------------------------------------------------------------------------
              */

              quote:
                data.bookingType ===
                "QUOTE_REQUEST"
                  ? {
                      create: {
                        status:
                          "PENDING",
                      },
                    }
                  : undefined,

              /*
              |--------------------------------------------------------------------------
              | Cleaning
              |--------------------------------------------------------------------------
              */

              cleaningRequest:
                data.cleaningRequest
                  ? {
                      create: {
                        propertyType:
                          data
                            .cleaningRequest
                            .propertyType,

                        bedrooms:
                          data
                            .cleaningRequest
                            .bedrooms,

                        bathrooms:
                          data
                            .cleaningRequest
                            .bathrooms,

                        squareMeters:
                          data
                            .cleaningRequest
                            .squareMeters,

                        cleaningType:
                          data
                            .cleaningRequest
                            .cleaningType,

                        additionalRequirements:
                          data
                            .cleaningRequest
                            .additionalRequirements,
                      },
                    }
                  : undefined,

              /*
              |--------------------------------------------------------------------------
              | Moving
              |--------------------------------------------------------------------------
              */

              movingRequest:
                data.movingRequest
                  ? {
                      create: {
                        pickupAddress:
                          data
                            .movingRequest
                            .pickupAddress,

                        destinationAddress:
                          data
                            .movingRequest
                            .destinationAddress,

                        propertyType:
                          data
                            .movingRequest
                            .propertyType,

                        truckSize:
                          data
                            .movingRequest
                            .truckSize,

                        numberOfMovers:
                          data
                            .movingRequest
                            .numberOfMovers,

                        packingRequired:
                          data
                            .movingRequest
                            .packingRequired ??
                          false,

                        specialItems:
                          data
                            .movingRequest
                            .specialItems,

                        estimatedDistanceKm:
                          data
                            .movingRequest
                            .estimatedDistanceKm,
                      },
                    }
                  : undefined,

              /*
              |--------------------------------------------------------------------------
              | Electrical
              |--------------------------------------------------------------------------
              */

              electricalRequest:
                data.electricalRequest
                  ? {
                      create: {
                        propertyType:
                          data
                            .electricalRequest
                            .propertyType,

                        numberOfFloors:
                          data
                            .electricalRequest
                            .numberOfFloors,

                        bedrooms:
                          data
                            .electricalRequest
                            .bedrooms,

                        newInstallation:
                          data
                            .electricalRequest
                            .newInstallation ??
                          false,

                        rewiring:
                          data
                            .electricalRequest
                            .rewiring ??
                          false,

                        numberOfSockets:
                          data
                            .electricalRequest
                            .numberOfSockets,

                        numberOfLights:
                          data
                            .electricalRequest
                            .numberOfLights,

                        distributionBoard:
                          data
                            .electricalRequest
                            .distributionBoard ??
                          false,

                        additionalRequirements:
                          data
                            .electricalRequest
                            .additionalRequirements,
                      },
                    }
                  : undefined,
            },

            include: {
              service: true,
              address: true,
              cleaningRequest: true,
              movingRequest: true,
              electricalRequest: true,
              quote: true,
            },
          });

        return createdBooking;
      }
    );

  /*
  |--------------------------------------------------------------------------
  | Get customer contact details
  |--------------------------------------------------------------------------
  */

  const customer =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        name: true,
        email: true,
        phone: true,
      },
    });

  if (!customer) {
    throw new AppError(
      "Customer not found",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | QUOTE REQUEST NOTIFICATIONS
  |--------------------------------------------------------------------------
  */

  if (
    data.bookingType ===
    "QUOTE_REQUEST"
  ) {
    /*
    |--------------------------------------------------------------------------
    | Admin in-app notification
    |--------------------------------------------------------------------------
    */

    await createRoleNotification({
      role: UserRole.ADMIN,

      type: "QUOTE_REQUESTED",

      title: "New Quote Request",

      message:
        `${customer.name} requested a quote for ${service.name}.`,

      relatedEntity: "QUOTE",

      relatedEntityId:
        booking.quote?.id ??
        booking.id,
    });

    /*
    |--------------------------------------------------------------------------
    | Customer in-app notification
    |--------------------------------------------------------------------------
    */

    await createNotification({
      userId,

      type: "QUOTE_REQUESTED",

      title: "Quote Request Received",

      message:
        `Your quote request for ${service.name} has been received.`,

      relatedEntity: "QUOTE",

      relatedEntityId:
        booking.quote?.id ??
        booking.id,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | INSTANT BOOKING NOTIFICATIONS
  |--------------------------------------------------------------------------
  */

  if (
    data.bookingType ===
    "INSTANT"
  ) {
    /*
    |--------------------------------------------------------------------------
    | Admin in-app notification
    |--------------------------------------------------------------------------
    */

    await createRoleNotification({
      role: UserRole.ADMIN,

      type: "BOOKING_CREATED",

      title: "New Booking",

      message:
        `${customer.name} created booking ${booking.bookingNumber}.`,

      relatedEntity: "BOOKING",

      relatedEntityId:
        booking.id,
    });

    /*
    |--------------------------------------------------------------------------
    | Customer in-app notification
    |--------------------------------------------------------------------------
    */

    await createNotification({
      userId,

      type: "BOOKING_CREATED",

      title: "Booking Created",

      message:
        `Your booking ${booking.bookingNumber} has been created successfully.`,

      relatedEntity: "BOOKING",

      relatedEntityId:
        booking.id,
    });

    /*
    |--------------------------------------------------------------------------
    | Customer email
    |--------------------------------------------------------------------------
    */
       console.log("BOOKING EMAIL TEST:", {
  email: customer.email,
  bookingNumber: booking.bookingNumber,
  serviceName: service.name,
});
    try {
      await sendBookingCreatedEmail({
        email:
          customer.email,

        name:
          customer.name,

        bookingNumber:
          booking.bookingNumber,

        serviceName:
          service.name,

        scheduledDate:
          booking.scheduledDate
            .toISOString(),

        scheduledTime:
          booking.scheduledTime,

        totalAmount:
          booking.totalAmount
            ?.toString(),
      });
    } catch (error) {
      console.error(
        "Failed to send booking creation email:",
        error
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Customer SMS
    |--------------------------------------------------------------------------
    */

    if (customer.phone) {
      try {
        await sendBookingCreatedSms({
          phone:
            customer.phone,

          bookingNumber:
            booking.bookingNumber,

          serviceName:
            service.name,

          scheduledDate:
            booking.scheduledDate
              .toISOString(),

          scheduledTime:
            booking.scheduledTime,
        });
      } catch (error) {
        console.error(
          "Failed to send booking creation SMS:",
          error
        );
      }
    }
  }

  return booking;
}

/*
|--------------------------------------------------------------------------
| Get customer bookings
|--------------------------------------------------------------------------
*/

export async function getCustomerBookings(
  userId: string
) {
  const bookings =
    await prisma.booking.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        service: true,
        address: true,
        cleaningRequest: true,
        movingRequest: true,
        electricalRequest: true,
        quote: true,
        payment: true,

        staffAssignments: {
          include: {
            staff: {
              include: {
                user: true,
              },
            },
          },
        },

        review: true,
      },
    });

  return bookings;
}

/*
|--------------------------------------------------------------------------
| Get single customer booking
|--------------------------------------------------------------------------
*/

export async function getCustomerBooking(
  userId: string,
  bookingId: string
) {
  const booking =
    await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },

      include: {
        service: true,
        address: true,
        cleaningRequest: true,
        movingRequest: true,
        electricalRequest: true,
        quote: true,
        payment: true,

        staffAssignments: {
          include: {
            staff: {
              include: {
                user: true,
              },
            },
          },
        },

        review: true,
      },
    });

  if (!booking) {
    throw new AppError(
      "Booking not found",
      404
    );
  }

  return booking;
}

/*
|--------------------------------------------------------------------------
| Cancel customer booking
|--------------------------------------------------------------------------
*/

export async function cancelCustomerBooking(
  userId: string,
  bookingId: string,
  reason?: string
) {
  const booking =
    await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },

      include: {
        service: true,
      },
    });

  if (!booking) {
    throw new AppError(
      "Booking not found",
      404
    );
  }

  if (
    booking.status ===
      "IN_PROGRESS" ||
    booking.status ===
      "COMPLETED" ||
    booking.status ===
      "CANCELLED"
  ) {
    throw new AppError(
      "This booking cannot be cancelled",
      400
    );
  }

  const cancellationNote =
    reason
      ? `Cancellation reason: ${reason}`
      : "Booking cancelled by customer";

  const notes = booking.notes
    ? `${booking.notes}\n\n${cancellationNote}`
    : cancellationNote;

  const cancelledBooking =
    await prisma.booking.update({
      where: {
        id: booking.id,
      },

      data: {
        status: "CANCELLED",

        notes,
      },

      include: {
        service: true,
        address: true,
        cleaningRequest: true,
        movingRequest: true,
        electricalRequest: true,
        quote: true,
        payment: true,
      },
    });

  /*
  |--------------------------------------------------------------------------
  | Get customer contact details
  |--------------------------------------------------------------------------
  */

  const customer =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        name: true,
        email: true,
        phone: true,
      },
    });

  /*
  |--------------------------------------------------------------------------
  | Customer in-app notification
  |--------------------------------------------------------------------------
  */

  await createNotification({
    userId,

    type: "BOOKING_CANCELLED",

    title: "Booking Cancelled",

    message:
      `Your booking ${cancelledBooking.bookingNumber} has been cancelled successfully.`,

    relatedEntity: "BOOKING",

    relatedEntityId:
      cancelledBooking.id,
  });

  /*
  |--------------------------------------------------------------------------
  | Admin in-app notification
  |--------------------------------------------------------------------------
  */

  await createRoleNotification({
    role: UserRole.ADMIN,

    type: "BOOKING_CANCELLED",

    title: "Booking Cancelled",

    message:
      `Customer cancelled booking ${cancelledBooking.bookingNumber}.`,

    relatedEntity: "BOOKING",

    relatedEntityId:
      cancelledBooking.id,
  });

  /*
  |--------------------------------------------------------------------------
  | Customer cancellation email
  |--------------------------------------------------------------------------
  */

  if (customer) {
    try {
      await sendBookingCancelledEmail({
        email:
          customer.email,

        name:
          customer.name,

        bookingNumber:
          cancelledBooking.bookingNumber,

        serviceName:
          booking.service.name,

        reason,
      });
    } catch (error) {
      console.error(
        "Failed to send booking cancellation email:",
        error
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Customer cancellation SMS
  |--------------------------------------------------------------------------
  */

  if (customer?.phone) {
    try {
      await sendBookingCancelledSms({
        phone:
          customer.phone,

        bookingNumber:
          cancelledBooking.bookingNumber,

        serviceName:
          booking.service.name,
      });
    } catch (error) {
      console.error(
        "Failed to send booking cancellation SMS:",
        error
      );
    }
  }

  return cancelledBooking;
}

/*
|--------------------------------------------------------------------------
| Get all bookings — Admin
|--------------------------------------------------------------------------
*/

export async function getAllBookings() {
  const bookings =
    await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: true,
        service: true,
        address: true,

        cleaningRequest: true,
        movingRequest: true,
        electricalRequest: true,

        quote: true,
        payment: true,

        staffAssignments: {
          include: {
            staff: {
              include: {
                user: true,
              },
            },
          },
        },

        review: true,
      },
    });

  return bookings;
}

/*
|--------------------------------------------------------------------------
| Get single booking — Admin
|--------------------------------------------------------------------------
*/

export async function getAdminBooking(
  bookingId: string
) {
  const booking =
    await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },

      include: {
        user: true,
        service: true,
        address: true,

        cleaningRequest: true,
        movingRequest: true,
        electricalRequest: true,

        quote: true,
        payment: true,

        staffAssignments: {
          include: {
            staff: {
              include: {
                user: true,
              },
            },
          },
        },

        review: true,
      },
    });

  if (!booking) {
    throw new AppError(
      "Booking not found",
      404
    );
  }

  return booking;
}
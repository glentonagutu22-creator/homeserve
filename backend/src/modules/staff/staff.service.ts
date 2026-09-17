
import bcrypt from "bcryptjs";

import { prisma } from "../../config/prisma";

import { AppError } from "../../utils/AppError";

import {
  StaffType,
  UserRole,
} from "../../generated/prisma/client";

import {
  createNotification,
  sendStaffAssignedEmail,
  sendStaffAssignedSms,
  sendJobStartedSms,
  sendJobCompletedEmail,
  sendJobCompletedSms,
} from "../notifications/notification.service";

interface CreateStaffInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  staffType: StaffType;
}

interface UpdateStaffInput {
  name?: string;
  phone?: string;
  staffType?: StaffType;
}


/*
|--------------------------------------------------------------------------
| Create staff
|--------------------------------------------------------------------------
*/

export async function createStaff(
  input: CreateStaffInput
) {
  const {
    name,
    email,
    phone,
    password,
    staffType,
  } = input;

  const existingUser =
    await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });

  if (existingUser) {
    throw new AppError(
      "Email or phone number is already registered",
      409
    );
  }

  const passwordHash =
    await bcrypt.hash(password, 12);

  const result =
    await prisma.$transaction(
      async (tx) => {
        const user =
          await tx.user.create({
            data: {
              name,
              email,
              phone,
              passwordHash,
              role: UserRole.STAFF,
            },
          });

        const staffProfile =
          await tx.staffProfile.create({
            data: {
              userId: user.id,
              staffType,
              isAvailable: true,
            },
          });

        return {
          user,
          staffProfile,
        };
      }
    );

  return {
    id: result.staffProfile.id,
    userId: result.user.id,
    name: result.user.name,
    email: result.user.email,
    phone: result.user.phone,
    role: result.user.role,
    staffType:
      result.staffProfile.staffType,
    isAvailable:
      result.staffProfile.isAvailable,
    createdAt:
      result.staffProfile.createdAt,
    updatedAt:
      result.staffProfile.updatedAt,
  };
}


/*
|--------------------------------------------------------------------------
| Get all staff
|--------------------------------------------------------------------------
*/

export async function getAllStaff() {
  const staff =
    await prisma.staffProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return staff;
}


/*
|--------------------------------------------------------------------------
| Get staff by ID
|--------------------------------------------------------------------------
*/

export async function getStaffById(
  staffId: string
) {
  const staff =
    await prisma.staffProfile.findUnique({
      where: {
        id: staffId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },

        assignments: {
          include: {
            booking: {
              include: {
                service: true,
                address: true,
              },
            },
          },

          orderBy: {
            assignedAt: "desc",
          },
        },
      },
    });

  if (!staff) {
    throw new AppError(
      "Staff member not found",
      404
    );
  }

  return staff;
}


/*
|--------------------------------------------------------------------------
| Update staff
|--------------------------------------------------------------------------
*/

export async function updateStaff(
  staffId: string,
  input: UpdateStaffInput
) {
  const staff =
    await prisma.staffProfile.findUnique({
      where: {
        id: staffId,
      },

      include: {
        user: true,
      },
    });

  if (!staff) {
    throw new AppError(
      "Staff member not found",
      404
    );
  }

  if (
    input.phone &&
    input.phone !== staff.user.phone
  ) {
    const existingPhone =
      await prisma.user.findFirst({
        where: {
          phone: input.phone,

          NOT: {
            id: staff.user.id,
          },
        },
      });

    if (existingPhone) {
      throw new AppError(
        "Phone number is already registered",
        409
      );
    }
  }

  const result =
    await prisma.$transaction(
      async (tx) => {
        const user =
          await tx.user.update({
            where: {
              id: staff.userId,
            },

            data: {
              ...(input.name !==
                undefined && {
                name: input.name,
              }),

              ...(input.phone !==
                undefined && {
                phone: input.phone,
              }),
            },
          });

        const staffProfile =
          await tx.staffProfile.update({
            where: {
              id: staffId,
            },

            data: {
              ...(input.staffType !==
                undefined && {
                staffType:
                  input.staffType,
              }),
            },
          });

        return {
          user,
          staffProfile,
        };
      }
    );

  return {
    id: result.staffProfile.id,
    userId: result.user.id,
    name: result.user.name,
    email: result.user.email,
    phone: result.user.phone,
    role: result.user.role,
    staffType:
      result.staffProfile.staffType,
    isAvailable:
      result.staffProfile.isAvailable,
    createdAt:
      result.staffProfile.createdAt,
    updatedAt:
      result.staffProfile.updatedAt,
  };
}


/*
|--------------------------------------------------------------------------
| Update staff availability
|--------------------------------------------------------------------------
*/

export async function updateStaffAvailability(
  staffId: string,
  isAvailable: boolean
) {
  const staff =
    await prisma.staffProfile.findUnique({
      where: {
        id: staffId,
      },
    });

  if (!staff) {
    throw new AppError(
      "Staff member not found",
      404
    );
  }

  const updatedStaff =
    await prisma.staffProfile.update({
      where: {
        id: staffId,
      },

      data: {
        isAvailable,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
    });

  return updatedStaff;
}


/*
|--------------------------------------------------------------------------
| Assign staff to booking
|--------------------------------------------------------------------------
*/

export async function assignStaffToBooking(
  staffId: string,
  bookingId: string
) {
  /*
  |--------------------------------------------------------------------------
  | Find staff
  |--------------------------------------------------------------------------
  */

  const staff =
    await prisma.staffProfile.findUnique({
      where: {
        id: staffId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
    });

  if (!staff) {
    throw new AppError(
      "Staff member not found",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Check availability
  |--------------------------------------------------------------------------
  */

  if (!staff.isAvailable) {
    throw new AppError(
      "Staff member is currently unavailable",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Find booking
  |--------------------------------------------------------------------------
  */

  const booking =
    await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },

      include: {
        service: true,
        address: true,

        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },

        staffAssignments: true,
      },
    });

  if (!booking) {
    throw new AppError(
      "Booking not found",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate booking status
  |--------------------------------------------------------------------------
  */

  if (
    booking.status === "CANCELLED"
  ) {
    throw new AppError(
      "Cancelled bookings cannot be assigned",
      400
    );
  }

  if (
    booking.status === "COMPLETED"
  ) {
    throw new AppError(
      "Completed bookings cannot be assigned",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Determine staff qualification
  |--------------------------------------------------------------------------
  */

  const serviceCategory =
    booking.service.category;

  const staffType =
    staff.staffType;

  const isQualified =
    staffType === "SUPERVISOR" ||
    (serviceCategory === "CLEANING" &&
      staffType === "CLEANER") ||
    (serviceCategory === "MOVING" &&
      staffType === "MOVER") ||
    (serviceCategory === "ELECTRICAL" &&
      staffType === "ELECTRICIAN");

  if (!isQualified) {
    throw new AppError(
      `Staff member is not qualified for ${serviceCategory.toLowerCase()} services`,
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Prevent duplicate assignment
  |--------------------------------------------------------------------------
  */

  const existingAssignment =
    await prisma.staffAssignment.findUnique({
      where: {
        bookingId_staffId: {
          bookingId,
          staffId,
        },
      },
    });

  if (existingAssignment) {
    throw new AppError(
      "Staff member is already assigned to this booking",
      409
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Prevent overlapping active bookings
  |--------------------------------------------------------------------------
  */

  const existingAssignments =
    await prisma.staffAssignment.findMany({
      where: {
        staffId,

        completedAt: null,

        booking: {
          scheduledDate:
            booking.scheduledDate,

          status: {
            notIn: [
              "CANCELLED",
              "COMPLETED",
            ],
          },
        },
      },

      include: {
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            scheduledDate: true,
            scheduledTime: true,
            status: true,
          },
        },
      },
    });

  if (
    existingAssignments.length > 0
  ) {
    throw new AppError(
      "Staff member already has an active booking scheduled for this date",
      409
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Create assignment + update booking
  |--------------------------------------------------------------------------
  */

  const result =
    await prisma.$transaction(
      async (tx) => {
        const assignment =
          await tx.staffAssignment.create({
            data: {
              bookingId,
              staffId,
            },

            include: {
              staff: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      phone: true,
                      role: true,
                    },
                  },
                },
              },

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
                },
              },
            },
          });

        await tx.booking.update({
          where: {
            id: bookingId,
          },

          data: {
            status: "ASSIGNED",
          },
        });

        return assignment;
      }
    );

  /*
  |--------------------------------------------------------------------------
  | Notify assigned staff — IN APP
  |--------------------------------------------------------------------------
  */

  await createNotification({
    userId: staff.userId,

    type: "STAFF_ASSIGNED",

    title: "New Job Assigned",

    message:
      `You have been assigned to booking ${result.booking.bookingNumber}.`,

    relatedEntity: "BOOKING",

    relatedEntityId:
      result.booking.id,
  });

  /*
  |--------------------------------------------------------------------------
  | Notify customer — IN APP
  |--------------------------------------------------------------------------
  */

  await createNotification({
    userId:
      result.booking.user.id,

    type: "STAFF_ASSIGNED",

    title: "Staff Assigned",

    message:
      `${result.staff.user.name} has been assigned to your booking ${result.booking.bookingNumber}.`,

    relatedEntity: "BOOKING",

    relatedEntityId:
      result.booking.id,
  });

  /*
  |--------------------------------------------------------------------------
  | Notify customer — EMAIL
  |--------------------------------------------------------------------------
  */

  try {
    await sendStaffAssignedEmail({
      email:
        result.booking.user.email,

      name:
        result.booking.user.name,

      bookingNumber:
        result.booking.bookingNumber,

      serviceName:
        result.booking.service.name,

      staffName:
        result.staff.user.name,

      scheduledDate:
        result.booking.scheduledDate
          .toISOString(),

      scheduledTime:
        result.booking.scheduledTime,
    });
  } catch (error) {
    console.error(
      "Failed to send staff assignment email:",
      error
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Notify customer — SMS
  |--------------------------------------------------------------------------
  */

  if (
    result.booking.user.phone
  ) {
    try {
      await sendStaffAssignedSms({
        phone:
          result.booking.user.phone,

        bookingNumber:
          result.booking.bookingNumber,

        staffName:
          result.staff.user.name,
      });
    } catch (error) {
      console.error(
        "Failed to send staff assignment SMS:",
        error
      );
    }
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| Unassign staff from booking
|--------------------------------------------------------------------------
*/

export async function unassignStaffFromBooking(
  assignmentId: string
) {
  const assignment =
    await prisma.staffAssignment.findUnique({
      where: {
        id: assignmentId,
      },

      include: {
        booking: true,

        staff: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

  if (!assignment) {
    throw new AppError(
      "Staff assignment not found",
      404
    );
  }

  if (
    assignment.booking.status ===
    "COMPLETED"
  ) {
    throw new AppError(
      "Completed bookings cannot be unassigned",
      400
    );
  }

  const result =
    await prisma.$transaction(
      async (tx) => {
        await tx.staffAssignment.delete({
          where: {
            id: assignmentId,
          },
        });

        const remainingAssignments =
          await tx.staffAssignment.count({
            where: {
              bookingId:
                assignment.bookingId,

              completedAt: null,
            },
          });

        let bookingStatus:
          | "PENDING"
          | "CONFIRMED"
          | "ASSIGNED" =
          "CONFIRMED";

        if (
          remainingAssignments > 0
        ) {
          bookingStatus = "ASSIGNED";
        }

        const booking =
          await tx.booking.update({
            where: {
              id: assignment.bookingId,
            },

            data: {
              status: bookingStatus,
            },

            include: {
              service: true,
              address: true,

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

        return booking;
      }
    );

  /*
  |--------------------------------------------------------------------------
  | Notify staff
  |--------------------------------------------------------------------------
  */

  await createNotification({
    userId:
      assignment.staff.userId,

    type: "STAFF_UNASSIGNED",

    title: "Job Assignment Removed",

    message:
      `You have been unassigned from booking ${result.bookingNumber}.`,

    relatedEntity: "BOOKING",

    relatedEntityId:
      result.id,
  });

  /*
  |--------------------------------------------------------------------------
  | Notify customer
  |--------------------------------------------------------------------------
  */

  await createNotification({
    userId:
      result.user.id,

    type: "STAFF_UNASSIGNED",

    title: "Staff Assignment Updated",

    message:
      `${assignment.staff.user.name} is no longer assigned to your booking ${result.bookingNumber}.`,

    relatedEntity: "BOOKING",

    relatedEntityId:
      result.id,
  });

  return result;
}


/*
|--------------------------------------------------------------------------
| Get staff assignments
|--------------------------------------------------------------------------
*/

export async function getStaffAssignments(
  staffId: string
) {
  const staff =
    await prisma.staffProfile.findUnique({
      where: {
        id: staffId,
      },
    });

  if (!staff) {
    throw new AppError(
      "Staff member not found",
      404
    );
  }

  return prisma.staffAssignment.findMany({
    where: {
      staffId,
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

    orderBy: {
      assignedAt: "desc",
    },
  });
}


/*
|--------------------------------------------------------------------------
| Get booking assignments
|--------------------------------------------------------------------------
*/

export async function getBookingAssignments(
  bookingId: string
) {
  const booking =
    await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

  if (!booking) {
    throw new AppError(
      "Booking not found",
      404
    );
  }

  return prisma.staffAssignment.findMany({
    where: {
      bookingId,
    },

    include: {
      staff: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
            },
          },
        },
      },
    },

    orderBy: {
      assignedAt: "desc",
    },
  });
}


/*
|--------------------------------------------------------------------------
| Get my staff profile
|--------------------------------------------------------------------------
*/

export async function getMyStaffProfile(
  userId: string
) {
  const staff =
    await prisma.staffProfile.findUnique({
      where: {
        userId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

  if (!staff) {
    throw new AppError(
      "Staff profile not found",
      404
    );
  }

  return staff;
}


/*
|--------------------------------------------------------------------------
| Get my staff assignments
|--------------------------------------------------------------------------
*/

export async function getMyStaffAssignments(
  userId: string
) {
  const staff =
    await prisma.staffProfile.findUnique({
      where: {
        userId,
      },
    });

  if (!staff) {
    throw new AppError(
      "Staff profile not found",
      404
    );
  }

  return prisma.staffAssignment.findMany({
    where: {
      staffId: staff.id,
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

    orderBy: {
      assignedAt: "desc",
    },
  });
}


/*
|--------------------------------------------------------------------------
| Update my staff availability
|--------------------------------------------------------------------------
*/

export async function updateMyStaffAvailability(
  userId: string,
  isAvailable: boolean
) {
  const staff =
    await prisma.staffProfile.findUnique({
      where: {
        userId,
      },
    });

  if (!staff) {
    throw new AppError(
      "Staff profile not found",
      404
    );
  }

  return prisma.staffProfile.update({
    where: {
      id: staff.id,
    },

    data: {
      isAvailable,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      },
    },
  });
}


/*
|--------------------------------------------------------------------------
| Update assigned booking status
|--------------------------------------------------------------------------
*/

export async function updateAssignedBookingStatus(
  userId: string,
  bookingId: string,
  status:
    | "IN_PROGRESS"
    | "COMPLETED"
) {
  /*
  |--------------------------------------------------------------------------
  | Find staff profile
  |--------------------------------------------------------------------------
  */

  const staff =
    await prisma.staffProfile.findUnique({
      where: {
        userId,
      },
    });

  if (!staff) {
    throw new AppError(
      "Staff profile not found",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Verify assignment
  |--------------------------------------------------------------------------
  */

  const assignment =
    await prisma.staffAssignment.findFirst({
      where: {
        staffId: staff.id,
        bookingId,
      },
    });

  if (!assignment) {
    throw new AppError(
      "You are not assigned to this booking",
      403
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Find booking
  |--------------------------------------------------------------------------
  */

  const booking =
    await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

  if (!booking) {
    throw new AppError(
      "Booking not found",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate status
  |--------------------------------------------------------------------------
  */

  if (
    booking.status ===
    "CANCELLED"
  ) {
    throw new AppError(
      "Cancelled bookings cannot be updated",
      400
    );
  }

  if (
    booking.status ===
    "COMPLETED"
  ) {
    throw new AppError(
      "Booking is already completed",
      400
    );
  }

  if (
    status === "IN_PROGRESS" &&
    booking.status !== "ASSIGNED"
  ) {
    throw new AppError(
      "Only assigned bookings can be started",
      400
    );
  }

  if (
    status === "COMPLETED" &&
    booking.status !== "IN_PROGRESS"
  ) {
    throw new AppError(
      "Only in-progress bookings can be completed",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Update booking
  |--------------------------------------------------------------------------
  */

  const result =
    await prisma.$transaction(
      async (tx) => {
        const updatedBooking =
          await tx.booking.update({
            where: {
              id: bookingId,
            },

            data: {
              status,
            },

            include: {
              service: true,
              address: true,

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

        /*
        |--------------------------------------------------------------------------
        | Mark assignment completed
        |--------------------------------------------------------------------------
        */

        if (
          status === "COMPLETED"
        ) {
          await tx.staffAssignment.update({
            where: {
              id: assignment.id,
            },

            data: {
              completedAt:
                new Date(),
            },
          });
        }

        return updatedBooking;
      }
    );

  /*
  |--------------------------------------------------------------------------
  | JOB STARTED
  |--------------------------------------------------------------------------
  */

  if (
    status === "IN_PROGRESS"
  ) {
    /*
    |--------------------------------------------------------------------------
    | Customer in-app notification
    |--------------------------------------------------------------------------
    */

    await createNotification({
      userId:
        result.user.id,

      type: "BOOKING_STARTED",

      title: "Service Started",

      message:
        `Your ${result.service.name} service for booking ${result.bookingNumber} has started.`,

      relatedEntity: "BOOKING",

      relatedEntityId:
        result.id,
    });

    /*
    |--------------------------------------------------------------------------
    | Customer SMS
    |--------------------------------------------------------------------------
    */

    if (result.user.phone) {
      try {
        await sendJobStartedSms({
          phone:
            result.user.phone,

          bookingNumber:
            result.bookingNumber,

          serviceName:
            result.service.name,
        });
      } catch (error) {
        console.error(
          "Failed to send job started SMS:",
          error
        );
      }
    }
  }

  /*
  |--------------------------------------------------------------------------
  | JOB COMPLETED
  |--------------------------------------------------------------------------
  */

  if (
    status === "COMPLETED"
  ) {
    /*
    |--------------------------------------------------------------------------
    | Customer in-app notification
    |--------------------------------------------------------------------------
    */

    await createNotification({
      userId:
        result.user.id,

      type: "BOOKING_COMPLETED",

      title: "Service Completed",

      message:
        `Your ${result.service.name} service for booking ${result.bookingNumber} has been completed.`,

      relatedEntity: "BOOKING",

      relatedEntityId:
        result.id,
    });

    /*
    |--------------------------------------------------------------------------
    | Customer email
    |--------------------------------------------------------------------------
    */

    try {
      await sendJobCompletedEmail({
        email:
          result.user.email,

        name:
          result.user.name,

        bookingNumber:
          result.bookingNumber,

        serviceName:
          result.service.name,
      });
    } catch (error) {
      console.error(
        "Failed to send job completed email:",
        error
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Customer SMS
    |--------------------------------------------------------------------------
    */

    if (result.user.phone) {
      try {
        await sendJobCompletedSms({
          phone:
            result.user.phone,

          bookingNumber:
            result.bookingNumber,

          serviceName:
            result.service.name,
        });
      } catch (error) {
        console.error(
          "Failed to send job completed SMS:",
          error
        );
      }
    }
  }

  return result;
}
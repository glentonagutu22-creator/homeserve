import { prisma } from "../../config/prisma";
import { UserRole } from "../../generated/prisma/client";
import { AppError } from "../../utils/AppError";

/*
|--------------------------------------------------------------------------
| Get all customers
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Admin — Get all manageable users
|--------------------------------------------------------------------------
*/

export async function getAllCustomers() {
  const customers =
    await prisma.user.findMany({
      where: {
        role: {
          in: [
            UserRole.CUSTOMER,
            UserRole.ADMIN,
          ],
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,

        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

  return customers;
}

/*
|--------------------------------------------------------------------------
| Get single customer
|--------------------------------------------------------------------------
*/

export async function getCustomerById(
  customerId: string
) {
const customer =
  await prisma.user.findFirst({
    where: {
      id: customerId,
      role: {
        in: [
          UserRole.CUSTOMER,
          UserRole.ADMIN,
        ],
      },
    },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,

        _count: {
          select: {
            bookings: true,
            reviews: true,
            addresses: true,
          },
        },

        bookings: {
          orderBy: {
            createdAt: "desc",
          },

          include: {
            service: true,
            address: true,
            quote: true,
            payment: true,
            cleaningRequest: true,
            movingRequest: true,
            electricalRequest: true,

            staffAssignments: {
              include: {
                staff: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },

        addresses: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  if (!customer) {
    throw new AppError(
      "Customer not found",
      404
    );
  }

  return customer;
}
/*
|--------------------------------------------------------------------------
| Admin — Change user role
|--------------------------------------------------------------------------
*/

export async function changeUserRole(
  requesterId: string,
  targetUserId: string,
  newRole: "CUSTOMER" | "ADMIN"
) {
  /*
  |--------------------------------------------------------------------------
  | Prevent an admin from changing their own role
  |--------------------------------------------------------------------------
  */

  if (requesterId === targetUserId) {
    throw new AppError(
      "You cannot change your own role",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Find target user
  |--------------------------------------------------------------------------
  */

  const targetUser =
    await prisma.user.findUnique({
      where: {
        id: targetUserId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

  if (!targetUser) {
    throw new AppError(
      "User not found",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Only CUSTOMER and ADMIN roles can be
  | changed through this operation.
  |--------------------------------------------------------------------------
  */

  if (
    targetUser.role !== UserRole.CUSTOMER &&
    targetUser.role !== UserRole.ADMIN
  ) {
    throw new AppError(
      "This user's role cannot be changed here",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate requested role
  |--------------------------------------------------------------------------
  */

  if (
    newRole !== UserRole.CUSTOMER &&
    newRole !== UserRole.ADMIN
  ) {
    throw new AppError(
      "Invalid user role",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | No-op role change
  |--------------------------------------------------------------------------
  */

  if (targetUser.role === newRole) {
    return targetUser;
  }

  /*
  |--------------------------------------------------------------------------
  | Prevent removal of the last administrator
  |--------------------------------------------------------------------------
  */

  if (
    targetUser.role === UserRole.ADMIN &&
    newRole === UserRole.CUSTOMER
  ) {
    const adminCount =
      await prisma.user.count({
        where: {
          role: UserRole.ADMIN,
        },
      });

    if (adminCount <= 1) {
      throw new AppError(
        "The last administrator cannot be demoted. Promote another administrator first.",
        400
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Update role
  |--------------------------------------------------------------------------
  */

  const updatedUser =
    await prisma.user.update({
      where: {
        id: targetUser.id,
      },

      data: {
        role: newRole,
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

  return updatedUser;
}
/*
|--------------------------------------------------------------------------
| Delete customer
|--------------------------------------------------------------------------
*/

export async function deleteCustomer(
  customerId: string
) {
  const customer =
    await prisma.user.findFirst({
      where: {
        id: customerId,
        role: UserRole.CUSTOMER,
      },

      select: {
        id: true,
        name: true,
        email: true,

        _count: {
          select: {
            bookings: true,
          },
        },
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
  | Preserve historical booking records
  |--------------------------------------------------------------------------
  */

  if (customer._count.bookings > 0) {
    throw new AppError(
      "This customer cannot be deleted because they have existing bookings",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Delete customer
  |--------------------------------------------------------------------------
  |
  | Addresses, notifications and reviews are
  | configured with cascading relations where
  | applicable.
  |
  */

  await prisma.user.delete({
    where: {
      id: customer.id,
    },
  });

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
  };
}

/*
|--------------------------------------------------------------------------
| Customer — Update own profile
|--------------------------------------------------------------------------
*/

export async function updateMyProfile(
  userId: string,
  data: {
    name?: string;
    phone?: string | null;
  }
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Prevent duplicate phone numbers
  |--------------------------------------------------------------------------
  */

  if (data.phone) {
    const existingUser =
      await prisma.user.findFirst({
        where: {
          phone: data.phone,
          NOT: {
            id: userId,
          },
        },
      });

    if (existingUser) {
      throw new AppError(
        "This phone number is already in use",
        409
      );
    }
  }

  const updatedUser =
    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        ...(data.name !== undefined
          ? { name: data.name }
          : {}),

        ...(data.phone !== undefined
          ? { phone: data.phone }
          : {}),
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

  return updatedUser;
}
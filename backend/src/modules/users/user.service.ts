import { prisma } from "../../config/prisma";
import { UserRole } from "../../generated/prisma/client";
import { AppError } from "../../utils/AppError";

/*
|--------------------------------------------------------------------------
| Get all customers
|--------------------------------------------------------------------------
*/

export async function getAllCustomers() {
  const customers =
    await prisma.user.findMany({
      where: {
        role: UserRole.CUSTOMER,
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
        role: UserRole.CUSTOMER,
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
| Change customer role
|--------------------------------------------------------------------------
*/

export async function changeCustomerRole(
  customerId: string,
  newRole: "CUSTOMER" | "ADMIN"
) {
  const customer =
    await prisma.user.findFirst({
      where: {
        id: customerId,
        role: UserRole.CUSTOMER,
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
  | No-op role change
  |--------------------------------------------------------------------------
  */

  if (
    newRole ===
    UserRole.CUSTOMER
  ) {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      role: customer.role,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Promote customer to admin
  |--------------------------------------------------------------------------
  */

  const updatedUser =
    await prisma.user.update({
      where: {
        id: customer.id,
      },

      data: {
        role: UserRole.ADMIN,
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
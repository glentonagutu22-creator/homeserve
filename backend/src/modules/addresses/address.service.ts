import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

/*
|--------------------------------------------------------------------------
| Create Address
|--------------------------------------------------------------------------
*/

export async function createAddress(
  userId: string,
  data: {
    label: string;
    addressLine: string;
    city: string;
    county: string;
    latitude?: number;
    longitude?: number;
  }
) {
  const address = await prisma.address.create({
    data: {
      userId,

      label: data.label,

      addressLine:
        data.addressLine,

      city: data.city,

      county: data.county,

      latitude:
        data.latitude,

      longitude:
        data.longitude,
    },
  });

  return address;
}

/*
|--------------------------------------------------------------------------
| Get Customer Addresses
|--------------------------------------------------------------------------
*/

export async function getCustomerAddresses(
  userId: string
) {
  const addresses =
    await prisma.address.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return addresses;
}

/*
|--------------------------------------------------------------------------
| Get Customer Address
|--------------------------------------------------------------------------
*/

export async function getCustomerAddress(
  userId: string,
  addressId: string
) {
  const address =
    await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

  if (!address) {
    throw new AppError(
      "Address not found",
      404
    );
  }

  return address;
}

/*
|--------------------------------------------------------------------------
| Update Customer Address
|--------------------------------------------------------------------------
*/

export async function updateAddress(
  userId: string,
  addressId: string,
  data: {
    label?: string;
    addressLine?: string;
    city?: string;
    county?: string;
    latitude?: number;
    longitude?: number;
  }
) {
  const address =
    await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

  if (!address) {
    throw new AppError(
      "Address not found",
      404
    );
  }

  const updatedAddress =
    await prisma.address.update({
      where: {
        id: address.id,
      },

      data: {
        label: data.label,

        addressLine:
          data.addressLine,

        city: data.city,

        county: data.county,

        latitude:
          data.latitude,

        longitude:
          data.longitude,
      },
    });

  return updatedAddress;
}

/*
|--------------------------------------------------------------------------
| Delete Customer Address
|--------------------------------------------------------------------------
*/

export async function deleteAddress(
  userId: string,
  addressId: string
) {
  const address =
    await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

  if (!address) {
    throw new AppError(
      "Address not found",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Check whether address is being used by bookings
  |--------------------------------------------------------------------------
  */

  const bookingCount =
    await prisma.booking.count({
      where: {
        addressId: address.id,
      },
    });

  if (bookingCount > 0) {
    throw new AppError(
      "This address cannot be deleted because it is associated with a booking",
      400
    );
  }

  await prisma.address.delete({
    where: {
      id: address.id,
    },
  });
}
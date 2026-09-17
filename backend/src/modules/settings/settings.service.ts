import bcrypt from "bcryptjs";

import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

// =========================================================
// SYSTEM SETTINGS
// =========================================================

export async function getAllSettings() {
  return prisma.systemSetting.findMany({
    orderBy: [
      { category: "asc" },
      { key: "asc" },
    ],
  });
}

export async function getSettingsByCategory(
  category: string
) {
  return prisma.systemSetting.findMany({
    where: {
      category,
    },
    orderBy: {
      key: "asc",
    },
  });
}

export async function getSettingByKey(
  key: string
) {
  const setting =
    await prisma.systemSetting.findUnique({
      where: {
        key,
      },
    });

  if (!setting) {
    throw new AppError(
      "Setting not found",
      404
    );
  }

  return setting;
}

export async function updateSetting(
  key: string,
  value: string
) {
  const existing =
    await prisma.systemSetting.findUnique({
      where: {
        key,
      },
    });

  if (!existing) {
    throw new AppError(
      "Setting not found",
      404
    );
  }

  return prisma.systemSetting.update({
    where: {
      key,
    },
    data: {
      value,
    },
  });
}

export async function updateSettings(
  settings: {
    key: string;
    value: string;
  }[]
) {
  const keys = settings.map(
    (setting) => setting.key
  );

  const existingSettings =
    await prisma.systemSetting.findMany({
      where: {
        key: {
          in: keys,
        },
      },
    });

  const existingKeys = new Set(
    existingSettings.map(
      (setting) => setting.key
    )
  );

  for (const setting of settings) {
    if (!existingKeys.has(setting.key)) {
      throw new AppError(
        `Setting not found: ${setting.key}`,
        404
      );
    }
  }

  return prisma.$transaction(
    settings.map((setting) =>
      prisma.systemSetting.update({
        where: {
          key: setting.key,
        },
        data: {
          value: setting.value,
        },
      })
    )
  );
}

// =========================================================
// USER SETTINGS
// =========================================================

export async function getUserSettings(
  userId: string
) {
  let settings =
    await prisma.userSetting.findUnique({
      where: {
        userId,
      },
    });

  if (!settings) {
    settings =
      await prisma.userSetting.create({
        data: {
          userId,
        },
      });
  }

  return settings;
}

export async function updateUserSettings(
  userId: string,
  data: {
    language?: string;
    currency?: string;
    timezone?: string;

    emailBookingUpdates?: boolean;
    emailQuoteUpdates?: boolean;
    emailPaymentUpdates?: boolean;
    emailServiceUpdates?: boolean;
    emailSystemAnnouncements?: boolean;

    smsBookingUpdates?: boolean;
    smsQuoteUpdates?: boolean;
    smsPaymentUpdates?: boolean;

    marketingNotifications?: boolean;
  }
) {
  return prisma.userSetting.upsert({
    where: {
      userId,
    },

    create: {
      userId,
      ...data,
    },

    update: {
      ...data,
    },
  });
}

// =========================================================
// PROFILE
// =========================================================

export async function getUserProfile(
  userId: string
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
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

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  return user;
}

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    phone?: string | null;
  }
) {
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
        "Phone number is already in use",
        409
      );
    }
  }

  return prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      ...(data.name !== undefined && {
        name: data.name,
      }),

      ...(data.phone !== undefined && {
        phone: data.phone,
      }),
    },

    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      updatedAt: true,
    },
  });
}

// =========================================================
// PASSWORD
// =========================================================

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  if (!user.passwordHash) {
    throw new AppError(
      "Password login is not configured for this account",
      400
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

  if (!passwordMatches) {
    throw new AppError(
      "Current password is incorrect",
      400
    );
  }

  const samePassword =
    await bcrypt.compare(
      newPassword,
      user.passwordHash
    );

  if (samePassword) {
    throw new AppError(
      "New password must be different from your current password",
      400
    );
  }

  const passwordHash =
    await bcrypt.hash(
      newPassword,
      12
    );

  await prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      passwordHash,
    },
  });
}

// =========================================================
// ACCOUNT
// =========================================================

export async function deleteUserAccount(
  userId: string
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        role: true,
      },
    });

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  if (user.role === "ADMIN") {
    throw new AppError(
      "Administrator accounts cannot be deleted through this endpoint",
      403
    );
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
}
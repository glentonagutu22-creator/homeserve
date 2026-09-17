import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import { prisma } from "../../config/prisma";

import { AppError } from "../../utils/AppError";

import googleClient from "../../config/google";

import {
  sendWelcomeEmail,
} from "../notifications/notification.service";

interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface GoogleLoginInput {
  credential: string;
}

export async function registerUser(
  input: RegisterInput
) {
  const {
    name,
    email,
    phone,
    password,
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

  const user =
    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
      },
    });

  /*
  |--------------------------------------------------------------------------
  | Welcome email
  |--------------------------------------------------------------------------
  |
  | Email delivery is best-effort inside
  | notification.service.ts, so a Resend failure
  | will not prevent registration from succeeding.
  |
  */

  await sendWelcomeEmail({
    email: user.email,
    name: user.name,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export async function loginUser(
  input: LoginInput
) {
  const {
    email,
    password,
  } = input;

  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const passwordHash =
    user.passwordHash;

  if (!passwordHash) {
    throw new AppError(
      "This account does not have a password. Please sign in with Google.",
      401
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      passwordHash
    );

  if (!passwordMatches) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError(
      "JWT_SECRET is not configured",
      500
    );
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    secret,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
}

export async function getCurrentUser(
  userId: string
) {
  const user =
    await prisma.user.findUnique({
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

export async function loginWithGoogle(
  input: GoogleLoginInput
) {
  const {
    credential,
  } = input;

  const clientId =
    process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new AppError(
      "Google authentication is not configured",
      500
    );
  }

  const ticket =
    await googleClient.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

  const payload =
    ticket.getPayload();

  if (!payload) {
    throw new AppError(
      "Invalid Google credential",
      401
    );
  }

  if (
    !payload.email ||
    payload.email_verified !== true
  ) {
    throw new AppError(
      "Google account email is not verified",
      401
    );
  }

  if (!payload.sub) {
    throw new AppError(
      "Google account ID is missing",
      401
    );
  }

  const googleId =
    payload.sub;

  const email =
    payload.email;

  const name =
    payload.name ||
    "HomeServe Customer";

  /*
  |--------------------------------------------------------------------------
  | 1. Check whether this Google account already exists
  |--------------------------------------------------------------------------
  */

  let user =
    await prisma.user.findUnique({
      where: {
        googleId,
      },
    });

  /*
  |--------------------------------------------------------------------------
  | 2. If not, check whether the email already exists
  |--------------------------------------------------------------------------
  */

  if (!user) {
    user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });
  }

  /*
  |--------------------------------------------------------------------------
  | 3. Existing account
  |--------------------------------------------------------------------------
  */

  if (user) {
    /*
    |--------------------------------------------------------------------------
    | Link Google to an existing account
    |--------------------------------------------------------------------------
    */

    if (!user.googleId) {
      user =
        await prisma.user.update({
          where: {
            id: user.id,
          },

          data: {
            googleId,
          },
        });
    }
  } else {
    /*
    |--------------------------------------------------------------------------
    | 4. Create a new HomeServe customer
    |--------------------------------------------------------------------------
    */

    user =
      await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          role: "CUSTOMER",
        },
      });

    /*
    |--------------------------------------------------------------------------
    | Welcome email for new Google customers
    |--------------------------------------------------------------------------
    */

    await sendWelcomeEmail({
      email: user.email,
      name: user.name,
    });
  }

  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError(
      "JWT_SECRET is not configured",
      500
    );
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    secret,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
}
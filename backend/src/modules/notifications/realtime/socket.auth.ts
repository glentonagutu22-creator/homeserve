import jwt from "jsonwebtoken";
import type { Socket } from "socket.io";
import { UserRole } from "../../../generated/prisma/client";

interface JwtPayload {
  userId: string;
  role: UserRole;
}

export interface AuthenticatedSocket extends Socket {
  user: JwtPayload;
}

function getCookieToken(
  cookieHeader?: string
): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  const cookies = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim());

  const accessTokenCookie = cookies.find((cookie) =>
    cookie.startsWith("accessToken=")
  );

  if (!accessTokenCookie) {
    return undefined;
  }

  return decodeURIComponent(
    accessTokenCookie.substring("accessToken=".length)
  );
}

export function authenticateSocket(
  socket: Socket,
  next: (error?: Error) => void
): void {
  const token = getCookieToken(
    socket.handshake.headers.cookie
  );

  if (!token) {
    return next(
      new Error("Authentication required")
    );
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next(
      new Error("JWT_SECRET is not configured")
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      secret
    ) as JwtPayload;

    if (!decoded.userId || !decoded.role) {
      return next(
        new Error("Invalid authentication token")
      );
    }

    const authenticatedSocket =
      socket as AuthenticatedSocket;

    authenticatedSocket.user = decoded;

    next();
  } catch {
    return next(
      new Error("Invalid or expired token")
    );
  }
}
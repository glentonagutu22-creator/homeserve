import {
  Request,
  Response,
  NextFunction,
} from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { UserRole } from "../generated/prisma/client";

interface JwtPayload {
  userId: string;
  role: UserRole;
}

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const token =
    req.cookies?.accessToken ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : undefined);

  if (!token) {
    return next(
      new AppError("Authentication required", 401)
    );
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next(
      new AppError("JWT_SECRET is not configured", 500)
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      secret
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch {
    return next(
      new AppError("Invalid or expired token", 401)
    );
  }
}
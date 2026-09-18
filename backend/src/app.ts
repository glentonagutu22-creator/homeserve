import express from "express";
import cors from "cors";
import { prisma } from "./config/prisma";
import authRoutes from "./modules/auth/auth.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import cookieParser from "cookie-parser";

import cleaningRoutes from "./modules/cleaning/cleaning.routes";
import movingRoutes from "./modules/moving/moving.routes";
import electricalRoutes from "./modules/electrical/electrical.routes";
import bookingRoutes from "./modules/bookings/booking.routes";
import addressRoutes from "./modules/addresses/address.routes";
import quoteRoutes from "./modules/quotes/quote.routes";
import pricingRoutes from "./modules/pricing/pricing.routes";
import staffRoutes from "./modules/staff/staff.routes";
import userRoutes from "./modules/users/user.routes";
import paymentRoutes from "./modules/payments/payment.routes";
import settingsRoutes from "./modules/settings/settings.routes";
import notificationRoutes from "./modules/notifications/notification.routes";

const app = express();

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Service Platform API is running",
  });
});

app.get("/api/test-db", async (_req, res) => {
  try {
    const userCount = await prisma.user.count();

    res.json({
      success: true,
      message: "Database connection is working",
      userCount,
    });
  } catch (error) {
    console.error("Database test failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

/*
 * TEMPORARY AUTH DEBUGGING
 * Remove this after authentication is fixed.
 */
app.get("/api/debug-auth", (req, res) => {
  res.json({
    hasAccessToken: Boolean(req.cookies?.accessToken),
    cookieHeader: req.headers.cookie || null,
    origin: req.headers.origin || null,
    host: req.headers.host || null,
    frontendUrl:
      process.env.FRONTEND_URL || null,
    nodeEnv:
      process.env.NODE_ENV || null,
    userAgent:
      req.headers["user-agent"] || null,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/cleaning", cleaningRoutes);
app.use("/api/moving", movingRoutes);
app.use("/api/electrical", electricalRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/notifications", notificationRoutes);

/*
 * Global error handler
 * Must be registered after routes.
 */
app.use(errorMiddleware);

export default app;
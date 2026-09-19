import express from "express";
import cors from "cors";
import { prisma } from "./config/prisma";
import authRoutes from "./modules/auth/auth.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import cookieParser from "cookie-parser";
import reportsRoutes from "./modules/reports/reports.routes";
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
import contactRoutes from "./modules/contact/contact.routes";


const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://homeserve-frontend.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as direct server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },
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
app.use("/api/reports", reportsRoutes);
app.use("/api/contact", contactRoutes);
/*
 * Global error handler
 * Must be registered after routes.
 */
app.use(errorMiddleware);

export default app;
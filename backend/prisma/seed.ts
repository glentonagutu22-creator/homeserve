
import "dotenv/config";

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // =========================================================
  // SERVICE CATALOG
  // =========================================================

  const services = [
    // =========================================================
    // CLEANING
    // =========================================================

    {
      name: "Home Cleaning",
      description:
        "Professional cleaning for homes and apartments.",
      category: "CLEANING" as const,
      pricingType: "CALCULATED" as const,
      basePrice: 1500,
      duration: 180,
      isActive: true,
    },

    {
      name: "Deep Cleaning",
      description:
        "Detailed cleaning for homes that need extra attention.",
      category: "CLEANING" as const,
      pricingType: "CALCULATED" as const,
      basePrice: 3000,
      duration: 300,
      isActive: true,
    },

    {
      name: "Office Cleaning",
      description:
        "Professional cleaning services for offices and workspaces.",
      category: "CLEANING" as const,
      pricingType: "QUOTE" as const,
      basePrice: null,
      duration: 240,
      isActive: true,
    },

    {
      name: "Move-In Cleaning",
      description:
        "Thorough cleaning before moving into a new property.",
      category: "CLEANING" as const,
      pricingType: "CALCULATED" as const,
      basePrice: 2500,
      duration: 240,
      isActive: true,
    },

    {
      name: "Move-Out Cleaning",
      description:
        "Complete cleaning before leaving a property.",
      category: "CLEANING" as const,
      pricingType: "CALCULATED" as const,
      basePrice: 2500,
      duration: 240,
      isActive: true,
    },

    {
      name: "Post-Construction Cleaning",
      description:
        "Removal of construction dust, debris, and residue.",
      category: "CLEANING" as const,
      pricingType: "QUOTE" as const,
      basePrice: null,
      duration: 360,
      isActive: true,
    },

    // =========================================================
    // MOVING
    // =========================================================

    {
      name: "House Moving",
      description:
        "Professional relocation services for homes and apartments.",
      category: "MOVING" as const,
      pricingType: "CALCULATED" as const,
      basePrice: 5000,
      duration: 240,
      isActive: true,
    },

    {
      name: "Office Moving",
      description:
        "Reliable relocation services for offices and businesses.",
      category: "MOVING" as const,
      pricingType: "CALCULATED" as const,
      basePrice: 7000,
      duration: 300,
      isActive: true,
    },

    {
      name: "Single-Item Moving",
      description:
        "Safe transportation of individual furniture and other large items.",
      category: "MOVING" as const,
      pricingType: "FIXED" as const,
      basePrice: 2500,
      duration: 120,
      isActive: true,
    },

    {
      name: "Packing and Moving",
      description:
        "Complete packing, transportation, and relocation service.",
      category: "MOVING" as const,
      pricingType: "CALCULATED" as const,
      basePrice: 8000,
      duration: 360,
      isActive: true,
    },

    {
      name: "Local Transportation",
      description:
        "Local transportation for furniture, equipment, and household items.",
      category: "MOVING" as const,
      pricingType: "CALCULATED" as const,
      basePrice: 2000,
      duration: 120,
      isActive: true,
    },

    // =========================================================
    // ELECTRICAL
    // =========================================================

    {
      name: "Electrical Wiring",
      description:
        "Professional electrical wiring services for residential and commercial properties.",
      category: "ELECTRICAL" as const,
      pricingType: "QUOTE" as const,
      basePrice: null,
      duration: 480,
      isActive: true,
    },

    {
      name: "Electrical Installation",
      description:
        "Professional installation of electrical systems and equipment.",
      category: "ELECTRICAL" as const,
      pricingType: "QUOTE" as const,
      basePrice: null,
      duration: 360,
      isActive: true,
    },

    {
      name: "Socket and Switch Installation",
      description:
        "Installation and replacement of electrical sockets and switches.",
      category: "ELECTRICAL" as const,
      pricingType: "FIXED" as const,
      basePrice: 500,
      duration: 60,
      isActive: true,
    },

    {
      name: "Lighting Installation",
      description:
        "Professional installation of indoor and outdoor lighting.",
      category: "ELECTRICAL" as const,
      pricingType: "FIXED" as const,
      basePrice: 1000,
      duration: 90,
      isActive: true,
    },

    {
      name: "Electrical Fault Diagnosis",
      description:
        "Professional diagnosis of electrical faults and system problems.",
      category: "ELECTRICAL" as const,
      pricingType: "FIXED" as const,
      basePrice: 1500,
      duration: 90,
      isActive: true,
    },

    {
      name: "Electrical Repairs",
      description:
        "Repair and troubleshooting of electrical systems and components.",
      category: "ELECTRICAL" as const,
      pricingType: "QUOTE" as const,
      basePrice: null,
      duration: 180,
      isActive: true,
    },

    {
      name: "Electrical Inspection",
      description:
        "Professional inspection and assessment of electrical installations.",
      category: "ELECTRICAL" as const,
      pricingType: "FIXED" as const,
      basePrice: 2000,
      duration: 120,
      isActive: true,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: {
        name_category: {
          name: service.name,
          category: service.category,
        },
      },

      update: {
        description: service.description,
        pricingType: service.pricingType,
        basePrice: service.basePrice,
        duration: service.duration,
        isActive: service.isActive,
      },

      create: service,
    });
  }

  console.log(
    "Service catalog seeded successfully"
  );

  // =========================================================
  // PRICING RULES
  // =========================================================

  const pricingRules = [
    // =========================================================
    // CLEANING
    // =========================================================

    {
      category: "CLEANING" as const,
      name: "BEDROOM",
      description:
        "Additional charge per bedroom",
      unit: "per bedroom",
      unitPrice: 300,
      isActive: true,
    },

    {
      category: "CLEANING" as const,
      name: "BATHROOM",
      description:
        "Additional charge per bathroom",
      unit: "per bathroom",
      unitPrice: 250,
      isActive: true,
    },

    {
      category: "CLEANING" as const,
      name: "SQUARE_METER",
      description:
        "Additional charge based on property area",
      unit: "per m²",
      unitPrice: 20,
      isActive: true,
    },

    // =========================================================
    // MOVING
    // =========================================================

    {
      category: "MOVING" as const,
      name: "DISTANCE_KM",
      description:
        "Additional charge based on moving distance",
      unit: "per km",
      unitPrice: 100,
      isActive: true,
    },

    {
      category: "MOVING" as const,
      name: "MOVER",
      description:
        "Additional charge per mover",
      unit: "per mover",
      unitPrice: 800,
      isActive: true,
    },

    {
      category: "MOVING" as const,
      name: "PACKING",
      description:
        "Additional charge for packing service",
      unit: "per service",
      unitPrice: 1500,
      isActive: true,
    },

    // =========================================================
    // ELECTRICAL
    // =========================================================

    {
      category: "ELECTRICAL" as const,
      name: "SOCKET",
      description:
        "Additional charge per socket installation",
      unit: "per socket",
      unitPrice: 350,
      isActive: true,
    },

    {
      category: "ELECTRICAL" as const,
      name: "LIGHT",
      description:
        "Additional charge per light installation",
      unit: "per light",
      unitPrice: 400,
      isActive: true,
    },

    {
      category: "ELECTRICAL" as const,
      name: "DISTRIBUTION_BOARD",
      description:
        "Additional charge for distribution board installation",
      unit: "per board",
      unitPrice: 5000,
      isActive: true,
    },

    {
      category: "ELECTRICAL" as const,
      name: "REWIRING",
      description:
        "Additional charge for rewiring service",
      unit: "per service",
      unitPrice: 2500,
      isActive: true,
    },
  ];

  for (const rule of pricingRules) {
    await prisma.pricingRule.upsert({
      where: {
        category_name: {
          category: rule.category,
          name: rule.name,
        },
      },

      update: {
        description: rule.description,
        unit: rule.unit,
        unitPrice: rule.unitPrice,
        isActive: rule.isActive,
      },

      create: rule,
    });
  }

  console.log(
    "Pricing rules seeded successfully"
  );

  // =========================================================
  // SYSTEM SETTINGS
  // =========================================================

  const systemSettings = [
    // =========================================================
    // BUSINESS
    // =========================================================

    {
      key: "business.name",
      value: "HomeServe",
      category: "BUSINESS",
      description:
        "HomeServe business name",
    },

    {
      key: "business.email",
      value: "support@homeserve.co.ke",
      category: "BUSINESS",
      description:
        "Primary business email",
    },

    {
      key: "business.phone",
      value: "+254",
      category: "BUSINESS",
      description:
        "Primary business phone number",
    },

    {
      key: "business.timezone",
      value: "Africa/Nairobi",
      category: "BUSINESS",
      description:
        "Business operating timezone",
    },

    // =========================================================
    // BOOKINGS
    // =========================================================

    {
      key: "booking.minimumLeadTime",
      value: "2",
      category: "BOOKING",
      description:
        "Minimum number of hours required before a booking",
    },

    {
      key: "booking.cancellationWindow",
      value: "24",
      category: "BOOKING",
      description:
        "Number of hours before scheduled time when cancellation is allowed",
    },

    {
      key: "booking.requireAddress",
      value: "true",
      category: "BOOKING",
      description:
        "Require customers to provide a service address",
    },

    // =========================================================
    // PAYMENTS
    // =========================================================

    {
      key: "payment.currency",
      value: "KES",
      category: "PAYMENT",
      description:
        "Platform currency",
    },

    {
      key: "payment.requirePayment",
      value: "false",
      category: "PAYMENT",
      description:
        "Whether payment is required before booking confirmation",
    },

    {
      key: "payment.mpesaEnabled",
      value: "true",
      category: "PAYMENT",
      description:
        "Enable M-Pesa as a payment method",
    },

    {
      key: "payment.cardEnabled",
      value: "true",
      category: "PAYMENT",
      description:
        "Enable card payments",
    },

    {
      key: "payment.cashEnabled",
      value: "true",
      category: "PAYMENT",
      description:
        "Enable cash payments",
    },

    // =========================================================
    // NOTIFICATIONS
    // =========================================================

    {
      key: "notification.bookingConfirmation",
      value: "true",
      category: "NOTIFICATION",
      description:
        "Send booking confirmation notifications",
    },

    {
      key: "notification.bookingReminder",
      value: "true",
      category: "NOTIFICATION",
      description:
        "Send booking reminder notifications",
    },

    {
      key: "notification.quoteNotification",
      value: "true",
      category: "NOTIFICATION",
      description:
        "Notify customers when a quote is available",
    },

    {
      key: "notification.paymentNotification",
      value: "true",
      category: "NOTIFICATION",
      description:
        "Notify customers about payment updates",
    },

    // =========================================================
    // STAFF
    // =========================================================

    {
      key: "staff.requireAvailability",
      value: "true",
      category: "STAFF",
      description:
        "Require staff members to maintain availability",
    },

    {
      key: "staff.allowSelfStatusUpdate",
      value: "true",
      category: "STAFF",
      description:
        "Allow staff to update their assigned booking status",
    },

    // =========================================================
    // SECURITY
    // =========================================================

    {
      key: "security.sessionDuration",
      value: "24",
      category: "SECURITY",
      description:
        "Authentication session duration in hours",
    },

    {
      key: "security.requireTwoFactorForAdmins",
      value: "false",
      category: "SECURITY",
      description:
        "Require two-factor authentication for administrators",
    },

    // =========================================================
    // SYSTEM
    // =========================================================

    {
      key: "system.maintenanceMode",
      value: "false",
      category: "SYSTEM",
      description:
        "Put the HomeServe platform into maintenance mode",
    },

    {
      key: "system.allowNewBookings",
      value: "true",
      category: "SYSTEM",
      description:
        "Allow customers to create new bookings",
    },
  ];

    // =========================================================
  // USER SETTINGS
  // =========================================================

  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  for (const user of users) {
    await prisma.userSetting.upsert({
      where: {
        userId: user.id,
      },

      update: {},

      create: {
        userId: user.id,
        language: "en",
        currency: "KES",
        timezone: "Africa/Nairobi",

        emailBookingUpdates: true,
        emailQuoteUpdates: true,
        emailPaymentUpdates: true,
        emailServiceUpdates: true,
        emailSystemAnnouncements: true,

        smsBookingUpdates: true,
        smsQuoteUpdates: true,
        smsPaymentUpdates: true,

        marketingNotifications: false,
      },
    });
  }

  console.log(
    "User settings seeded successfully"
  );

  for (const setting of systemSettings) {
    await prisma.systemSetting.upsert({
      where: {
        key: setting.key,
      },

      update: {
        category: setting.category,
        description: setting.description,
      },

      create: setting,
    });
  }

  console.log(
    "System settings seeded successfully"
  );
}

// =========================================================
// RUN SEED
// =========================================================

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

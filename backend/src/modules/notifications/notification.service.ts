import { prisma } from "../../config/prisma";
import { getIO } from "./realtime/socket";

import {
  CreateNotificationData,
  CreateRoleNotificationData,
} from "./notification.types";

import { AppError } from "../../utils/AppError";

import { sendEmail } from "./email/email.service";

import {
  welcomeEmail,
  bookingCreatedEmail,
  bookingConfirmedEmail,
  bookingCancelledEmail,
  staffAssignedEmail,
  jobCompletedEmail,
  quoteSentEmail,
  quoteAcceptedEmail,
  quoteRejectedEmail,
  quoteExpiredEmail,
  paymentCompletedEmail,
  paymentFailedEmail,
} from "./email/email.templates";
import { sendSms } from "./sms/sms.service";

import {
  bookingCreatedSms,
  bookingConfirmedSms,
  bookingCancelledSms,
  staffAssignedSms,
  jobStartedSms,
  jobCompletedSms,
  quoteSentSms,
  quoteAcceptedSms,
  quoteRejectedSms,
  quoteExpiredSms,
  paymentCompletedSms,
  paymentFailedSms,
} from "./sms/sms.templates";

/*
|--------------------------------------------------------------------------
| Real-time delivery
|--------------------------------------------------------------------------
*/

/**
 * Deliver a notification to a user's Socket.IO room.
 *
 * Real-time delivery is intentionally best-effort.
 *
 * The notification has already been persisted in
 * PostgreSQL, so a Socket.IO failure must not
 * cause the business operation to fail.
 */
function emitNotification(
  userId: string,
  notification: unknown
): void {
  try {
    const io = getIO();

    io
      .to(`user:${userId}`)
      .emit(
        "notification:new",
        notification
      );
  } catch (error) {
    console.error(
      `Failed to deliver real-time notification to user ${userId}:`,
      error
    );
  }
}

/*
|--------------------------------------------------------------------------
| Email delivery
|--------------------------------------------------------------------------
*/

/**
 * Email delivery is intentionally best-effort.
 *
 * A failure to send an email must NOT cause the
 * business operation that triggered the notification
 * to fail.
 */
async function deliverEmail(
  data: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }
): Promise<void> {
  try {
    await sendEmail(data);
  } catch (error) {
    console.error(
      `Failed to send email to ${data.to}:`,
      error
    );
  }
}

/*
|--------------------------------------------------------------------------
| SMS delivery
|--------------------------------------------------------------------------
*/

/**
 * SMS delivery is intentionally best-effort.
 *
 * A failure to send an SMS must NOT cause the
 * business operation that triggered the notification
 * to fail.
 */
async function deliverSms(
  data: {
    to: string;
    message: string;
  }
): Promise<void> {
  try {
    await sendSms(data);
  } catch (error) {
    console.error(
      `Failed to send SMS to ${data.to}:`,
      error
    );
  }
}

/*
|--------------------------------------------------------------------------
| Create notification
|--------------------------------------------------------------------------
*/

/**
 * Create and persist a notification for one user.
 *
 * Flow:
 *
 * Business operation
 *       ↓
 * PostgreSQL notification
 *       ↓
 * Socket.IO delivery
 *
 * Socket.IO delivery is best-effort.
 *
 * Email/SMS delivery is handled separately by the
 * specific notification methods below.
 */
export async function createNotification(
  data: CreateNotificationData
) {
  /*
  |--------------------------------------------------------------------------
  | Persist notification first
  |--------------------------------------------------------------------------
  */

  const notification =
    await prisma.notification.create({
      data: {
        userId: data.userId,

        type: data.type,

        title: data.title,

        message: data.message,

        relatedEntity:
          data.relatedEntity,

        relatedEntityId:
          data.relatedEntityId,
      },
    });

  /*
  |--------------------------------------------------------------------------
  | Deliver notification in real time
  |--------------------------------------------------------------------------
  */

  emitNotification(
    data.userId,
    notification
  );

  return notification;
}

/*
|--------------------------------------------------------------------------
| Create role notification
|--------------------------------------------------------------------------
*/

/**
 * Create notifications for every user
 * belonging to a specific role.
 *
 * Example:
 *
 * role = ADMIN
 *
 * Every admin receives an individual
 * persisted notification.
 */
export async function createRoleNotification(
  data: CreateRoleNotificationData
) {
  /*
  |--------------------------------------------------------------------------
  | Find users with the requested role
  |--------------------------------------------------------------------------
  */

  const users = await prisma.user.findMany({
    where: {
      role: data.role,
    },

    select: {
      id: true,
    },
  });

  if (users.length === 0) {
    return [];
  }

  /*
  |--------------------------------------------------------------------------
  | Persist all notifications
  |--------------------------------------------------------------------------
  */

  const notifications =
    await prisma.$transaction(
      users.map((user) =>
        prisma.notification.create({
          data: {
            userId: user.id,

            type: data.type,

            title: data.title,

            message: data.message,

            relatedEntity:
              data.relatedEntity,

            relatedEntityId:
              data.relatedEntityId,
          },
        })
      )
    );

  /*
  |--------------------------------------------------------------------------
  | Deliver each notification
  |--------------------------------------------------------------------------
  */

  notifications.forEach(
    (notification) => {
      emitNotification(
        notification.userId,
        notification
      );
    }
  );

  return notifications;
}

/*
|--------------------------------------------------------------------------
| Email notifications
|--------------------------------------------------------------------------
*/

/**
 * Send welcome email after customer registration.
 */
export async function sendWelcomeEmail(
  data: {
    email: string;
    name: string;
  }
): Promise<void> {
  const template =
    welcomeEmail(data.name);

  await deliverEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send booking-created email.
 */
export async function sendBookingCreatedEmail(
  data: {
    email: string;
    name: string;
    bookingNumber: string;
    serviceName: string;
    scheduledDate: string;
    scheduledTime: string;
    totalAmount?: string;
  }
): Promise<void> {
  const template =
    bookingCreatedEmail(data);

  await deliverEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send booking-confirmed email.
 */
export async function sendBookingConfirmedEmail(
  data: {
    email: string;
    name: string;
    bookingNumber: string;
    serviceName: string;
    scheduledDate: string;
    scheduledTime: string;
    totalAmount?: string;
  }
): Promise<void> {
  const template =
    bookingConfirmedEmail(data);

  await deliverEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send booking-cancelled email.
 */
export async function sendBookingCancelledEmail(
  data: {
    email: string;
    name: string;
    bookingNumber: string;
    serviceName: string;
    reason?: string;
  }
): Promise<void> {
  const template =
    bookingCancelledEmail(data);

  await deliverEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send staff-assigned email.
 */
export async function sendStaffAssignedEmail(
  data: {
    email: string;
    name: string;
    bookingNumber: string;
    serviceName: string;
    staffName: string;
    scheduledDate: string;
    scheduledTime: string;
  }
): Promise<void> {
  const template =
    staffAssignedEmail(data);

  await deliverEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send job-completed email.
 */
export async function sendJobCompletedEmail(
  data: {
    email: string;
    name: string;
    bookingNumber: string;
    serviceName: string;
  }
): Promise<void> {
  const template =
    jobCompletedEmail(data);

  await deliverEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send quote-sent email.
 */
export async function sendQuoteSentEmail(
  data: {
    email: string;
    name: string;
    bookingNumber: string;
    serviceName: string;
    amount: string;
    validUntil?: string;
    description?: string;
  }
): Promise<void> {
  const template =
    quoteSentEmail(data);

  await deliverEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send quote-accepted email.
 */
export async function sendQuoteAcceptedEmail(
  data: {
    email: string;
    name: string;
    bookingNumber: string;
    serviceName: string;
    amount: string;
  }
): Promise<void> {
  const template =
    quoteAcceptedEmail(data);

  await deliverEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send quote-rejected email.
 */
export async function sendQuoteRejectedEmail(
  data: {
    email: string;
    name: string;
    bookingNumber: string;
    serviceName: string;
  }
): Promise<void> {
  const template =
    quoteRejectedEmail(data);

  await deliverEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send quote-expired email.
 */
export async function sendQuoteExpiredEmail(
  data: {
    email: string;
    name: string;
    bookingNumber: string;
    serviceName: string;
  }
): Promise<void> {
  const template =
    quoteExpiredEmail(data);

  await deliverEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send payment-completed email.
 */
export async function sendPaymentCompletedEmail(
  data: {
    email: string;
    name: string;
    bookingNumber: string;
    amount: string;
    paymentMethod: string;
    transactionReference?: string;
  }
): Promise<void> {
  const template =
    paymentCompletedEmail(data);

  await deliverEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send payment-failed email.
 */
export async function sendPaymentFailedEmail(
  data: {
    email: string;
    name: string;
    bookingNumber: string;
    amount: string;
    paymentMethod: string;
  }
): Promise<void> {
  const template =
    paymentFailedEmail(data);

  await deliverEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/*
|--------------------------------------------------------------------------
| SMS notifications
|--------------------------------------------------------------------------
*/

/**
 * Send booking-created SMS.
 */
export async function sendBookingCreatedSms(
  data: {
    phone: string;
    bookingNumber: string;
    serviceName: string;
    scheduledDate: string;
    scheduledTime: string;
  }
): Promise<void> {
  const message =
    bookingCreatedSms(
      data.bookingNumber,
      data.serviceName,
      data.scheduledDate,
      data.scheduledTime
    );

  await deliverSms({
    to: data.phone,
    message,
  });
}

/**
 * Send booking-confirmed SMS.
 */
export async function sendBookingConfirmedSms(
  data: {
    phone: string;
    bookingNumber: string;
    serviceName: string;
  }
): Promise<void> {
  const message =
    bookingConfirmedSms(
      data.bookingNumber,
      data.serviceName
    );

  await deliverSms({
    to: data.phone,
    message,
  });
}

/**
 * Send booking-cancelled SMS.
 */
export async function sendBookingCancelledSms(
  data: {
    phone: string;
    bookingNumber: string;
    serviceName: string;
  }
): Promise<void> {
  const message =
    bookingCancelledSms(
      data.bookingNumber,
      data.serviceName
    );

  await deliverSms({
    to: data.phone,
    message,
  });
}

/**
 * Send staff-assigned SMS.
 */
export async function sendStaffAssignedSms(
  data: {
    phone: string;
    bookingNumber: string;
    staffName: string;
  }
): Promise<void> {
  const message =
    staffAssignedSms(
      data.bookingNumber,
      data.staffName
    );

  await deliverSms({
    to: data.phone,
    message,
  });
}

/**
 * Send job-started SMS.
 */
export async function sendJobStartedSms(
  data: {
    phone: string;
    bookingNumber: string;
    serviceName: string;
  }
): Promise<void> {
  const message =
    jobStartedSms(
      data.bookingNumber,
      data.serviceName
    );

  await deliverSms({
    to: data.phone,
    message,
  });
}

/**
 * Send job-completed SMS.
 */
export async function sendJobCompletedSms(
  data: {
    phone: string;
    bookingNumber: string;
    serviceName: string;
  }
): Promise<void> {
  const message =
    jobCompletedSms(
      data.bookingNumber,
      data.serviceName
    );

  await deliverSms({
    to: data.phone,
    message,
  });
}

/**
 * Send quote-sent SMS.
 */
export async function sendQuoteSentSms(
  data: {
    phone: string;
    bookingNumber: string;
    amount: string;
  }
): Promise<void> {
  const message =
    quoteSentSms(
      data.bookingNumber,
      data.amount
    );

  await deliverSms({
    to: data.phone,
    message,
  });
}

/**
 * Send quote-accepted SMS.
 */
export async function sendQuoteAcceptedSms(
  data: {
    phone: string;
    bookingNumber: string;
  }
): Promise<void> {
  const message =
    quoteAcceptedSms(
      data.bookingNumber
    );

  await deliverSms({
    to: data.phone,
    message,
  });
}

/**
 * Send quote-rejected SMS.
 */
export async function sendQuoteRejectedSms(
  data: {
    phone: string;
    bookingNumber: string;
  }
): Promise<void> {
  const message =
    quoteRejectedSms(
      data.bookingNumber
    );

  await deliverSms({
    to: data.phone,
    message,
  });
}

/**
 * Send quote-expired SMS.
 */
export async function sendQuoteExpiredSms(
  data: {
    phone: string;
    bookingNumber: string;
  }
): Promise<void> {
  const message =
    quoteExpiredSms(
      data.bookingNumber
    );

  await deliverSms({
    to: data.phone,
    message,
  });
}

/**
 * Send payment-completed SMS.
 */
export async function sendPaymentCompletedSms(
  data: {
    phone: string;
    bookingNumber: string;
    amount: string;
  }
): Promise<void> {
  const message =
    paymentCompletedSms(
      data.bookingNumber,
      data.amount
    );

  await deliverSms({
    to: data.phone,
    message,
  });
}

/**
 * Send payment-failed SMS.
 */
export async function sendPaymentFailedSms(
  data: {
    phone: string;
    bookingNumber: string;
    amount: string;
  }
): Promise<void> {
  const message =
    paymentFailedSms(
      data.bookingNumber,
      data.amount
    );

  await deliverSms({
    to: data.phone,
    message,
  });
}

/*
|--------------------------------------------------------------------------
| Get notifications
|--------------------------------------------------------------------------
*/

/**
 * Get all notifications for a user.
 */
export async function getNotifications(
  userId: string
) {
  return prisma.notification.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

/*
|--------------------------------------------------------------------------
| Get unread notifications
|--------------------------------------------------------------------------
*/

/**
 * Get unread notifications for a user.
 */
export async function getUnreadNotifications(
  userId: string
) {
  return prisma.notification.findMany({
    where: {
      userId,

      isRead: false,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

/*
|--------------------------------------------------------------------------
| Get unread count
|--------------------------------------------------------------------------
*/

/**
 * Get the number of unread notifications.
 */
export async function getUnreadCount(
  userId: string
) {
  return prisma.notification.count({
    where: {
      userId,

      isRead: false,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Mark notification as read
|--------------------------------------------------------------------------
*/

/**
 * Mark one notification as read.
 *
 * The notification must belong to the
 * requesting user.
 */
export async function markNotificationAsRead(
  userId: string,
  notificationId: string
) {
  const notification =
    await prisma.notification.findFirst({
      where: {
        id: notificationId,

        userId,
      },
    });

  if (!notification) {
    throw new AppError(
      "Notification not found",
      404
    );
  }

  /*
   * Avoid unnecessary database writes.
   */
  if (notification.isRead) {
    return notification;
  }

  return prisma.notification.update({
    where: {
      id: notificationId,
    },

    data: {
      isRead: true,

      readAt: new Date(),
    },
  });
}

/*
|--------------------------------------------------------------------------
| Mark all notifications as read
|--------------------------------------------------------------------------
*/

/**
 * Mark all unread notifications belonging
 * to a user as read.
 */
export async function markAllNotificationsAsRead(
  userId: string
) {
  return prisma.notification.updateMany({
    where: {
      userId,

      isRead: false,
    },

    data: {
      isRead: true,

      readAt: new Date(),
    },
  });
}


import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

import { createRoleNotification } from "../notifications/notification.service";

import { UserRole } from "../../generated/prisma/client";

interface CreateContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function createContactMessage(
  data: CreateContactMessageInput
) {
  /*
  |--------------------------------------------------------------------------
  | Save contact message
  |--------------------------------------------------------------------------
  */

  const contactMessage =
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
      },
    });

  /*
  |--------------------------------------------------------------------------
  | Notify administrators
  |--------------------------------------------------------------------------
  */

  try {
    await createRoleNotification({
      role: UserRole.ADMIN,

      type: "CONTACT_MESSAGE",

      title: "New contact message",

      message: `${contactMessage.name} sent a new message: ${contactMessage.subject}`,

      relatedEntity: "CONTACT_MESSAGE",

      relatedEntityId: contactMessage.id,
    });
  } catch (error) {
    /*
     * Notification failure must not cause the
     * contact form submission to fail.
     */
    console.error(
      "Failed to notify administrators about contact message:",
      error
    );
  }

  return contactMessage;
}

export async function getContactMessages() {
  return prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getContactMessage(
  id: string
) {
  const contactMessage =
    await prisma.contactMessage.findUnique({
      where: { id },
    });

  if (!contactMessage) {
    throw new AppError(
      "Contact message not found",
      404
    );
  }

  return contactMessage;
}

export async function updateContactMessageStatus(
  id: string,
  status:
    | "NEW"
    | "READ"
    | "RESPONDED"
    | "CLOSED"
) {
  const existing =
    await prisma.contactMessage.findUnique({
      where: { id },
    });

  if (!existing) {
    throw new AppError(
      "Contact message not found",
      404
    );
  }

  return prisma.contactMessage.update({
    where: { id },
    data: { status },
  });
}
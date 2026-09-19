import { Request, Response } from "express";

import {
  createContactMessage,
  getContactMessage,
  getContactMessages,
  updateContactMessageStatus,
} from "./contact.service";

export async function createContactMessageController(
  req: Request,
  res: Response
) {
  const contactMessage =
    await createContactMessage(req.body);

  return res.status(201).json({
    success: true,
    message:
      "Your message has been sent successfully",
    contactMessage,
  });
}

export async function getContactMessagesController(
  _req: Request,
  res: Response
) {
  const contactMessages =
    await getContactMessages();

  return res.status(200).json({
    success: true,
    contactMessages,
  });
}

export async function getContactMessageController(
  req: Request,
  res: Response
) {
  const contactMessage =
    await getContactMessage(
      String(req.params.id)
    );

  return res.status(200).json({
    success: true,
    contactMessage,
  });
}

export async function updateContactMessageStatusController(
  req: Request,
  res: Response
) {
  const contactMessage =
    await updateContactMessageStatus(
      String(req.params.id),
      req.body.status
    );

  return res.status(200).json({
    success: true,
    message:
      "Contact message status updated successfully",
    contactMessage,
  });
}
import { apiRequest } from "./api";

export type ContactMessageStatus =
  | "NEW"
  | "READ"
  | "RESPONDED"
  | "CLOSED";

export interface AdminContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
}

interface ContactMessagesResponse {
  success: boolean;
  contactMessages: AdminContactMessage[];
}

interface ContactMessageResponse {
  success: boolean;
  contactMessage: AdminContactMessage;
}

interface UpdateContactMessageResponse {
  success: boolean;
  message: string;
  contactMessage: AdminContactMessage;
}

export async function getContactMessages(): Promise<
  AdminContactMessage[]
> {
  const response =
    await apiRequest<ContactMessagesResponse>(
      "/contact"
    );

  return response.contactMessages;
}

export async function getContactMessage(
  id: string
): Promise<AdminContactMessage> {
  const response =
    await apiRequest<ContactMessageResponse>(
      `/contact/${id}`
    );

  return response.contactMessage;
}

export async function updateContactMessageStatus(
  id: string,
  status: ContactMessageStatus
): Promise<AdminContactMessage> {
  const response =
    await apiRequest<UpdateContactMessageResponse>(
      `/contact/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status,
        }),
      }
    );

  return response.contactMessage;
}
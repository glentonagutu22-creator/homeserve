import { apiRequest } from "./api";

export interface CreateContactMessageData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessageResponse {
  success: boolean;
  message: string;
  contactMessage: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    status: "NEW" | "READ" | "RESPONDED" | "CLOSED";
    createdAt: string;
    updatedAt: string;
  };
}

export async function submitContactMessage(
  data: CreateContactMessageData
) {
  return apiRequest<ContactMessageResponse>(
    "/contact",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}
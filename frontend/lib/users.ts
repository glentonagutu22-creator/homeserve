import { apiRequest } from "./api";

import type { User } from "@/types/auth";

export async function updateMyProfile(
  data: {
    name?: string;
    phone?: string | null;
  }
): Promise<User> {
  const response = await apiRequest<{
    success: boolean;
    message: string;
    user: User;
  }>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  return response.user;
}
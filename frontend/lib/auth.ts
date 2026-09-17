import { apiRequest } from "./api";

import {
  RegisterData,
  RegisterResponse,
  LoginData,
  LoginResponse,
  User,
} from "@/types/auth";

export async function registerUser(
  data: RegisterData
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function loginUser(
  data: LoginData
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiRequest<{
    success: boolean;
    user: User;
  }>("/auth/me");

  return response.user;
}

export async function logoutUser() {
  return apiRequest<{
    success: boolean;
    message: string;
  }>("/auth/logout", {
    method: "POST",
  });
}
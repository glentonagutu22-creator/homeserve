export type UserRole =
  | "CUSTOMER"
  | "STAFF"
  | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string | null;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
}
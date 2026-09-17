import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  loginWithGoogle,
} from "./auth.service";





export async function register(
  req: Request,
  res: Response
  
) {
  const user = await registerUser(req.body);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
}

export async function login(
  req: Request,
  res: Response
) {
  const result = await loginUser(req.body);

  res.cookie("accessToken", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: result.user,
  });
}

export async function me(
  req: Request,
  res: Response
) {
  const user = await getCurrentUser(
    req.user!.userId
  );

  return res.status(200).json({
    success: true,
    user,
  });
}

export async function googleLogin(
  req: Request,
  res: Response
) {
  const result = await loginWithGoogle(req.body);

  res.cookie("accessToken", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Google authentication successful",
    user: result.user,
  });
}

export async function logout(
  _req: Request,
  res: Response
) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
}

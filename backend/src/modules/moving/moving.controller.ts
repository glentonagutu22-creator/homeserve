import { Request, Response } from "express";
import { getMovingServices } from "./moving.service";

export async function getMoving(
  _req: Request,
  res: Response
) {
  const services = await getMovingServices();

  return res.status(200).json({
    success: true,
    services,
  });
}
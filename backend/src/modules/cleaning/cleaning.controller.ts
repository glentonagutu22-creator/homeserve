import { Request, Response } from "express";
import { getCleaningServices } from "./cleaning.service";

export async function getCleaning(
  _req: Request,
  res: Response
) {
  const services = await getCleaningServices();

  return res.status(200).json({
    success: true,
    services,
  });
}
import { Request, Response } from "express";
import { getElectricalServices } from "./electrical.service";

export async function getElectrical(
  _req: Request,
  res: Response
) {
  const services = await getElectricalServices();

  return res.status(200).json({
    success: true,
    services,
  });
}
import type {
  Request,
  Response,
} from "express";

import { getReports } from "./reports.service";

export async function getReportsController(
  _req: Request,
  res: Response
) {
  const reports = await getReports();

  return res.status(200).json({
    success: true,
    reports,
  });
}
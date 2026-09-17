import { Router } from "express";
import { getElectrical } from "./electrical.controller";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(getElectrical)
);

export default router;
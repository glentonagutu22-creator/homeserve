import { Router } from "express";
import { getCleaning } from "./cleaning.controller";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(getCleaning)
);

export default router;
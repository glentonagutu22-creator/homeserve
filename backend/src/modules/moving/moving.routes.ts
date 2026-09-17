import { Router } from "express";
import { getMoving } from "./moving.controller";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(getMoving)
);

export default router;
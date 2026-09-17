import { Router } from "express";
import {
  register,
  login,
  googleLogin,
  me,
    logout,

    
} from "./auth.controller";
import {
  registerSchema,
  loginSchema,
  googleLoginSchema
} from "./auth.validator";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../middleware/asyncHandler";
import { authenticate } from "../../middleware/auth.middleware";
const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(register)
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(login)
);

router.post(
  "/google",
  validate(googleLoginSchema),
  asyncHandler(googleLogin)
);

router.get(
  "/me",
  authenticate,
  asyncHandler(me)
);

router.post(
  "/logout",
  authenticate,
  asyncHandler(logout)
);




export default router;
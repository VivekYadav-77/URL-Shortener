import express from "express";
import { authLimiter } from "../middleware/authRateLimiter.js";
import { validate } from "../middleware/validate_middleware.js";
import { loginSchema, registerSchema } from "../config/auth_validator.js";
import {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from "../controllers/auth_controller.js";
import { blockGuard } from "../middleware/blockGuard.js";
const auth_router = express.Router();
auth_router.post("/register", authLimiter, validate(registerSchema), register);
auth_router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  blockGuard,
  login,
);
auth_router.post("/refresh", refresh);
auth_router.post("/logout", logout);
auth_router.post("/forgot-password", authLimiter, blockGuard, forgotPassword);
auth_router.get("/verify-email/:token", verifyEmail);
auth_router.post("/reset-password/:token", resetPassword);
auth_router.post(
  "/resend-verification",
  authLimiter,
  blockGuard,
  resendVerification,
);
export default auth_router;

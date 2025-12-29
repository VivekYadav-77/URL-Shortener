import express from "express";
import { authLimiter } from "../middleware/authRateLimiter.js";
import { validate } from "../middleware/validate_middleware.js";
import { loginSchema,registerSchema } from "../config/auth_validator.js";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/auth_controller.js";
const auth_router = express.Router();
auth_router.post("/register", authLimiter,validate(registerSchema), register);
auth_router.post("/login", authLimiter,validate(loginSchema), login);
auth_router.post("/refresh", refresh);
auth_router.post("/logout", logout);
export default auth_router;

import express from "express";
import authMiddleware from "../middleware/auth_middleware.js";
import {
  getMe,
  updateMe,
  changePassword,
} from "../controllers/userProfile_controller.js";
import { validate } from "../middleware/validate_middleware.js";
import {
  updateProfilenname,
  updateProfilepassword,
} from "../config/auth_validator.js";
import { criticalActionGuard } from "../middleware/criticalActionGuard.js";
const user_routers = express.Router();
user_routers.get("/me", authMiddleware, getMe);
user_routers.patch(
  "/me",
  authMiddleware,
  criticalActionGuard,
  validate(updateProfilenname),
  updateMe,
);
user_routers.patch(
  "/me/password",
  authMiddleware,
  criticalActionGuard,
  validate(updateProfilepassword),
  changePassword,
);
export default user_routers;

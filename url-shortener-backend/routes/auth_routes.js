import express from "express";
import { authLimiter } from "../middleware/authRateLimiter.js";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/auth_controller.js";
const auth_router = express.Router();
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
export default auth_router;

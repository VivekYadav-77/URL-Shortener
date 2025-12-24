import express from "express";
import authMiddleware from "../middleware/auth_middleware.js";
import adminMiddleware from "../middleware/admin_middleware.js";

import {
  getAllUrls,
  getAbusedUrls,
  disableUrl,
  getPlatformStats,
} from "../controllers/admin_controller.js";

const admin_router = express.Router();

admin_router.use(authMiddleware, adminMiddleware);

admin_router.get("/urls", getAllUrls);

admin_router.get("/abuse", getAbusedUrls);

admin_router.patch("/disable/:id", disableUrl);

admin_router.get("/stats", getPlatformStats);

export default admin_router;

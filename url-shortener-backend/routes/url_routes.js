import express from "express";
import {
  createShortUrl,
  getMyUrls,
  deleteUrl,
  getUrlById,
  updateUrl,
  getUrlStats

} from "../controllers/url_controller.js";


import authMiddleware from "../middleware/auth_middleware.js";
import { createUrlLimiter } from "../middleware/rateLimit.middleware.js";

const url_router = express.Router();
router.post("/", authMiddleware, createUrlLimiter, createShortUrl);
router.get("/my", authMiddleware, getMyUrls);
router.get("/:id", authMiddleware, getUrlById);
router.patch("/:id", authMiddleware, updateUrl);
router.get("/:id/stats", authMiddleware, getUrlStats);
router.delete("/:id", authMiddleware, deleteUrl);
export default url_router;

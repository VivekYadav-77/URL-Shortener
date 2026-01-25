import express from "express";
import { validate } from "../middleware/validate_middleware.js";
import { createUrlSchema } from "../config/url_validator.js";
import {
  createShortUrl,
  getMyUrls,
  deleteUrl,
  getUrlById,
  updateUrl,
  getUrlStats

} from "../controllers/url_controller.js";


import authMiddleware from "../middleware/auth_middleware.js";
import { createUrlLimiter } from "../middleware/rateLimiting_middleware.js";
import { getUrlHistory } from "../controllers/getUrlHistory_controller.js";
const url_routes = express.Router();
url_routes.post("/", authMiddleware, createUrlLimiter,validate(createUrlSchema),createShortUrl);
url_routes.get("/history",authMiddleware,getUrlHistory)
url_routes.get("/my", authMiddleware, getMyUrls);
url_routes.get("/:id", authMiddleware, getUrlById);
url_routes.patch("/:id", authMiddleware, updateUrl);
url_routes.get("/:id/stats", authMiddleware, getUrlStats);
url_routes.delete("/:id", authMiddleware, deleteUrl);
export default url_routes;

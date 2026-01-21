import express from "express";
import authMiddleware from "../middleware/auth_middleware.js";
import adminMiddleware from "../middleware/admin_middleware.js";
import { getSecurityLogs,getHighRiskLogs,deleteSecurityLogs } from "../controllers/securityLogsController.js";
import {getAdminStats,getAllUrls,disableUrlByAdmin,deleteUrlByAdmin,getAbuseUrls, adminEnableUrl,getAllUsers,getUserUrls, getSingleUserProfile} from "../controllers/admin_controller.js";

const admin_router = express.Router();
admin_router.use(authMiddleware, adminMiddleware);

admin_router.get("/stats", getAdminStats);
admin_router.get("/urls", getAllUrls);
admin_router.patch("/url/:id/disable", disableUrlByAdmin);
admin_router.patch("/url/:id/enable", adminEnableUrl);
admin_router.delete("/url/:id", deleteUrlByAdmin);
admin_router.get("/abuse", getAbuseUrls);
admin_router.get("/users",getAllUsers);
admin_router.get("/users/:id/urls",  getUserUrls);
admin_router.get("/users/:id",getSingleUserProfile)
admin_router.get("/logs",getSecurityLogs)
admin_router.get("/high-risk",getHighRiskLogs)
admin_router.get("/deleteLogs",deleteSecurityLogs)


export default admin_router;

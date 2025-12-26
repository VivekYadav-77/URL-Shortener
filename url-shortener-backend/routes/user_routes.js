import express from "express"
import authMiddleware from "../middleware/auth_middleware.js"
import { getMe,updateMe,changePassword } from "../controllers/userProfile_controller.js"

const user_routers = express()
user_routers.get("/me",authMiddleware,getMe)
user_routers.patch("/me",authMiddleware,updateMe)
user_routers.patch("/me/password",authMiddleware,changePassword)
export default user_routers

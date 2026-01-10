import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import hpp from "hpp";
import errrorHandler from './middleware/error_middleware.js'
import { redirect } from './controllers/redirectUrl_controller.js'
import auth_router from './routes/auth_routes.js'
import url_router from './routes/url_routes.js'
import { redisRateLimit } from './middleware/redisRateLimiting.js'
import { abuseGuard } from './middleware/abuse_middleware.js'
import admin_router from './routes/admin_routes.js'
import user_routers from './routes/user_routes.js'
//import "./crons/cronexpireUrlsJob.js"
//import "./crons/cronRedisStats.js"
const app = express()
app.use(helmet( helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    }
  })))
app.use(hpp());
console.log(process.env.CLIENT_URL)
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes"
})
app.use(limiter)
app.use("/api/auth",auth_router)
app.use("/api/urls",url_router)
app.use("/api/users",user_routers)
app.use('/api/admin',admin_router)
app.get("/:shortCode",abuseGuard,redisRateLimit,redirect)
app.use(errrorHandler)
export default app
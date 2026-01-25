import express from 'express'
import cors from 'cors'
import path from "path"
import { fileURLToPath } from 'url'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import hpp from "hpp";
import errorHandler from './middleware/error_middleware.js'
import { redirect } from './controllers/redirectUrl_controller.js'
import auth_router from './routes/auth_routes.js'
import { trafficAnomalyGuard } from './middleware/trafficAnomalyGuard.js'
import url_router from './routes/url_routes.js'
import { redisRateLimit } from './middleware/redisRateLimiting.js'
import { abuseGuard } from './middleware/abuse_middleware.js'
import admin_router from './routes/admin_routes.js'
import user_routers from './routes/user_routes.js'
//import "./crons/cronexpireUrlsJob.js"
//import "./crons/cronRedisStats.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
app.use(express.static(path.join(__dirname, "public")));
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
app.get("/:shortCode",abuseGuard,redisRateLimit("rl", 50, 60),trafficAnomalyGuard,redirect)
app.use((req, res) => {
  res
    .status(404)
    .sendFile(path.join(__dirname, "./public/error/not-found.html"));
});
app.use(errorHandler)
export default app
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import mongoSanitize from "express-mongo-sanitize";
import xss from 'xss-clean';
import hpp from "hpp";
import errrorHandler from './middleware/error_middleware.js'
import { redirect } from './controllers/redirectUrl_controller.js'
import auth_router from './routes/auth_routes.js'
import url_router from './routes/url_routes.js'
import { redisRateLimit } from './middleware/redisRateLimiting.js'
import { abuseGuard } from './middleware/abuse_middleware.js'
import admin_router from './routes/admin_routes.js'
const app = express()
app.use(helmet())
app.use(mongoSanitize())
app.use(xss());
app.use(hpp());
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
app.use(limiter())
app.use("/api/auth",auth_router)
app.use("/api/url",url_router)
app.use('/api/admin',admin_router)
app.get("/:shortCode",abuseGuard,redisRateLimit,redirect)

app.use(errrorHandler)
export default app
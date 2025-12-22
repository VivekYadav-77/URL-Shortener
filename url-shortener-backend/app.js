import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import mongoSanitize from "express-mongo-sanitize";
import xss from 'xss-clean';
import hpp from "hpp";
import errrorHandler from './middleware/error_middleware.js'
import csrf from "csurf";
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
app.use("/api/auth")
app.use("/api/url")
app.use(errrorHandler)
export default app
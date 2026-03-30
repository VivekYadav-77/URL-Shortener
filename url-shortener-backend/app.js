import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import redis from "./config/redish.js";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import errorHandler from "./middleware/error_middleware.js";
import { redirect } from "./controllers/redirectUrl_controller.js";
import auth_router from "./routes/auth_routes.js";
import url_router from "./routes/url_routes.js";
import { rateLimiter } from "./middleware/redisRateLimiting.js";
import admin_router from "./routes/admin_routes.js";
import user_routers from "./routes/user_routes.js";
import AppError from "./utils/ApiError.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set("trust proxy", 1);
app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
    }),
  );
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

console.log(process.env.CLIENT_URL);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  handler: (req, res, next, options) => {
  next(new AppError("Too many requests. Try again later.", options.statusCode));
  },
});
app.use((req, res, next) => {
  if (req.path === "/keep-alive") return next();
  limiter(req, res, next);
});
app.use(express.json());
app.use(hpp());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", auth_router);
app.use("/api/urls", url_router);
app.use("/api/users", user_routers);
app.use("/api/admin", admin_router);
app.get("/health", async (req, res) => {
  let redisStatus = "down";
  try {
    await redis.ping();
    redisStatus = "up";
    res.status(200).json({
    status: "ok",
    redis: redisStatus,
    service: "running",
    timestamp: new Date().toISOString(),
  });
  } catch (err) {
    res.status(200).send("Redis unavailable");
  }
});
app.get("/keep-alive", async (req, res) => {
  const token = req.headers["x-cron-secret"];

  if (token !== process.env.CRON_SECRET) {
    return res.status(403).send("Forbidden");
  }

  try {
    await redis.incr("keep_alive"); 

    console.log("Redis kept alive at:", new Date().toISOString());

    res.status(200).send("ok");
  } catch (err) {
    console.error("Keep-alive failed:", err);
    res.status(500).send("fail");
  }
});
app.get(
  "/:shortCode",
  rateLimiter,
  redirect,
);

app.use((req, res) => {
  res
    .status(404)
    .sendFile(path.join(__dirname, "./public/error/not-found.html"));
});
app.use(errorHandler);
export default app;

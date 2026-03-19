import ApiError from "../utils/ApiError.js";
import redis from "../config/redish.js";
const memoryMap = new Map();

export const emailRateLimiter = (limit = 3, windowMs = 900000) => {
  return (req, res, next) => {
    const { email } = req.body;

    if (!email) return next();

    const now = Date.now();
    const entry = memoryMap.get(email) || { count: 0, time: now };

    if (now - entry.time > windowMs) {
      entry.count = 1;
      entry.time = now;
    } else {
      entry.count++;
    }

    memoryMap.set(email, entry);

    if (entry.count > limit) {
      return next(new ApiError(429, "Too many requests"));
    }

    redis.incr(`email_limit:${email}`).catch(() => {});

    next();
  };
};
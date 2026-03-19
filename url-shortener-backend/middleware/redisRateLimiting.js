import { safeIncr, safeExpire } from "../utils/safeRedish.js";

export const rateLimiter = async (req, res, next) => {
  const key = `rl:${req.ip}`;

  const count = await safeIncr(key);

  if (count === 1) {
    await safeExpire(key, 60);
  }

  if (count > 100) {
    return res.status(429).json({ message: "Too many requests" });
  }

  next();
};
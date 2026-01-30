import redis from "../config/redish.js";
export const redisRateLimit = (prefix, limit, windowSec) => {
  return async (req, res, next) => {
    try {
      const key = `${prefix}:${req.ip}`;

      const count = await redis.incr(key);

      if (count === 1) {
        await redis.expire(key, windowSec);
      }

      if (count > limit) {
        return res.status(429).json({ message: "Too many requests" });
      }

      next();
    } catch (err) {
      next();
    }
  };
};

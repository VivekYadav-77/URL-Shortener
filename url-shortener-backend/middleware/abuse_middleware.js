import redis from "../config/redish.js";

export const abuseGuard = async (req, res, next) => {
  try {
    const ip = req.ip;
    const key = `abuse:${ip}`;

    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, 600); 
    }

    if (count > 100) {
      return res
        .status(403)
        .json({ message: "Access temporarily blocked due to suspicious activity" });
    }

    next();
  } catch (err) {
    next();
  }
};

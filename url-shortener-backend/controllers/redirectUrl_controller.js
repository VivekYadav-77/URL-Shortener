import UrlCollection from "../models/url_model.js";
import redis from "../config/redish.js";

export const redirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const cacheKey = `url:${shortCode}`;
    const statsKey = `stats:${shortCode}`;

    const cached = await redis.get(cacheKey);
    let url;

    if (cached) {
      url = JSON.parse(cached);

      if (
        !url.isActive ||
        url.status === "deleted" ||
        (url.expiresAt && new Date(url.expiresAt) < new Date())
      ) {
        await redis.del(cacheKey);
        return res.status(410).json({ message: "Link expired or inactive" });
      }
    } else {
      const dbUrl = await UrlCollection.findOne({ shortCode });
      if (
        !dbUrl ||
        !dbUrl.isActive ||
        dbUrl.status === "deleted" ||
        (dbUrl.expiresAt && dbUrl.expiresAt < Date.now())
      ) {
        return res.status(410).json({ message: "Link expired or inactive" });
      }

      url = {
        originalUrl: dbUrl.originalUrl,
        isActive: dbUrl.isActive,
        status: dbUrl.status,
        expiresAt: dbUrl.expiresAt
      };

      await redis.set(cacheKey, JSON.stringify(url), { ex: 300 });
    }

    const abuseKey = `abuse:${shortCode}:${req.ip}`;
    const abuseCount = await redis.incr(abuseKey);
    if (abuseCount === 1) await redis.expire(abuseKey, 600);

    if (abuseCount > 100) {
      await redis.hIncrBy(statsKey, "abuse", 1);
      return res.status(403).json({ message: "Too many requests" });
    }

    await redis.hIncrBy(statsKey, "clicks", 1);

    return res.redirect(url.originalUrl);
  } catch (err) {
    next(err);
  }
};

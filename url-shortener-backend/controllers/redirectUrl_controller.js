import UrlCollection from "../models/url_model.js";
import redis from "../config/redish.js";
import ApiError from "../utils/ApiError.js";

export const redirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const cacheKey = `url:${shortCode}`;
    const statsKey = `stats:${shortCode}`;


    const cached = await redis.get(cacheKey);
    let url;

    if (cached) {
      url = cached; 

      if (
        !url.isActive ||
        url.status === "deleted" ||
        (url.expiresAt && new Date(url.expiresAt) < new Date())
      ) {
        await redis.del(cacheKey);
        return next(new ApiError(410, "Link expired or inactive"));
      }
    } else {
      const dbUrl = await UrlCollection.findOne({ shortCode });

      if (
        !dbUrl ||
        !dbUrl.isActive ||
        dbUrl.status === "deleted" ||
        (dbUrl.expiresAt && dbUrl.expiresAt < Date.now())
      ) {
        return next(new ApiError(410, "Link expired or inactive"));
      }

      url = {
        originalUrl: dbUrl.originalUrl,
        isActive: dbUrl.isActive,
        status: dbUrl.status,
        expiresAt: dbUrl.expiresAt,
      };

      await redis.set(cacheKey, url, { ex: 300 });
    }

    const abuseKey = `abuse:${shortCode}:${req.ip}`;
    const abuseCount = await redis.incr(abuseKey);
    if (abuseCount === 1) await redis.expire(abuseKey, 600);

    if (abuseCount > 100) {
      const abuse = Number(await redis.hget(statsKey, "abuse")) || 0;
      await redis.hset(statsKey, { abuse: abuse + 1 });

      return next(new ApiError(403, "Too many requests"));
    }

    const clicks = Number(await redis.hget(statsKey, "clicks")) || 0;
    await redis.hset(statsKey, { clicks: clicks + 1 });

    return res.redirect(url.originalUrl);

  } catch (err) {
    next(err);
  }
};

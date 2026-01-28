import UrlCollection from "../models/url_model.js";
import redis from "../config/redish.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendInvalidLinkPage = (res) => {
  return res
    .status(410)
    .sendFile(path.join(__dirname, "../public/error/link-invalid.html"));
};

export const redirect = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const cacheKey = `url:${shortCode}`;
    const statsKey = `stats:${shortCode}`;

    const cached = await redis.get(cacheKey);
    let url;

    if (cached) {
      // FIX: Upstash often returns the object directly if it's already parsed
      // Only parse if it is a string
      url = typeof cached === "string" ? JSON.parse(cached) : cached;

      if (
        !url.isActive ||
        url.status === "deleted" ||
        (url.expiresAt && new Date(url.expiresAt) < new Date())
      ) {
        await redis.del(cacheKey);
        return sendInvalidLinkPage(res);
      }
    } else {
      const dbUrl = await UrlCollection.findOne({ shortCode });

      if (
        !dbUrl ||
        !dbUrl.isActive ||
        dbUrl.status === "deleted" ||
        (dbUrl.expiresAt && dbUrl.expiresAt < Date.now())
      ) {
        return sendInvalidLinkPage(res);
      }

      url = {
        originalUrl: dbUrl.originalUrl,
        isActive: dbUrl.isActive,
        status: dbUrl.status,
        expiresAt: dbUrl.expiresAt,
      };

      // Ensure we store it as a stringified JSON for consistency
      await redis.set(cacheKey, JSON.stringify(url), { ex: 300 });
    }

    // ABUSE PROTECTION & STATS
    const abuseKey = `abuse:${shortCode}:${req.ip}`;
    const abuseCount = await redis.incr(abuseKey);
    if (abuseCount === 1) await redis.expire(abuseKey, 600);

    if (abuseCount > 100) {
      await redis.hincrby(statsKey, "abuse", 1);
      return sendInvalidLinkPage(res);
    }

    await redis.hincrby(statsKey, "clicks", 1);

    // Final Redirect
    return res.redirect(url.originalUrl);
  } catch (err) {
    console.error("Redirect Error:", err);
    return sendInvalidLinkPage(res);
  }
};

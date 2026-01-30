/*import UrlCollection from "../models/url_model.js";
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
};*/
import { waitUntil } from "@vercel/functions";
import UrlCollection from "../models/url_model.js";
import redis from "../config/redish.js";
import path from "path";
import { fileURLToPath } from "url";
import { flushRedisStats } from "../jobs/flushRedisStats.js";
import { expireUrlsJob } from "../jobs/expireUrlsJob.js";
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

    // 1. ATTEMPT CACHE RETRIEVAL
    const cached = await redis.get(cacheKey);
    let url;

    if (cached) {
      url = typeof cached === "string" ? JSON.parse(cached) : cached;
      if (!url.isActive || url.status === "deleted" || (url.expiresAt && new Date(url.expiresAt) < new Date())) {
        await redis.del(cacheKey);
        return sendInvalidLinkPage(res);
      }
    } else {
      // 2. DB FALLBACK
      const dbUrl = await UrlCollection.findOne({ shortCode });
      if (!dbUrl || !dbUrl.isActive || dbUrl.status === "deleted" || (dbUrl.expiresAt && dbUrl.expiresAt < Date.now())) {
        return sendInvalidLinkPage(res);
      }
      url = { originalUrl: dbUrl.originalUrl, isActive: dbUrl.isActive, status: dbUrl.status, expiresAt: dbUrl.expiresAt };
      await redis.set(cacheKey, JSON.stringify(url), { ex: 300 });
    }

    // 3. SEND RESPONSE IMMEDIATELY (Non-blocking)
    res.redirect(url.originalUrl);

    // 4. BACKGROUND TASKS (Using waitUntil)
    waitUntil((async () => {
      try {
        // Analytics & Abuse Logic
        const abuseKey = `abuse:${shortCode}:${req.ip}`;
        const abuseCount = await redis.incr(abuseKey);
        if (abuseCount === 1) await redis.expire(abuseKey, 600);
        
        if (abuseCount > 100) {
          await redis.hincrby(statsKey, "abuse", 1);
        } else {
          await redis.hincrby(statsKey, "clicks", 1);
        }

        // COOLDOWN CRON LOGIC
        const COOLDOWN_KEY = "internal:cron:cooldown";
        const hasRecentlyRun = await redis.get(COOLDOWN_KEY);

        if (!hasRecentlyRun) {
          console.log("[Background Job] Starting Sync & Cleanup...");
          // Run your heavy jobs
          await Promise.allSettled([
            flushRedisStats(),
            expireUrlsJob()
          ]);
          // Set 15-minute cooldown (900 seconds)
          await redis.set(COOLDOWN_KEY, "true", { ex: 900 });
        }
      } catch (bgErr) {
        console.error("Background Task Error:", bgErr);
      }
    })());

  } catch (err) {
    console.error("Redirect Error:", err);
    if (!res.headersSent) return sendInvalidLinkPage(res);
  }
};

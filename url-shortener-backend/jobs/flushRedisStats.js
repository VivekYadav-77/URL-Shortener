import redis from "../config/redish.js";
import UrlCollection from "../models/url_model.js";

export const flushRedisStats = async () => {
  try {
    const keys = await redis.keys("stats:*");

    for (const key of keys) {
      const shortCode = key.split(":")[1];
      const stats = await redis.hGetAll(key);

      const clicks = parseInt(stats.clicks || 0);
      const abuse = parseInt(stats.abuse || 0);

      if (clicks > 0 || abuse > 0) {
        await UrlCollection.updateOne(
          { shortCode },
          {
            $inc: {
              clicks,
              abuseScore: abuse
            },
            ...(abuse > 0 && { lastAbuseAt: new Date() })
          }
        );
      }

      await redis.del(key);
    }

    console.log(" Redis stats flushed");
  } catch (err) {
    console.error(" Flush job failed", err);
  }
};

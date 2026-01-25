import redis from "../config/redish.js";
import UrlCollection from "../models/url_model.js";

export const flushRedisStats = async () => {
  try {
    let cursor = 0;

    do {
      const [nextCursor, keys] = await redis.scan(cursor, {
        match: "stats:*",
        count: 100,
      });

      cursor = nextCursor;
      if (keys.length === 0) continue;

      const pipeline = redis.pipeline();

      for (const key of keys) {
        const shortCode = key.split(":")[1];

        const stats = await redis.hgetall(key);
        
        const clicks = parseInt(stats?.clicks || 0);
        const abuse = parseInt(stats?.abuse || 0);

        if (clicks > 0 || abuse > 0) {
          await UrlCollection.updateOne(
            { shortCode },
            {
              $inc: { clicks, abuseScore: abuse },
              ...(abuse > 0 && { lastAbuseAt: new Date() }),
            }
          );
        }

        pipeline.del(key);
      }

      await pipeline.exec();

    } while (cursor !== "0" && cursor !== 0);

    console.log("Redis stats flushed efficiently");
  } catch (err) {
    console.error("Flush job failed", err);
  }
};
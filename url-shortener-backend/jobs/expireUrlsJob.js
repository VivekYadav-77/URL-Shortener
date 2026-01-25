import redis from "../config/redish.js";
import UrlCollection from "../models/url_model.js";

export const expireUrlsJob = async () => {
  try {
    const now = new Date();

    const expiredUrls = await UrlCollection.find({
      isActive: true,
      expiresAt: { $ne: null, $lt: now }
    });

    if (expiredUrls.length === 0) {
      console.log("[Cron] No expired URLs found.");
      return;
    }

    const pipeline = redis.pipeline();
    expiredUrls.forEach(url => {
      pipeline.del(`url:${url.shortCode}`);
    });
    await pipeline.exec();

    const result = await UrlCollection.updateMany(
      { _id: { $in: expiredUrls.map(u => u._id) } },
      {
        $set: {
          isActive: false,
          status: "expired"
        }
      }
    );

    console.log(`[Cron Success] Expired ${result.modifiedCount} URLs and cleared cache.`);
  } catch (error) {
    console.error("[Cron Error] Failed to run expireUrlsJob:", error.message);
  }
};
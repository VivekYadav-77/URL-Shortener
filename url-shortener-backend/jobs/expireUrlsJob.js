import redis from "../config/redish.js";
import UrlCollection from "../models/url_model.js";
export const expireUrlsJob = async () => {
  const now = new Date();

  const expiredUrls = await UrlCollection.find({
    isActive: true,
    expiresAt: { $ne: null, $lt: now }
  });

  if (!expiredUrls.length) return;

  await UrlCollection.updateMany(
    { _id: { $in: expiredUrls.map(u => u._id) } },
    {
      $set: {
        isActive: false,
        status: "expired"
      }
    }
  );

  for (const url of expiredUrls) {
    await redis.del(`url:${url.shortCode}`);
  }

  console.log(`Expired ${expiredUrls.length} URLs and cleared cache`);
};
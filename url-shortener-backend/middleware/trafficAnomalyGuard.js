import redis from "../config/redish.js";
import UrlCollection from "../models/url_model.js";

export const trafficAnomalyGuard = async (req, res, next) => {
  try {
    const ip = req.ip;
    const userAgent = (req.headers["user-agent"] || "").toLowerCase();
    const { shortCode } = req.params;

    const botAgents = ["curl", "python", "wget", "bot", "scraper"];
    if (botAgents.some(agent => userAgent.includes(agent))) {
      await markAbuse(shortCode, 5);
    }

    const burstKey = `burst:${shortCode}:${ip}`;
    const burstCount = await redis.incr(burstKey);
    redis.expire(burstKey, 10); 

    if (burstCount > 8) {
      await markAbuse(shortCode, 10);
    }

    const globalKey = `spike:${shortCode}`;
    const globalCount = await redis.incr(globalKey);
    redis.expire(globalKey, 60); 

    if (globalCount > 200) {
      await markAbuse(shortCode, 20);
    }

    const urlDoc = await UrlCollection.findOne({ shortCode }).select("abuseScore status isActive");

    if (!urlDoc) return next();

    if (urlDoc.abuseScore > 100 && urlDoc.isActive === true) {
      urlDoc.isActive = false;
      urlDoc.status = "inactive";
      urlDoc.disabledByRole = "system";
      urlDoc.disabledAt = new Date();
      await urlDoc.save();
    }

    next();
  } catch (err) {
    next();
  }
};


async function markAbuse(shortCode, amount) {
  await UrlCollection.findOneAndUpdate(
    { shortCode },
    { 
      $inc: { abuseScore: amount }, 
      $set: { lastAbuseAt: new Date() } 
    }
  );
}
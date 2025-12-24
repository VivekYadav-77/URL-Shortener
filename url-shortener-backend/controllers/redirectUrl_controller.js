import UrlCollection from "../models/url_model.js";
import redis from "../config/redish.js";
export const redirect = async (req, res,next) => {
  try {
    
    const { shortCode } = req.params;
  const cached = await redis.get(`url:${shortCode}`)
   if (cached) {
      return res.redirect(cached)
    }
    const url = await UrlCollection.findOne({ shortCode, isActive: true });
  
    if (!url) {
      return res.status(404).json({ message: "Invalid link" });
    }
  
    if (url.expiresAt && url.expiresAt < Date.now()) {
      return res.status(410).json({ message: "Link expired" });
    }
    const abuseKey = `abuse:${shortCode}:${req.ip}`;
    const count = await redis.incr(abuseKey);

    if (count === 1) {
      await redis.expire(abuseKey, 600); 
    }

    if (count > 100) {
      url.abuseScore += 1;
      url.lastAbuseAt = new Date();
      await url.save();

      return res.status(403).json({
        message: "Access temporarily blocked"
      });
    }
  const clickKey = `click:${shortCode}:${req.ip}`;
      const clicked = await redis.get(clickKey);
  
      if (!clicked) {
        await redis.set(clickKey, "1", { ex: 3600 }); // 1 hour
        url.clicks += 1;
        await url.save();
      }
    await redis.set(`url:${shortCode}`, url.originalUrl, { ex: 3600 });
  
    return res.redirect(url.originalUrl);
  } catch (error) {
    next(error)
  }
};

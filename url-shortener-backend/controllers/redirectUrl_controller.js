import UrlCollection from "../models/url_model.js";
import redis from "../config/redish.js";

export const redirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const cacheKey = `url:${shortCode}`;

    const cached = await redis.get(cacheKey);

    if (cached) {
      const data = JSON.parse(cached);

     
      if (
        !data.isActive ||
        data.status === "deleted" ||
        (data.expiresAt && new Date(data.expiresAt) < new Date())
      ) {
        await redis.del(cacheKey);
        return res.status(410).json({ message: "Link expired or inactive" });
      }

      return res.redirect(data.originalUrl);
    }

    const url = await UrlCollection.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ message: "Invalid link" });
    }

    if (
      !url.isActive ||
      url.status === "deleted" ||
      (url.expiresAt && url.expiresAt < new Date())
    ) {
      return res.status(410).json({ message: "Link expired or inactive" });
    }

    url.clicks += 1;
    await url.save();

    await redis.set(
      cacheKey,
      JSON.stringify({
        originalUrl: url.originalUrl,
        isActive: url.isActive,
        status: url.status,
        expiresAt: url.expiresAt
      }),
      { ex: 300 }
    );

    return res.redirect(url.originalUrl);

  } catch (err) {
    next(err);
  }
};

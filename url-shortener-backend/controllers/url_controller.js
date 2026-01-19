import ApiError from "../utils/ApiError.js";
import UrlCollection from "../models/url_model.js";
import { validateUrl } from "../utils/validateUrls.js";
import { validateAlias } from "../utils/validateAlias.js";
import { generateShortCode } from "../utils/generateShortCode.js";
import { isUrlSafe } from "../utils/googlesafecheck.js";
import redis from "../config/redish.js";
export const createShortUrl = async (req, res) => {
  const { originalUrl, customAlias, expiresAt } = req.body;
  if (!originalUrl || !validateUrl(originalUrl)) {
    return next(new ApiError(400, "Invalid URL"));
  }
  const safe = await isUrlSafe(originalUrl);
  if (!safe) {
   return next(new ApiError(400, "Malicious URL detected"));
  }

  let shortCode;
  let isCustom = false;
  if (customAlias) {
    const alias = customAlias.trim().toLowerCase();
    if (!validateAlias(customAlias)) {
      return next(new ApiError(400, "Invalid alias"));
    }

    const exists = await UrlCollection.exists({ shortCode: customAlias });
    if (exists) {
     return next(new ApiError(409, "Alias already taken"));
    }

    shortCode = alias;
    isCustom = true;
  } else {
    do {
      shortCode = generateShortCode();
    } while (await UrlCollection.exists({ shortCode }));
  }
  const now = Date.now();
  const MAX_EXPIRY = 7 * 24 * 60 * 60 * 1000;
  const DEFAULT_EXPIRY = 5 * 24 * 60 * 60 * 1000;
  let expiresAtFinal;
  if (expiresAt) {
    const requested = new Date(expiresAt).getTime();
    if (isNaN(requested) || requested <= now) {
      return next(new ApiError(400, "Expiry must be within 7 days"))
    }
    if (requested - now > MAX_EXPIRY) {
      return next(new ApiError(400, "Expiry must be within 7 days"))
    }
    expiresAtFinal = new Date(requested);
  } else {
    expiresAtFinal = new Date(now + DEFAULT_EXPIRY);
  }

  await UrlCollection.create({
    originalUrl,
    shortCode,
    owner: req.userId,
    expiresAt: expiresAtFinal,
    isCustom,
  });

  res.status(201).json({
    shortUrl: `${process.env.CLIENT_URL}/${shortCode}`,
  });
};
export const getMyUrls = async (req, res, next) => {
  try {
    const urls = await UrlCollection.find({
      owner: req.userId,
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.status(200).json(urls);
  } catch (err) {
    next(err);
  }
};

export const deleteUrl = async (req, res, next) => {
  try {
    const { id } = req.params;

    const url = await UrlCollection.findOne({
      _id: id,
      owner: req.userId,
    });

    if (!url) {
      return next(new ApiError(404, "URL not found or not authorized"));
    }

    url.isActive = false;
    url.status = "deleted";
    url.deletedBy = req.userId;
    url.deletedByRole = "user";
    url.deletedAt = new Date();
    url.expiresAt = new Date();

    await url.save();
    await redis.del(`url:${url.shortCode}`);
    res.json({ message: "URL deleted and expired successfully" });
  } catch (err) {
    next(err);
  }
};

export const getUrlStats = async (req, res, next) => {
  try {
    const url = await UrlCollection.findOne({
      _id: req.params.id,
      owner: req.userId,
    }).select("clicks createdAt expiresAt isActive");

    if (!url) {
      return next(new ApiError(404, "URL not found"));
    }

    res.status(200).json(url);
  } catch (err) {
    next(err);
  }
};
export const updateUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const url = await UrlCollection.findOne({
      _id: id,
      owner: req.userId,
    });

    if (!url) {
     return next(new ApiError(404, "URL not found"));
    }
    if (url.disabledByRole === "admin") {
     return next(new ApiError(403, "Action forbidden: This URL was disabled by an administrator."));
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      url.isActive = false;
      url.status = "expired";
      url.disabledBy = req.userId;
      url.disabledByRole = "user";
      await url.save();
     return next(new ApiError(400, "This URL is expired and cannot be enabled again"));
    }

    url.isActive = Boolean(isActive);
    url.status = isActive ? "active" : "inactive";
    url.disabledBy = isActive ? null : req.userId;
    url.disabledByRole = isActive ? null : "user";
    url.disabledAt = isActive ? null : new Date();
    await url.save();
    await redis.del(`url:${url.shortCode}`);
    res.status(200).json(url);
  } catch (err) {
    next(err);
  }
};

export const getUrlById = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid URL ID"));
  }
  try {
    const url = await UrlCollection.findOne({
      _id: id,
      owner: req.userId,
    });

    if (!url) {
     return next(new ApiError(404, "URL not found"));
    }

    res.json(url);
  } catch (err) {
    next(err);
  }
};

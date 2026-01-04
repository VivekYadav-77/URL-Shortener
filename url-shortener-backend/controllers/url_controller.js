import UrlCollection from "../models/url_model.js";
import { validateUrl } from "../utils/validateUrls.js";
import { validateAlias } from "../utils/validateAlias.js";
import { generateShortCode } from "../utils/generateShortCode.js";
import { isUrlSafe } from "../utils/googlesafecheck.js";
export const createShortUrl = async (req, res) => {
  const { originalUrl, customAlias, expiresAt } = req.body;
  if (!originalUrl || !validateUrl(originalUrl)) {
    return res.status(400).json({ message: "Invalid URL" });
  }
  const safe = await isUrlSafe(originalUrl);
  if (!safe) {
    return res.status(400).json({ message: "Malicious URL detected" });
  }

  let shortCode;
  let isCustom = false;
  if (customAlias) {
    const alias = customAlias.trim().toLowerCase();
    if (!validateAlias(customAlias)) {
      return res.status(400).json({ message: "Invalid alias" });
    }

    const exists = await UrlCollection.exists({ shortCode: customAlias });
    if (exists) {
      return res.status(409).json({ message: "Alias already taken" });
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
    if (isNaN(requested) || requested - now > MAX_EXPIRY) {
      return res.status(400).json({
        message: "Expiry must be within 7 days",
      });
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

    const url = await UrlCollection.findOneAndUpdate(
      {
        $set: {
          isActive: false,
          status: "deleted",
          deletedAt: new Date(),
          expiresAt: new Date(),
        },
      },
      {
        new: true,
      }
    );

    if (!url) {
      return res
        .status(404)
        .json({ message: "URL not found or not authorized" });
    }

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
      return res.status(404).json({ message: "URL not found" });
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
      owner: req.userId
    });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      url.isActive = false;
      url.status = "expired";
      await url.save();

      return res.status(400).json({
        message: "This URL is expired and cannot be enabled again"
      });
    }

    url.isActive = Boolean(isActive);
    url.status = isActive ? "active" : "inactive";

    await url.save();

    res.status(200).json(url);
  } catch (err) {
    next(err);
  }
};

export const getUrlById = async (req, res, next) => {
  try {
    const url = await UrlCollection.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    res.json(url);
  } catch (err) {
    next(err);
  }
};

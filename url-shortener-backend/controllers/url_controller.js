import UrlCollection from "../models/url_model.js";
import { validateUrl } from "../utils/validateUrls.js";
import { validateAlias } from "../utils/validateAlias.js";
import { generateShortCode } from "../utils/generateShortCode.js";
import { isUrlSafe } from "../utils/googlesafecheck.js";
export const createShortUrl =async(req,res)=>{
    const {originalUrl, customAlias, expiresAt} = req.body
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
    if (!validateAlias(customAlias)) {
      return res.status(400).json({ message: "Invalid alias" });
    }

    const exists = await UrlCollection.exists({ shortCode: customAlias });
    if (exists) {
      return res.status(409).json({ message: "Alias already taken" });
    }

    shortCode = customAlias;
    isCustom = true;
  } else {
    let exists = true;
    while (exists) {
      shortCode = generateShortCode();
      exists = await UrlCollection.exists({ shortCode });
    }
  }
  await UrlCollection.create({
    originalUrl,
    shortCode,
    owner: req.userId,
    expiresAt: expiresAt || null,
    isCustom
  });

  res.status(201).json({
    shortUrl: `${process.env.BASE_URL}/${shortCode}`
  });
}
export const getMyUrls = async (req, res, next) => {
  try {
    const urls = await UrlCollection.find({
      owner: req.userId,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.status(200).json(urls)
  } catch (err) {
    next(err);
  }
};

export const deleteUrl = async (req, res, next) => {
  try {
    const { id } = req.params;

    const url = await UrlCollection.findOneAndUpdate(
      {
        _id: id,
        owner: req.userId
      },
      {
        isActive: false
      },
      {
        new: true
      }
    );

    if (!url) {
      return res.status(404).json({ message: "URL not found or not authorized" });
    }

    res.json({ message: "URL disabled successfully" });
  } catch (err) {
    next(err);
  }
};

export const getUrlStats = async (req, res, next) => {
  try {
    const url = await UrlCollection.findOne({
      _id: req.params.id,
      owner: req.userId
    }).select("clicks createdAt expiresAt isActive");

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    res.json(url);
  } catch (err) {
    next(err);
  }
};
export const updateUrl = async (req, res, next) => {
  try {
    const allowed = ["expiresAt", "isActive"];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const url = await UrlCollection.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      updates,
      { new: true }
    );

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    res.json(url);
  } catch (err) {
    next(err);
  }
};
export const getUrlById = async (req, res, next) => {
  try {
    const url = await UrlCollection.findOne({
      _id: req.params.id,
      owner: req.userId
    });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    res.json(url);
  } catch (err) {
    next(err);
  }
};
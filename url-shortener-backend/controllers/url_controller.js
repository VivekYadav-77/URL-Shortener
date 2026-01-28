import ApiError from "../utils/ApiError.js";
import UrlCollection from "../models/url_model.js";
import { validateUrl } from "../utils/validateUrls.js";
import { validateAlias } from "../utils/validateAlias.js";
import { generateShortCode } from "../utils/generateShortCode.js";
import { checkUrlSecurity } from "../utils/secureScanner.js";
import { analyzeUrlRisk } from "../utils/urlRiskAnalyzer.js";
import SecurityLog from "../models/securityLog_model.js";
import { getSecurityMetadata } from "../utils/securityHelper.js";
import redis from "../config/redish.js";
export const createShortUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;

    // 1. Initial Validation
    if (!originalUrl || !validateUrl(originalUrl)) {
      return next(new ApiError(400, "Invalid URL"));
    }

    // 2. Expiry Calculation
    const now = Date.now();
    const MAX_EXPIRY = 7 * 24 * 60 * 60 * 1000;
    const DEFAULT_EXPIRY = 5 * 24 * 60 * 60 * 1000;
    let expiresAtFinal;

    if (expiresAt) {
      const requested = new Date(expiresAt).getTime();
      if (isNaN(requested) || requested <= now)
        return next(new ApiError(400, "Expiry must be in the future"));
      if (requested - now > MAX_EXPIRY)
        return next(new ApiError(400, "Expiry cannot exceed 7 days"));
      expiresAtFinal = new Date(requested);
    } else {
      expiresAtFinal = new Date(now + DEFAULT_EXPIRY);
    }

    // 3. Prepare shortCode (Custom or Generated)
    let shortCode;
    let isCustom = false;

    if (customAlias) {
      shortCode = customAlias.trim().toLowerCase();
      if (!validateAlias(shortCode)) return next(new ApiError(400, "Invalid alias format."));
      
      const exists = await UrlCollection.exists({ shortCode });
      if (exists) return next(new ApiError(409, "Alias already taken"));
      isCustom = true;
    } else {
      // Pre-check loop to avoid collisions before creation
      do {
        shortCode = generateShortCode();
      } while (await UrlCollection.exists({ shortCode }));
    }

    // 4. Security & Admin Blocks
    // We run these together to avoid multiple individual queries
    const [adminBlocked, securityLogged] = await Promise.all([
      UrlCollection.exists({
        originalUrl,
        $or: [{ deletedByRole: "admin" }, { disabledByRole: "admin" }],
      }),
      SecurityLog.exists({
        originalUrl,
        type: { $in: ["high_risk_blocked", "critical_blocked"] },
      })
    ]);

    if (adminBlocked) return next(new ApiError(403, "URL blocked by admin."));
    if (securityLogged) return next(new ApiError(400, "URL previously flagged as harmful."));

    // 5. Risk Analysis & Logging
    const riskScore = analyzeUrlRisk(originalUrl);
    if (riskScore >= 60) {
      await SecurityLog.create({
        type: riskScore >= 100 ? "critical_blocked" : "high_risk_blocked",
        originalUrl,
        shortCode,
        user: req.userId,
        metadata: getSecurityMetadata(req, { riskScore })
      });
      return next(new ApiError(400, "URL blocked due to high risk."));
    }

    // 6. Security Scanning (Check Cache First)
    const twoWeekMs = 14 * 24 * 60 * 60 * 1000;
    // We look for any existing document for this URL to see its scan history
    const existingDoc = await UrlCollection.findOne({ originalUrl }).select("scanCache");
    
    let scanResult;
    const cache = existingDoc?.scanCache;

    if (cache?.safe !== null && cache?.checkedAt && (now - new Date(cache.checkedAt).getTime() < twoWeekMs)) {
      scanResult = { safe: cache.safe, source: cache.source, fromCache: true };
    } else {
      // Actual API call only if needed
      scanResult = await checkUrlSecurity(originalUrl);

      if (scanResult.rateLimited) return next(new ApiError(503, "Security service busy."));
      if (!scanResult.safe){await SecurityLog.create({
          type: "unsafe_scan_blocked",
          originalUrl,
          shortCode,
          user: req.userId,
          metadata: getSecurityMetadata(req, { 
            safe: false, 
            scannerUsed: scanResult.source 
          }),
        });
        return next(new ApiError(400, "Unsafe URL detected."));
      }

      // Optional: Log the new successful scan
      await SecurityLog.create({
        type: "scan_success",
        originalUrl,
        shortCode,
        user: req.userId,
        metadata: getSecurityMetadata(req, { 
          safe: true, 
          scannerUsed: scanResult.source,
          ip: req.ip 
        }),
      });
    }

    // 7. SINGLE ATOMIC SAVE
    // This creates the document with ALL data at once. No "null" shortCodes.
    const newUrl = await UrlCollection.create({
      originalUrl,
      shortCode,
      owner: req.userId,
      expiresAt: expiresAtFinal,
      isCustom,
      scanCache: {
        safe: scanResult.safe,
        checkedAt: new Date(),
        source: scanResult.source ?? "safe_browsing",
      },
      ...(riskScore >= 30 ? { abuseScore: 1, lastAbuseAt: new Date() } : {}),
    });

    return res.status(201).json({
      shortUrl: `${process.env.CLIENT_URL}/${newUrl.shortCode}`,
    });

  } catch (err) {
    if (err.code === 11000) return next(new ApiError(409, "Collision detected, please try again."));
    next(err);
  }
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
    }).select("clicks createdAt expiresAt isActive disabledAt disabledByRole deletedAt deletedByRole abuseScore shortCode");

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
      return next(
        new ApiError(
          403,
          "Action forbidden: This URL was disabled by an administrator.",
        ),
      );
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      url.isActive = false;
      url.status = "expired";
      url.disabledBy = req.userId;
      url.disabledByRole = "user";
      await url.save();
      return next(
        new ApiError(400, "This URL is expired and cannot be enabled again"),
      );
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

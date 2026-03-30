import { safeGet, safeSet } from "../utils/safeRedish.js";
import UrlCollection from "../models/url_model.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import path from "path";
const sendInvalidLinkPage = (res) => {
  return res
    .status(410)
    .sendFile(path.join(__dirname, "../public/error/link-invalid.html"));
};
export const redirect = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const cacheKey = `url:${shortCode}`;

    // 1. Try cache
    const cached = await safeGet(cacheKey);

    if (cached) {
const url = cached;      
      if (
        !url.isActive ||
        url.status === "deleted" ||
        (url.expiresAt && new Date(url.expiresAt) < new Date())
      ) {
        return sendInvalidLinkPage(res);
      }

      res.redirect(url.originalUrl);

      // async click update
      UrlCollection.updateOne(
        { shortCode },
        { $inc: { clicks: 1 } }
      ).catch(() => {});

      return;
    }

    // 2. DB fallback
    const dbUrl = await UrlCollection.findOne({ shortCode }).lean();

    if (
      !dbUrl ||
      !dbUrl.isActive ||
      dbUrl.status === "deleted" ||
      (dbUrl.expiresAt && dbUrl.expiresAt < Date.now())
    ) {
      return sendInvalidLinkPage(res);
    }

    // 3. Cache (non-blocking)
    safeSet(
  cacheKey,
  {
    originalUrl: dbUrl.originalUrl,
    isActive: dbUrl.isActive,
    status: dbUrl.status,
    expiresAt: dbUrl.expiresAt,
  },
  { ex: 86400 }
);

    // 4. Redirect
    res.redirect(dbUrl.originalUrl);

    // 5. Async click update
    UrlCollection.updateOne(
      { shortCode },
      { $inc: { clicks: 1 } }
    ).catch(() => {});

  } catch (err) {
    console.error("Redirect Error:", err);
    return sendInvalidLinkPage(res);
  }
};
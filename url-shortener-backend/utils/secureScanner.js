import UrlCollection from "../models/user_model.js";
import { isUrlSafe } from "../security/googlesafecheck.js";
import { scanWithVirusTotal } from "../security/virusTotalScan.js";

export const checkUrlSecurity = async (originalUrl) => {
  const existing = await UrlCollection.findOne({
    originalUrl,
    "scanCache.safe": { $ne: null },
  }).select("scanCache");

  if (existing) {
    const diff = Date.now() - new Date(existing.scanCache.checkedAt).getTime();
    const MONTH = 30 * 24 * 60 * 60 * 1000;

    if (diff < MONTH) {
      return {
        safe: existing.scanCache.safe,
        source: "cache",
        rateLimited: false,
      };
    }
  }

  const safeRes = await isUrlSafe(originalUrl);

  if (safeRes.rateLimited) {
    return { safe: false, rateLimited: true, source: "safe_browsing" };
  }

  if (!safeRes.safe) {
    return { safe: false, rateLimited: false, source: "safe_browsing" };
  }

  const vtRes = await scanWithVirusTotal(originalUrl);

  if (vtRes.rateLimited) {
    return { safe: false, rateLimited: true, source: "virustotal" };
  }

  await UrlCollection.updateMany(
    { originalUrl },
    {
      scanCache: {
        safe: vtRes.safe,
        checkedAt: new Date(),
        source: "virustotal",
      },
    },
  );

  return { safe: vtRes.safe, rateLimited: false, source: "virustotal" };
};

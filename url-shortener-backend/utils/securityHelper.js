// utils/securityHelper.js
import geoip from 'geoip-lite';

export const getSecurityMetadata = (req, extra = {}) => {
  // 1. Extract IP (req.ip works because we set 'trust proxy' in app.js)
  let ip = req.ip || req.connection.remoteAddress || "0.0.0.0";

  // 2. Normalize Localhost and IPv6-mapped addresses
  if (ip === "::1") ip = "127.0.0.1";
  if (ip.includes("::ffff:")) ip = ip.split("::ffff:")[1];

  // 3. Geolocation Lookup
  const geo = geoip.lookup(ip);

  return {
    ip,
    city: geo ? geo.city : "Unknown",
    country: geo ? geo.country : "Unknown",
    coordinates: geo ? geo.ll : [0, 0],
    userAgent: req.get('User-Agent'),
    ...extra // Merge any additional data like riskScore or scannerUsed
  };
};
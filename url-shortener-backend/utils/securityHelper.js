import geoip from "geoip-lite";
import { getClientIp } from "./getClientIp.js";

export const getSecurityMetadata = (req, extra = {}) => {
  const ip = getClientIp(req);

  const isPrivate =
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.");

  const geo = !isPrivate ? geoip.lookup(ip) : null;

  const userAgent = req.get("User-Agent");

  return {
    ip,
    city: geo?.city || "Unknown",
    country: geo?.country || "Unknown",
    coordinates: geo?.ll || [0, 0],
    userAgent,
    isPrivateIP: isPrivate,

    deviceType: /mobile/i.test(userAgent) ? "mobile" : "desktop",

    ...extra,
  };
};
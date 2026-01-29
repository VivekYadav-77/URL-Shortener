import geoip from "geoip-lite";

export const getSecurityMetadata = (req, extra = {}) => {
  let ip = req.ip || req.connection.remoteAddress || "0.0.0.0";

  if (ip === "::1") ip = "127.0.0.1";
  if (ip.includes("::ffff:")) ip = ip.split("::ffff:")[1];

  const geo = geoip.lookup(ip);

  return {
    ip,
    city: geo ? geo.city : "Unknown",
    country: geo ? geo.country : "Unknown",
    coordinates: geo ? geo.ll : [0, 0],
    userAgent: req.get("User-Agent"),
    ...extra,
  };
};

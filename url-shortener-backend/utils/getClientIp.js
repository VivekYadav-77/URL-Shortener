export const getClientIp = (req) => {
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    req.ip ||
    "0.0.0.0";

  if (ip === "::1") ip = "127.0.0.1";
  if (ip.includes("::ffff:")) ip = ip.split("::ffff:")[1];

  return ip;
};
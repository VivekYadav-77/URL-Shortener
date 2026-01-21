import SecurityLog from "../models/securityLog_model.js";

export const logSecurityEvent = async ({
  type,
  originalUrl,
  shortCode = null,
  user = null,
  metadata = {},
}) => {
  try {
    await SecurityLog.create({
      type,
      originalUrl,
      shortCode,
      user,
      metadata,
    });
  } catch (err) {
    console.error("Security log error:", err.message);
  }
};

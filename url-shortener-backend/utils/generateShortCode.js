import crypto from "crypto";

export const generateShortCode = () => {
  return crypto.randomBytes(5).toString("base64url");
};

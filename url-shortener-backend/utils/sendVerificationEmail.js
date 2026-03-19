import axios from "axios";
import crypto from "crypto";
import redis from "../config/redish.js";


export const sendAuthEmail = async (user, type) => {
  
  try {
    const key = `email_send:${user._id}`;

    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, 300); // 5 min window
    }

    if (count > 2) {
      throw new Error("Too many emails sent. Try later.");
    }
  } catch (err) {
    console.error("Redis fail, skipping email throttle:", err.message);
    // fail-open → do NOT block user if Redis is down
  }


  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expiry = Date.now() + 60 * 60 * 1000; // 1 hour

  if (type === "VERIFY") {
    user.verificationToken = hashedToken;
    user.verificationTokenExpires = expiry;
  } else if (type === "RESET") {
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expiry;
  }

  await user.save({ validateBeforeSave: false });

 
  const path = type === "VERIFY" ? "verify-email" : "reset-password";

  const url = `${process.env.CLIENT_URL}/${path}/${rawToken}`;

  const subject =
    type === "VERIFY"
      ? "Verify Your Identity"
      : "Reset Your Password";

  const body = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 15px; max-width: 500px;">
      <h2 style="color: #2563eb;">Shortly Protocol</h2>
      <p style="color: #444;">A ${type.toLowerCase()} request has been initiated. This link is valid for 60 minutes.</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="${url}" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          ${type === 'VERIFY' ? 'Verify Email' : 'Reset Password'}
        </a>
      </div>
      <p style="font-size: 11px; color: #999;">If you didn't request this, please ignore this email.</p>
    </div>
  `;

  
  const payload = {
    key: process.env.GAS_SECRET,
    to: user.email,
    subject,
    body,
  };

  try {
    if (!process.env.GOOGLE_SCRIPT_URL) {
      throw new Error("GOOGLE_SCRIPT_URL is not defined");
    }

    const response = await axios({
      method: "post",
      url: process.env.GOOGLE_SCRIPT_URL.trim(),
      data: JSON.stringify(payload),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      maxRedirects: 5,
    });

    if (
      typeof response.data === "string" &&
      response.data.includes("Success")
    ) {
      console.log(`[MAILER]: ${type} success for ${user.email}`);
    } else {
      throw new Error(`Mailer rejected: ${response.data}`);
    }
  } catch (error) {
    console.error("--- MAILER ERROR ---");
    console.error(error.message);
    throw new Error("Email relay system failed.");
  }
};
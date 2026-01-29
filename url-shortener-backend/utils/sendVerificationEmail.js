import axios from 'axios';
import crypto from 'crypto';

/**
 * Sends an authentication email via Google Apps Script Relay
 * @param {Object} user - The Mongoose user document
 * @param {string} type - 'VERIFY' or 'RESET'
 */
export const sendAuthEmail = async (user, type) => {
 
  
  // 1. Generate the security token
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = Date.now() + 3600000; // 1 hour expiration

  if (type === 'VERIFY') {
    user.verificationToken = token;
    user.verificationTokenExpires = expiry;
  } else if (type === 'RESET') {
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiry;
  }

  // 2. Save tokens to DB (skip password validation to avoid re-hashing)
  await user.save({ validateBeforeSave: false });

  // 3. Prepare Email Content
  const path = type === 'VERIFY' ? 'verify-email' : 'reset-password';
  const url = `${process.env.CLIENT_URL}/${path}/${token}`;
  
  const subject = type === 'VERIFY' ? "Verify Your Identity" : "Reset Your Password";
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

  // 4. Create the Payload for Google Apps Script
  const payload = {
    key: process.env.GAS_SECRET, 
    to: user.email,
    subject: subject,
    body: body
  };

  // 5. Send Request using Bulletproof Axios Config
  try {
    // Ensure the URL exists and has no extra spaces
    if (!process.env.GOOGLE_SCRIPT_URL) {
      throw new Error("GOOGLE_SCRIPT_URL is not defined in .env");
    }
    
    const cleanUrl = process.env.GOOGLE_SCRIPT_URL.trim();

    const response = await axios({
      method: 'post',
      url: cleanUrl,
      // Google Apps Script requires a stringified body when sent as text/plain
      data: JSON.stringify(payload), 
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
      // Google redirects from /exec to a temporary URL; Axios handles this
      maxRedirects: 5,
    });

    // Check Google's response text
    if (typeof response.data === 'string' && response.data.includes("Success")) {
      console.log(`[MAILER]: ${type} success for ${user.email}`);
    } else {
      console.error("[MAILER REJECTION]:", response.data);
      throw new Error(`Google Script rejected the request: ${response.data}`);
    }

  } catch (error) {
    console.error("--- MAILER ERROR ---");
    console.error("Message:", error.message);
    if (error.code === 'ENOTFOUND') {
      console.error("CRITICAL: The URL is invalid or the internet connection is failing.");
    }
    throw new Error("Email relay system failed.");
  }
};
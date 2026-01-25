import sgMail from '@sendgrid/mail';
import crypto from 'crypto';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * @param {Object} user - The Mongoose user document
 * @param {string} type - 'VERIFY' or 'RESET'
 */
export const sendAuthEmail = async (user, type) => {
  const COOLDOWN = 60 * 1000;
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = Date.now() + 3600000; // 1 hour

  if (type === 'VERIFY') {
    // Cooldown check for verification only
    if (user.lastVerificationEmailAt && (Date.now() - user.lastVerificationEmailAt < COOLDOWN)) {
      throw new Error("Please wait 60 seconds before requesting another link.");
    }
    user.verificationToken = token;
    user.verificationTokenExpires = expiry;
    user.lastVerificationEmailAt = Date.now();
  } else if (type === 'RESET') {
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiry;
  }

  await user.save();

  const path = type === 'VERIFY' ? 'verify-email' : 'reset-password';
  const url = `${process.env.CLIENT_URL}/${path}/${token}`;
  
  const content = type === 'VERIFY' 
    ? { sub: "Verify your Email", btn: "Verify Email", color: "#2F88FF", text: "verify your account" }
    : { sub: "Password Reset Request", btn: "Reset Password", color: "#ef4444", text: "reset your password" };

  const msg = {
    to: user.email,
    from: process.env.EMAIL_USER,
    subject: content.sub,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333;">${content.sub}</h2>
        <p>Click the button below to ${content.text}. This link is valid for 1 hour.</p>
        <a href="${url}" style="background: ${content.color}; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
          ${content.btn}
        </a>
      </div>`,
  };

  await sgMail.send(msg);
};
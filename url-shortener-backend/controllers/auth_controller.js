import ApiError from "../utils/ApiError.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import UserCollection from "../models/user_model.js";
import RefreshTokenCollection from "../models/statefull_model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTokenID,
} from "../utils/tokens.js";
import { sendAuthEmail } from "../utils/sendVerificationEmail.js";
//Register
export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  

  if (!name || !email || !password) {
    return next(new ApiError(400, "All fields required"));
  }

  const existingUser = await UserCollection.findOne({
    $or: [{ email }, { name }],
  });

  if (existingUser) {
    return next(new ApiError(409, "User already exists"));
  }

  // 1. Create the user (isVerified defaults to false)
  const user = await UserCollection.create({ name, email, password });

  try {
    // 2. Trigger the verification email logic
    const hello = await sendAuthEmail(user, "VERIFY");
   
    res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account before logging in.",
    });
  } catch (error) {
    // If email fails, we don't crash, but tell the user to try resending later
    res.status(201).json({
      message:
        "User registered, but verification email failed to send. Please request a resend from the login page.",
    });
  }
};
//Login
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserCollection.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
   
    return next(new ApiError(401, "Invalid credentials"));
  }

  // NEW VERIFICATION CHECK
  if (!user.isVerified) {
    return next(
      new ApiError(
        403,
        "Your email is not verified. Please verify it to gain access.",
      ),
    );
  }

  const accessToken = generateAccessToken(user._id);
  const tokenId = generateTokenID();
  const refreshToken = generateRefreshToken(user._id, tokenId);

  await RefreshTokenCollection.create({
    tokenId,
    user: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 1000,
    path:"/"
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path:"/api/auth/refresh"
  });

  res.status(200).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
};
export const resendVerification = async (req, res, next) => {
  const { email } = req.body;
  const genericResponse = {
    message: "If eligible, a verification email has been sent.",
  };
  try {
    const user = await UserCollection.findOne({ email });

    if (!user || user.isVerified) {
      return res.status(200).json(genericResponse);
    }
    const COOLDOWN = 2 * 60 * 1000; // 2 minutes

    if (user.lastEmailSentAt && Date.now() - user.lastEmailSentAt < COOLDOWN) {
      return res.status(200).json({
        message: "If eligible, email will be sent shortly.",
      });
    }

    user.lastEmailSentAt = new Date();
    await user.save();
    await sendAuthEmail(user, "VERIFY");

    return res.status(200).json(genericResponse);
  } catch (error) {
    return res.status(200).json(genericResponse);
  }
};
export const verifyEmail = async (req, res, next) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await UserCollection.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError(400, "Invalid or expired verification link."));
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res
    .status(200)
    .json({ message: "Email verified successfully! You can now log in." });
};
// FORGOT PASSWORD
export const forgotPassword = async (req, res, next) => {
  const genericResponse = {
    message: "If this email exists, a reset link has been sent.",
  };
  const { email } = req.body;
  try {
    const user = await UserCollection.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(200).json(genericResponse);
    }
    const COOLDOWN = 2 * 60 * 1000;

    if (user.lastEmailSentAt && Date.now() - user.lastEmailSentAt < COOLDOWN) {
      return res.status(200).json({
        message: "If eligible, email will be sent shortly.",
      });
    }

    user.lastEmailSentAt = new Date();
    await user.save();
    await sendAuthEmail(user, "RESET");

    return res.status(200).json(genericResponse);
  } catch (error) {
    return res.status(200).json(genericResponse);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) {
      return next(new ApiError(400, "New password is required."));
    }

    // 1. Find user by the reset token
    // 2. Check if the token hasn't expired ($gt: Date.now())
    // 3. Select '+password' to ensure the Argon2 pre-save hook triggers correctly
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await UserCollection.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return next(
        new ApiError(400, "Password reset token is invalid or has expired."),
      );
    }

    // 4. Set the new password
    // Because we call .save(), your Argon2 schema hook will automatically hash this.
    user.password = password;

    // 5. IMPORTANT: Clear the reset fields so the link cannot be used again
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message:
        "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    next(error);
  }
};
//Refresh
export const refresh = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return next(new ApiError(401, "No refresh token"));
  }
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch {
    return next(new ApiError(401, "Invalid refresh token"));
  }
  const storedToken = await RefreshTokenCollection.findOne({
    tokenId: payload.jti,
  });
  if (!storedToken) {
    return next(new ApiError(401, "Invalid refresh token"));
  }
  if (storedToken.revoked) {
    console.error({
      type: "TOKEN_REUSE_ATTACK",
      user: storedToken.user,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    await RefreshTokenCollection.updateMany(
      { user: storedToken.user, revoked: false },
      { $set: { revoked: true } },
    );

    return next(new ApiError(401, "Session compromised. Please login again."));
  }
  if (storedToken.expiresAt < Date.now()) {
    return next(new ApiError(401, "Refresh token expired"));
  }
  storedToken.revoked = true;
  const newTokenId = generateTokenID();
  storedToken.replacedByToken = newTokenId;
  await storedToken.save();
  const newRefreshToken = generateRefreshToken(payload.id, newTokenId);
  await RefreshTokenCollection.create({
    tokenId: newTokenId,
    user: payload.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
  const newAccessToken = generateAccessToken(payload.id);
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 1000,
    path:"/"
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path:"/api/auth/refresh"
  });

  res.json({ message: "Token refreshed" });
};
//logout
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
 
};
export const logout = async (req, res) => {
 try {
    const token = req.cookies.refreshToken;

    if (token) {
      const payload = jwt.decode(token);
      if (payload?.jti) {
        await RefreshTokenCollection.updateOne(
          { tokenId: payload.jti },
          { revoked: true }
        );
      }
    }

res.clearCookie("accessToken",{...cookieOptions,path:"/"});
res.clearCookie("refreshToken",{...cookieOptions,path:"/api/auth/refresh"});
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Logout failed" });
  }
};

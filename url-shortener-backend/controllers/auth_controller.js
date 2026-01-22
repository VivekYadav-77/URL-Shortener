import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import UserCollection from "../models/user_model.js";
import RefreshTokenCollection from "../models/statefull_model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTokenID,
} from "../utils/tokens.js";
//Register
export const register = async (req, res) => {
  console.log(req.body)
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ApiError(400, "All fields required"));
  }
  const existingUser = await UserCollection.findOne({
    $or: [{ email }, { name }],
  });
  if (existingUser) {
    return next(new ApiError(409, "User already exist"));
  }
  await UserCollection.create({ name, email, password });
  res.status(201).json({ message: "User registered successfully" });
};
//Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email.endsWith("@gmail.com")) {
   return next(new ApiError(400, "Only Gmail accounts are allowed"));
  }
  const user = await UserCollection.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return next(new ApiError(401, "Invalid credentials"));
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
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none"   : "lax",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none"   : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
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
//Refresh
export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return next(new ApiError(401, "No refresh token"))  }
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch {
    return next(new ApiError(401, "Invalid refresh token"));
  }
  const storedToken = await RefreshTokenCollection.findOne({ tokenId: payload.jti });
    if (!storedToken || storedToken.revoked || storedToken.expiresAt < Date.now()) {
    return next(new ApiError(401, "Refresh token revoked"));
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
    userAgent: req.headers["user-agent"]
  });
   const newAccessToken = generateAccessToken(payload.id);
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none"   : "lax",
    maxAge: 60 * 60 * 1000
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none"   : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ message: "Token refreshed" });
};
//logout
export const logout = async(req,res)=>{
    const token = req.cookies.refreshToken
    if(token){
        const payload = jwt.decode(token)
        if (payload?.jti) {
      await RefreshTokenCollection.updateOne(
        { tokenId: payload.jti },
        { revoked: true }
      );
    }
    }
     res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({ message: "Logged out successfully" });
}

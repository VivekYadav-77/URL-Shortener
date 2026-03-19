import UserCollection from "../models/user_model.js";
import ApiError from "../utils/ApiError.js";
export const criticalActionGuard = async (req, res, next) => {
  const user = await UserCollection.findById(req.userId).select("status");

  if (!user || user.status === "blocked") {
    res.clearCookie("accessToken", { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });
    res.clearCookie("refreshToken", { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    return next(new ApiError(403, "Your account has been blocked."));
  }

  next();
};
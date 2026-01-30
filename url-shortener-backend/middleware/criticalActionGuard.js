import UserCollection from "../models/user_model.js";
import ApiError from "../utils/ApiError.js";
export const criticalActionGuard = async (req, res, next) => {
  const user = await UserCollection.findById(req.userId).select("status");

  if (!user || user.status === "blocked") {
    // 1. Force the browser to delete the cookies NOW
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

    // 2. Return error so the React frontend knows to redirect to /login
    return next(new ApiError(403, "Your account has been blocked."));
  }

  next();
};
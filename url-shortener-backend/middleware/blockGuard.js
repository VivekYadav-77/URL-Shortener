import UserCollection from "../models/user_model.js";
import ApiError from "../utils/ApiError.js";
export const blockGuard = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new ApiError(400, "All fields required"));
  const user = await UserCollection.findOne({ email });
  if (!user) {
    return next(new ApiError(404, "This account not found."));
  }
  if (user && user.status === "blocked") {
    return next(
      new ApiError(403, "This account has been blocked for violating terms."),
    );
  }

  next();
};

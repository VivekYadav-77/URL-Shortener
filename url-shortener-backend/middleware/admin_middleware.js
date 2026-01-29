import UserCollection from "../models/user_model.js";
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await UserCollection.findById(req.userId).select("role");

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied: Admin privileges required." });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error during authorization" });
  }
};

export default adminMiddleware;

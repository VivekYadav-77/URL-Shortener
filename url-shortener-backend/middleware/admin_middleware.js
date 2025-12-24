import UrlCollection from "../models/url_model.js";
import UserCollection from "../models/user_model";
const adminMiddleware = async (req, res, next) => {
  const user = await UserCollection.findById(req.userId);

  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};

export default adminMiddleware;
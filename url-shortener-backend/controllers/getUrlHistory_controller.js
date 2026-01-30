import ApiError from "../utils/ApiError.js";
import UrlCollection from "../models/url_model.js";
export const getUrlHistory = async (req, res, next) => {
  try {
    const urls = await UrlCollection.find({
      owner: req.userId,
      status: { $in: ["expired", "deleted"] },
    })
      .sort({ updatedAt: -1 })
      .select("-__v");
    if (!urls) {
      return next(new ApiError(404, "Url history not found "));
    }
    res.status(200).json(urls);
  } catch (error) {
    next(error);
  }
};

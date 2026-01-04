import UrlCollection from "../models/url_model.js";
export const getUrlHistory = async (req, res, next) => {
  try {
    const urls = await UrlCollection.find({
      owner: req.userId,
      status: { $in: ["expired", "deleted"] },
    })
      .sort({ updatedAt: -1 })
      .select("-__v");
    res.status(200).json(urls);
  } catch (error) {
    next(error);
  }
};

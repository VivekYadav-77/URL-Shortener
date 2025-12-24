import UrlCollection from "../models/url_model.js";
import UserCollection from "../models/user_model.js";
export const getAllUrls = async (req, res) => {
  const urls = await UrlCollection.find()
    .populate("owner", "email username")
    .sort({ createdAt: -1 });

  res.json(urls);
};
export const getAbusedUrls = async (req, res) => {
  const urls = await UrlCollection.find({
    abuseScore: { $gt: 0 }
  })
    .sort({ abuseScore: -1, lastAbuseAt: -1 })
    .populate("owner", "email username");

  res.json(urls);
};
export const disableUrl = async (req, res) => {
  const { id } = req.params;

  const url = await UrlCollection.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!url) {
    return res.status(404).json({ message: "URL not found" });
  }

  res.json({ message: "URL disabled by admin" });
};
export const getPlatformStats = async (req, res) => {
  const totalUsers = await UserCollection.countDocuments();
  const totalUrls = await UrlCollection.countDocuments();
  const abusedUrls = await UrlCollection.countDocuments({
    abuseScore: { $gt: 0 }
  });

  res.json({
    totalUsers,
    totalUrls,
    abusedUrls
  });
};

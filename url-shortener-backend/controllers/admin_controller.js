import ApiError from "../utils/ApiError.js";
import UrlCollection from "../models/url_model.js";
import UserCollection from "../models/user_model.js";
import mongoose from "mongoose";
import redis from "../config/redish.js";
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      total,
      active,
      inactive,
      expired,
      deleted,
      totalClicks,
      abuse
    ] = await Promise.all([
      UrlCollection.countDocuments(),
      UrlCollection.countDocuments({ status: "active" }),
      UrlCollection.countDocuments({ status: "inactive" }),
      UrlCollection.countDocuments({ status: "expired" }),
      UrlCollection.countDocuments({ status: "deleted" }),
      UrlCollection.aggregate([
        { $group: { _id: null, clicks: { $sum: "$clicks" } } }
      ]),
      UrlCollection.countDocuments({ abuseScore: { $gt: 0 } })
    ]);

    res.json({
      totalUrls: total,
      activeUrls: active,
      inactiveUrls: inactive,
      expiredUrls: expired,
      deletedUrls: deleted,
      totalClicks: totalClicks[0]?.clicks || 0,
      abuseUrls: abuse
    });
  } catch (err) {
    next(err);
  }
};
export const getAllUrls = async (req, res,next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const urls = await UrlCollection.find(query)
      .populate("owner", "name email")
      .populate("disabledBy", "name email")
      .populate("deletedBy", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(urls);
  } catch (err) {
    next(err);
  }
};

export const disableUrlByAdmin = async (req, res, next) => {
  try {
    const url = await UrlCollection.findById(req.params.id);

    if (!url) {
      return next(new ApiError(404, "URL not found"));
    }

    if (url.status === "deleted") {
      return next(new ApiError(400, "URL already deleted"));
    }

    if (url.expiresAt < new Date()) {
      url.status = "expired";
      url.isActive = false;
      await url.save();
      return next(new ApiError(400, "URL already expired"));
    }

    url.isActive = false;
    url.status = "inactive";
    url.disabledBy = req.userId;
    url.disabledByRole = "admin";
    url.disabledAt = new Date();

    await url.save();
    await redis.del(`url:${url.shortCode}`);

    res.json({ message: "URL disabled by admin" });
  } catch (err) {
    next(err);
  }
};
export const adminEnableUrl = async (req, res, next) => {
  try {
    const url = await UrlCollection.findById(req.params.id);
    const now = new Date();

    if (!url) {
       return next(new ApiError(404, "URL not found"));
    }
     if (url.status === "deleted") {
     return next(new ApiError(400, "URL already deleted and cannot be enabled"));
    }

    let disabledAt = url.disabledAt;
    let oldExpiry = url.expiresAt;

    let timeDisabled = disabledAt - oldExpiry;

    if (timeDisabled <= 0) {
      timeDisabled = 24 * 60 * 60 * 1000;
    }

    const newExpiry = new Date(now.getTime() + timeDisabled);

    url.isActive = true;
    url.status = "active";
    url.expiresAt = newExpiry;

    url.disabledAt = null;
    url.disabledBy = null;
    url.disabledByRole = null;
    await url.save();

    await redis.del(`url:${url.shortCode}`);

    res.json({
      message: "URL revived & enabled by admin",
      newExpiry
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUrlByAdmin = async (req, res, next) => {
  try {
    const url = await UrlCollection.findById(req.params.id);

    if (!url) {
      return next(new ApiError(404, "URL not found"));
    }

    if (url.status === "deleted") {
      return next(new ApiError(400, "URL already deleted"));
    }

    url.isActive = false;
    url.status = "deleted";

    url.deletedBy = req.userId;
    url.deletedByRole = "admin";

    url.deletedAt = new Date();
    url.expiresAt = new Date(); 

    await url.save();
    await redis.del(`url:${url.shortCode}`);

    res.json({ message: "URL deleted by admin" });
  } catch (err) {
    next(err);
  }
};
export const getAbuseUrls = async (req, res, next) => {
  try {
    const urls = await UrlCollection.find({
      abuseScore: { $gt: 0 }
    }).sort({ abuseScore: -1 });

    res.json(urls);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserCollection.find()
      .select("name email role createdAt");

    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getUserUrls = async (req, res, next) => {
  const {id} = req.params
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
 return next(new ApiError(400, "Invalid user ID"));
}

  try {
    const urls = await UrlCollection.find({ owner: id})
      .sort({ createdAt: -1 });

    res.json(urls);
  } catch (err) {
    next(err);
  }
};
export const getSingleUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
if (!id || !mongoose.Types.ObjectId.isValid(id)) {
 return next(new ApiError(400, "Invalid user ID"));
}

    const user = await UserCollection.findById(id).select("-password");

    if (!user) {
     return next(new ApiError(404, "User not found"));
    }

    const urls = await UrlCollection.find({ owner: id }).sort({
      createdAt: -1,
    });

    const stats = {
      totalUrls: urls.length,
      active: urls.filter((u) => u.status === "active").length,
      inactive: urls.filter((u) => u.status === "inactive").length,
      expired: urls.filter((u) => u.status === "expired").length,
      deleted: urls.filter((u) => u.status === "deleted").length,
      totalClicks: urls.reduce((sum, u) => sum + (u.clicks || 0), 0),
      abuseUrls: urls.filter((u) => u.abuseScore > 0).length,
    };

    res.json({
      user,
      stats,
      urls,
    });
  } catch (err) {
    next(err);
  }


}

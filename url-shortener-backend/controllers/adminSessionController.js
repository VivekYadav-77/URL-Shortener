import UserCollection from "../models/user_model.js";
import RefreshTokenCollection from "../models/statefull_model.js";
export const getSessions = async (req, res, next) => {
  try {
    const sessions = await RefreshTokenCollection.find({
      user: req.userId,
      revoked: false,
      expiresAt: { $gt: new Date() },
    })
      .select("tokenId ip userAgent createdAt expiresAt")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (err) {
    next(err);
  }
};
export const revokeSession = async (req, res, next) => {
  try {
    const { tokenId } = req.params;

    const currentToken = req.cookies.refreshToken;

    const decoded = jwt.verify(
      currentToken,
      process.env.JWT_REFRESH_SECRET
    );

    if (decoded.jti === tokenId) {
      return next(
        new ApiError(400, "You cannot remove your current session")
      );
    }

    const session = await RefreshTokenCollection.findOne({
      tokenId,
      user: req.userId,
    });

    if (!session) {
      return next(new ApiError(404, "Session not found"));
    }

    session.revoked = true;
    await session.save();

    res.json({
      success: true,
      message: "Session removed",
    });
  } catch (err) {
    next(err);
  }
};
export const logoutAll = async (req, res, next) => {
  try {
    const currentToken = req.cookies.refreshToken;

    const decoded = jwt.verify(
      currentToken,
      process.env.JWT_REFRESH_SECRET
    );

    await RefreshTokenCollection.updateMany(
      {
        user: req.userId,
        tokenId: { $ne: decoded.jti }, // 🔥 keep current
        revoked: false,
      },
      { $set: { revoked: true } }
    );

    res.json({
      success: true,
      message: "Logged out from all other devices",
    });
  } catch (err) {
    next(err);
  }
};
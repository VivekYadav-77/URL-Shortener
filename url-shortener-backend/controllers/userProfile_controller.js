import ApiError from "../utils/ApiError.js";
import UserCollection from "../models/user_model.js";
import argon2 from "argon2";
export const getMe = async (req, res, next) => {
  try {
    const user = await UserCollection.findById(req.userId).select(
      "-password -__v",
    );
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name } = req.body;
    console.log(req.body);

    if (!name || name.trim().length < 8) {
      return next(new ApiError(400, "Username is required"));
    }

    const user = await UserCollection.findByIdAndUpdate(
      req.userId,
      { name },
      { new: true, runValidators: true },
    ).select("-password");

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return next(
        new ApiError(400, "Both current and new passwords are required"),
      );
    }

    const user = await UserCollection.findById(req.userId).select("+password");
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const valid = await argon2.verify(user.password, currentPassword);
    if (!valid) {
      return next(new ApiError(400, "Invalid current password"));
    }
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

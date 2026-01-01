import UserCollection from "../models/user_model.js";
import argon2 from "argon2";
export const getMe = async (req, res, next) => {
  try {
    const user = await UserCollection.findById(req.userId)
      .select("-password -__v");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
   const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        message: "Username is required",
      });
    }

   const user = await UserCollection.findByIdAndUpdate(
      req.userId,
      { username },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await UserCollection.findById(req.userId).select("+password");

    const valid = await argon2.verify(user.password, currentPassword);
    if (!valid) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    user.password = await argon2.hash(newPassword);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

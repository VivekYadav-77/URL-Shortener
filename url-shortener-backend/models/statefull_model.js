import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  expiresAt: {
    type: Date,
    required: true
  },

  revoked: {
    type: Boolean,
    default: false
  },

  replacedByToken: {
    type: String,
    default: null
  },

  ip: String,
  userAgent: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});
const RefreshTokenCollection = mongoose.model("RefreshToken", refreshTokenSchema);
export default RefreshTokenCollection

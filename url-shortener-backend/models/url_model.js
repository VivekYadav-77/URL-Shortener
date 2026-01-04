import mongoose  from "mongoose";
const urlSchema = new mongoose.Schema({
    originalUrl: {
    type: String,
    required: true
  },
   shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  isCustom: {
      type: Boolean,
      default: false
    },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  clicks: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true
  },
   expiresAt: {
      type: Date,
      default: null
    },
    deletedAt: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ["active","inactive", "expired", "deleted"],
    default: "active"
  },
    abuseScore: {
  type: Number,
  default: 0
},
lastAbuseAt: {
  type: Date,
  default: null
}

}, { timestamps: true })
const UrlCollection = mongoose.model('Url',urlSchema)
export default UrlCollection
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  clicks: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: Date
}, { timestamps: true })
const UrlCollection = mongoose.model('Url',urlSchema)
export default UrlCollection
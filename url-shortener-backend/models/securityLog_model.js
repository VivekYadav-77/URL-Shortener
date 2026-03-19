import mongoose from "mongoose";

const securityLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "scan_success",
        "scan_failed",
        "scan_rate_limited",
        "high_risk_blocked",
        "critical_blocked",
        "admin_blocked",
        "admin_disabled",
        "creation_attempt_blocked",
        "suspicious_activity",
      ],
      required: true,
    },

    originalUrl: { type: String, required: true },

    shortCode: { type: String, default: null },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    metadata: {
       safe: Boolean,
  riskScore: Number,
  scannerUsed: String,
  reason: String,
  ip: String,
  userAgent: String,
  deviceType: String,
  isPrivateIP: Boolean,
    },
  },
  { timestamps: true },
);
securityLogSchema.index({ "metadata.ip": 1, createdAt: -1 });

export default mongoose.model("SecurityLog", securityLogSchema);


import SecurityLog from "../models/securityLog_model.js";
import ApiError from "../utils/ApiError.js";

export const getSecurityLogs = async (req, res, next) => {
  try {
    const logs = await SecurityLog.find()
      .sort({ createdAt: -1 })
      .limit(500); 

    return res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
};

export const getHighRiskLogs = async (req, res, next) => {
  try {
    const logs = await SecurityLog.find({
      "metadata.riskScore": { $gte: 60 },
    }).sort({ createdAt: -1 });

    return res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
};

export const deleteSecurityLogs = async (req, res, next) => {
  try {
    await SecurityLog.deleteMany({});
    return res.status(200).json({ message: "Security logs cleared" });
  } catch (err) {
    next(err);
  }
};

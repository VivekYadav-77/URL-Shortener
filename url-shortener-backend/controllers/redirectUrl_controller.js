import UrlCollection from "../models/url_model.js";

export const redirect = async (req, res) => {
  const { shortCode } = req.params;

  const url = await UrlCollection.findOne({ shortCode, isActive: true });

  if (!url) {
    return res.status(404).json({ message: "Invalid link" });
  }

  if (url.expiresAt && url.expiresAt < Date.now()) {
    return res.status(410).json({ message: "Link expired" });
  }

  url.clicks += 1;
  await url.save();

  return res.redirect(url.originalUrl);
};

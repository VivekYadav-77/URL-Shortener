import axios from "axios";

export const isUrlSafe = async (url) => {
  try {
    if (!url || typeof url !== "string") {
      return {
        safe: false,
        reason: "Invalid URL",
        details: null,
        source: "google",
      };
    }

    const API_KEY = process.env.GOOGLE_SAFE_API_KEY;

    if (!API_KEY) {
      console.error("Missing GOOGLE_SAFE_API_KEY");
      return {
        safe: true,
        reason: "API Key Missing - Fail Open",
        details: null,
        source: "google",
      };
    }

    // --- v5 UPDATE: Endpoint is now a GET request to urls:search ---
    const endpoint = `https://safebrowsing.googleapis.com/v5/urls:search?key=${API_KEY}&urls=${encodeURIComponent(url)}`;

    const response = await axios.get(endpoint, {
      timeout: 4000,
    });

    // --- v5 UPDATE: "matches" is now "threats" ---
    if (!response.data || !response.data.threats || response.data.threats.length === 0) {
      return {
        safe: true,
        reason: null,
        details: null,
        source: "google",
      };
    }

    const threatMatch = response.data.threats[0];

    // --- v5 UPDATE: Threat types are now returned as an array ---
    const primaryThreat = (threatMatch.threatTypes && threatMatch.threatTypes.length > 0) 
      ? threatMatch.threatTypes[0] 
      : "UNKNOWN_THREAT";

    return {
      safe: false,
      reason: primaryThreat,
      details: threatMatch,
      source: "google",
    };
  } catch (error) {
    console.error("🔻 Google SafeBrowsing Error:", error.message);

    // RATE LIMIT (429)
    if (error.response?.status === 429) {
      return {
        safe: true,
        reason: "Google Rate Limited - Fail Open",
        details: null,
        source: "google",
      };
    }

    // QUOTA OVER (403)
    if (error.response?.status === 403) {
      return {
        safe: true,
        reason: "Google Quota Exhausted - Fail Open",
        details: null,
        source: "google",
      };
    }

    // Default fallback: DO NOT BLOCK USERS due to API error.
    return {
      safe: true,
      reason: "Google API Error - Fail Open",
      details: null,
      source: "google",
    };
  }
};
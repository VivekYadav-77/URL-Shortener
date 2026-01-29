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

    const endpoint =
      "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=" +
      API_KEY;

    const body = {
      client: {
        clientId: "url-shortener",
        clientVersion: "1.0",
      },
      threatInfo: {
        threatTypes: [
          "MALWARE",
          "SOCIAL_ENGINEERING",
          "UNWANTED_SOFTWARE",
          "POTENTIALLY_HARMFUL_APPLICATION",
        ],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url }],
      },
    };

    const response = await axios.post(endpoint, body, {
      timeout: 4000,
    });

    if (!response.data || !response.data.matches) {
      return {
        safe: true,
        reason: null,
        details: null,
        source: "google",
      };
    }

    const match = response.data.matches[0];

    return {
      safe: false,
      reason: match.threatType || "UNKNOWN_THREAT",
      details: match,
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

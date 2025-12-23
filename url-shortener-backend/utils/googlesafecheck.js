import axios from "axios";

export const isUrlSafe = async (url) => {
  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_SAFE_API_KEY}`;

  const body = {
    client: {
      clientId: "url-shortener",
      clientVersion: "1.0"
    },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url }]
    }
  };

  const response = await axios.post(endpoint, body);

  return !response.data.matches;
};

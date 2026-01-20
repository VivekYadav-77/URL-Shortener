import axios from "axios";

export const scanWithVirusTotal = async (url) => {
  try {
    const response = await axios.post(
      "https://www.virustotal.com/api/v3/urls",
      new URLSearchParams({ url }),
      {
        headers: {
          "x-apikey": process.env.VIRUS_TOTAL_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const analysisId = response.data.data.id;

    // Fetch result
    const analysisResult = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      { headers: { "x-apikey": process.env.VIRUS_TOTAL_API_KEY } }
    );

    const stats = analysisResult.data.data.attributes.stats;

    // If any malicious detection exists → unsafe
    const malicious = stats.malicious || stats.suspicious;

    return { safe: malicious === 0, rateLimited: false };

  } catch (error) {
    console.error("VirusTotal error:", error?.response?.data || error);

    if (error.response?.status === 429) {
      return { safe: false, rateLimited: true };
    }

    return { safe: false, rateLimited: false };
  }
};

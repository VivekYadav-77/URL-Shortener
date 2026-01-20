import tldts from "tldts";

export function analyzeUrlRisk(url) {
  let score = 0;
  const lower = url.toLowerCase();

  // Check if URL uses an IP address
  if (/^https?:\/\/\d{1,3}(\.\d{1,3}){3}/.test(lower)) {
    score += 30; // high risk
  }

  //  Too long URLs
  if (url.length > 200) score += 10;
  if (url.length > 500) score += 20;

  //  Too many query params → suspicious
  if ((url.match(/\?/g) || []).length > 1) score += 10;
  if ((url.match(/=/g) || []).length > 5) score += 10;

  // Suspicious characters
  const suspiciousChars = /(%2e|%2f|%00|<|>|"|\\|\{|\}|\||\^|\~)/i;
  if (suspiciousChars.test(lower)) score += 25;

  //  Base64 in URL (used by phishing kits)
  if (/base64/i.test(lower)) score += 15;

  // Unicode homoglyph attacks
  if (/[^\u0000-\u007f]/.test(url)) {
    score += 20;
  }

  //  Shortened malicious domains
  const parsed = tldts.parse(url);
  const badTlds = ["zip", "xyz", "click", "work", "top", "loan"];
  if (parsed.domain && badTlds.includes(parsed.publicSuffix)) {
    score += 15;
  }

  //  Phishing keyword detection
  const phishingWords = ["login", "verify", "update", "password", "wallet"];
  if (phishingWords.some(w => lower.includes(w))) {
    score += 15;
  }

  //  Detect DECEPTIVE domains (typosquatting)
  const trustedBrands = ["google", "facebook", "amazon", "apple"];
  for (let brand of trustedBrands) {
    if (parsed.domain && parsed.domain.includes(brand)) {
      const real = brand;
      const found = parsed.domain;

      // allow exact match
      if (real !== found) score += 20;
    }
  }

  //  Very new domain – if you want future improvement (need WHOIS)
  // score += domainAgeCheck(parsed.domain);

  return score;
}

import tldts from "tldts";

export function analyzeUrlRisk(url) {
  let score = 0;
  const lower = url.toLowerCase();
  const parsed = tldts.parse(url);

  // IP address in URL → suspicious
  if (/^https?:\/\/\d{1,3}(\.\d{1,3}){3}/.test(lower)) {
    score += 30;
  }

  // Very long URLs (but allow Google/Amazon/etc.)
  if (url.length > 2000) score += 10;

  // Too many params (but Google commonly uses many)
  const paramsCount = (url.match(/=/g) || []).length;
  if (paramsCount > 40) score += 10;

  // Very suspicious characters (avoid flagging %2f, %2e)
  const dangerousChars = /(%00|<|>|"|\{|\}|\\|\^|\~)/;
  if (dangerousChars.test(lower)) score += 25;

  // Base64 in URL
  if (/base64/i.test(lower)) score += 15;

  // Bad TLDs
  const badTlds = ["zip", "xyz", "click", "work", "top", "loan"];
  if (parsed.publicSuffix && badTlds.includes(parsed.publicSuffix)) {
    score += 10;
  }

  // Phishing keywords
  const phishingWords = ["login", "verify", "update", "password", "wallet"];
  if (phishingWords.some((w) => lower.includes(w))) {
    score += 10;
  }

  // Typosquatting — only penalize if not exact brand domain
  const trustedBrands = ["google", "facebook", "amazon", "apple"];
  for (let brand of trustedBrands) {
    if (parsed.domain === `${brand}.com`) continue;
    if (parsed.domain?.includes(brand)) score += 15;
  }

  return score;
}

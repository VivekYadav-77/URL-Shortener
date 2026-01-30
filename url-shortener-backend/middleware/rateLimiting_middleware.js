import rateLimit from "express-rate-limit";
export const redirectLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    message: "Too many requests. Slow down.",
  },
});

export const createUrlLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    message: "URL creation limit reached. Try later.",
  },
});

import redis from "../config/redish.js";

export async function safeGet(key) {
  try {
    return await redis.get(key);
  } catch (err) {
    console.error("Redis GET failed:", err.message);
    return null;
  }
}

export async function safeSet(key, value, options = {}) {
  try {
    return await redis.set(key, value, options);
  } catch (err) {
    console.error("Redis SET failed:", err.message);
  }
}

export async function safeIncr(key) {
  try {
    return await redis.incr(key);
  } catch (err) {
    console.error("Redis INCR failed:", err.message);
    return null;
  }
}

export async function safeExpire(key, ttl) {
  try {
    return await redis.expire(key, ttl);
  } catch (err) {
    console.error("Redis EXPIRE failed:", err.message);
  }
}
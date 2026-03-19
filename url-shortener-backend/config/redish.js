import dotenv from "dotenv";
dotenv.config();
import { Redis } from "@upstash/redis";

if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
  throw new Error("Redis env variables missing");
}

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
  enableAutoPipelining: true,
  retry: { retries: 1 },
});

export default redis;

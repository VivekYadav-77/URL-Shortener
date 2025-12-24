import dotenv from "dotenv";
dotenv.config();
import redis from "./config/redish.js";
(async () => {
  await redis.set("test:key", "hello");
  const value = await redis.get("test:key");
  console.log(value);
})();

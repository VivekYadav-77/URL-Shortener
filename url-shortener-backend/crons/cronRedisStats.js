import cron from "node-cron"
import { flushRedisStats } from "../jobs/flushRedisStats.js";
cron.schedule("*/20 * * * *", async () => {
  console.log(" Flushing Redis stats...");
  await flushRedisStats();
});
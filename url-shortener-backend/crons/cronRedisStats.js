import cron from "node-cron"
import { flushRedisStats } from "../jobs/flushRedisStats.js";
cron.schedule("*/5 * * * *", async () => {
  console.log(" Flushing Redis stats...");
  await flushRedisStats();
});
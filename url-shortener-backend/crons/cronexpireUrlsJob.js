import cron from "node-cron"
import { expireUrlsJob } from "../jobs/expireUrlsJob.js"
cron.schedule("*/5 * * * *", async () => {
  console.log(" Flushing Redis stats...");
  await expireUrlsJob();
});
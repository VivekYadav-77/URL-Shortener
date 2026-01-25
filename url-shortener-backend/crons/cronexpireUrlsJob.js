import cron from "node-cron"
import { expireUrlsJob } from "../jobs/expireUrlsJob.js"
cron.schedule("0 */5 * * *", async () => {
  console.log("--- Starting Scheduled Maintenance: Expiring URLs ---");
  await expireUrlsJob()
});
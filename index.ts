import { CronJob } from "cron";
import { grabberFunction } from "./grabber";

// run this job every 8 hours

// const schedule = "0 0 */8 * * *";


// const job = new CronJob(schedule, grabberFunction, null);

// job.start();

grabberFunction()

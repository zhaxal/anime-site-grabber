import { CronJob } from "cron";
import { grabberFunction } from "./grabber";

// run this job every thursday at 10:00:00 AM

// const schedule = "0 0 10 * * 4";


// const job = new CronJob(schedule, grabberFunction, null);

// job.start();

grabberFunction()

import { CronJob } from "cron"


export let jobs_initialized: boolean = false;
export const jobs: Record<string, CronJob> = {};


export default async function init() {
	jobs["kmz_files"] = new CronJob(
		"0 0 * * *",
		() => {
			console.log("Running kmz_files job");
		},
		null,
		true,
		"America/Los_Angeles"
	)

	jobs_initialized = true;
}
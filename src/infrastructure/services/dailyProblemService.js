// file to schedule the daily problem for the users

// importing the required modules
const cron = require("node-cron");
const problemScheduler = require("../../application/usecase/problemUseCase/problemUseCase");

// creating the service for the scheduler
module.exports = () => {
  cron.schedule("30 9 * * *", async () => {
    try {
      console.log("Running daily problem task at 9:30 AM");
      const result = await problemScheduler.dailyProblem();
      console.log("Daily problem task result:", result);
    } catch (error) {
      console.error("Error running daily problem task:", error);
    }
  });
};

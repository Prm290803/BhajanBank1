import cron from "node-cron";
import User from "../models/user.js";
import { sendNotification } from "../utils/fcm.js";

cron.schedule("0 0 * * *", async () => {
  const users = await User.find({}); // All users

  for (const user of users) {
    if (!user.taskSubmittedToday && user.fcmtoken) {
      await sendNotification(
        user.fcmtoken,
        "Task Reminder!",
        "You have not submitted your task today."
      );
    }
  }
});

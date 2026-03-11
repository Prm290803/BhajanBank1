import cron from "node-cron";
import User from "../models/user.js";
import Task from "../models/Task.js";
import { sendNotificationToMultiple } from "../utils/fcm.js";

const startDailyCheck = () => {

  // Run every day at 7 PM
  cron.schedule("* * * *", async () => {
    console.log("⏰ Running Daily Bhajan Check (7 PM)");

    try {

      // Bhajan day: 4 AM → next day 4 AM
      const todayStart = new Date();
      todayStart.setHours(4, 0, 0, 0);

      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);

      // Users who submitted today
      const submittedUsers = await Task.find({
        date: { $gte: todayStart, $lt: todayEnd }
      }).distinct("user");

      // Users who didn't submit
      const users = await User.find({
        _id: { $nin: submittedUsers },
        fcmtoken: { $ne: null }
      }).select("fcmtoken name");

      if (!users.length) {
        console.log("✅ All users submitted today's bhajan");
        return;
      }

      console.log(`⚠ ${users.length} users haven't submitted bhajan`);

      const tokens = users.map(u => u.fcmtoken).filter(Boolean);

      if (tokens.length > 0) {

        const result = await sendNotificationToMultiple(tokens, {
          title: "ભજન યાદ અપાવવું",
          body: "તમે આજે તમારું ભજન હજી સુધી મૂક્યું નથી.",
          data: {
            type: "TASK_REMINDER"
          }
        });

        console.log(`✅ Notifications sent: ${result.successCount}`);
      }

    } catch (error) {
      console.error("❌ Daily bhajan check error:", error);
    }

  }, {
    timezone: "Asia/Kolkata"
  });

};

export default startDailyCheck;

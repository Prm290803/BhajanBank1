import cron from "node-cron";
import User from "../models/user.js";
import Task from "../models/Task.js";
import { sendNotificationToMultiple } from "../utils/fcm.js";

const sendReminderToUnsubmitted = async (label) => {
  console.log(`⏰ Running Task Check: ${label}`);

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Get users who already submitted tasks today
    const submittedUsers = await Task.find({
      date: { $gte: todayStart, $lte: todayEnd }
    }).distinct("user");

    // Find users who DID NOT submit tasks
    const users = await User.find({
      _id: { $nin: submittedUsers },
      fcmtoken: { $ne: null }
    }).select("fcmtoken name");

    if (!users.length) {
      console.log("✅ All users submitted tasks today");
      return;
    }

    console.log(`⚠ ${users.length} users haven't submitted tasks`);

    const tokens = users.map(u => u.fcmtoken).filter(Boolean);

    if (tokens.length > 0) {
      const result = await sendNotificationToMultiple(tokens, {
        title: "ભજન યાદ અપાવવું",
        body: "તમે આજે તમારું ભજન હજી સુધી મૂક્યું નથી.",
        data: { type: "TASK_REMINDER" }
      });

      console.log(`✅ Notifications sent (${label}): ${result.successCount}`);
    }

  } catch (error) {
    console.error("❌ Daily task check error:", error);
  }
};

const startDailyCheck = () => {

  // 🔔 First reminder  — 7:00 PM IST
  cron.schedule("0 19 * * *", () => sendReminderToUnsubmitted("7:00 PM"), {
    timezone: "Asia/Kolkata"
  });

  // 🔔 Second reminder — 9:00 PM IST  
  cron.schedule("0 21 * * *", () => sendReminderToUnsubmitted("9:00 PM"), {
    timezone: "Asia/Kolkata"
  });

  console.log("✅ Daily task reminders scheduled: 7 PM and 9 PM IST");
};

export default startDailyCheck;


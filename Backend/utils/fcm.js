// backend/utils/fcm.js
import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("../firebase-service-account.json");

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin initialized");
}

// Send notification to a single device
export const sendNotification = async (token, notification) => {
  try {
    if (!token) {
      console.error("❌ No FCM token provided");
      return false;
    }

    const message = {
      token: token,
      notification: {
        title: notification.title || "BhajanBank",
        body: notification.body || "You have a new notification",
      },
      data: notification.data || {},
      android: {
        priority: "high",
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent successfully:", response);
    return true;
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    return false;
  }
};

// Send notification to multiple devices
export const sendNotificationToMultiple = async (tokens, notification) => {
  try {
    if (!tokens || tokens.length === 0) {
      console.error("❌ No FCM tokens provided");
      return false;
    }

    const message = {
      tokens: tokens,
      notification: {
        title: notification.title || "BhajanBank",
        body: notification.body || "You have a new notification",
      },
      data: notification.data || {},
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log(`✅ Sent ${response.successCount} notifications successfully`);
    console.log(`❌ Failed ${response.failureCount} notifications`);
    
    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`Failed for token ${tokens[idx]}:`, resp.error);
        }
      });
    }
    
    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses,
    };
  } catch (error) {
    console.error("❌ Error sending multiple notifications:", error);
    return false;
  }
};

// Send notification to all users in a family
export const sendNotificationToFamily = async (familyId, notification) => {
  try {
    // Import User model inside function to avoid circular dependency
    const { default: User } = await import("../models/user.js");
    
    const users = await User.find({ family: familyId }).select("fcmtoken");
    const tokens = users.map(user => user.fcmtoken).filter(token => token);
    
    if (tokens.length === 0) {
      console.log("⚠ No FCM tokens found for family members");
      return {
        successCount: 0,
        failureCount: 0,
        message: "No FCM tokens found"
      };
    }
    
    console.log(`📢 Sending notification to ${tokens.length} family members`);
    return await sendNotificationToMultiple(tokens, notification);
    
  } catch (error) {
    console.error("❌ Error sending to family:", error);
    return {
      successCount: 0,
      failureCount: 0,
      error: error.message
    };
  }
};

// Send notification to specific user by ID
export const sendNotificationToUser = async (userId, notification) => {
  try {
    const { default: User } = await import("../models/user.js");
    
    const user = await User.findById(userId).select("fcmtoken");
    
    if (!user || !user.fcmtoken) {
      console.log(`⚠ No FCM token found for user ${userId}`);
      return false;
    }
    
    console.log(`📢 Sending notification to user: ${userId}`);
    return await sendNotification(user.fcmtoken, notification);
    
  } catch (error) {
    console.error("❌ Error sending to user:", error);
    return false;
  }
};
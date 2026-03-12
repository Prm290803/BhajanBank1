import admin from "firebase-admin";

let isInitialized = false;

const initializeFirebase = () => {
  if (isInitialized) return;

  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PRIVATE_KEY
  ) {
    console.error("❌ Firebase env variables are missing");
    return;
  }

  const serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase Admin initialized");
  isInitialized = true;
};


// ==============================
// Send notification to ONE user
// ==============================
export const sendNotification = async (token, notification) => {
  try {
    initializeFirebase();

    if (!token) {
      console.error("❌ No FCM token provided");
      return false;
    }

    const message = {
      token,
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


// ===================================
// Send notification to MULTIPLE users
// ===================================
export const sendNotificationToMultiple = async (tokens, notification) => {
  try {
    initializeFirebase();

    if (!tokens || tokens.length === 0) {
      console.error("❌ No FCM tokens provided");
      return {
        successCount: 0,
        failureCount: 0,
      };
    }

    const message = {
      tokens,
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
          },
        },
      },
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    console.log(`✅ Sent ${response.successCount} notifications`);
    console.log(`❌ Failed ${response.failureCount} notifications`);

    const invalidTokens = [];

    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const errorCode = resp.error?.code;

        console.error(`❌ Failed token ${tokens[idx]}:`, resp.error);

        if (
          errorCode === "messaging/registration-token-not-registered" ||
          errorCode === "messaging/invalid-registration-token"
        ) {
          invalidTokens.push(tokens[idx]);
        }
      }
    });

    // Remove invalid tokens from DB
    if (invalidTokens.length > 0) {
      const { default: User } = await import("../models/user.js");

      await User.updateMany(
        { fcmtoken: { $in: invalidTokens } },
        { $unset: { fcmtoken: "" } }
      );

      console.log(`🧹 Removed ${invalidTokens.length} invalid tokens from DB`);
    }

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
    };

  } catch (error) {
    console.error("❌ Error sending multiple notifications:", error);
    return {
      successCount: 0,
      failureCount: 0,
    };
  }
};


// ===================================
// Send notification to FAMILY members
// ===================================
export const sendNotificationToFamily = async (familyId, notification) => {
  try {
    initializeFirebase();

    const { default: User } = await import("../models/user.js");

    const users = await User.find({ family: familyId }).select("fcmtoken");

    const tokens = users
      .map(user => user.fcmtoken)
      .filter(Boolean);

    if (!tokens.length) {
      console.log("⚠ No FCM tokens found for family members");
      return {
        successCount: 0,
        failureCount: 0,
      };
    }

    console.log(`📢 Sending notification to ${tokens.length} family members`);

    return await sendNotificationToMultiple(tokens, notification);

  } catch (error) {
    console.error("❌ Error sending to family:", error);
    return {
      successCount: 0,
      failureCount: 0,
    };
  }
};


// ===================================
// Send notification to specific USER
// ===================================
export const sendNotificationToUser = async (userId, notification) => {
  try {
    initializeFirebase();

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


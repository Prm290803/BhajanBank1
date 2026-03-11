import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
export const auth = getAuth(app);

const backendUrl = import.meta.env.VITE_BACKENDURL;

const TOKEN_CACHE_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days

// ========================================
// Get FCM Token
// ========================================
export const getFCMToken = async () => {
  try {

    if (!("Notification" in window)) {
      console.log("❌ Browser does not support notifications");
      return null;
    }

    const authToken = localStorage.getItem("token");

    const storedToken = localStorage.getItem("fcmToken");
    const tokenTimestamp = localStorage.getItem("fcmTokenTimestamp");

    // ====================================
    // Use cached token if still valid
    // ====================================
    if (storedToken && tokenTimestamp) {

      const age = Date.now() - parseInt(tokenTimestamp);

      if (age < TOKEN_CACHE_TIME) {

        try {
          await fetch(`${backendUrl}/api/save-fcm-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ token: storedToken }),
          });

          console.log("✅ Cached FCM token synced");

        } catch (err) {
          console.error("❌ Failed syncing cached token", err);
        }

        return storedToken;
      }
    }

    // ====================================
    // Register service worker
    // ====================================
    const registration =
      (await navigator.serviceWorker.getRegistration()) ||
      (await navigator.serviceWorker.register("/firebase-messaging-sw.js"));

    // ====================================
    // Ask notification permission
    // ====================================
    let permission = Notification.permission;

    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    if (permission !== "granted") {

      console.warn("⚠ Notification permission denied");

      localStorage.setItem("notificationPermissionDenied", "true");
      localStorage.setItem("permissionDeniedTime", Date.now().toString());

      return null;
    }

    localStorage.removeItem("notificationPermissionDenied");
    localStorage.removeItem("permissionDeniedTime");

    // ====================================
    // Generate token
    // ====================================
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.error("❌ Failed generating FCM token");
      return null;
    }

    // Store locally
    localStorage.setItem("fcmToken", token);
    localStorage.setItem("fcmTokenTimestamp", Date.now().toString());

    // ====================================
    // Sync with backend
    // ====================================
    try {

      await fetch(`${backendUrl}/api/save-fcm-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ token }),
      });

      console.log("✅ FCM token saved to backend");

    } catch (err) {
      console.error("❌ Failed saving token", err);
    }

    return token;

  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
    return null;
  }
};

// ========================================
// Refresh Token if Firebase rotates it
// ========================================
export const refreshFCMToken = async () => {
  try {

    const registration = await navigator.serviceWorker.getRegistration();

    if (!registration) return;

    const newToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    const storedToken = localStorage.getItem("fcmToken");

    if (newToken && newToken !== storedToken) {

      const authToken = localStorage.getItem("token");

      localStorage.setItem("fcmToken", newToken);
      localStorage.setItem("fcmTokenTimestamp", Date.now().toString());

      await fetch(`${backendUrl}/api/save-fcm-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ token: newToken }),
      });

      console.log("🔄 FCM token refreshed");

    }

  } catch (error) {
    console.error("❌ Token refresh error:", error);
  }
};

// ========================================
// Remove Token (Logout)
// ========================================
export const clearFCMToken = async () => {

  const token = localStorage.getItem("fcmToken");
  const authToken = localStorage.getItem("token");

  try {

    if (token) {

      await fetch(`${backendUrl}/api/remove-fcm-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ token }),
      });

      console.log("🧹 Token removed from backend");
    }

  } catch (err) {
    console.error("❌ Failed removing token", err);
  }

  localStorage.removeItem("fcmToken");
  localStorage.removeItem("fcmTokenTimestamp");
  localStorage.removeItem("notificationPermissionDenied");
  localStorage.removeItem("permissionDeniedTime");

  console.log("🧹 Local FCM cache cleared");
};

// ========================================
// Foreground Notifications
// ========================================
onMessage(messaging, (payload) => {

  console.log("📨 Foreground notification:", payload);

  if (payload.notification && Notification.permission === "granted") {

    const { title, body } = payload.notification;

    new Notification(title, {
      body,
      icon: "/1.png",
      badge: "/1.png",
    });

  }

});
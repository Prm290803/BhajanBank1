import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBA7dGKKM-QqWEw6XOMWXPmfljqM9nBYxg",
  authDomain: "bhajan-bank-d8e0a.firebaseapp.com",
  projectId: "bhajan-bank-d8e0a",
  storageBucket: "bhajan-bank-d8e0a.firebasestorage.app",
  messagingSenderId: "135110860650",
  appId: "1:135110860650:web:6bd4da5149c4a51e90cf13",
  measurementId: "G-7DMH0NNB49"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const getFCMToken = async (userId = null) => {
  try {
    // First, check if notifications are supported
    if (!("Notification" in window)) {
      console.log("❌ This browser does not support notifications");
      return null;
    }

    // Check if we already have a valid token in localStorage
    const storedToken = localStorage.getItem('fcmToken');
    const tokenTimestamp = localStorage.getItem('fcmTokenTimestamp');
    
    // If token exists and is less than 7 days old, return it
    if (storedToken && tokenTimestamp) {
      const age = Date.now() - parseInt(tokenTimestamp);
      if (age < 7 * 24 * 60 * 60 * 1000) {
        console.log("✅ Using cached FCM token");
        return storedToken;
      } else {
        console.log("🔄 Cached FCM token expired, getting new one");
      }
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("✅ Service Worker registered for FCM");

    // Check current permission
    let permission = Notification.permission;
    
    if (permission === "default") {
      // Ask for permission
      permission = await Notification.requestPermission();
    }
    
    if (permission !== "granted") {
      console.warn("⚠ Notification permission not granted");
      
      // Store a flag to not ask again immediately
      localStorage.setItem('notificationPermissionDenied', 'true');
      localStorage.setItem('permissionDeniedTime', Date.now().toString());
      
      return null;
    }

    // Clear denial flag if permission is granted
    localStorage.removeItem('notificationPermissionDenied');
    localStorage.removeItem('permissionDeniedTime');

    // Get new token
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("✅ New FCM Token generated:", token.substring(0, 20) + "...");
      
      // Store locally
      localStorage.setItem('fcmToken', token);
      localStorage.setItem('fcmTokenTimestamp', Date.now().toString());
      
      return token;
    } else {
      console.error("❌ No FCM token generated - check VAPID key and service worker");
      return null;
    }

  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
    return null;
  }
};

export const clearFCMToken = () => {
  localStorage.removeItem('fcmToken');
  localStorage.removeItem('fcmTokenTimestamp');
  localStorage.removeItem('notificationPermissionDenied');
  localStorage.removeItem('permissionDeniedTime');
  console.log("✅ FCM tokens cleared from localStorage");
};

// Handle foreground messages
onMessage(messaging, (payload) => {
  console.log("📨 Foreground message received:", payload);
  
  // Show notification if app is in foreground
  if (payload.notification) {
    const { title, body } = payload.notification;
    
    // Check if we can show notifications
    if (Notification.permission === "granted") {
      new Notification(title, { 
        body, 
        icon: "/1.png",
        badge: "/1.png"
      });
    }
  }
});
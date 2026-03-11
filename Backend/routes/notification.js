// backend/routes/notification.js
import express from "express";
import { sendNotification, sendNotificationToFamily } from "../utils/fcm.js";
import User from "../models/user.js";
import Family from "../models/Family.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


// Save or update FCM token for logged-in user
router.post("/save-fcm-token", authMiddleware, async (req, res) => {
  try {
    const { token } = req.body;

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    await User.findByIdAndUpdate(req.userId, {
      fcmtoken: token
    });

    res.json({
      success: true,
      message: "FCM token saved successfully"
    });

  } catch (error) {
    console.error("Save FCM token error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});


// Test notification (no auth required)
router.get("/test", async (req, res) => {
  try {
    const token = "f_xIOOPhH7OVKmQ1Zv-bEB:APA91bGsY44ImdEnxOxCgCs5IevdcXDPXmajuIFWGJofxMOHx59l3jv11yTdB32L5zOSFVfFoBfE69Va9nJu4xPGxFylzNmYggpY-1JJ-2f31IIrQNKMxHg";

    const success = await sendNotification(token, {
      title: "🎯 Test Notification",
      body: "This is a test notification from BhajanBank!",
      data: {
        type: "test",
        timestamp: new Date().toISOString(),
        click_action: "/"
      }
    });

    if (success) {
      res.json({ 
        success: true, 
        message: "✅ Test notification sent successfully!" 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: "❌ Failed to send test notification" 
      });
    }
  } catch (error) {
    console.error("Test notification error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

// Send notification to logged-in user (for testing)
router.post("/send-to-me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.fcmtoken) {
      return res.status(400).json({
        success: false,
        message: "User not found or no FCM token available"
      });
    }

    const { title, body, data } = req.body;

    const success = await sendNotification(user.fcmtoken, {
      title: title || "📱 BhajanBank Notification",
      body: body || "You have a new notification!",
      data: data || {}
    });

    if (success) {
      res.json({
        success: true,
        message: "✅ Notification sent to your device"
      });
    } else {
      res.status(500).json({
        success: false,
        message: "❌ Failed to send notification"
      });
    }
  } catch (error) {
    console.error("Send to me error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Send notification to all family members
router.post("/send-to-family", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.family) {
      return res.status(400).json({
        success: false,
        message: "User not found or not in a family"
      });
    }

    const { title, body, data } = req.body;

    const result = await sendNotificationToFamily(user.family._id, {
      title: title || "👨‍👩‍👧‍👦 Family Notification",
      body: body || "New family notification!",
      data: data || {}
    });

    if (result) {
      res.json({
        success: true,
        message: `✅ Notification sent to family members`,
        ...result
      });
    } else {
      res.status(500).json({
        success: false,
        message: "❌ Failed to send to family"
      });
    }
  } catch (error) {
    console.error("Send to family error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Get user's FCM token status
router.get("/my-token", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("fcmtoken");
    
    res.json({
      success: true,
      hasToken: !!user.fcmtoken,
      token: user.fcmtoken || null,
      message: user.fcmtoken 
        ? "✅ FCM token is registered" 
        : "❌ No FCM token found"
    });
  } catch (error) {
    console.error("Get token error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

export default router;
// routes/userRoutes.js
import express from "express";
import authMiddleware from "../middleware/auth.js";
import User from "../models/user.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs";
import Task from "../models/Task.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Get logged-in user
router.get("/api/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/save-token", authMiddleware, async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user._id; // Get userId from authenticated user

    if (!token) {
      return res.status(400).json({ message: "Missing token" });
    }

    await User.findByIdAndUpdate(userId, { fcmtoken: token });
    res.json({ success: true, message: "Token saved" });
  } catch (error) {
    console.error("Error saving FCM token:", error);
    res.status(500).json({ message: "Failed to save token" });
  }
});

// Upload / Update Profile Photo
router.post("/api/user/upload-photo", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "user_profiles",
      public_id: `user_${user._id}`,
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: "fill" },
        { quality: "auto" }
      ]
    });

    // Use async delete (non-blocking)
    fs.unlink(req.file.path, () => {});

    user.profilePic = uploadResult.secure_url;
    await user.save();

    res.json({
      message: "Profile picture updated successfully",
      profilePic: user.profilePic
    });

  } catch (err) {
    console.error("Upload photo error:", err);
    res.status(500).json({ error: "Failed to upload photo" });
  }
});

// Delete profile photo (revert to default)
router.delete("/api/user/delete-photo", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.profilePic && !user.profilePic.includes("default_profile")) {
      const oldPublicId = user.profilePic.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`user_profiles/${oldPublicId}`).catch(() => {});
    }

    user.profilePic = "https://res.cloudinary.com/demo/image/upload/v1690000000/default_profile.jpg";
    await user.save();

    res.json({ message: "Profile picture reset to default", profilePic: user.profilePic });
  } catch (err) {
    console.error("Delete photo error:", err);
    res.status(500).json({ error: "Failed to delete photo" });
  }
});

router.get("/api/profile-summary", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();

    let start = new Date(now);
    start.setHours(2, 0, 0, 0);

    let end = new Date(start);
    end.setDate(end.getDate() + 1);

    if (now < start) {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    }

    const past10Start = new Date(start);
    past10Start.setDate(start.getDate() - 9);

    // 🔥 ONE DB QUERY ONLY
    const allTasks = await Task.find({
      user: userId,
      date: { $gte: past10Start, $lt: end }
    }).sort({ date: -1 });

    const todayTasks = allTasks.filter(
      t => t.date >= start && t.date < end
    );

    let allTimePoints = 0;
    let allTimeCount = 0;
    const activeDaysSet = new Set();

    allTasks.forEach(doc => {
      activeDaysSet.add(doc.date.toDateString());
      allTimePoints += doc.summary?.grandTotalPoints || 0;
      allTimeCount += doc.summary?.totalCount || 0;
    });

    res.json({
      todayTasks,
      pastTasks: allTasks,
      allTimePoints,
      allTimeCount,
      activeDays: activeDaysSet.size
    });

  } catch (err) {
    console.error("Profile summary error:", err);
    res.status(500).json({ error: "Failed to fetch profile summary" });
  }
});

export default router;

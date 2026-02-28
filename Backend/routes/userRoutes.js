// routes/userRoutes.js
import express from "express";
import authMiddleware from "../middleware/auth.js";
import User from "../models/user.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs";

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

// Save FCM Token
// router.post("/save-token", async (req, res) => {
//   const { userId, token } = req.body;

//   if (!userId || !token)
//     return res.status(400).json({ message: "Missing userId or token" });

//   await User.findByIdAndUpdate(userId, { fcmtoken: token });
//   res.json({ success: true, message: "Token saved" });
// });
router.post("/save-token", async (req, res) => {
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
    });

    fs.unlinkSync(req.file.path);

    user.profilePic = uploadResult.secure_url;
    await user.save();

    res.json({ message: "Profile picture updated successfully", profilePic: user.profilePic });
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

export default router;

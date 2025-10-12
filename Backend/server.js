import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import User from './models/user.js';
import Task from './models/Task.js';
import authMiddleware from './middleware/auth.js';
import bcrypt from 'bcryptjs';
const app = express();
import { nanoid } from 'nanoid';
import Family from './models/Family.js';

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer config for temporary uploads
const upload = multer({ dest: "uploads/" });

app.use(express.json());

// const webpush = require("web-push");
// const bodyParser = require("body-parser");

// app.use(bodyParser.json());

// const vapidKeys = webpush.generateVAPIDKeys(); 
// // Generate once, save keys in .env
// webpush.setVapidDetails(
//   "mailto:you@example.com",
//   process.env.VAPID_PUBLIC_KEY,
//   process.env.VAPID_PRIVATE_KEY
// );

// let subscriptions = [];

// // Save subscription
// app.post("/api/subscribe", (req, res) => {
//   const subscription = req.body;
//   subscriptions.push(subscription);
//   res.status(201).json({});
// });

// // Send a test notification
// app.post("/api/notify", (req, res) => {
//   const payload = JSON.stringify({ title: "Hello", body: "This is a test!" });
//   subscriptions.forEach(sub => {
//     webpush.sendNotification(sub, payload).catch(err => console.error(err));
//   });
//   res.send("Notifications sent");
// });


  
  // MongoDB Connection
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
  
  // Middleware
  app.use(cors({
    origin: 'https://bhajan-bank1.vercel.app',
    // origin: ['http://localhost:5173'],
    credentials: true
  }));
  

// Routes
app.post('/api/register', async (req, res) => {
  try {
    // console.log(req.body, 'This is the request')
    const { name, email, password } = req.body;
    
      if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }


  // Check if email exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ error: "Email already registered!" });
  }


// Try now for registering ...>.  
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters!" });
  }


    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }


    // Create new user
    user = new User({
      name,
      email,
      // password: await argon2.hash(password)
      // password: await bcrypt.hash(password,10)
      password: mopassword
    });
    // console.log(user,'This is the user')
    await user.save();

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    // console.log(token, 'This is the token')
    res.status(201).json({ 
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' }); // Consistent error key
  }
});

//reset password
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // bcrypt requires saltRounds
    const saltRounds = 10;
    user.password = await bcrypt.hash(newPassword, saltRounds);

    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

//login 
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email); // Debug log
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found'); // Debug
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2. Debug password comparison
    console.log('Stored hash:', user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ 
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Server error" });
  }
});

// =============================
// 📸 Profile Picture Management
// =============================

// Upload / Update Profile Photo
app.post("/api/user/upload-photo", authMiddleware, upload.single("photo"), async (req, res) => {
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
app.delete("/api/user/delete-photo", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Delete Cloudinary image if custom
    if (user.profilePic && !user.profilePic.includes("default_profile")) {
      const oldPublicId = user.profilePic.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`user_profiles/${oldPublicId}`).catch(() => {});
    }

    // Set back to default
    user.profilePic = "https://res.cloudinary.com/demo/image/upload/v1690000000/default_profile.jpg";
    await user.save();

    res.json({ message: "Profile picture reset to default", profilePic: user.profilePic });
  } catch (err) {
    console.error("Delete photo error:", err);
    res.status(500).json({ error: "Failed to delete photo" });
  }
});




// Protected routes
app.get("/api/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // hide password
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const { tasks } = req.body;
    const userId = req.userId;

    // Validate tasks exists and is an array
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: 'Tasks must be a non-empty array' });
    }

    // Validate each task object
    for (const task of tasks) {
      if (!task.task || typeof task.task !== 'string') {
        return res.status(400).json({ error: 'Each task must have a "task" string field' });
      }
      if (typeof task.points !== 'number' || task.points <= 0) {
        return res.status(400).json({ error: 'Each task must have positive "points" number' });
      }
      if (typeof task.count !== 'number' || task.count <= 0) {
        return res.status(400).json({ error: 'Each task must have positive "count" number' });
      }
    }

    // Create the task document
    const savedTaskDoc = await Task.create({
      user: userId,
      date: new Date(),
      tasks: tasks.map(task => ({
        task: task.task,
        points: task.points,
        count: task.count,
        totalPoints: task.points * task.count // Calculate and store totalPoints
      }))
    });

    res.status(201).json(savedTaskDoc);
  } catch (err) {
    console.error('Task creation error:', err);
    res.status(500).json({ error: 'Failed to create tasks' });
  }
});




app.get('/api/tasks', authMiddleware, async (req, res) => {
  try {
    // const userId = req.userId;
    const now = new Date();

    // Create a boundary at 4 AM
    let start = new Date(now);
    start.setHours(4, 0, 0, 0);

    let end = new Date(start);
    end.setDate(end.getDate() + 1); // next day 4 AM

    // If current time is before 4 AM, shift to previous day
    if (now < start) {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    }

    const tasks = await Task.find({
      // user: userId,  // keep if filtering by user
      date: { $gte: start, $lt: end }
    }).populate('user', 'name');

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/leaderboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const leaderboard = await Task.aggregate([
     
    ]);

    res.json(leaderboard || []); // Always return array
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json([]);
  }
});
app.get("/api/taskuser", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();

    // Create a 4 AM day boundary
    let start = new Date(now);
    start.setHours(4, 0, 0, 0);

    let end = new Date(start);
    end.setDate(end.getDate() + 1); // next day 4 AM

    // If current time is before 4 AM, shift to previous day
    if (now < start) {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    }

    const tasks = await Task.find({
      user: userId, // ✅ filter only tasks belonging to this user
      date: { $gte: start, $lt: end },
    }).populate("user", "name");

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});


// Delete entire task document by ID
app.delete("/api/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const taskDoc = await Task.findById(req.params.id);
    if (!taskDoc) return res.status(404).json({ error: "Task not found" });

    // only allow owner to delete
    if (taskDoc.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await taskDoc.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Task delete error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Update subtask count
app.put("/api/tasks/:taskId/:subtaskId", authMiddleware, async (req, res) => {
  try {
    const { count } = req.body;
    const { taskId, subtaskId } = req.params;

    if (typeof count !== "number" || count < 0) {
      return res.status(400).json({ error: "Count must be a positive number" });
    }

    const taskDoc = await Task.findById(taskId);
    if (!taskDoc) return res.status(404).json({ error: "Task not found" });

    if (taskDoc.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const subtask = taskDoc.tasks.id(subtaskId);
    if (!subtask) return res.status(404).json({ error: "Subtask not found" });

    subtask.count = count;
    subtask.totalPoints = subtask.points * count;

    await taskDoc.save();
    res.json(taskDoc);
  } catch (err) {
    console.error("Task update error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});


//update family's totalPoints
// utils/updateFamilyPoints.js


export const updateFamilyPoints = async (familyId) => {
  const family = await Family.findById(familyId).populate('members', '_id');
  if (!family) return null;

  const memberIds = family.members.map(m => m._id);
  const now = new Date();
  let start = new Date(now);
  start.setHours(4, 0, 0, 0);

  let end = new Date(start);
  end.setDate(end.getDate() + 1);

  // If current time is before 4 AM, shift window to previous day
  if (now < start) {
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate() - 1);
  }
  // Sum all grandTotalPoints for tasks belonging to these members
 const result = await Task.aggregate([
    { 
      $match: { 
        user: { $in: memberIds },
        date: { $gte: start, $lt: end }
      } 
    },
    { $group: { _id: null, totalPoints: { $sum: "$summary.grandTotalPoints" } } }
  ]);

  const totalPoints = result.length ? result[0].totalPoints : 0;

  family.totalPoints = totalPoints;
  await family.save();

  return family;
};


//family routes would go here
//create family


app.post("/api/create-family", async (req, res) => {
  try {
    const { userId, familyName } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.family) {
      return res.status(400).json({ error: "User already belongs to a family" });
    }

    const code = nanoid(8);

    const family = new Family({
      name: familyName,
      code,
      members: [user._id],
    });
    await family.save();

    user.family = family._id;
    await user.save();

    // 💡 Automatically recalculate after linking
    const updatedFamily = await updateFamilyPoints(family._id);

    res.json({
      message: "Family created successfully",
      familyCode: family.code,
      familyId: family._id,
      totalPoints: updatedFamily.totalPoints,
    });
  } catch (err) {
    console.error("Create family error:", err);
    res.status(500).json({ error: "Failed to create family" });
  }
});




// app.post("/api/create-family", async (req, res) => {
//   try {
//     const { userId, familyName } = req.body;

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // Check if user already in a family
//     if (user.family) {
//       return res.status(400).json({ error: "User already belongs to a family" });
//     }

    
//     const code = nanoid(8);

  
//     const userPoints = user.points || 0;

//     const family = new Family({
//       name: familyName,
//       code,
//       members: [user._id],
//       totalPoints: userPoints, // ← this is the fix
//     });
//     await family.save();

//     // ✅ Link user to family
//     user.family = family._id;
//     await user.save();

//     res.json({
//       message: "Family created successfully",
//       familyCode: code,
//       familyId: family._id,
//       totalPoints: family.totalPoints,
//     });
//   } catch (err) {
//     console.error("Create family error:", err);
//     res.status(500).json({ error: "Failed to create family" });
//   }
// });

app.get("/api/families/:id", async (req, res) => {
  try {
    const family = await Family.findById(req.params.id)
      .populate("members", "name email") // optional
      .lean();

    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }

    res.json(family);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// //join family
app.post("/api/join-family", async (req, res) => {
  try {
    const { userId, code } = req.body;  
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });    
    const family = await Family.findOne({ code  });

    if (!family) return res.status(404).json({ error: "Family not found" });    
    if (user.family) {
      return res.status(400).json({ error: "User already in a family" });
    }   

    // Add user to family   
    family.members.push(user._id);
    await family.save();    
    user.family = family._id;
    await user.save();    

    // 💡 Auto update total points
    const updatedFamily = await updateFamilyPoints(family._id);
    res.json({
      message: "Joined family successfully", 
      totalPoints: updatedFamily.totalPoints,
      familyId: family._id
    });
  } catch (err) {
    console.error("Join family error:", err);
    res.status(500).json({ error: "Failed to join family" });
  } 
});


// app.post("/api/join-family", async (req, res) => {
//   try {
//     const { userId, code } = req.body;

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const family = await Family.findOne({ code });
//     if (!family) return res.status(404).json({ error: "Family not found" });

//     if (user.family) {
//       return res.status(400).json({ error: "User already in a family" });
//     }

//     // Add user to family
//     family.members.push(user._id);
//     await family.save();

//     user.family = family._id;
//     await user.save();

//     // 💡 Auto update total points
//     const updatedFamily = await updateFamilyPoints(family._id);

//     res.json({
//       message: "Joined family successfully",
//       totalPoints: updatedFamily.totalPoints,
//       familyId: family._id

//     });
//   } catch (err) {
//     console.error("Join family error:", err);
//     res.status(500).json({ error: "Failed to join family" });
//   }
// });



//leave family
app.post("/api/leave-family", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });  
    if (!user.family) {
      return res.status(400).json({ error: "User not in a family" });
    }

    const family = await Family.findById(user.family);  
    if (!family) {
      user.family = null;
      await user.save();
      return res.status(404).json({ error: "Family not found" });
    }
    // 💡 Auto update total points
  const updatedFamily = await updateFamilyPoints(family._id);

    family.members = family.members.filter(
      (memberId) => memberId.toString() !== user._id.toString()
    );  
    await family.save();
    user.family = null;
    await user.save();  
    res.json({ message: "Left family successfully",
    totalPoints: updatedFamily.totalPoints
     });
  } catch (err) {
    console.error("Leave family error:", err);
    res.status(500).json({ error: "Failed to leave family" });
  }
});


// Example: user earns points
app.post("/api/add-points", async (req, res) => {
  const { userId, earnedPoints } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.points += earnedPoints;
    await user.save();

    // 💡 Update the family’s total automatically
    if (user.family) {
      await updateFamilyPoints(user.family);
    }

    res.json({ message: "Points added successfully" });
  } catch (err) {
    console.error("Add points error:", err);
    res.status(500).json({ error: "Failed to add points" });
  }
});


//family leaderboard
// GET family leaderboard
app.get("/family-leaderboard", authMiddleware, async (req, res) => {
  try {
    // Find the logged-in user
    const user = await User.findById(req.userId).populate("family");
    if (!user || !user.family) {
      return res.status(400).json({ error: "You are not part of any family" });
    }

    // Get the family and members
    const family = await Family.findById(user.family._id).populate("members");

    // Calculate points for each member
    const membersWithPoints = await Promise.all(
      family.members.map(async (member) => {
        const tasks = await Task.find({ user: member._id });
        const totalPoints = tasks.reduce(
          (sum, t) => sum + (t.summary?.grandTotalPoints || 0),
          0
        );
        return {
          _id: member._id,
          name: member.name,
          points: totalPoints,
        };
      })
    );

    // Sort by points descending
    membersWithPoints.sort((a, b) => b.points - a.points);

    res.json({
      familyName: family.name,
      members: membersWithPoints,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



//counting members points 
app.get("/families/today", async (req, res) => {
  try {
    const families = await Family.find()
      .populate("members", "name email")
      .lean();

    const now = new Date();
    let start = new Date(now);
    start.setHours(4, 0, 0, 0);

    let end = new Date(start);
    end.setDate(end.getDate() + 1);

    if (now < start) {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    }

    const familiesWithPoints = [];

    for (let fam of families) {
      const memberIds = fam.members.map(m => m._id);

      const result = await Task.aggregate([
        { 
          $match: { 
            user: { $in: memberIds },
            date: { $gte: start, $lt: end }
          } 
        },
        { $group: { _id: null, totalPoints: { $sum: "$summary.grandTotalPoints" } } }
      ]);

      const totalPoints = result.length > 0 ? result[0].totalPoints : 0;

      familiesWithPoints.push({
        _id: fam._id,
        name: fam.name,
        code: fam.code,
        totalMembers: fam.members.length,
        totalPoints,
        members: fam.members,
        createdAt: fam.createdAt
      });
    }

    // Sort descending
    familiesWithPoints.sort((a, b) => b.totalPoints - a.totalPoints);

    res.json(familiesWithPoints);

  } catch (err) {
    console.error("Error fetching today's family points:", err);
    res.status(500).json({ error: "Failed to fetch today's points" });
  }
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
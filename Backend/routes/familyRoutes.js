// routes/familyRoutes.js
import express from "express";
import authMiddleware from "../middleware/auth.js";
import Family from "../models/Family.js";
import User from "../models/user.js";
import Task from "../models/Task.js";
import { nanoid } from "nanoid";
import { updateFamilyPoints } from "../utils/updateFamilyPoints.js";

const router = express.Router();

/** POST /api/family/goal */
router.post("/api/family/goal", authMiddleware, async (req, res) => {
  try {
    const { goal, goalName } = req.body;
    const userId = req.userId;
    const today = new Date().toISOString().slice(0, 10);

    const family = await Family.findOne({ members: userId });
    if (!family) return res.status(404).json({ message: "Family not found" });

    family.dailyGoal = goal;
    family.goalname = goalName || "Today's Goal";
    family.goalDate = today;
    await family.save();

    res.json({ success: true, goal, goalName: family.goalname });
  } catch (err) {
    res.status(500).json({ message: "Failed to set goal", error: err.message });
  }
});

/** GET /api/family/goal */
router.get("/api/family/goal", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date().toISOString().slice(0, 10);

    const family = await Family.findOne({ members: userId });
    if (!family) return res.status(404).json({ message: "Family not found" });

    if (family.goalDate !== today) {
      return res.json({ goal: 0 });
    }

    res.json({ goal: family.dailyGoal || 0 });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch goal", error: err.message });
  }
});

/** DELETE /api/family/goal */
router.delete("/api/family/goal", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const family = await Family.findOne({ members: userId });
    if (!family) return res.status(404).json({ message: "Family not found" });

    family.dailyGoal = 0;
    family.goalDate = null;
    await family.save();

    res.json({ success: true, message: "Goal deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete goal", error: err.message });
  }
});

/** Create family */
router.post("/api/create-family", async (req, res) => {
  try {
    const { userId, familyName } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.family) {
      return res.status(400).json({ error: "User already belongs to a family" });
    }
    const existingFamily = await Family.findOne({ name: familyName });
    if (existingFamily) {
      return res.status(400).json({ error: "A family with this name already exists" });
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

    const updatedFamily = await updateFamilyPoints(family._id);

    res.json({
      message: "Family created successfully",
      familyCode: family.code,
      familyId: family._id,
      totalPoints: updatedFamily?.totalPoints || 0,
    });
  } catch (err) {
    console.error("Create family error:", err);
    res.status(500).json({ error: "Failed to create family" });
  }
});

/** Get family by id */
router.get("/api/families/:id", async (req, res) => {
  try {
    const family = await Family.findById(req.params.id).populate("members", "name email").lean();

    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }

    res.json(family);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/** Join family */
router.post("/api/join-family", async (req, res) => {
  try {
    const { userId, code } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const family = await Family.findOne({ code });

    if (!family) return res.status(404).json({ error: "Family not found" });
    if (user.family) {
      return res.status(400).json({ error: "User already in a family" });
    }

    family.members.push(user._id);
    await family.save();
    user.family = family._id;
    await user.save();

    const updatedFamily = await updateFamilyPoints(family._id);
    res.json({
      message: "Joined family successfully",
      totalPoints: updatedFamily?.totalPoints || 0,
      familyId: family._id,
    });
  } catch (err) {
    console.error("Join family error:", err);
    res.status(500).json({ error: "Failed to join family" });
  }
});

/** Leave family */
router.post("/api/leave-family", async (req, res) => {
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

    const updatedFamily = await updateFamilyPoints(family._id);

    family.members = family.members.filter((memberId) => memberId.toString() !== user._id.toString());
    await family.save();
    user.family = null;
    await user.save();
    res.json({ message: "Left family successfully", totalPoints: updatedFamily?.totalPoints || 0 });
  } catch (err) {
    console.error("Leave family error:", err);
    res.status(500).json({ error: "Failed to leave family" });
  }
});

/** Add points (keeps same behavior) */
router.post("/api/add-points", async (req, res) => {
  const { userId, earnedPoints } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.points = (user.points || 0) + (earnedPoints || 0);
    await user.save();

    if (user.family) {
      await updateFamilyPoints(user.family);
    }

    res.json({ message: "Points added successfully" });
  } catch (err) {
    console.error("Add points error:", err);
    res.status(500).json({ error: "Failed to add points" });
  }
});

/** Family leaderboard (keeps 0-4AM vs day logic minimal) */
router.get("/family-leaderboard", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("family");
    if (!user || !user.family) {
      return res.status(400).json({ error: "You are not part of any family" });
    }

    const family = await Family.findById(user.family._id).populate("members");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const membersWithPoints = await Promise.all(
      family.members.map(async (member) => {
        const tasks = await Task.find({ user: member._id, date: { $gte: today, $lt: tomorrow } });

        const totalPoints = tasks.reduce((sum, t) => sum + (t.summary?.grandTotalPoints || 0), 0);

        return { _id: member._id, name: member.name, points: totalPoints };
      })
    );

    membersWithPoints.sort((a, b) => b.points - a.points);

    res.json({ familyName: family.name, members: membersWithPoints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/** /families/today (keeps behavior) */
router.get("/families/today", async (req, res) => {
  try {
    const families = await Family.find().populate("members", "name email").lean();

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
      const memberIds = fam.members.map((m) => m._id);

      const result = await Task.aggregate([
        {
          $match: {
            user: { $in: memberIds },
            date: { $gte: start, $lt: end },
          },
        },
        { $group: { _id: null, totalPoints: { $sum: "$summary.grandTotalPoints" } } },
      ]);

      const totalPoints = result.length > 0 ? result[0].totalPoints : 0;

      familiesWithPoints.push({
        _id: fam._id,
        name: fam.name,
        code: fam.code,
        totalMembers: fam.members.length,
        totalPoints,
        members: fam.members,
        createdAt: fam.createdAt,
      });
    }

    familiesWithPoints.sort((a, b) => b.totalPoints - a.totalPoints);

    res.json(familiesWithPoints);
  } catch (err) {
    console.error("Error fetching today's family points:", err);
    res.status(500).json({ error: "Failed to fetch today's points" });
  }
});

export default router;

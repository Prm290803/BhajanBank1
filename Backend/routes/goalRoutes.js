// routes/universalGoalRoutes.js
import express from "express";
import authMiddleware from "../middleware/auth.js";
import UniversalGoal from "../models/UniversalGoal.js";
import Task from "../models/Task.js";
import User from "../models/user.js";

const router = express.Router();

/** Create Universal Goal (Admin only ideally) */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const goal = await UniversalGoal.create(req.body);
    res.json(goal);
  } catch (err) {
    console.error("Create universal goal error:", err);
    res.status(500).json({ error: "Failed to create goal" });
  }
});

/** Get Universal Goal Progress */
router.get("/progress", async (req, res) => {
  try {
    const goal = await UniversalGoal.findOne({ isActive: true });
    if (!goal) return res.json({ message: "No active goal" });

    const matchStage = {
      date: { $gte: goal.startDate, $lte: goal.endDate }
    };

    let pipeline = [
      { $match: matchStage },
      { $unwind: "$tasks" }
    ];

    if (goal.targetType === "task") {
      pipeline.push({
        $match: { "tasks.task": goal.targetName }
      });
    }

    if (goal.targetType === "category") {
      pipeline.push({
        $match: { "tasks.category": goal.targetName }
      });
    }

    pipeline.push({
      $group: {
        _id: "$user",
        total: { $sum: "$tasks.count" }
      }
    });

    const results = await Task.aggregate(pipeline);

    // Get user names
    const userIds = results.map(r => r._id);
    const users = await User.find({ _id: { $in: userIds } });

    const leaderboard = results.map(r => {
      const user = users.find(u => u._id.toString() === r._id.toString());
      return {
        userId: r._id,
        name: user?.name || "Unknown",
        total: r.total
      };
    }).sort((a, b) => b.total - a.total);

    const globalTotal = leaderboard.reduce((sum, r) => sum + r.total, 0);

    res.json({
      goalName: goal.name,
      description: goal.description,
      target: goal.targetCount,
      globalTotal,
      progress: Math.min((globalTotal / goal.targetCount) * 100, 100),
      startDate: goal.startDate,
      endDate: goal.endDate,
      leaderboard
    });

  } catch (err) {
    console.error("Universal goal progress error:", err);
    res.status(500).json({ error: "Failed to calculate progress" });
  }
});

export default router;
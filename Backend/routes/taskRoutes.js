// routes/taskRoutes.js
import express from "express";
import authMiddleware from "../middleware/auth.js";
import Task from "../models/Task.js";
import mongoose from "mongoose";

const router = express.Router();

/** Create tasks (same validation + stored totalPoints per subtask) */
router.post("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const { tasks } = req.body;
    const userId = req.userId;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: "Tasks must be a non-empty array" });
    }

    for (const task of tasks) {
      if (!task.task || typeof task.task !== "string") {
        return res.status(400).json({ error: 'Each task must have a "task" string field' });
      }
      if (typeof task.points !== "number" || task.points <= 0) {
        return res.status(400).json({ error: 'Each task must have positive "points" number' });
      }
      if (typeof task.count !== "number" || task.count <= 0) {
        return res.status(400).json({ error: 'Each task must have positive "count" number' });
      }
    }

    const savedTaskDoc = await Task.create({
      user: userId,
      date: new Date(),
      tasks: tasks.map((task) => ({
        task: task.task,
        points: task.points,
        count: task.count,
        totalPoints: task.points * task.count,
      })),
    });

    res.status(201).json(savedTaskDoc);
  } catch (err) {
    console.error("Task creation error:", err);
    res.status(500).json({ error: "Failed to create tasks" });
  }
});

/** Get today's tasks (keeps your 4 AM boundary logic) */
router.get("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const now = new Date();

    let start = new Date(now);
    start.setHours(2, 0, 0, 0);

    let end = new Date(start);
    end.setDate(end.getDate() + 1);

    if (now < start) {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    }

    const tasks = await Task.find({
      date: { $gte: start, $lt: end },
    }).populate("user", "name");

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/** Leaderboard (placeholder preserved) */
router.get("/api/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Task.aggregate([]);
    res.json(leaderboard || []);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json([]);
  }
});

/** user-specific endpoints that were previously top-level */
router.get("/api/taskuser", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();

    // Set 2 AM as reset boundary
    let start = new Date(now);
    start.setHours(2, 0, 0, 0);

    let end = new Date(start);
    end.setDate(start.getDate() + 1);

    // If current time < 2 AM, shift the window back one day
    if (now < start) {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    }

    const tasks = await Task.find({
      user: userId,
      date: { $gte: start, $lt: end },
    }).populate("user", "name");

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching today's tasks:", err);
    res.status(500).json({ error: "Failed to fetch today's tasks" });
  }
});

router.get("/api/taskuser/past10days", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();

    // Define boundary (2 AM start of the day)
    let todayBoundary = new Date(now);
    todayBoundary.setHours(2, 0, 0, 0);

    if (now < todayBoundary) {
      todayBoundary.setDate(todayBoundary.getDate() - 1);
    }

    // Past 9 days + today
    const past10Boundary = new Date(todayBoundary);
    past10Boundary.setDate(todayBoundary.getDate() - 9);

    // End boundary: tomorrow 4 AM (so we include full today)
    const endBoundary = new Date(todayBoundary);
    endBoundary.setDate(endBoundary.getDate() + 1);

    const tasks = await Task.find({
      user: userId,
      date: { $gte: past10Boundary, $lt: endBoundary },
    }).populate("user", "name");

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching past 10 days tasks:", err);
    res.status(500).json({ error: "Failed to fetch past 10 days tasks" });
  }
});



// router.get("/api/tasks/range", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.userId;
//     const days = parseInt(req.query.days) || 7;

//     const now = new Date();
//     let todayBoundary = new Date(now);
//     todayBoundary.setHours(2, 0, 0, 0);

//     if (now < todayBoundary) {
//       todayBoundary.setDate(todayBoundary.getDate() - 1);
//     }

//     const rangeStart = new Date(todayBoundary);
//     rangeStart.setDate(todayBoundary.getDate() - (days - 1));

//     const tasks = await Task.aggregate([
//       {
//         $match: {
//           user: new mongoose.Types.ObjectId(userId),
//           date: { $gte: rangeStart, $lte: todayBoundary },
//         },
//       },
//       {
//         $addFields: {
//           docTotalPoints: { $sum: "$tasks.totalPoints" },
//         },
//       },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
//           totalPoints: { $sum: "$docTotalPoints" },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     res.json(tasks);
//   } catch (err) {
//     console.error("Error fetching tasks by range:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

/** Get all user tasks summary */
router.get("/api/taskuser/all", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const allTasks = await Task.find({ user: userId }).sort({ date: -1 });

    let allTimePoints = 0;
    let allTimeCount = 0;
    const activeDaysSet = new Set();

    allTasks.forEach((doc) => {
      activeDaysSet.add(doc.date.toDateString());
      allTimePoints += doc.summary?.grandTotalPoints || 0;
      allTimeCount += doc.summary?.totalCount || 0;
    });

    res.json({
      allTasks,
      allTimePoints,
      allTimeCount,
      activeDays: activeDaysSet.size,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch all tasks" });
  }
});

/** Task delete/get/update subtask (preserve auth logic) */
router.delete("/api/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const taskDoc = await Task.findById(req.params.id);
    if (!taskDoc) return res.status(404).json({ error: "Task not found" });

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

router.get("/api/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json(task);
  } catch (err) {
    console.error("Fetch task error:", err);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

router.put("/api/tasks/:taskId/:subtaskId", authMiddleware, async (req, res) => {
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

export default router;


// import express from "express";
// import mongoose from "mongoose";
// import authMiddleware from "../middleware/auth.js";
// import BhajanShatra from "../models/Bhajanshatra.js";
// import BhajanContribution from "../models/BhajanShatraContribution.js";
// import User from "../models/user.js";

// const router = express.Router();


// // ======================================================
// // 1️⃣ Create Shatra (Admin Only)
// // ======================================================
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);

//     if (!user || user.role !== "admin") {
//       return res.status(403).json({ message: "Only admin can create Shatra" });
//     }

//     const { title, description, startDate, endDate, targetCount } = req.body;

//     if (!title || !startDate || !endDate || !targetCount) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     if (new Date(startDate) > new Date(endDate)) {
//       return res.status(400).json({ message: "Start date must be before end date" });
//     }

//     const shatra = await BhajanShatra.create({
//       title,
//       description,
//       startDate,
//       endDate,
//       targetCount: Number(targetCount),
//       createdBy: req.userId
//     });

//     res.status(201).json(shatra);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Creation failed" });
//   }
// });


// // ======================================================
// // 2️⃣ Get All Shatras (including future ones)
// // ======================================================
// router.get("/", async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // Get ALL shatras - no date filter
//     const shatras = await BhajanShatra.find({}).sort({ startDate: -1 });

//     const result = [];

//     for (const shatra of shatras) {
//       const total = await BhajanContribution.aggregate([
//         { $match: { shatra: shatra._id } },
//         { $group: { _id: null, total: { $sum: "$count" } } }
//       ]);

//       const totalCount = total[0]?.total || 0;

//       // Calculate status based on dates
//       const startDate = new Date(shatra.startDate);
//       startDate.setHours(0, 0, 0, 0);
      
//       const endDate = new Date(shatra.endDate);
//       endDate.setHours(23, 59, 59, 999);
      
//       let status;
//       if (today > endDate) {
//         status = "completed";
//       } else if (today >= startDate && today <= endDate) {
//         status = "active";
//       } else {
//         status = "upcoming";
//       }

//       result.push({
//         ...shatra.toObject(),
//         totalContribution: totalCount,
//         progress: Math.min((totalCount / shatra.targetCount) * 100, 100),
//         status
//       });
//     }

//     res.json(result);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Fetch failed" });
//   }
// });


// // ======================================================
// // 3️⃣ Add Contribution (1 Entry Per Day)
// // ======================================================
// router.post("/:id/contribute", authMiddleware, async (req, res) => {
//   try {
//     const { count } = req.body;
//     const shatraId = req.params.id;
//     const userId = req.userId;

//     if (!count || count <= 0) {
//       return res.status(400).json({ message: "Invalid count" });
//     }

//     const shatra = await BhajanShatra.findById(shatraId);
//     if (!shatra) {
//       return res.status(404).json({ message: "Shatra not found" });
//     }

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // Check if contribution is allowed based on dates
//     const startDate = new Date(shatra.startDate);
//     startDate.setHours(0, 0, 0, 0);
    
//     const endDate = new Date(shatra.endDate);
//     endDate.setHours(23, 59, 59, 999);

//     if (today < startDate) {
//       return res.status(400).json({ message: "This shatra hasn't started yet" });
//     }

//     if (today > endDate) {
//       return res.status(400).json({ message: "This shatra has ended" });
//     }

//     const existing = await BhajanContribution.findOne({
//       shatra: shatraId,
//       user: userId,
//       date: today
//     });

//     if (existing) {
//       existing.count += Number(count);
//       await existing.save();
//     } else {
//       await BhajanContribution.create({
//         shatra: shatraId,
//         user: userId,
//         date: today,
//         count: Number(count)
//       });
//     }

//     res.json({ success: true });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Contribution failed" });
//   }
// });


// // ======================================================
// // 4️⃣ Leaderboard (Top 10 + User Rank)
// // ======================================================
// router.get("/:id/leaderboard", authMiddleware, async (req, res) => {
//   try {
//     const shatraId = req.params.id;
//     const userId = req.userId;

//     const leaderboard = await BhajanContribution.aggregate([
//       { $match: { shatra: new mongoose.Types.ObjectId(shatraId) } },
//       {
//         $group: {
//           _id: "$user",
//           total: { $sum: "$count" }
//         }
//       },
//       { $sort: { total: -1 } }
//     ]);

//     const userIds = leaderboard.map(l => l._id);

//     const users = await User.find({ _id: { $in: userIds } })
//       .select("name");

//     const userMap = {};
//     users.forEach(u => {
//       userMap[u._id.toString()] = u.name;
//     });

//     const formatted = leaderboard.map((entry, index) => ({
//       rank: index + 1,
//       userId: entry._id,
//       name: userMap[entry._id.toString()] || "Unknown",
//       total: entry.total
//     }));

//     const top10 = formatted.slice(0, 10);

//     const userRank = formatted.find(
//       u => u.userId.toString() === userId
//     );

//     res.json({
//       top10,
//       userRank: userRank || null
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Leaderboard error" });
//   }
// });

// export default router;


import express from "express";
import mongoose from "mongoose";
import authMiddleware from "../middleware/auth.js";
import BhajanShatra from "../models/Bhajanshatra.js";
import BhajanContribution from "../models/BhajanShatraContribution.js";
import User from "../models/user.js";

const router = express.Router();


// ======================================================
// 1️⃣ Create Shatra (Admin Only)
// ======================================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create Shatra" });
    }

    const { title, description, startDate, endDate, targetCount } = req.body;

    if (!title || !startDate || !endDate || !targetCount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: "Start date must be before end date" });
    }

    const shatra = await BhajanShatra.create({
      title,
      description,
      startDate,
      endDate,
      targetCount: Number(targetCount),
      createdBy: req.userId
    });

    res.status(201).json(shatra);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Creation failed" });
  }
});


// ======================================================
// 2️⃣ Get All Shatras (including future ones)
// ======================================================
// router.get("/", async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // Get ALL shatras - no date filter
//     const shatras = await BhajanShatra.find({}).sort({ startDate: -1 });

//     const result = [];

//     for (const shatra of shatras) {
//       const total = await BhajanContribution.aggregate([
//         { $match: { shatra: shatra._id } },
//         { $group: { _id: null, total: { $sum: "$count" } } }
//       ]);

//       const totalCount = total[0]?.total || 0;

//       // Calculate status based on dates
//       const startDate = new Date(shatra.startDate);
//       startDate.setHours(0, 0, 0, 0);
      
//       const endDate = new Date(shatra.endDate);
//       endDate.setHours(23, 59, 59, 999);
      
//       let status;
//       if (today > endDate) {
//         status = "completed";
//       } else if (today >= startDate && today <= endDate) {
//         status = "active";
//       } else {
//         status = "upcoming";
//       }

//       result.push({
//         ...shatra.toObject(),
//         totalContribution: totalCount,
//         progress: Math.min((totalCount / shatra.targetCount) * 100, 100),
//         status
//       });
//     }

//     res.json(result);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Fetch failed" });
//   }
// });

// routes/bhajanShatra.js - Update GET endpoint

// ======================================================
// 2️⃣ Get All Shatras
// ======================================================
router.get("/", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get ALL shatras with their stored values
    const shatras = await BhajanShatra.find({}).sort({ startDate: -1 });

    const result = shatras.map(shatra => {
      // Calculate status based on dates
      const startDate = new Date(shatra.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(shatra.endDate);
      endDate.setHours(23, 59, 59, 999);
      
      let status;
      if (today > endDate) {
        status = "completed";
      } else if (today >= startDate && today <= endDate) {
        status = "active";
      } else {
        status = "upcoming";
      }

      return {
        ...shatra.toObject(),
        progress: Math.min((shatra.totalContributions / shatra.targetCount) * 100, 100),
        status
      };
    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch failed" });
  }
});
// routes/bhajanShatra.js - Update the contribute endpoint

// ======================================================
// 3️⃣ Add Contribution (1 Entry Per Day)
// ======================================================
router.post("/:id/contribute", authMiddleware, async (req, res) => {
  try {
    const { count } = req.body;
    const shatraId = req.params.id;
    const userId = req.userId;

    if (!count || count <= 0) {
      return res.status(400).json({ message: "Invalid count" });
    }

    const shatra = await BhajanShatra.findById(shatraId);
    if (!shatra) {
      return res.status(404).json({ message: "Shatra not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if contribution is allowed
    const startDate = new Date(shatra.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(shatra.endDate);
    endDate.setHours(23, 59, 59, 999);

    if (today < startDate) {
      return res.status(400).json({ message: "This shatra hasn't started yet" });
    }

    if (today > endDate) {
      return res.status(400).json({ message: "This shatra has ended" });
    }

    // Check if this user has contributed before
    const existing = await BhajanContribution.findOne({
      shatra: shatraId,
      user: userId,
      date: today
    });

    // Check if this is the user's first ever contribution to this shatra
    const isFirstContribution = !await BhajanContribution.findOne({
      shatra: shatraId,
      user: userId
    });

    if (existing) {
      // Update existing contribution
      existing.count += Number(count);
      await existing.save();
      
      // Update total contributions only
      await BhajanShatra.updateOne(
        { _id: shatraId },
        { 
          $inc: { totalContributions: Number(count) },
          $set: { lastContributionAt: new Date() }
        }
      );
    } else {
      // Create new contribution
      await BhajanContribution.create({
        shatra: shatraId,
        user: userId,
        date: today,
        count: Number(count)
      });
      
      // Update total contributions AND increment contributor count if first time
      const updateOps = {
        $inc: { 
          totalContributions: Number(count),
          ...(isFirstContribution && { totalContributors: 1 })
        },
        $set: { lastContributionAt: new Date() }
      };
      
      await BhajanShatra.updateOne(
        { _id: shatraId },
        updateOps
      );
    }

    // Get the updated shatra to return
    const updatedShatra = await BhajanShatra.findById(shatraId);

    res.json({ 
      success: true,
      totalContributors: updatedShatra.totalContributors,
      totalContributions: updatedShatra.totalContributions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Contribution failed" });
  }
});

// ======================================================
// 4️⃣ Leaderboard (Top 10 + User Rank)
// ======================================================
router.get("/:id/leaderboard", authMiddleware, async (req, res) => {
  try {
    const shatraId = req.params.id;
    const userId = req.userId;

    const leaderboard = await BhajanContribution.aggregate([
      { $match: { shatra: new mongoose.Types.ObjectId(shatraId) } },
      {
        $group: {
          _id: "$user",
          total: { $sum: "$count" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const userIds = leaderboard.map(l => l._id);

    const users = await User.find({ _id: { $in: userIds } })
      .select("name");

    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u.name;
    });

    const formatted = leaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry._id,
      name: userMap[entry._id.toString()] || "Unknown",
      total: entry.total
    }));

    const top10 = formatted.slice(0, 10);

    const userRank = formatted.find(
      u => u.userId.toString() === userId
    );

    res.json({
      top10,
      userRank: userRank || null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Leaderboard error" });
  }
});


// ======================================================
// 5️⃣ NEW: Get All Contributors with Details
// ======================================================
router.get("/:id/contributors", authMiddleware, async (req, res) => {
  try {
    const shatraId = req.params.id;
    const { page = 1, limit = 20, search = "" } = req.query;
    const skip = (page - 1) * limit;

    // Build match query
    const matchQuery = { shatra: new mongoose.Types.ObjectId(shatraId) };
    
    // If search is provided, we need to join with users first
    let pipeline = [
      { $match: matchQuery },
      {
        $group: {
          _id: "$user",
          total: { $sum: "$count" },
          firstContribution: { $min: "$date" },
          lastContribution: { $max: "$date" },
          contributionDays: { $sum: 1 }
        }
      }
    ];

    // Add user lookup
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" }
    );

    // Add search if provided
    if (search) {
      pipeline.push({
        $match: {
          "userDetails.name": { $regex: search, $options: "i" }
        }
      });
    }

    // Add sorting, pagination and projection
    pipeline.push(
      { $sort: { total: -1 } },
      {
        $facet: {
          metadata: [
            { $count: "totalCount" }
          ],
          data: [
            { $skip: skip },
            { $limit: parseInt(limit) },
            {
              $project: {
                userId: "$_id",
                name: "$userDetails.name",
                email: "$userDetails.email",
                total: 1,
                firstContribution: 1,
                lastContribution: 1,
                contributionDays: 1,
                averagePerDay: { $round: [{ $divide: ["$total", "$contributionDays"] }, 2] }
              }
            }
          ]
        }
      }
    );

    const result = await BhajanContribution.aggregate(pipeline);
    
    const totalCount = result[0]?.metadata[0]?.totalCount || 0;
    const contributors = result[0]?.data || [];

    res.json({
      contributors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        hasNextPage: parseInt(page) < Math.ceil(totalCount / limit),
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch contributors" });
  }
});


// ======================================================
// 6️⃣ NEW: Get Single Contributor Details
// ======================================================
router.get("/:id/contributors/:userId", authMiddleware, async (req, res) => {
  try {
    const { id: shatraId, userId } = req.params;

    const contributions = await BhajanContribution.aggregate([
      { 
        $match: { 
          shatra: new mongoose.Types.ObjectId(shatraId),
          user: new mongoose.Types.ObjectId(userId)
        } 
      },
      { $sort: { date: -1 } },
      {
        $group: {
          _id: null,
          total: { $sum: "$count" },
          contributions: { $push: "$$ROOT" },
          firstDate: { $min: "$date" },
          lastDate: { $max: "$date" },
          totalDays: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "contributions.user",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 0,
          user: {
            id: "$userInfo._id",
            name: "$userInfo.name",
            email: "$userInfo.email"
          },
          total: 1,
          firstDate: 1,
          lastDate: 1,
          totalDays: 1,
          contributions: {
            $map: {
              input: "$contributions",
              as: "c",
              in: {
                date: "$$c.date",
                count: "$$c.count"
              }
            }
          }
        }
      }
    ]);

    if (!contributions.length) {
      return res.status(404).json({ message: "Contributor not found" });
    }

    res.json(contributions[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch contributor details" });
  }
});


// ======================================================
// 7️⃣ NEW: Export Contributors to CSV
// ======================================================
router.get("/:id/contributors/export", authMiddleware, async (req, res) => {
  try {
    const shatraId = req.params.id;
    const userId = req.userId;

    // Check if user is admin
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can export data" });
    }

    const contributors = await BhajanContribution.aggregate([
      { $match: { shatra: new mongoose.Types.ObjectId(shatraId) } },
      {
        $group: {
          _id: "$user",
          total: { $sum: "$count" },
          firstContribution: { $min: "$date" },
          lastContribution: { $max: "$date" },
          contributionDays: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          rank: { $literal: 1 }, // Will be updated in code
          name: "$userDetails.name",
          email: "$userDetails.email",
          total: 1,
          contributionDays: 1,
          firstContribution: 1,
          lastContribution: 1,
          averagePerDay: { $round: [{ $divide: ["$total", "$contributionDays"] }, 2] }
        }
      }
    ]);

    // Add rank
    contributors.forEach((c, index) => {
      c.rank = index + 1;
    });

    // Get shatra details
    const shatra = await BhajanShatra.findById(shatraId);

    // Generate CSV
    const csvRows = [];
    
    // Add header
    csvRows.push("Rank,Name,Email,Total Malas,Contribution Days,Average Per Day,First Contribution,Last Contribution");
    
    // Add data
    contributors.forEach(c => {
      csvRows.push(
        `${c.rank},${c.name},${c.email},${c.total},${c.contributionDays},${c.averagePerDay},${new Date(c.firstContribution).toLocaleDateString()},${new Date(c.lastContribution).toLocaleDateString()}`
      );
    });

    const csvString = csvRows.join("\n");

    // Set headers for file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${shatra.title}_contributors.csv`);

    res.send(csvString);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to export contributors" });
  }
});

export default router;
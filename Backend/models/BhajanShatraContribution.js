// import mongoose from "mongoose";

// const bhajanContributionSchema = new mongoose.Schema({
//   shatra: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "BhajanShatra",
//     required: true
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   date: { type: Date, required: true },
//   count: { type: Number, required: true }
// });

// bhajanContributionSchema.index({ shatra: 1, user: 1 });
// bhajanContributionSchema.index({ shatra: 1, date: 1 });

// export default mongoose.model("BhajanContribution", bhajanContributionSchema);


// models/BhajanContribution.js
import mongoose from "mongoose";

const bhajanContributionSchema = new mongoose.Schema({
  shatra: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BhajanShatra",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: { 
    type: Date, 
    required: true 
  },
  count: { 
    type: Number, 
    required: true,
    min: 1,
    max: 100000 // Reasonable limit
  }
}, {
  timestamps: true
});

// ======================================================
// ONLY 3 INDEXES NEEDED - NOTHING MORE
// ======================================================

// 1. Unique index (prevents duplicates, covers most queries)
bhajanContributionSchema.index(
  { shatra: 1, user: 1, date: 1 }, 
  { unique: true }
);

// 2. For leaderboard (sorted by count)
bhajanContributionSchema.index({ shatra: 1, count: -1 });

// 3. For user history
bhajanContributionSchema.index({ user: 1, date: -1 });

// ======================================================
// STATIC METHODS (Clean and simple)
// ======================================================

// Get leaderboard with pagination
bhajanContributionSchema.statics.getLeaderboard = async function(shatraId, limit = 10, page = 1) {
  const skip = (page - 1) * limit;
  
  const results = await this.aggregate([
    { $match: { shatra: new mongoose.Types.ObjectId(shatraId) } },
    {
      $group: {
        _id: "$user",
        total: { $sum: "$count" }
      }
    },
    { $sort: { total: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        name: "$user.name",
        total: 1,
        rank: { $add: [skip, 1] } // Will be adjusted in code
      }
    }
  ]);
  
  // Add correct rank
  return results.map((item, index) => ({
    ...item,
    rank: skip + index + 1
  }));
};

// Get single user's rank
bhajanContributionSchema.statics.getUserRank = async function(shatraId, userId) {
  const result = await this.aggregate([
    { $match: { shatra: new mongoose.Types.ObjectId(shatraId) } },
    {
      $group: {
        _id: "$user",
        total: { $sum: "$count" }
      }
    },
    { $sort: { total: -1 } },
    {
      $group: {
        _id: null,
        users: { $push: { userId: "$_id", total: "$total" } }
      }
    },
    {
      $project: {
        rank: {
          $add: [
            { $indexOfArray: ["$users.userId", new mongoose.Types.ObjectId(userId)] },
            1
          ]
        },
        total: {
          $arrayElemAt: [
            "$users.total", 
            { $indexOfArray: ["$users.userId", new mongoose.Types.ObjectId(userId)] }
          ]
        }
      }
    }
  ]);
  
  return result[0] || null;
};

// Get user history
bhajanContributionSchema.statics.getUserHistory = async function(userId, limit = 10, page = 1) {
  const skip = (page - 1) * limit;
  
  const [items, total] = await Promise.all([
    this.find({ user: userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate('shatra', 'title targetCount')
      .lean(),
    this.countDocuments({ user: userId })
  ]);
  
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export default mongoose.model("BhajanContribution", bhajanContributionSchema);
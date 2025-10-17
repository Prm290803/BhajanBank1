// utils/updateFamilyPoints.js
import Family from "../models/Family.js";
import Task from "../models/Task.js";

export const updateFamilyPoints = async (familyId) => {
  const family = await Family.findById(familyId).populate("members", "_id");
  if (!family) return null;

  const memberIds = family.members.map((m) => m._id);
  const now = new Date();
  let start = new Date(now);
  start.setHours(4, 0, 0, 0);

  let end = new Date(start);
  end.setDate(end.getDate() + 1);

  if (now < start) {
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate() - 1);
  }

  const result = await Task.aggregate([
    {
      $match: {
        user: { $in: memberIds },
        date: { $gte: start, $lt: end },
      },
    },
    { $group: { _id: null, totalPoints: { $sum: "$summary.grandTotalPoints" } } },
  ]);

  const totalPoints = result.length ? result[0].totalPoints : 0;

  family.totalPoints = totalPoints;
  await family.save();

  return family;
};

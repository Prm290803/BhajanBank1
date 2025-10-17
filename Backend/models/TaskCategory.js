// models/TaskCategory.js
import mongoose from "mongoose";

const taskCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Vandu Sahajanand"
  displayName: String, // For UI display
  defaultPoints: { type: Number, default: 1 },
  globalGoalCount: { type: Number, default: 0 }, // e.g., 100000
  totalCompletedCount: { type: Number, default: 0 }, // keep incrementing
});

export default mongoose.model("TaskCategory", taskCategorySchema);

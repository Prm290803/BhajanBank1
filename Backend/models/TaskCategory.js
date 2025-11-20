// models/TaskCategory.js
import mongoose from "mongoose";

const taskCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // internal name, e.g., "Mantra Japp"
  displayName: String, // for UI display (e.g., "Mantra Japp (મંત્ર જપ)")
  points: { type: Number, required: true }, // default points for one count
  categoryType: {
    type: String,
    enum: ["Bhajan", "Tap", "Path", "Satsang", "Other"], // example categories
    required: true,
  },
  globalGoalCount: { type: Number, default: 0 },
  totalCompletedCount: { type: Number, default: 0 },
});

export default mongoose.model("TaskCategory", taskCategorySchema);

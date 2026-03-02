import mongoose from "mongoose";

const universalGoalSchema = new mongoose.Schema({
  name: { type: String, required: true }, // "Utsav 2026 Sankalp"
  description: String,

  targetType: {
    type: String,
    enum: ["task", "category"],
    required: true
  },

  targetName: { 
    type: String, 
    required: true 
  },

  targetCount: { type: Number, required: true },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  isActive: { type: Boolean, default: true }

}, { timestamps: true });

export default mongoose.model("UniversalGoal", universalGoalSchema);
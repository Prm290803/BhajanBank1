import mongoose from 'mongoose';
import Task from './Task.js';

const familySchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  totalPoints: { type: Number, default: 0 }, // ✅ existing
  createdAt: { type: Date, default: Date.now },

  // ✅ Add these for daily goal feature
  goalname: { type: String, default: 'todays goal' },
  dailyGoal: { type: Number, default: 0 },
  goalDate: { type: String }, // e.g. "2025-10-16"
});
export default mongoose.model('Family', familySchema);

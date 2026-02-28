import mongoose from 'mongoose';

const familySchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  totalPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },

  // ✅ Add these for daily goal feature
  goalname: { type: String, default: 'todays goal' },
  dailyGoal: { type: Number, default: 0 },
  goalDate: { type: String }, // e.g. "2025-10-16"
});

// ✅ IMPORTANT: Check if model already exists before creating it
const Family = mongoose.models.Family || mongoose.model('Family', familySchema);

export default Family;
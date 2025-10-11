import mongoose from 'mongoose';
import Task from './Task.js';

const familySchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  totalPoints: { type: Number, default: 0 },  // ✅ added
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Family', familySchema);

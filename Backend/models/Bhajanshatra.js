// import mongoose from "mongoose";

// const bhajanShatraSchema = new mongoose.Schema({
//   title: { type: String, required: true }, // e.g. 20 Lakh Swaminarayan Mala
//   description: String,
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//   targetCount: { type: Number, required: true }, // 2000000
//   isActive: { type: Boolean, default: true },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   createdAt: { type: Date, default: Date.now }
// });

// bhajanShatraSchema.index({ isActive: 1 });
// bhajanShatraSchema.index({ startDate: 1, endDate: 1 });

// export default mongoose.model("BhajanShatra", bhajanShatraSchema);


// models/BhajanShatra.js
import mongoose from "mongoose";

const bhajanShatraSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: String,
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        return value >= this.startDate;
      },
      message: "End date must be after start date"
    }
  },
  targetCount: { 
    type: Number, 
    required: true,
    min: 1
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  // Store contributor count directly in the model
  totalContributors: {
    type: Number,
    default: 0
  },
  // Store total contributions
  totalContributions: {
    type: Number,
    default: 0
  },
  lastContributionAt: Date
}, {
  timestamps: true
});

// Only 2 indexes needed
bhajanShatraSchema.index({ startDate: 1, endDate: 1 });
bhajanShatraSchema.index({ createdBy: 1, createdAt: -1 });

// Virtual for status
bhajanShatraSchema.virtual('status').get(function() {
  const now = new Date();
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  
  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'active';
});

// Helper method
bhajanShatraSchema.methods.canContribute = function() {
  const now = new Date();
  return this.isActive && now >= this.startDate && now <= this.endDate;
};

export default mongoose.model("BhajanShatra", bhajanShatraSchema);
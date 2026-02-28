import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // make optional for Google users
  googleId: { type: String, default: null }, //  store Google account ID
  profilePic: {
    type: String,
    default: "/1.png", // Default profile image
  },
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family",
    default: null,
  },
  fcmtoken: {
  type: String,
  default: null
},
  createdAt: { type: Date, default: Date.now },
  
});


// 🔒 Password hashing middleware
userSchema.pre("save", async function (next) {
  // only hash if password exists and is modified
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default mongoose.model("User", userSchema);

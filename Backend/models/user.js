import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  family: { type: mongoose.Schema.Types.ObjectId, ref: "Family", default: null },
  profilePic: {
    type: String,
    default:
      "https://res.cloudinary.com/demo/image/upload/v1690000000/default_profile.jpg" // 🖼️ default profile image
  },
  createdAt: { type: Date, default: Date.now },
});

// 🔒 Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);

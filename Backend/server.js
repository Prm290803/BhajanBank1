

// server.js
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const app = express();
app.use(express.json());

/** DB */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

/** Cloudinary */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** CORS (keep same origin) */
app.use(
  cors({
    // origin: "https://bhajan-bank1.vercel.app",
      origin: ['http://localhost:5173'],
    credentials: true,
  })
);

/** Routes (these routers contain the exact same endpoints you had) */
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import familyRoutes from "./routes/familyRoutes.js";

app.use(authRoutes);
app.use(userRoutes);
app.use(taskRoutes);
app.use(familyRoutes);

/** Root */
app.get("/", (req, res) => res.send("API running"));

/** Start */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// server.js
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { v2 as cloudinary } from "cloudinary";
// import "./scheduler/dailyCheck.js"; // <-- import the scheduler

// import "./passportConfig.js"; // <-- new file (see below)

dotenv.config();
console.log("ENV CHECK:", process.env.FIREBASE_PROJECT_ID);

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

/** CORS */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://bhajan-bank1.vercel.app",
    "https://www.bhajanbankvadtal.com",
    "https://bhajanbankvadtal.com"
  ],
  credentials: true
}));

/** Express Session (required for Passport) */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

/** Initialize Passport */
app.use(passport.initialize());
app.use(passport.session());

/** Routes */
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import familyRoutes from "./routes/familyRoutes.js";
import notificationRoutes from "./routes/notification.js";

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use(authRoutes);
app.use(userRoutes);
app.use(taskRoutes);
app.use(familyRoutes);
app.use("/api/notifications", notificationRoutes);
/** Root */
app.get("/", (req, res) => res.send("API running"));

/** Start */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

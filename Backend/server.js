import dotenv from 'dotenv';
dotenv.config();

console.log('Environment Variables:', {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET ? '***loaded***' : 'NOT LOADED',
  PORT: process.env.PORT
});
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import jwt from 'jsonwebtoken';
import User from './models/user.js';
import Task from './models/Task.js';
import authMiddleware from './middleware/auth.js';

import bcrypt from 'bcryptjs';




const app = express();



app.use(express.json());


  
  // MongoDB Connection
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
  
  // Middleware
  app.use(cors({
    origin: 'https://bhajan-bank.vercel.app/', // Your frontend URL
    credentials: true
  }));
  
// Routes
app.post('/api/register', async (req, res) => {
  try {
    console.log(req.body, 'This is the request')
    const { name, email, password } = req.body;
    
      if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  // Check if email exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ error: "Email already registered!" });
  }
// Try now for registering ...>.  

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters!" });
  }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      // password: await argon2.hash(password)
      // password: await bcrypt.hash(password,10) 
      password: password
    });
    console.log(user,'This is the user')
    await user.save();

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    console.log(token, 'This is the token')
    res.status(201).json({ 
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' }); // Consistent error key
  }
});

app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.password = await bcrypt.hash(newPassword);
    // user.password = await argon2.hash(newPassword); // Argon2 hashing
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email); // Debug log
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found'); // Debug
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2. Debug password comparison
    console.log('Stored hash:', user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ 
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Server error" });
  }
});

// Protected routes

app.get('/api/user', async(req,res)=> {
 

})
app.post('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const { tasks } = req.body;
    const userId = req.userId;

    // Validate tasks exists and is an array
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: 'Tasks must be a non-empty array' });
    }

    // Validate each task object
    for (const task of tasks) {
      if (!task.task || typeof task.task !== 'string') {
        return res.status(400).json({ error: 'Each task must have a "task" string field' });
      }
      if (typeof task.points !== 'number' || task.points <= 0) {
        return res.status(400).json({ error: 'Each task must have positive "points" number' });
      }
      if (typeof task.count !== 'number' || task.count <= 0) {
        return res.status(400).json({ error: 'Each task must have positive "count" number' });
      }
    }

    // Create the task document
    const savedTaskDoc = await Task.create({
      user: userId,
      date: new Date(),
      tasks: tasks.map(task => ({
        task: task.task,
        points: task.points,
        count: task.count,
        totalPoints: task.points * task.count // Calculate and store totalPoints
      }))
    });

    res.status(201).json(savedTaskDoc);
  } catch (err) {
    console.error('Task creation error:', err);
    res.status(500).json({ error: 'Failed to create tasks' });
  }
});




app.get('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await Task.find({
      // user: userId,
      date: { $gte: today }
    }).populate('user', 'name');
    // const tasks = await Task.find({}).populate('user', 'name');
    
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const leaderboard = await Task.aggregate([
     
    ]);

    res.json(leaderboard || []); // Always return array
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json([]);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
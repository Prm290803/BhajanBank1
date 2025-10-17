import React, { useState, useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from '../Navbar/Navbar';

const UserProfile = () => {
  const { user, token } = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL;
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pastTasks, setPastTasks] = useState([]);
  const [allTimePoints, setAllTimePoints] = useState(0);
  const [allTimeCount, setAllTimeCount] = useState(0);
  const [allTimeActiveDays, setAllTimeActiveDays] = useState(0);

const fetchAllTasksSummary = async () => {
  try {
    setLoading(true);
    const res = await fetch(`${backend_url}/api/taskuser/all`, {
      headers: { Authorization: `Bearer ${token}` },
    }); 
    if (!res.ok) throw new Error("Failed to fetch all tasks");

    const data = await res.json();

    setAllTimePoints(data.allTimePoints || 0);
    setAllTimeCount(data.allTimeCount || 0);
    setAllTimeActiveDays(data.activeDays || 0);

   
  } catch (err) {
    console.error(err);
    setError("Failed to fetch tasks summary");
  } finally {
    setLoading(false);
  }
};

const fetchTasks = async () => {
  try {
    setLoading(true);

    // ✅ Fetch today's tasks
    const todayRes = await fetch(`${backend_url}/api/taskuser`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!todayRes.ok) throw new Error("Failed to fetch today's tasks");
    const todayData = await todayRes.json();

    // ✅ Fetch past 10 days' tasks
    const pastRes = await fetch(`${backend_url}/api/taskuser/past10days`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!pastRes.ok) throw new Error("Failed to fetch past 10 days' tasks");
    const pastData = await pastRes.json();

    // ✅ Store separately
    setTasks(todayData);
    setPastTasks(pastData);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    setError("Failed to load tasks");
  } finally {
    setLoading(false);
  }
};

  const fetchFamily = async () => {
    if (!user?.family) return;
    try {
      const response = await fetch(`${backend_url}/api/families/${user.family}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch family");

      const data = await response.json();
      setFamily(data);
    } catch (err) {
      console.error("Error fetching family:", err);
    }
  };

  const handleJoinFamily = () => navigate("/join-family");
  const handleCreateFamily = () => navigate("/create-family");

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`${backend_url}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Failed to delete task: ${response.status}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task");
    }
  };

  const handleLeaveFamily = async () => {
    if (!window.confirm("Are you sure you want to leave this family?")) return;

    try {
      const response = await fetch(`${backend_url}/api/leave-family`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user._id }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setFamily(null);
      } else {
        setError(data.error || "Failed to leave family");
      }
    } catch (error) {
      console.error("Error leaving family:", error);
      setError("Failed to leave family");
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);
    setUploading(true);

    try {
      const res = await fetch(`${backend_url}/api/user/upload-photo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Profile picture updated successfully!");
        window.location.reload();
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while uploading");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (token && user?._id) {
     fetchTasks();
      setFamily(user?.family || null);
      fetchFamily();
    
      fetchAllTasksSummary();
    }
  }, [token, user]);

const allTaskDocs = [...pastTasks, ...tasks];

// Map to chart-friendly format

  // Date filtering
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const past10Date = new Date(today);
  past10Date.setDate(today.getDate() - 10);

const allTasks = [...pastTasks, ...tasks];

const totalPointsAllTime = allTasks.reduce(
  (total, taskDoc) => total + (taskDoc.tasks?.reduce((sum, t) => sum + (t.totalPoints || 0), 0) || 0),
  0
);

const activeDaysSetAllTime = new Set(
  allTasks.map(taskDoc => {
    const d = new Date(taskDoc.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  })
);
const activeDaysCountAllTime = activeDaysSetAllTime.size;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-orange-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen pt-16">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            Loading your profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-orange-50">
      <Navbar />
      
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>

      <div className="container mx-auto px-3 sm:px-6 max-w-4xl pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-4 sm:p-6 lg:p-8 mx-2 sm:mx-0"
        >
          {/* Header Section with Profile Image */}
          <div className="flex flex-col items-center text-center mb-8">
  {/* Profile Image Section */}
  <div className="relative mb-6 group">
    {/* Main Profile Image Container */}
    <motion.div
      className="relative rounded-full p-1 bg-gradient-to-r from-orange-400 to-amber-500 shadow-2xl"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <img
        src={user?.profilePic || "/1.png"}
        alt="Profile"
        className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-lg object-cover"
      />
      
      {/* Upload Overlay */}
      <motion.div
        className="absolute inset-0 rounded-full bg-black  bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
        whileHover={{ opacity: 1 }}
      >
        <motion.label
          className="flex flex-col items-center justify-center cursor-pointer text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfileImageUpload}
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-1"></div>
              <span className="text-xs font-medium">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-1">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium">Change Photo</span>
            </div>
          )}
        </motion.label>
      </motion.div>
    </motion.div>

    {/* Camera Icon Badge - Always Visible */}
    <motion.label
      className="absolute bottom-2 right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full p-3 cursor-pointer shadow-lg border-2 border-white hover:shadow-xl transition-all duration-200"
      whileHover={{ scale: 1.15, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleProfileImageUpload}
        disabled={uploading}
      />
      {uploading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </motion.label>
  </div>

  {/* User Info Section */}
  <div className="flex-1 w-full">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{user?.name}</h1>
      <p className="text-gray-600 mb-6">Welcome to your spiritual journey</p>
    
    {/* User Stats */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 max-w-md mx-auto">
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200 shadow-sm">
        <p className="text-2xl select-none font-bold text-orange-600 mb-1"> 
          {tasks.reduce((total, taskDoc) => total + (taskDoc.tasks?.length || 0), 0)}
        </p>
        <p className="text-xs select-none text-gray-600 font-medium">Today's Tasks</p>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 shadow-sm">
        <p className="text-2xl select-none font-bold text-blue-600 mb-1">
          {pastTasks.reduce(
  (total, taskDoc) => total + (taskDoc.tasks?.length || 0),
  0
)}
        </p>
        <p className="text-xs select-none text-gray-600 font-medium">Past Tasks</p>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 shadow-sm">
        <p className="text-2xl select-none font-bold text-green-600 mb-1">
          {Math.round(totalPointsAllTime)}
        </p>
        <p className="text-xs select-none text-gray-600 font-medium">Total Points</p>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200 shadow-sm">
        <p className="text-2xl select-none font-bold text-purple-600 mb-1">
          {activeDaysCountAllTime}
        </p>
        <p className="text-xs select-none text-gray-600 font-medium">Active Days</p>
      </div>
    </div>

    <motion.button
      onClick={() => navigate("/data")}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Add New Tasks
    </motion.button>
  </div>
</div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-300 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6 flex justify-between items-center text-sm"
            >
              <span className="flex-1 pr-2">{error}</span>
              <button onClick={() => setError("")} className="text-red-500 hover:text-red-700 font-bold text-lg flex-shrink-0">
                ×
              </button>
            </motion.div>
          )}

          {/* Family Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xl sm:text-2xl">🏠</span> 
              <span className="hidden sm:inline">Family</span>
              <span className="sm:hidden">Family</span>
            </h2>
            {family ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 sm:p-6 rounded-xl"
              >
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="text-center sm:text-left">
                    <p className="text-gray-700 text-sm sm:text-lg">
                      Family: <span className="font-bold text-blue-600">{family.name}</span>
                    </p>
                    {family.description && (
                      <p className="text-gray-600 text-xs sm:text-sm mt-1">{family.description}</p>
                    )}
                  </div>
                  <motion.button
                    onClick={handleLeaveFamily}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all duration-200 w-full sm:w-auto"
                  >
                    Leave Family
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 sm:p-6 rounded-xl"
              >
                <p className="text-gray-700 text-sm sm:text-lg mb-3 sm:mb-4 text-center sm:text-left">You are not part of any family yet.</p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <motion.button
                    onClick={handleJoinFamily}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-all duration-200 shadow text-sm sm:text-base"
                  >
                    Join Family
                  </motion.button>
                  <motion.button
                    onClick={handleCreateFamily}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-all duration-200 shadow text-sm sm:text-base"
                  >
                    Create Family
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Today's Tasks Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">📅</span> 
                <span className="hidden sm:inline">Today's Tasks</span>
                <span className="sm:hidden">Today</span>
              </h2>
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow">
                {tasks.reduce((total, taskDoc) => total + taskDoc.tasks.length, 0)} tasks
              </span>
            </div>
            
            {tasks.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {tasks.map((taskDoc) =>
                  taskDoc.tasks.map((task, idx) => (
                    <motion.div
                      key={`${taskDoc._id}-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col sm:flex-row justify-between items-start bg-white border border-gray-200 p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex-1 mb-3 sm:mb-0">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2">{task.task}</h4>
                        <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Count: {task.count}</span>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Points: {task.totalPoints}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <motion.button
                          onClick={() => navigate(`/tasks/update/${taskDoc._id}`)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm transition-all duration-200"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteTask(taskDoc._id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm transition-all duration-200"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-50 border border-gray-200 p-6 sm:p-8 rounded-xl text-center"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📝</div>
                <p className="text-gray-600 text-sm sm:text-lg mb-3 sm:mb-4">No tasks for today.</p>
                <motion.button
                  onClick={() => navigate("/data")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg text-sm sm:text-base"
                >
                  Add Your First Task
                </motion.button>
              </motion.div>
            )}
          </div>
      
          {/* Past Tasks Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xl sm:text-2xl">📚</span> 
              <span className="hidden sm:inline">Past 10 Days</span>
              <span className="sm:hidden">Past Tasks</span>
            </h2>
            {pastTasks.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {pastTasks.map((taskDoc, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white border border-gray-200 p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <h4 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-lg">
                      {new Date(taskDoc.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      {taskDoc.tasks.map((task, j) => (
                        <div key={j} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-gray-100 last:border-b-0 gap-1 sm:gap-0">
                          <span className="text-gray-700 font-medium text-sm sm:text-base line-clamp-2">{task.task}</span>
                          <div className="text-xs sm:text-sm text-gray-600 flex gap-2 sm:gap-4">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Count: {task.count}</span>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Points: {Math.round(task.totalPoints)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-50 border border-gray-200 p-6 sm:p-8 rounded-xl text-center"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📖</div>
                <p className="text-gray-600 text-sm sm:text-lg">No past tasks available.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;
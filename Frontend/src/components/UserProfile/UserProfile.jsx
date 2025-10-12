import React, { useState, useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from '../Navbar/Navbar';

const UserProfile = () => {
  const { user, token } = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL || "";
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backend_url}/api/taskuser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }
      
      const data = await response.json();
      setTasks(data);
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

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    setError("Image size should be less than 5MB");
    return;
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    setError("Please select a valid image file");
    return;
  }

  const formData = new FormData();
  formData.append("photo", file); // ✅ attach the actual file
  setUploading(true);

  try {
    const res = await fetch(`${backend_url}/api/user/upload-photo`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }, // do NOT set content-type manually
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("Profile picture updated successfully!");
      window.location.reload();
    } else {
      setError(data.error || "Upload failed"); // backend uses "error" key
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
    }
  }, [token, user]);

  // Date filtering
  const today = new Date();
  today.setHours(4, 0, 0, 0);

  const past10Date = new Date();
  past10Date.setDate(today.getDate() - 10);
  past10Date.setHours(0, 0, 0, 0);

  const todaysTasks = tasks.filter((t) => {
    const taskDate = new Date(t.date);
    return taskDate >= today && taskDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
  });

  const pastTasks = tasks.filter((t) => {
    const taskDate = new Date(t.date);
    return taskDate >= past10Date && taskDate < today;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-orange-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
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

      <div className="container mx-auto p-6 max-w-4xl pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-8"
        >
          {/* Header Section with Profile Image */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <motion.img
                  src={user?.profilePic || "/1.png"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-orange-300 shadow-lg object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.label 
                  className="absolute bottom-2 right-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full p-3 cursor-pointer shadow-lg transition-all duration-200"
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
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="text-sm">📸</span>
                  )}
                </motion.label>
              </div>
              {uploading && (
                <p className="text-sm text-gray-500 mt-2">Uploading...</p>
              )}
            </div>

            {/* User Info Section */}
            <div className="flex-1 text-center lg:text-left">
              
              <h1 className="text-gray-600 font-bold uppercase text-2xl mb-4">{user?.name}</h1>
              {/* User Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <p className="text-2xl font-bold text-orange-600">
                    {todaysTasks.reduce((total, taskDoc) => total + taskDoc.tasks.length, 0)}
                  </p>
                  <p className="text-xs text-gray-600">Today's Tasks</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">
                    {pastTasks.length}
                  </p>
                  <p className="text-xs text-gray-600">Past Tasks</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-2xl font-bold text-green-600">
                    {tasks.reduce((total, taskDoc) => total + taskDoc.tasks.reduce((sum, task) => sum + task.totalPoints, 0), 0)}
                  </p>
                  <p className="text-xs text-gray-600">Total Points</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <p className="text-2xl font-bold text-purple-600">
                    {tasks.length}
                  </p>
                  <p className="text-xs text-gray-600">Active Days</p>
                </div>
              </div>

              <motion.button
                onClick={() => navigate("/data")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
              >
                + Add Tasks
              </motion.button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6 flex justify-between items-center"
            >
              <span>{error}</span>
              <button onClick={() => setError("")} className="text-red-500 hover:text-red-700 font-bold text-lg">
                ×
              </button>
            </motion.div>
          )}

          {/* Rest of the component remains the same */}
          {/* Family Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">🏠</span> Family
            </h2>
            {family ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <p className="text-gray-700 text-lg">
                      You are part of: <span className="font-bold text-blue-600">{family.name}</span>
                    </p>
                    {family.description && (
                      <p className="text-gray-600 text-sm mt-1">{family.description}</p>
                    )}
                  </div>
                  <motion.button
                    onClick={handleLeaveFamily}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 mt-3 sm:mt-0"
                  >
                    Leave Family
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-6 rounded-xl"
              >
                <p className="text-gray-700 text-lg mb-4">You are not part of any family yet.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={handleJoinFamily}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow"
                  >
                    Join Family
                  </motion.button>
                  <motion.button
                    onClick={handleCreateFamily}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow"
                  >
                    Create Family
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Today's Tasks Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">📅</span> Today's Tasks
              </h2>
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow">
                {todaysTasks.reduce((total, taskDoc) => total + taskDoc.tasks.length, 0)} tasks
              </span>
            </div>
            
            {todaysTasks.length > 0 ? (
              <div className="space-y-4">
                {todaysTasks.map((taskDoc) =>
                  taskDoc.tasks.map((task, idx) => (
                    <motion.div
                      key={`${taskDoc._id}-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex-1 mb-4 sm:mb-0">
                        <h4 className="font-semibold text-gray-800 text-lg mb-2">{task.task}</h4>
                        <div className="flex gap-6 text-sm text-gray-600">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Count: {task.count}</span>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">Points: {task.totalPoints}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <motion.button
                          onClick={() => navigate(`/tasks/update/${taskDoc._id}`)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 flex-1 sm:flex-none"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteTask(taskDoc._id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 flex-1 sm:flex-none"
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
                className="bg-gray-50 border border-gray-200 p-8 rounded-xl text-center"
              >
                <div className="text-4xl mb-4">📝</div>
                <p className="text-gray-600 text-lg mb-4">No tasks for today.</p>
                <motion.button
                  onClick={() => navigate("/data")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                >
                  Add Your First Task
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Past Tasks Section */}
          <div>
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📚</span> Past 10 Days Tasks
            </h2>
            {pastTasks.length > 0 ? (
              <div className="space-y-4">
                {pastTasks.map((taskDoc, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <h4 className="font-semibold text-gray-700 mb-3 text-lg">
                      {new Date(taskDoc.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h4>
                    <div className="space-y-3">
                      {taskDoc.tasks.map((task, j) => (
                        <div key={j} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <span className="text-gray-700 font-medium">{task.task}</span>
                          <div className="text-sm text-gray-600 flex gap-4">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Count: {task.count}</span>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Points: {task.totalPoints}</span>
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
                className="bg-gray-50 border border-gray-200 p-8 rounded-xl text-center"
              >
                <div className="text-4xl mb-4">📖</div>
                <p className="text-gray-600 text-lg">No past tasks available.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;
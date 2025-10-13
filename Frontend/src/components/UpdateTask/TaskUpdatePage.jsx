import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from '../Navbar/Navbar';

function TaskUpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const backend_url = import.meta.env.VITE_BACKENDURL || "http://localhost:5000";

  const [task, setTask] = useState(null);
  const [subtaskCounts, setSubtaskCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch single task
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`${backend_url}/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch task");

        const data = await res.json();
        setTask(data);

        // Initialize counts
        const counts = {};
        data.tasks.forEach((subtask, index) => {
          counts[subtask._id] = subtask.count;
        });
        setSubtaskCounts(counts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, token]);

  // Handle input change
  const handleInputChange = (subtaskId, value) => {
    if (value === "" || (parseInt(value, 10) >= 0)) {
      setSubtaskCounts((prev) => ({ ...prev, [subtaskId]: value }));
    }
  };

  // Update all subtasks
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const updatePromises = task.tasks.map((subtask) =>
        fetch(`${backend_url}/api/tasks/${task._id}/${subtask._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ count: parseInt(subtaskCounts[subtask._id], 10) || 0 }),
        })
      );

      const results = await Promise.all(updatePromises);
      const failed = results.find((res) => !res.ok);
      if (failed) throw new Error("Failed to update some subtasks");

      alert("All subtasks updated successfully!");
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-orange-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen pt-16">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            Loading task details...
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

      <div className="container mx-auto px-3 sm:px-6 max-w-2xl pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-4 sm:p-6 lg:p-8 mx-2 sm:mx-0"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-2xl">✏️</span>
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Update Tasks
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {task && new Date(task.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6 flex justify-between items-center"
            >
              <span className="flex-1 text-sm">{error}</span>
              <button 
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700 font-bold text-lg ml-4"
              >
                ×
              </button>
            </motion.div>
          )}

          {/* Task Form */}
          {task && (
            <motion.form 
              onSubmit={handleUpdate}
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {task.tasks.map((subtask, index) => (
                <motion.div
                  key={subtask._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">
                        {subtask.task}
                      </h3>
                      <div className="flex gap-3 text-xs sm:text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Points: {subtask.points}
                        </span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Current: {subtask.count}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                        New Count:
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={subtaskCounts[subtask._id]}
                        onChange={(e) => handleInputChange(subtask._id, e.target.value)}
                        className="w-20 sm:w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-center"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <motion.button
                  type="button"
                  onClick={() => navigate("/profile")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg text-sm sm:text-base"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  type="submit"
                  disabled={updating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {updating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      Update Tasks
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <p className="text-sm text-blue-700 text-center">
              💡 Update the counts for your completed spiritual activities
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default TaskUpdatePage;
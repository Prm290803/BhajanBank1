import React, { useState, useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from '../Navbar/Navbar';

const UserProfile = () => {
  const { user, token} = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL || "";
  const navigate = useNavigate();

  const [users, setUsers] = useState({});
  const [tasks, setTasks] = useState([]);
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all users
 

  // Fetch logged-in user's tasks
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

  // Fetch family details
 const fetchFamily = async () => {
  if (!user?.family) return;
  try {
    const response = await fetch(`${backend_url}/api/families/${user.family}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch family");

    const data = await response.json();
    setFamily(data); // now family has name, description, etc.
  } catch (err) {
    console.error("Error fetching family:", err);
  }
};


  // Join/Create family actions
  const handleJoinFamily = () => {
    navigate("/join-family");
  };

  const handleCreateFamily = () => {
    navigate("/create-family");
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await fetch(`${backend_url}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.status}`);
      }

      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task");
    }
  };

  // Update task count
  const handleUpdateSubtask = async (taskId, subtaskId, newCount) => {
  try {
    const response = await fetch(
      `${backend_url}/api/tasks/${taskId}/${subtaskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ count: parseInt(newCount, 10) }),
      }
    );

    if (!response.ok) throw new Error("Failed to update subtask");
    fetchTasks();
  } catch (err) {
    console.error(err);
  }
};


  // Leave family
  const handleLeaveFamily = async () => {
  if (!window.confirm("Are you sure you want to leave this family?")) {
    return;
  }

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

  useEffect(() => {
    if (token && user?._id) {
     
      fetchTasks();
      setFamily(user?.family || null);
      fetchFamily();
    }
  }, [token, user]);

  // // Filter tasks
  const all = new Date().toISOString().split("E")[0];
  // const today = new Date().toISOString().split("T")[0];
  // const todaysTasks = tasks.filter((t) => t.date && t.date.startsWith(today));
  // const pastTasks = tasks.filter((t) => t.date && !t.date.startsWith(all));

  // const today = new Date().toISOString().split("T")[0];

const today = new Date();
today.setHours(0, 0, 0, 0); // start of today

const past10Date = new Date();
past10Date.setDate(today.getDate() - 10);
past10Date.setHours(0, 0, 0, 0); // start of 10 days ago

const todaysTasks = tasks.filter((t) => {
  const taskDate = new Date(t.date);
  return (
    taskDate >= today &&
    taskDate < new Date(today.getTime() + 24 * 60 * 60 * 1000) // less than tomorrow
  );
});

const pastTasks = tasks.filter((t) => {
  const taskDate = new Date(t.date);
  return taskDate >= past10Date && taskDate < today;
});

console.log("Today's tasks:", todaysTasks);
console.log("Past 10 days tasks:", pastTasks);

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-100">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-100">
      <Navbar />
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-white pt-15 rounded-lg shadow-md p-6 mb-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Jay Swaminarayan</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
            </div>
            
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button 
                onClick={() => setError("")}
                className="float-right font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* Family Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Family</h2>
            {family ? (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50 p-4 rounded-lg">
                <div>
                  <p className="text-gray-700">
                    You are part of: <span className="font-semibold">{family.name}</span>
                  </p>
                  {family.description && (
                    <p className="text-gray-600 text-sm mt-1">{family.description}</p>
                  )}
                </div>
                <button
                  onClick={handleLeaveFamily}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition duration-200 mt-2 sm:mt-0"
                >
                  Leave Family
                </button>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">You are not part of any family yet.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleJoinFamily}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    Join Family
                  </button>
                  <button
                    onClick={handleCreateFamily}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    Create Family
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Today's Tasks */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Today's Tasks</h2>
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                {todaysTasks.reduce((total, taskDoc) => total + taskDoc.tasks.length, 0)} tasks
              </span>
            </div>
            
            {todaysTasks.length > 0 ? (
              <div className="space-y-3">
                {todaysTasks.map((taskDoc) =>
                  taskDoc.tasks.map((task, idx) => (
                    <div
                      key={`${taskDoc._id}-${idx}`}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1 mb-3 sm:mb-0">
                        <h4 className="font-medium text-gray-800">{task.task}</h4>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                          <span>Count: {task.count}</span>
                          <span>Points: {task.totalPoints}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => navigate(`/tasks/update/${taskDoc._id}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition duration-200 flex-1 sm:flex-none"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(taskDoc._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition duration-200 flex-1 sm:flex-none"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-600">No tasks for today.</p>
                <button
                  onClick={() => navigate("/data")}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg mt-3 transition duration-200"
                >
                  Add Tasks
                </button>
              </div>
            )}
          </div>

          {/* Past Tasks */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Past Tasks</h2>
            {pastTasks.length > 0 ? (
              <div className="space-y-4">
                {pastTasks.map((taskDoc, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      {new Date(taskDoc.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h4>
                    <div className="space-y-2">
                      {taskDoc.tasks.map((task, j) => (
                        <div key={j} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <span className="text-gray-700">{task.task}</span>
                          <div className="text-sm text-gray-600">
                            Count: {task.count} • Points: {task.totalPoints}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-600">No past tasks available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
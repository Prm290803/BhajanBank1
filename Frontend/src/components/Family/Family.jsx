import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import LotusDivider from "../Common/LotusDivider";

// Motion Variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const FamilyLeaderboard = () => {
  const [members, setMembers] = useState([]);
  const [familyName, setFamilyName] = useState("");
  const [goal, setGoal] = useState(0);
  const [goalName, setGoalName] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState("leaderboard");
  const { user, token } = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL || "";
  const [todayUserTasks, setTodayUserTasks] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [taskCategories, setTaskCategories] = useState([]);
const [selectedTasks, setSelectedTasks] = useState([]);
const [showCreateGoal, setShowCreateGoal] = useState(false);
const [goalTasks, setGoalTasks] = useState([]);
const [goalMessage, setGoalMessage] = useState({ type: '', text: '' });
const [goalNameInput, setGoalNameInput] = useState('');
const [showNameInput, setShowNameInput] = useState(false);


  // Fetch leaderboard + goal
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [leaderboardRes, goalRes] = await Promise.all([
          fetch(`${backend_url}/family-leaderboard`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${backend_url}/api/family/goal`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const leaderboardData = await leaderboardRes.json();
        const goalData = await goalRes.json();

        if (leaderboardRes.ok) {
          setFamilyName(leaderboardData.familyName);
          setMembers(leaderboardData.members);
        }
        if (goalRes.ok) {
          setGoal(goalData.goal || 0);
          setGoalName(goalData.goalName || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token, backend_url]);

  // Fetch task categories
useEffect(() => {
  const fetchTaskCategories = async () => {
    try {
      const res = await fetch(`${backend_url}/api/taskcategories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTaskCategories(data);
      }
    } catch (err) {
      console.error("Error fetching task categories:", err);
    }
  };

  if (token) fetchTaskCategories();
}, [token, backend_url]);


const handleSetGoal = async () => {
  if (selectedTasks.length === 0) {
    setGoalMessage({ type: 'error', text: 'Please select at least one task for the goal' });
    setTimeout(() => setGoalMessage({ type: '', text: '' }), 3000);
    return;
  }

  if (!goalNameInput.trim()) {
    setGoalMessage({ type: 'error', text: 'Please enter a goal name' });
    setTimeout(() => setGoalMessage({ type: '', text: '' }), 3000);
    return;
  }

  // Calculate total possible points from selected tasks
  const totalPossiblePoints = selectedTasks.reduce((sum, task) => {
    return sum + (task.points * (task.targetCount || 1));
  }, 0);

  try {
    const res = await fetch(`${backend_url}/api/family/goal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        goal: totalPossiblePoints, 
        goalName: goalNameInput,
        goalTasks: selectedTasks
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setGoal(data.goal);
      setGoalName(data.goalName);
      setGoalTasks(selectedTasks);
      setShowCreateGoal(false);
      setShowNameInput(false);
      setSelectedTasks([]);
      setGoalNameInput('');
      
      // Show success message inline
      setGoalMessage({ type: 'success', text: '✅ Goal set successfully!' });
      setTimeout(() => setGoalMessage({ type: '', text: '' }), 3000);
    } else {
      setGoalMessage({ type: 'error', text: data.message || 'Failed to set goal' });
      setTimeout(() => setGoalMessage({ type: '', text: '' }), 3000);
    }
  } catch (err) {
    console.error(err);
    setGoalMessage({ type: 'error', text: 'Failed to set goal' });
    setTimeout(() => setGoalMessage({ type: '', text: '' }), 3000);
  }
};



  const handleDeleteGoal = async () => {
    if (!window.confirm("Are you sure you want to delete today's goal?")) return;

    try {
      const res = await fetch(`${backend_url}/api/family/goal`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setGoal(0);
        setGoalName("");
        alert("✅ Goal deleted successfully");
      } else {
        alert(data.message || "Failed to delete goal");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete goal");
    }
  };
// Fetch user's tasks for today
useEffect(() => {
  const fetchUserTasks = async () => {
    if (!token || !user) return;
    
    try {
      const res = await fetch(`${backend_url}/api/user/today-tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
     
      const data = await res.json();
      //  console.log("Fetching today's tasks for user:", data); 
      if (res.ok) {
        setTodayUserTasks(data.tasks || []);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };


  fetchUserTasks();
}, [token, user, backend_url]);
  // Calculate total points and progress
  const totalPoints = members.reduce((sum, member) => sum + Math.round(member.points), 0);
  const progress = goal > 0 ? Math.min((totalPoints / goal) * 100, 100) : 0;
  const remainingPoints = Math.max(goal - totalPoints, 0);
  
  const avgPoints = members.length > 0 ? Math.round(totalPoints / members.length) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-orange-50">
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>
        <Navbar />
        <div className="pt-24 px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-6 h-6 border-2 border-[#FF7722] border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading family leaderboard...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-orange-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>
      
      <Navbar />
      
      <div className="relative max-w-7xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 pt-20 sm:pt-24">
        {/* Header Section */}
        <motion.div 
          className="text-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <span className="text-2xl sm:text-3xl">👨‍👩‍👧‍👦</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 font-sans">
              {familyName || "Family"} <span className="text-[#FF7722]">Leaderboard</span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg font-light max-w-2xl">
              Track your family's spiritual journey and celebrate collective devotion
            </p>
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
          </div>
        </motion.div>

        <LotusDivider />

        {/* View Toggle */}
        <motion.div 
          className="flex justify-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white/80 backdrop-blur-sm p-1 rounded-xl border border-gray-200 inline-flex shadow-sm">
            {[
              { id: "leaderboard", label: "Leaderboard", icon: "📊" },
              { id: "stats", label: "Family Stats", icon: "📈" },
              { id: "goals", label: "Daily Goal", icon: "🎯" }
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm sm:text-base ${
                  selectedView === view.id
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                    : "text-gray-600 hover:text-orange-500"
                }`}
              >
                <span>{view.icon}</span>
                <span className="hidden sm:inline">{view.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats Cards */}
        {members.length > 0 && (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
          >
            {[
              { label: "Total Members", value: members.length, icon: "👥", color: "from-blue-500 to-indigo-500" },
              { label: "Total Points", value: totalPoints.toLocaleString(), icon: "⭐", color: "from-orange-500 to-amber-500" },
              { label: "Active Today", value: members.filter(m => m.points > 0).length, icon: "🔥", color: "from-red-500 to-orange-500" },
              { label: "Average", value: avgPoints.toLocaleString(), icon: "📊", color: "from-purple-500 to-pink-500" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className={`text-xs font-medium px-2 py-1 bg-gradient-to-r ${stat.color} text-white rounded-full`}>
                    #{index + 1}
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {selectedView === "leaderboard" && (
            <motion.div
              key="leaderboard"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            >
              {members.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {members.map((member, index) => (
                    <motion.div
                      key={member._id}
                      variants={fadeUp}
                      className={`p-4 sm:p-6 hover:bg-orange-50/30 transition-colors duration-200 ${
                        index === 0 ? "bg-gradient-to-r from-amber-50/50 to-orange-50/50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Rank */}
                        <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-bold text-sm sm:text-base flex-shrink-0 ${
                          index === 0 ? "bg-amber-500 text-white" :
                          index === 1 ? "bg-orange-500 text-white" :
                          index === 2 ? "bg-amber-400 text-white" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {index + 1}
                        </div>

                        {/* Avatar */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 p-0.5 flex-shrink-0">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-lg sm:text-xl font-semibold text-orange-500">
                            {member.name.charAt(0)}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                              {member.name}
                            </span>
                            {member._id === user?._id && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>
                            )}
                            {index === 0 && (
                              <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span>👑</span> Leading
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">{member.email}</p>
                        </div>

                        {/* Points */}
                        <div className="text-right">
                          <span className="text-xs text-gray-500 hidden sm:block">Points</span>
                          <span className={`font-bold text-lg sm:text-xl ${
                            index === 0 ? "text-amber-600" :
                            index === 1 ? "text-orange-600" :
                            index === 2 ? "text-amber-500" :
                            "text-gray-700"
                          }`}>
                            {Math.round(member.points)}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar for contributions */}
                      {totalPoints > 0 && (
                        <div className="mt-2 ml-[4.5rem] sm:ml-14">
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(member.points / totalPoints) * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className={`h-full rounded-full ${
                                index === 0 ? "bg-amber-500" :
                                index === 1 ? "bg-orange-500" :
                                index === 2 ? "bg-amber-400" :
                                "bg-orange-300"
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 sm:py-16 px-4">
                  <div className="text-5xl sm:text-6xl mb-4">👨‍👩‍👧‍👦</div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Family Members Yet</h3>
                  <p className="text-gray-500 text-sm sm:text-base mb-6 max-w-sm mx-auto">
                    Invite your family members to join and start contributing to the spiritual journey!
                  </p>
                  <button
                    onClick={() => window.location.href = '/invite'}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                  >
                    <span>📨</span>
                    Invite Family
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {selectedView === "stats" && members.length > 0 && (
            <motion.div
              key="stats"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Family Statistics
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                {/* Contribution Distribution */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Contribution Distribution</h3>
                  <div className="space-y-4">
                    {members.map((member, index) => {
                      const percentage = totalPoints > 0 ? (member.points / totalPoints) * 100 : 0;
                      return (
                        <div key={member._id} className="space-y-1">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">{member.name}</span>
                            <span className="font-semibold text-orange-600">{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className={`h-full rounded-full ${
                                index === 0 ? "bg-amber-500" :
                                index === 1 ? "bg-orange-500" :
                                index === 2 ? "bg-amber-400" :
                                "bg-orange-300"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Highest</p>
                      <p className="text-xl sm:text-2xl font-bold text-orange-600">{Math.round(...members.map(m => m.points))}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{members.find(m => m.points === Math.round(...members.map(m => m.points)))?.name}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Lowest</p>
                      <p className="text-xl sm:text-2xl font-bold text-amber-600">{Math.round(Math.min(...members.map(m => m.points)))}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{members.find(m => m.points === Math.round(Math.min(...members.map(m => m.points))))?.name}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Average</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{avgPoints}</p>
                      <p className="text-xs text-gray-500 mt-1">per member</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Total</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalPoints}</p>
                      <p className="text-xs text-gray-500 mt-1">points earned</p>
                    </div>
                  </div>

                  {/* Achievement Section */}
                  <div className="mt-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">🏅 Recent Achievers</h3>
                    <div className="space-y-2">
                      {members.filter(m => m.points > 0).slice(0, 3).map((member, index) => (
                        <div key={member._id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            index === 0 ? "bg-amber-100 text-amber-600" :
                            index === 1 ? "bg-orange-100 text-orange-600" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {index === 0 ? "👑" : index === 1 ? "⭐" : "🔥"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                            <p className="text-xs text-gray-500">{Math.round(member.points)} points</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

{selectedView === "goals" && (
  <motion.div
    key="goals"
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    exit={{ opacity: 0, y: -20 }}
    className="space-y-6"
  >
    {/* Goal Card */}
    <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <span className="text-2xl">🎯</span>
          Daily Family Goal
        </h2>
      </div>

      {/* Inline Message */}
      {goalMessage.text && (
        <div className={`mb-4 p-3 rounded-lg text-center ${
          goalMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {goalMessage.text}
        </div>
      )}

      {!showCreateGoal && goal === 0 && (
        <div className="text-center py-8">
          <button
            onClick={() => setShowCreateGoal(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600"
          >
            Create New Goal
          </button>
        </div>
      )}

      {/* Create Goal Form */}
      {showCreateGoal && !showNameInput && (
        <div className="max-w-2xl mx-auto bg-orange-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Select Tasks for Today's Goal</h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
            {taskCategories.map((category) => (
              <div key={category._id} className="bg-white rounded-lg p-3 border border-gray-200">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedTasks.some(t => t.name === category.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTasks([...selectedTasks, {
                          name: category.name,
                          points: category.points,
                          category: category.categoryType,
                          targetCount: 1
                        }]);
                      } else {
                        setSelectedTasks(selectedTasks.filter(t => t.name !== category.name));
                      }
                    }}
                    className="w-4 h-4 text-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-orange-600">{category.points} pts each</span>
                    </div>
                    <span className="text-xs text-gray-500">{category.categoryType}</span>
                  </div>
                </label>
                
                {/* Target count input for selected tasks */}
                {selectedTasks.some(t => t.name === category.name) && (
                  <div className="mt-2 ml-7">
                    <label className="text-sm text-gray-600">Target count:</label>
                    <input
                      type="number"
                      min="1"
                      value={selectedTasks.find(t => t.name === category.name)?.targetCount || 1}
                      onChange={(e) => {
                        const count = parseInt(e.target.value) || 1;
                        setSelectedTasks(selectedTasks.map(t => 
                          t.name === category.name ? {...t, targetCount: count} : t
                        ));
                      }}
                      className="ml-2 w-20 px-2 py-1 border rounded"
                    />
                    <span className="ml-2 text-sm text-gray-500">
                      = {category.points * (selectedTasks.find(t => t.name === category.name)?.targetCount || 1)} pts
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowNameInput(true)}
              disabled={selectedTasks.length === 0}
              className="flex-1 bg-orange-500 text-white py-2 rounded-lg disabled:opacity-50"
            >
              Next ({selectedTasks.reduce((sum, t) => sum + (t.points * t.targetCount), 0)} pts)
            </button>
            <button
              onClick={() => {
                setShowCreateGoal(false);
                setSelectedTasks([]);
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Goal Name Input Form */}
      {showNameInput && (
        <div className="max-w-md mx-auto bg-orange-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Name Your Goal</h3>
          
          <input
            type="text"
            value={goalNameInput}
            onChange={(e) => setGoalNameInput(e.target.value)}
            placeholder="e.g., Morning Sadhana, Family Prayer Time..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            autoFocus
          />
          
          <div className="flex gap-3">
            <button
              onClick={handleSetGoal}
              className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
            >
              Create Goal
            </button>
            <button
              onClick={() => {
                setShowNameInput(false);
                setGoalNameInput('');
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Active Goal Display */}
      {goal > 0 && !showCreateGoal && !showNameInput && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{goalName}</h3>
              <p className="text-sm text-gray-600">Target: {goal.toLocaleString()} points</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{Math.round(totalPoints)} pts</span>
                <span className="font-semibold text-orange-600">{progress.toFixed(1)}%</span>
                <span>{goal} pts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className={`h-full rounded-full ${
                    progress >= 100 ? "bg-green-500" : "bg-orange-500"
                  }`}
                />
              </div>
            </div>

            {/* Goal Tasks Progress */}
            {goalTasks.length > 0 && (
              <div className="mt-4 pt-4 border-t border-orange-200">
                <h4 className="font-medium mb-2">Task Progress:</h4>
                {goalTasks.map((goalTask) => {
                  // Find how many times this task was done today
                  const completedCount = todayUserTasks.reduce((sum, taskDoc) => {
                    const matchingTask = taskDoc.tasks?.find(t => t.task === goalTask.name);
                    return sum + (matchingTask?.count || 0);
                  }, 0);
                  
                  const targetCount = goalTask.targetCount || 1;
                  const taskProgress = Math.min((completedCount / targetCount) * 100, 100);
                  
                  return (
                    <div key={goalTask.name} className="mb-2">
                      <div className="flex justify-between text-sm">
                        <span>{goalTask.name}</span>
                        <span>{completedCount}/{targetCount}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-400 h-2 rounded-full"
                          style={{ width: `${taskProgress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => {
                  setShowCreateGoal(true);
                  setSelectedTasks(goalTasks);
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
              >
                Update Goal
              </button>
              <button
                onClick={handleDeleteGoal}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>


    {/* Family Tasks Progress */}
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span>👪</span>
        Family Progress
      </h3>
      
      <div className="space-y-4">
        {members.filter(m => m.points > 0).map((member) => (
          <div key={member._id} className="border-b border-gray-100 pb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  {member.name.charAt(0)}
                </div>
                <span className="font-medium">{member.name}</span>
              </div>
              <span className="text-orange-600 font-semibold">{Math.round(member.points)}</span>
            </div>
            
            {/* Progress bar towards goal */}
            {goal > 0 && (
              <div className="ml-10">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-400 h-2 rounded-full"
                    style={{ width: `${(member.points / goal) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </motion.div>
)}
     </AnimatePresence>

        {/* Footer */}
        <motion.footer 
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center py-6"
        >
          <LotusDivider className="mb-4" />
          <p className="text-xs text-gray-500">
            Leaderboard updates daily • Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-xs mt-2 text-gray-400">
            Developed by{' '}
            <a 
              href="https://buildcrew.co.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Build Crew
            </a>
          </p>
        </motion.footer>
      </div>

     
    </div>
  );
};

export default FamilyLeaderboard;
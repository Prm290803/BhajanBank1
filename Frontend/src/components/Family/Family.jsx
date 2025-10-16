import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";

const FamilyLeaderboard = () => {
  const [members, setMembers] = useState([]);
  const [familyName, setFamilyName] = useState("");
  const [goal, setGoal] = useState(0);
  const [goalName, setGoalName] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL || "";

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

  const handleSetGoal = async () => {
    const goalNameInput = prompt("Enter goal name:", "Utsav Vandusahajanand Paath");
    if (!goalNameInput) return;

    const input = prompt("Enter today's goal (points):", "100000");
    if (!input) return;

    const newGoal = parseInt(input);
    if (isNaN(newGoal) || newGoal <= 0) return alert("Please enter a valid number.");

    try {
      const res = await fetch(`${backend_url}/api/family/goal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ goal: newGoal, goalName: goalNameInput }),
      });

      const data = await res.json();
      if (res.ok) {
        setGoal(data.goal);
        setGoalName(data.goalName);
        alert(`✅ Goal set successfully: ${data.goalName} - ${data.goal.toLocaleString()} points`);
      } else {
        alert(data.message || "Failed to set goal");
      }
    } catch (err) {
      console.error(err);
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

  // Calculate total points and progress
  const totalPoints = members.reduce((sum, member) => sum + member.points, 0);
  const progress = goal > 0 ? Math.min((totalPoints / goal) * 100, 100) : 0;
  const remainingPoints = Math.max(goal - totalPoints, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navbar />
        <div className="pt-16 md:pt-20 lg:pt-24 p-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-orange-100 p-6 sm:p-8 max-w-4xl mx-auto">
            <div className="flex justify-center items-center py-8 sm:py-12">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-600 text-sm sm:text-base">
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                Loading leaderboard...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      {/* Main Content with proper mobile spacing */}
      <div className="pt-16 md:pt-20 lg:pt-24 px-3 sm:px-4 lg:px-8">
        <div className="max-w-4xl lg:max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 sm:mb-8 lg:mb-12 px-2"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <span className="text-2xl sm:text-3xl lg:text-4xl">🏆</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              {familyName || "Family"} Leaderboard
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-md sm:max-w-2xl mx-auto mb-4">
              Top contributors in your family
            </p>

            {/* Goal Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex flex-col sm:flex-row items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-amber-200 px-4 sm:px-6 py-3 rounded-xl shadow-sm"
            >
              {goal > 0 ? (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="text-amber-700 font-semibold text-sm sm:text-base flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      {goalName}
                    </span>
                    <span className="text-amber-600 text-xs sm:text-sm">
                      Target: {goal.toLocaleString()} Points
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSetGoal}
                      className="text-amber-600 hover:text-amber-800 text-xs sm:text-sm font-medium underline transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSetGoal}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <span className="text-lg">🎯</span>
                  Set Today's Goal
                </motion.button>
              )}
            </motion.div>
          </motion.div>

          {/* Content Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-orange-100 p-4 sm:p-6 lg:p-8 mx-2 sm:mx-0"
          >
            {/* Leaderboard Table */}
            {members.length > 0 ? (
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                {members.map((member, index) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 border ${
                      index === 0
                        ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 sm:border-amber-300 shadow-sm sm:shadow-lg"
                        : index === 1
                        ? "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 sm:border-orange-300 shadow-sm sm:shadow-md"
                        : index === 2
                        ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 sm:border-amber-300 shadow-sm sm:shadow-md"
                        : "bg-white border-gray-100 sm:border-gray-200 hover:border-orange-200"
                    } hover:shadow-md sm:hover:shadow-lg hover:translate-x-1 sm:hover:translate-x-2`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 min-w-0 flex-1">
                      {/* Rank Badge */}
                      <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold text-base sm:text-lg lg:text-xl transition-all duration-300 flex-shrink-0 ${
                        index === 0 ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg sm:shadow-xl" :
                        index === 1 ? "bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-md sm:shadow-lg" :
                        index === 2 ? "bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-md sm:shadow-lg" :
                        "bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600"
                      }`}>
                        {index + 1}
                      </div>
                      
                      {/* Member Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 lg:gap-4">
                          <span className={`font-semibold text-base sm:text-lg lg:text-xl truncate ${
                            index === 0 ? "text-gray-900" : "text-gray-800"
                          }`}>
                            {member.name}
                            {member._id === user?._id && (
                              <span className="text-blue-600 text-xs sm:text-sm ml-1 sm:ml-2">(You)</span>
                            )}
                          </span>
                          {index === 0 && (
                            <div className="flex items-center gap-1 mt-1 sm:mt-0">
                              <span className="text-xs sm:text-sm text-amber-600 font-medium bg-amber-100 px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full border border-amber-200 sm:border-amber-300">
                                🏆 Leading
                              </span>
                            </div>
                          )}
                        </div>
                        {member.email && (
                          <p className="text-gray-500 text-xs sm:text-sm lg:text-base mt-1 truncate">
                            {member.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Points Section */}
                    <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 ml-2 sm:ml-4 flex-shrink-0">
                      <span className="text-gray-500 font-medium text-xs sm:text-sm lg:text-base hidden xs:inline">
                        Points
                      </span>
                      <span className={`px-3 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-3 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold text-sm sm:text-base lg:text-lg min-w-14 sm:min-w-16 lg:min-w-20 text-center shadow-md sm:shadow-lg ${
                        index === 0 ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white" :
                        index === 1 ? "bg-gradient-to-br from-gray-500 to-gray-600 text-white" :
                        index === 2 ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white" :
                        "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700"
                      }`}>
                        {member.points}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 sm:py-16 lg:py-20 px-4"
              >
                <div className="text-5xl sm:text-6xl lg:text-7xl mb-4 sm:mb-6">👨‍👩‍👧‍👦</div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  No Family Members Yet
                </h3>
                <p className="text-gray-500 text-sm sm:text-base lg:text-lg max-w-xs sm:max-w-md mx-auto mb-6 sm:mb-8">
                  Invite family members to join and start contributing to the leaderboard!
                </p>
                <motion.button
                  onClick={() => window.location.href = '/invite'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                >
                  Invite Family Members
                </motion.button>
              </motion.div>
            )}

            {/* Stats Summary */}
            {members.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 sm:mt-8 lg:mt-12 p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 sm:border-2 sm:border-amber-300 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">{members.length}</div>
                    <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">Total Members</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-amber-600">
                      {totalPoints}
                    </div>
                    <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">Total Points</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1 mt-2 sm:mt-0">
                    <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">
                      {members.filter(m => m.points > 0).length}
                    </div>
                    <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">Active Members</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Goal Progress Bar */}
            {goal > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-6 sm:mt-8 lg:mt-12 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl sm:rounded-2xl shadow-md"
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
                    <span className="text-xl">🎯</span>
                    {goalName} - Goal Progress
                  </h3>
                  <div className="flex justify-between items-center text-sm sm:text-base text-gray-600 mb-2">
                    <span>{totalPoints.toLocaleString()} points</span>
                    <span className="font-semibold">{progress.toFixed(1)}%</span>
                    <span>{goal.toLocaleString()} points</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 sm:h-6 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      progress >= 100 
                        ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                        : "bg-gradient-to-r from-orange-500 to-amber-500"
                    } shadow-inner`}
                  />
                </div>

                {/* Progress Message */}
                <div className="text-center mt-3">
                  {progress >= 100 ? (
                    <p className="text-green-600 font-semibold text-sm sm:text-base">
                      🎉 Congratulations! Goal achieved!
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm sm:text-base">
                      {remainingPoints.toLocaleString()} points remaining to reach today's goal
                    </p>
                  )}
                </div>

                {/* Delete Goal Button */}
                <div className="text-center mt-4">
                  <button
                    onClick={handleDeleteGoal}
                    className="text-red-500 hover:text-red-700 text-xs sm:text-sm font-medium underline transition-colors"
                  >
                    Remove Today's Goal
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Footer Section */}
          {members.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-6 sm:mt-8 lg:mt-12 px-2"
            >
              <p className="text-gray-500 text-xs sm:text-sm lg:text-base">
                Leaderboard updates daily • Last updated: {new Date().toLocaleDateString()}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyLeaderboard;
// import React, { useEffect, useState } from "react";
// import { useAuth } from "../../Auth/AuthContext";
// import { motion } from "framer-motion";

// const BhajanShatra = () => {
//   const { user } = useAuth();
//   const backend_url = import.meta.env.VITE_BACKENDURL;

//   const [goalData, setGoalData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUniversalGoal = async () => {
//       try {
//         console.log("Fetching from:", `${backend_url}/api/universal-goal/progress`);
        
//         const res = await fetch(`${backend_url}/api/universal-goal/progress`);
        
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
        
//         const text = await res.text();
//         console.log("Raw response:", text);
        
//         try {
//           const result = JSON.parse(text);
          
//           if (result.message) {
//             setGoalData(null);
//           } else {
//             setGoalData(result);
//           }
//         } catch (parseError) {
//           console.error("JSON parse error:", parseError);
//           throw new Error("Invalid JSON response from server");
//         }
        
//       } catch (err) {
//         console.error("Failed to fetch universal goal:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUniversalGoal();
//   }, [backend_url]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-4xl mb-4 animate-pulse">🕉️</div>
//           <div className="text-lg text-gray-600">Loading Bhajan Shatra...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
//           <div className="text-6xl mb-4">⚠️</div>
//           <div className="text-lg text-red-600 mb-2">Error Loading Data</div>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <p className="text-sm text-gray-400">
//             Please check if the backend server is running on port 5000
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!goalData || goalData.message) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
//           <div className="text-6xl mb-4">🕉️</div>
//           <div className="text-lg text-gray-600">
//             {goalData?.message || "No active Bhajan Shatra right now 🙏"}
//           </div>
//           <p className="text-sm text-gray-400 mt-4">
//             Check back later for new spiritual challenges
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const {
//     goalName,
//     description,
//     target,
//     globalTotal,
//     progress,
//     startDate,
//     endDate,
//     leaderboard = []
//   } = goalData;

//   const daysRemaining = Math.ceil(
//     (new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)
//   );

//   const daysSinceStart = Math.ceil(
//     (new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24)
//   );

//   const currentUserEntry = leaderboard.find(
//     (entry) => entry.userId === user?._id
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
//       <div className="max-w-5xl mx-auto">

//         {/* Header with Decorative Elements */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-12 relative"
//         >
//           <div className="absolute inset-0 flex items-center justify-center opacity-10">
//             <span className="text-8xl">🕉️</span>
//           </div>
          
//           <div className="relative">
//             <h1 className="text-5xl font-bold text-gray-900 mb-4">
//               <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
//                 {goalName || "Bhajan Shatra"}
//               </span>
//             </h1>
//             <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//               {description || "Join the community in this spiritual journey"}
//             </p>
            
//             {/* Timeline Badges */}
//             <div className="flex flex-wrap justify-center gap-4 mt-6">
//               <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
//                 <span className="text-gray-600">Started: </span>
//                 <span className="font-semibold">
//                   {new Date(startDate).toLocaleDateString()}
//                 </span>
//               </div>
//               <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
//                 <span className="text-gray-600">Ends in: </span>
//                 <span className="font-semibold text-orange-600">
//                   {daysRemaining > 0 ? daysRemaining : 0} days
//                 </span>
//               </div>
//               <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
//                 <span className="text-gray-600">Day </span>
//                 <span className="font-semibold text-amber-600">
//                   {daysSinceStart}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Global Progress Card */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-orange-100"
//         >
//           <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
//             🌍 Global Progress
//           </h2>
          
//           <div className="flex justify-between text-sm text-gray-600 mb-3">
//             <span className="font-medium">{globalTotal.toLocaleString()} completed</span>
//             <span className="font-medium">Target: {target.toLocaleString()}</span>
//           </div>

//           <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${progress}%` }}
//               transition={{ duration: 1, ease: "easeOut" }}
//               className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 relative"
//             >
//               <div className="absolute inset-0 flex items-center justify-end pr-4">
//                 <span className="text-white text-sm font-bold drop-shadow-md">
//                   {progress.toFixed(1)}%
//                 </span>
//               </div>
//             </motion.div>
//           </div>

//           <div className="grid grid-cols-2 gap-4 mt-6">
//             <div className="text-center p-4 bg-orange-50 rounded-xl">
//               <div className="text-sm text-gray-600">Total Contributions</div>
//               <div className="text-2xl font-bold text-orange-600">
//                 {globalTotal.toLocaleString()}
//               </div>
//             </div>
//             <div className="text-center p-4 bg-amber-50 rounded-xl">
//               <div className="text-sm text-gray-600">Active Devotees</div>
//               <div className="text-2xl font-bold text-amber-600">
//                 {leaderboard.length}
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Personal Contribution Card */}
//         {currentUserEntry && (
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.3 }}
//             className="bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-300 rounded-2xl p-6 mb-8 shadow-md"
//           >
//             <div className="flex items-center justify-between flex-wrap gap-4">
//               <div className="flex items-center gap-3">
//                 <span className="text-4xl">🙏</span>
//                 <div>
//                   <p className="text-gray-700">Your Contribution</p>
//                   <p className="text-2xl font-bold text-orange-700">
//                     {currentUserEntry.total} counts
//                   </p>
//                 </div>
//               </div>
//               <div className="bg-white px-6 py-3 rounded-xl">
//                 <span className="text-gray-600">Rank </span>
//                 <span className="text-2xl font-bold text-amber-600">
//                   #{leaderboard.findIndex(u => u.userId === user?._id) + 1}
//                 </span>
//               </div>
//             </div>
//           </motion.div>
//         )}

//         {/* Leaderboard Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="bg-white rounded-3xl shadow-xl p-8"
//         >
//           <h2 className="text-3xl font-bold text-center mb-8">
//             <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
//               🏆 Top Devotees
//             </span>
//           </h2>

//           <div className="space-y-3">
//             {leaderboard.slice(0, 10).map((member, index) => {
//               const isCurrentUser = member.userId === user?._id;
//               const rankColors = [
//                 "bg-yellow-100 border-yellow-300", // 1st
//                 "bg-gray-100 border-gray-300",      // 2nd
//                 "bg-amber-100 border-amber-300",    // 3rd
//                 "bg-orange-50 border-orange-200"    // 4th+
//               ];
              
//               const rankColor = index < 3 ? rankColors[index] : rankColors[3];
//               const rankEmoji = index === 0 ? "👑" : index === 1 ? "🥈" : index === 2 ? "🥉" : "📿";

//               return (
//                 <motion.div
//                   key={member.userId}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                   className={`flex justify-between items-center p-4 rounded-xl border-2 ${rankColor} ${
//                     isCurrentUser ? "ring-2 ring-blue-400 ring-offset-2" : ""
//                   }`}
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-2">
//                       <span className="text-2xl">{rankEmoji}</span>
//                       <span className="font-bold text-lg min-w-[2rem]">
//                         #{index + 1}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="font-semibold text-gray-800">
//                         {member.name}
//                       </span>
//                       {isCurrentUser && (
//                         <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
//                           You
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <span className="font-bold text-lg text-orange-700">
//                       {member.total.toLocaleString()}
//                     </span>
//                     <span className="text-sm text-gray-500">counts</span>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>

//           {leaderboard.length === 0 && (
//             <div className="text-center py-12 text-gray-500">
//               <div className="text-6xl mb-4">🕊️</div>
//               <p>No contributions yet. Be the first to start!</p>
//             </div>
//           )}

//           {/* Footer Note */}
//           <div className="mt-8 text-center text-sm text-gray-500 border-t pt-6">
//             <p>Continue your spiritual practice • Every count matters 🙏</p>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default BhajanShatra;



import React, { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const BhajanShatra = () => {
  const { user } = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL;

  const [goalData, setGoalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for creating new goal
  const [newGoal, setNewGoal] = useState({
    name: "",
    description: "",
    targetCount: "",
    targetType: "category",
    targetName: "Bhajan",
    duration: 30 // days
  });

  // Debug logs
  console.log("Backend URL:", backend_url);
  console.log("User:", user);
  console.log("Goal Data:", goalData);

  // Check if user is admin
  useEffect(() => {
    if (user) {
      // Check if user has admin role - modify this based on your user schema
      setIsAdmin(user.role === "admin" || user.isAdmin || false);
    }
  }, [user]);

  const fetchUniversalGoal = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching from:", `${backend_url}/api/universal-goal/progress`);
      
      const res = await fetch(`${backend_url}/api/universal-goal/progress`);
      
      // Handle 404 specially - this means no active goal
      if (res.status === 404) {
        console.log("No active goal found (404)");
        setGoalData(null);
        setLoading(false);
        return;
      }
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const text = await res.text();
      console.log("Raw response:", text);
      
      // If response is empty, treat as no goal
      if (!text || text.trim() === '') {
        console.log("Empty response, no goal found");
        setGoalData(null);
        setLoading(false);
        return;
      }
      
      try {
        const result = JSON.parse(text);
        console.log("Parsed result:", result);
        
        // Check if the response indicates no goal
        if (result.message || !result.name) {
          console.log("Response indicates no goal:", result.message);
          setGoalData(null);
        } else {
          console.log("Active goal found:", result.name);
          setGoalData(result);
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        setGoalData(null);
      }
      
    } catch (err) {
      console.error("Failed to fetch universal goal:", err);
      // Don't set error for "no goal" situations
      if (err.message.includes("404")) {
        setGoalData(null);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversalGoal();
  }, [backend_url]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token"); // Adjust based on your auth storage
      
      if (!token) {
        alert("You must be logged in to create a goal");
        return;
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(newGoal.duration));

      const goalToCreate = {
        name: newGoal.name,
        description: newGoal.description,
        targetCount: parseInt(newGoal.targetCount),
        targetType: newGoal.targetType,
        targetName: newGoal.targetName,
        startDate: startDate,
        endDate: endDate,
        isActive: true
      };

      console.log("Creating goal:", goalToCreate);
      console.log("Token:", token);

      const res = await fetch(`${backend_url}/api/universal-goal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(goalToCreate)
      });

      const responseText = await res.text();
      console.log("Create response status:", res.status);
      console.log("Create response:", responseText);

      if (!res.ok) {
        throw new Error(`Failed to create goal: ${res.status} - ${responseText}`);
      }

      // Refresh the goal data
      await fetchUniversalGoal();
      setShowCreateForm(false);
      
      // Reset form
      setNewGoal({
        name: "",
        description: "",
        targetCount: "",
        targetType: "category",
        targetName: "Bhajan",
        duration: 30
      });

      alert("Goal created successfully! 🎉");

    } catch (err) {
      console.error("Error creating goal:", err);
      alert(`Failed to create goal: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewGoal({
      name: "",
      description: "",
      targetCount: "",
      targetType: "category",
      targetName: "Bhajan",
      duration: 30
    });
    setShowCreateForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🕉️</div>
          <div className="text-lg text-gray-600">Loading Bhajan Shatra...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-lg text-red-600 mb-2">Error Loading Data</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUniversalGoal}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No active goal - Show create button or message
  if (!goalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
        <div className="max-w-4xl mx-auto">
          
          {/* No Goal Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="text-8xl mb-6">🕉️</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Bhajan Shatra
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              No active spiritual challenge at the moment
            </p>

            {/* Admin Create Button */}
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                ✨ Create New Bhajan Shatra ✨
              </motion.button>
            )}
          </motion.div>

          {/* Create Goal Form Modal */}
          <AnimatePresence>
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                onClick={resetForm}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                  onClick={e => e.stopPropagation()}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Create New Bhajan Shatra
                  </h2>

                  <form onSubmit={handleCreateGoal} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Goal Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newGoal.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Bhajan Shatra 2026"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={newGoal.description}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Describe the spiritual challenge..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Count *
                      </label>
                      <input
                        type="number"
                        name="targetCount"
                        value={newGoal.targetCount}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., 1000000"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Type *
                        </label>
                        <select
                          name="targetType"
                          value={newGoal.targetType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="category">Category</option>
                          <option value="task">Task</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Name *
                        </label>
                        <input
                          type="text"
                          name="targetName"
                          value={newGoal.targetName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="e.g., Bhajan"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (days) *
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={newGoal.duration}
                        onChange={handleInputChange}
                        required
                        min="1"
                        max="365"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow ${
                          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? 'Creating...' : 'Create Goal'}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Non-admin view */}
          {!isAdmin && (
            <div className="text-center text-gray-500">
              <p className="text-lg">Check back later for new spiritual challenges 🙏</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Active goal exists - Show the goal details
  const {
    name: goalName,
    description,
    target,
    globalTotal,
    progress,
    startDate,
    endDate,
    leaderboard = []
  } = goalData;

  // Handle potential different data structures
  const targetValue = typeof target === 'object' ? target.count : target;
  const globalTotalValue = typeof globalTotal === 'object' ? globalTotal.count : globalTotal;

  const daysRemaining = Math.max(0, Math.ceil(
    (new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)
  ));

  const daysSinceStart = Math.max(1, Math.ceil(
    (new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24)
  ));

  const currentUserEntry = leaderboard.find(
    (entry) => entry.userId === user?._id
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Admin Edit Button */}
        {isAdmin && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-white text-orange-600 rounded-lg shadow hover:shadow-md transition-shadow border border-orange-200"
            >
              ✏️ Edit Goal
            </button>
          </div>
        )}

        {/* Header with Decorative Elements */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-8xl">🕉️</span>
          </div>
          
          <div className="relative">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {goalName || "Bhajan Shatra"}
              </span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {description || "Join the community in this spiritual journey"}
            </p>
            
            {/* Timeline Badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="text-gray-600">Started: </span>
                <span className="font-semibold">
                  {new Date(startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="text-gray-600">Ends in: </span>
                <span className="font-semibold text-orange-600">
                  {daysRemaining > 0 ? daysRemaining : 0} days
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="text-gray-600">Day </span>
                <span className="font-semibold text-amber-600">
                  {daysSinceStart}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Progress Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-orange-100"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            🌍 Global Progress
          </h2>
          
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span className="font-medium">{globalTotalValue?.toLocaleString() || 0} completed</span>
            <span className="font-medium">Target: {targetValue?.toLocaleString() || 0}</span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress || 0}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 relative"
            >
              <div className="absolute inset-0 flex items-center justify-end pr-4">
                <span className="text-white text-sm font-bold drop-shadow-md">
                  {(progress || 0).toFixed(1)}%
                </span>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-sm text-gray-600">Total Contributions</div>
              <div className="text-2xl font-bold text-orange-600">
                {globalTotalValue?.toLocaleString() || 0}
              </div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <div className="text-sm text-gray-600">Active Devotees</div>
              <div className="text-2xl font-bold text-amber-600">
                {leaderboard.length}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personal Contribution Card */}
        {currentUserEntry && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-300 rounded-2xl p-6 mb-8 shadow-md"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🙏</span>
                <div>
                  <p className="text-gray-700">Your Contribution</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {currentUserEntry.total?.toLocaleString() || 0} counts
                  </p>
                </div>
              </div>
              <div className="bg-white px-6 py-3 rounded-xl">
                <span className="text-gray-600">Rank </span>
                <span className="text-2xl font-bold text-amber-600">
                  #{leaderboard.findIndex(u => u.userId === user?._id) + 1}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              🏆 Top Devotees
            </span>
          </h2>

          <div className="space-y-3">
            {leaderboard.slice(0, 10).map((member, index) => {
              const isCurrentUser = member.userId === user?._id;
              const rankColors = [
                "bg-yellow-100 border-yellow-300", // 1st
                "bg-gray-100 border-gray-300",      // 2nd
                "bg-amber-100 border-amber-300",    // 3rd
                "bg-orange-50 border-orange-200"    // 4th+
              ];
              
              const rankColor = index < 3 ? rankColors[index] : rankColors[3];
              const rankEmoji = index === 0 ? "👑" : index === 1 ? "🥈" : index === 2 ? "🥉" : "📿";

              return (
                <motion.div
                  key={member.userId || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex justify-between items-center p-4 rounded-xl border-2 ${rankColor} ${
                    isCurrentUser ? "ring-2 ring-blue-400 ring-offset-2" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{rankEmoji}</span>
                      <span className="font-bold text-lg min-w-[2rem]">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">
                        {member.name || "Anonymous"}
                      </span>
                      {isCurrentUser && (
                        <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          You
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-orange-700">
                      {member.total?.toLocaleString() || 0}
                    </span>
                    <span className="text-sm text-gray-500">counts</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {leaderboard.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🕊️</div>
              <p>No contributions yet. Be the first to start!</p>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-gray-500 border-t pt-6">
            <p>Continue your spiritual practice • Every count matters 🙏</p>
          </div>
        </motion.div>
      </div>

      {/* Create/Edit Goal Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {goalData ? "Edit Bhajan Shatra" : "Create New Bhajan Shatra"}
              </h2>

              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newGoal.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Bhajan Shatra 2026"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={newGoal.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Describe the spiritual challenge..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Count *
                  </label>
                  <input
                    type="number"
                    name="targetCount"
                    value={newGoal.targetCount}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., 1000000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Type *
                    </label>
                    <select
                      name="targetType"
                      value={newGoal.targetType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="category">Category</option>
                      <option value="task">Task</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Name *
                    </label>
                    <input
                      type="text"
                      name="targetName"
                      value={newGoal.targetName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Bhajan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (days) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={newGoal.duration}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="365"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Saving...' : (goalData ? 'Update Goal' : 'Create Goal')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BhajanShatra;

// import { useEffect, useState } from "react";
// import { useAuth } from "../../Auth/AuthContext";
// import { motion, AnimatePresence } from "framer-motion";
// import Navbar from "../Navbar/Navbar";
// import LotusDivider from "../Common/LotusDivider";
// import axios from "axios";

// // Motion Variants
// const fadeUp = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
// };

// const stagger = {
//   visible: {
//     transition: {
//       staggerChildren: 0.1
//     }
//   }
// };

// const BhajanShastra = () => {
//   const { user, token } = useAuth();
//   const backend_url = import.meta.env.VITE_BACKENDURL;
  
//   // State for shatras
//   const [shatras, setShatras] = useState([]);
//   const [activeShatra, setActiveShatra] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [contributionInput, setContributionInput] = useState("");
//   const [fetchError, setFetchError] = useState(null);
  
//   // State for leaderboard
//   const [leaderboard, setLeaderboard] = useState({ top10: [], userRank: null });
//   const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  
//   // Form state for creating shatra
//   const [newShatra, setNewShatra] = useState({
//     title: "",
//     description: "",
//     targetCount: "",
//     startDate: "",
//     endDate: ""
//   });

//   // Fetch all shatras on component mount and when token changes
//   useEffect(() => {
//     if (token) {
//       fetchShatras();
//     }
//   }, [token]);

//   // Load active shatra from localStorage on initial mount
//   useEffect(() => {
//     const savedShatraId = localStorage.getItem('activeShatraId');
//     if (savedShatraId && shatras.length > 0) {
//       const savedShatra = shatras.find(s => s._id === savedShatraId);
//       if (savedShatra) {
//         setActiveShatra(savedShatra);
//         fetchLeaderboard(savedShatra._id);
//       }
//     }
//   }, [shatras]);

//   // Save active shatra to localStorage whenever it changes
//   useEffect(() => {
//     if (activeShatra) {
//       localStorage.setItem('activeShatraId', activeShatra._id);
//     }
//   }, [activeShatra]);

//   const fetchShatras = async () => {
//     try {
//       setLoading(true);
//       setFetchError(null);
//       const response = await axios.get(`${backend_url}/api/bhajan-shatra`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       setShatras(response.data);
      
//       // If no active shatra is set, set the first active one
//       if (!activeShatra && response.data.length > 0) {
//         const active = response.data.find(s => s.status === "active") || 
//                       response.data.find(s => s.status === "upcoming") || 
//                       response.data[0];
//         setActiveShatra(active);
//         fetchLeaderboard(active._id);
//       }
//     } catch (error) {
//       console.error("Error fetching shatras:", error);
//       setFetchError("Failed to load shatras. Please refresh the page.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch leaderboard for specific shatra
//   const fetchLeaderboard = async (shatraId) => {
//     if (!shatraId) return;
    
//     try {
//       setLeaderboardLoading(true);
//       const response = await axios.get(
//         `${backend_url}/api/bhajan-shatra/${shatraId}/leaderboard`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setLeaderboard(response.data);
//     } catch (error) {
//       console.error("Error fetching leaderboard:", error);
//     } finally {
//       setLeaderboardLoading(false);
//     }
//   };

//   // Create new shatra (admin only)
//   const handleCreateShatra = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `${backend_url}/api/bhajan-shatra`,
//         {
//           ...newShatra,
//           targetCount: parseInt(newShatra.targetCount)
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       // Add status to the new shatra
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
      
//       const startDate = new Date(response.data.startDate);
//       startDate.setHours(0, 0, 0, 0);
      
//       const endDate = new Date(response.data.endDate);
//       endDate.setHours(23, 59, 59, 999);
      
//       let status;
//       if (today > endDate) {
//         status = "completed";
//       } else if (today >= startDate && today <= endDate) {
//         status = "active";
//       } else {
//         status = "upcoming";
//       }
      
//       const newShatraWithStatus = {
//         ...response.data,
//         status,
//         totalContribution: 0,
//         progress: 0
//       };
      
//       setShatras([newShatraWithStatus, ...shatras]);
//       setShowCreateForm(false);
//       setNewShatra({
//         title: "",
//         description: "",
//         targetCount: "",
//         startDate: "",
//         endDate: ""
//       });
      
//       // Set the new shatra as active
//       setActiveShatra(newShatraWithStatus);
//       fetchLeaderboard(newShatraWithStatus._id);
      
//     } catch (error) {
//       console.error("Error creating shatra:", error);
//       alert(error.response?.data?.message || "Failed to create shatra");
//     }
//   };

//   // Add daily contribution
//   const handleAddContribution = async () => {
//     if (!activeShatra || !contributionInput) return;
    
//     try {
//       await axios.post(
//         `${backend_url}/api/bhajan-shatra/${activeShatra._id}/contribute`,
//         { count: parseInt(contributionInput) },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       // Refresh shatras to get updated totalContribution
//       await fetchShatras();
//       // Refresh leaderboard
//       await fetchLeaderboard(activeShatra._id);
      
//       setContributionInput("");
      
//     } catch (error) {
//       console.error("Error adding contribution:", error);
//       alert(error.response?.data?.message || "Failed to add contribution");
//     }
//   };

//   // Calculate user's total from leaderboard
//   const userTotal = leaderboard.userRank?.total || 0;
  
//   // Calculate progress
//   const progressPercentage = activeShatra 
//     ? (userTotal / activeShatra.targetCount) * 100 
//     : 0;
  
//   const barPercentage = Math.min(progressPercentage, 100);
//   const remainingCount = activeShatra 
//     ? Math.max(activeShatra.targetCount - userTotal, 0) 
//     : 0;
    
//   const isGoalAchieved = activeShatra && userTotal >= activeShatra.targetCount;

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   // Check if user can contribute
//   const canContribute = () => {
//     if (!activeShatra) return false;
    
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const startDate = new Date(activeShatra.startDate);
//     startDate.setHours(0, 0, 0, 0);
    
//     const endDate = new Date(activeShatra.endDate);
//     endDate.setHours(23, 59, 59, 999);
    
//     return today >= startDate && today <= endDate;
//   };

//   // Get status color and text
//   const getStatusInfo = (shatra) => {
//     if (!shatra) return { color: "bg-gray-50", textColor: "text-gray-700", label: "Unknown", icon: "❓" };
    
//     switch(shatra.status) {
//       case "active":
//         return { 
//           color: "bg-green-50", 
//           textColor: "text-green-700", 
//           label: "Ongoing", 
//           icon: <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//         };
//       case "upcoming":
//         return { 
//           color: "bg-blue-50", 
//           textColor: "text-blue-700", 
//           label: "Upcoming", 
//           icon: "⏳"
//         };
//       case "completed":
//         return { 
//           color: "bg-gray-50", 
//           textColor: "text-gray-700", 
//           label: "Completed", 
//           icon: "✅"
//         };
//       default:
//         return { 
//           color: "bg-gray-50", 
//           textColor: "text-gray-700", 
//           label: shatra.status || "Unknown", 
//           icon: "❓"
//         };
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
//         <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:15px_15px] sm:bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>
//         <Navbar />
//         <div className="pt-20 px-3 sm:px-4 relative">
//           <div className="max-w-4xl mx-auto">
//             <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
//               <div className="flex justify-center items-center py-12">
//                 <div className="flex items-center gap-3 text-gray-600">
//                   <div className="w-6 h-6 border-2 border-[#FF7722] border-t-transparent rounded-full animate-spin"></div>
//                   <span>Loading Bhajan Shastra...</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (fetchError) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
//         <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:15px_15px] sm:bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>
//         <Navbar />
//         <div className="pt-20 px-3 sm:px-4 relative">
//           <div className="max-w-4xl mx-auto">
//             <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
//               <div className="text-center py-12">
//                 <div className="text-4xl mb-4">⚠️</div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
//                 <p className="text-gray-500 text-sm mb-4">{fetchError}</p>
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium"
//                 >
//                   Refresh Page
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
//       {/* Background pattern */}
//       <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:15px_15px] sm:bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>
      
//       <Navbar />
      
//       <div className="relative max-w-6xl mx-auto space-y-6 sm:space-y-8 px-3 sm:px-4 pt-20 pb-8">
//         {/* Header */}
//         <motion.div 
//           className="text-center"
//           variants={fadeUp}
//           initial="hidden"
//           animate="visible"
//         >
//           <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4">
//             <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
//             <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-sans px-2">
//               Bhajan <span className="text-[#FF7722]">Shastra</span>
//             </h1>
//             <p className="text-gray-600 text-sm sm:text-base lg:text-lg font-light max-w-2xl px-2">
//               Collective spiritual sadhana for utsavs
//             </p>
//             <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
//           </div>
//         </motion.div>

//         <LotusDivider />

//         {/* Shatra Selection and Create Button */}
//         <motion.div 
//           className="flex flex-col sm:flex-row justify-between items-center gap-4"
//           variants={fadeUp}
//           initial="hidden"
//           animate="visible"
//         >
//           <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
//             {shatras.map((shatra) => {
//               const statusInfo = getStatusInfo(shatra);
              
//               return (
//                 <button
//                   key={shatra._id}
//                   onClick={() => {
//                     setActiveShatra(shatra);
//                     fetchLeaderboard(shatra._id);
//                   }}
//                   className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
//                     activeShatra?._id === shatra._id
//                       ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
//                       : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
//                   }`}
//                 >
//                   {shatra.title}
//                   <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
//                     shatra.status === "active" ? "bg-green-100 text-green-600" :
//                     shatra.status === "upcoming" ? "bg-blue-100 text-blue-600" :
//                     "bg-gray-100 text-gray-600"
//                   }`}>
//                     {shatra.status === "active" ? "Ongoing" :
//                      shatra.status === "upcoming" ? "Upcoming" : "Completed"}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
          
//           {/* Plus Button for Admin - Always Visible */}
//           {user?.role === "admin" && (
//             <motion.button
//               onClick={() => setShowCreateForm(!showCreateForm)}
//               className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <span className="text-2xl font-bold">+</span>
//               <span className="font-semibold">Create New Shatra</span>
//             </motion.button>
//           )}
//         </motion.div>

//         {/* Create Shatra Form */}
//         <AnimatePresence>
//           {showCreateForm && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               className="overflow-hidden"
//             >
//               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">Create New Bhajan Shatra</h3>
//                   <button
//                     onClick={() => setShowCreateForm(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     ✕
//                   </button>
//                 </div>
//                 <form onSubmit={handleCreateShatra} className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                       <input
//                         type="text"
//                         value={newShatra.title}
//                         onChange={(e) => setNewShatra({...newShatra, title: e.target.value})}
//                         placeholder="e.g., 20 Lakh Swaminarayan Mala"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                         required
//                       />
//                     </div>
                    
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                       <textarea
//                         value={newShatra.description}
//                         onChange={(e) => setNewShatra({...newShatra, description: e.target.value})}
//                         rows="2"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                         required
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Target Count</label>
//                       <input
//                         type="number"
//                         value={newShatra.targetCount}
//                         onChange={(e) => setNewShatra({...newShatra, targetCount: e.target.value})}
//                         placeholder="2000000"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                         required
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//                       <input
//                         type="date"
//                         value={newShatra.startDate}
//                         onChange={(e) => setNewShatra({...newShatra, startDate: e.target.value})}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                         required
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//                       <input
//                         type="date"
//                         value={newShatra.endDate}
//                         onChange={(e) => setNewShatra({...newShatra, endDate: e.target.value})}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                         required
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="flex justify-end gap-3">
//                     <button
//                       type="button"
//                       onClick={() => setShowCreateForm(false)}
//                       className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-md transition-all"
//                     >
//                       Create Shatra
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {activeShatra ? (
//           <>
//             {/* Shatra Info Card */}
//             <motion.div
//               className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
//               variants={fadeUp}
//               initial="hidden"
//               animate="visible"
//             >
//               <div className="flex flex-col md:flex-row justify-between items-start gap-4">
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-900 mb-2">{activeShatra.title}</h2>
//                   <p className="text-gray-600 text-sm mb-3">{activeShatra.description}</p>
//                   <div className="flex flex-wrap gap-4 text-sm">
//                     <span className="text-gray-500">
//                       📅 {formatDate(activeShatra.startDate)} - {formatDate(activeShatra.endDate)}
//                     </span>
//                     <span className="text-gray-500">
//                       🎯 Target: {activeShatra.targetCount.toLocaleString()} malas
//                     </span>
//                     <span className="text-gray-500">
//                       📊 Total: {activeShatra.totalContribution?.toLocaleString()} malas
//                     </span>
//                   </div>
//                 </div>
                
//                 {/* Status Badge */}
//                 {(() => {
//                   const statusInfo = getStatusInfo(activeShatra);
//                   return (
//                     <div className={`px-4 py-2 rounded-lg ${statusInfo.color}`}>
//                       <span className={`text-sm font-medium flex items-center gap-1 ${statusInfo.textColor}`}>
//                         {statusInfo.icon}
//                         {statusInfo.label}
//                       </span>
//                     </div>
//                   );
//                 })()}
//               </div>
              
//               {/* Goal Achievement Badge - Only show for active shatras */}
//               {isGoalAchieved && activeShatra.status === "active" && (
//                 <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
//                   <p className="text-purple-700 text-sm flex items-center gap-2">
//                     <span className="text-lg">🎉</span>
//                     <span className="font-medium">Goal Achieved! </span>
//                     You've surpassed the target count. Keep going until the end date!
//                   </p>
//                 </div>
//               )}
//             </motion.div>

//             {/* Progress Card */}
//             <motion.div
//               className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
//               variants={fadeUp}
//               initial="hidden"
//               animate="visible"
//             >
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
              
//               {/* Progress Stats */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//                 <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg">
//                   <p className="text-sm text-gray-600 mb-1">Completed</p>
//                   <p className="text-2xl font-bold text-orange-600">{userTotal.toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">malas</p>
//                 </div>
                
//                 <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg">
//                   <p className="text-sm text-gray-600 mb-1">Remaining to Target</p>
//                   <p className="text-2xl font-bold text-amber-600">{Math.max(remainingCount, 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-500">malas</p>
//                 </div>
                
//                 <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg">
//                   <p className="text-sm text-gray-600 mb-1">Progress</p>
//                   <p className="text-2xl font-bold text-gray-900">{progressPercentage.toFixed(1)}%</p>
//                   <p className="text-xs text-gray-500">of target</p>
//                 </div>
//               </div>

//               {/* Progress Bar */}
//               <div className="mb-2">
//                 <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: `${barPercentage}%` }}
//                     transition={{ duration: 1 }}
//                     className={`h-full ${
//                       isGoalAchieved && activeShatra.status === "active"
//                         ? "bg-gradient-to-r from-purple-500 to-pink-500" 
//                         : "bg-gradient-to-r from-orange-500 to-amber-500"
//                     }`}
//                   />
//                 </div>
//               </div>
              
//               {/* Progress Stats Line */}
//               <div className="flex justify-between text-xs text-gray-500 mb-6">
//                 <span>0</span>
//                 <span className="text-center">
//                   {userTotal.toLocaleString()} / {activeShatra.targetCount.toLocaleString()} malas
//                 </span>
//                 <span>{activeShatra.targetCount.toLocaleString()}</span>
//               </div>

//               {/* Add Contribution Form */}
//               {activeShatra.status === "active" && canContribute() ? (
//                 <div className="flex gap-3">
//                   <input
//                     type="number"
//                     value={contributionInput}
//                     onChange={(e) => setContributionInput(e.target.value)}
//                     placeholder="Enter malas done today"
//                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     min="1"
//                   />
//                   <button
//                     onClick={handleAddContribution}
//                     disabled={!contributionInput || leaderboardLoading}
//                     className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {leaderboardLoading ? "Adding..." : "Add Progress"}
//                   </button>
//                 </div>
//               ) : activeShatra.status === "upcoming" ? (
//                 <div className="bg-blue-50 p-4 rounded-lg text-center">
//                   <p className="text-blue-700 text-sm">
//                     ⏳ This shatra starts on {formatDate(activeShatra.startDate)}. Please wait until then to add progress.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="bg-gray-50 p-4 rounded-lg text-center">
//                   <p className="text-gray-600 text-sm">
//                     This shatra ended on {formatDate(activeShatra.endDate)}. No more contributions allowed.
//                   </p>
//                 </div>
//               )}
//             </motion.div>

//             {/* Leaderboard */}
//             <motion.div
//               className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
//               variants={fadeUp}
//               initial="hidden"
//               animate="visible"
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900">Sadhana Leaderboard</h3>
//                 <span className="text-sm text-gray-500">Top 10 Contributors</span>
//               </div>

//               {/* Top 10 Leaderboard */}
//               {leaderboardLoading ? (
//                 <div className="flex justify-center py-8">
//                   <div className="w-6 h-6 border-2 border-[#FF7722] border-t-transparent rounded-full animate-spin"></div>
//                 </div>
//               ) : leaderboard.top10.length > 0 ? (
//                 <>
//                   <div className="space-y-3 mb-6">
//                     {leaderboard.top10.map((entry, index) => (
//                       <motion.div
//                         key={entry.userId}
//                         variants={fadeUp}
//                         className={`flex items-center justify-between p-3 rounded-lg transition-all ${
//                           entry.userId === user?._id 
//                             ? "bg-orange-50 border border-orange-200" 
//                             : "bg-gray-50 hover:bg-orange-50/50"
//                         }`}
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
//                             index === 0 ? "bg-amber-500 text-white" :
//                             index === 1 ? "bg-gray-500 text-white" :
//                             index === 2 ? "bg-amber-400 text-white" :
//                             "bg-gray-300 text-gray-700"
//                           }`}>
//                             {entry.rank}
//                           </div>
//                           <div>
//                             <span className="font-medium text-gray-900">{entry.name}</span>
//                             {entry.userId === user?._id && (
//                               <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <span className="text-sm text-gray-500">{entry.total.toLocaleString()} malas</span>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>

//                   {/* User's rank if not in top 10 */}
//                   {leaderboard.userRank && leaderboard.userRank.rank > 10 && (
//                     <div className="border-t border-gray-200 pt-4">
//                       <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
//                         <div className="flex items-center gap-3">
//                           <div className="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-bold">
//                             {leaderboard.userRank.rank}
//                           </div>
//                           <div>
//                             <span className="font-medium text-gray-900">{leaderboard.userRank.name}</span>
//                             <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <span className="text-sm text-gray-500">{leaderboard.userRank.total.toLocaleString()} malas</span>
//                         </div>
//                       </div>
//                       <p className="text-xs text-gray-500 text-center mt-2">
//                         You're #{leaderboard.userRank.rank} overall • {leaderboard.userRank.total.toLocaleString()} malas completed
//                       </p>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">No contributions yet. Be the first to add your sadhana!</p>
//                 </div>
//               )}
//             </motion.div>
//           </>
//         ) : (
//           <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
//             <p className="text-gray-500">No shatras available.</p>
//           </div>
//         )}

//         {/* Footer */}
//         <motion.footer 
//           className="text-center py-6"
//           variants={fadeUp}
//           initial="hidden"
//           animate="visible"
//         >
//           <LotusDivider className="mb-4" />
//           <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">श्री स्वामिनारायणाय नमः</p>
//           <p className="text-xs text-gray-500 max-w-xs mx-auto">
//             May our collective sadhana bring divine blessings
//           </p>
//           <p className="text-xs mt-2 text-gray-400">
//             Developed by{' '}
//             <a 
//               href="https://buildcrew.co.in" 
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
//             >
//               Build Crew
//             </a>
//           </p>
//         </motion.footer>
//       </div>
//     </div>
//   );
// };

// export default BhajanShastra;

import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import LotusDivider from "../Common/LotusDivider";
import axios from "axios";

// Motion Variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const BhajanShastra = () => {
  const { user, token } = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL;
  
  // State for shatras
  const [shatras, setShatras] = useState([]);
  const [activeShatra, setActiveShatra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [contributionInput, setContributionInput] = useState("");
  const [fetchError, setFetchError] = useState(null);
  
  // State for leaderboard
  const [leaderboard, setLeaderboard] = useState({ top10: [], userRank: null });
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  
  // State for contributors modal
  const [showContributorsModal, setShowContributorsModal] = useState(false);
  const [contributors, setContributors] = useState([]);
  const [contributorsLoading, setContributorsLoading] = useState(false);
  const [contributorsPagination, setContributorsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [contributorDetails, setContributorDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  
  // Form state for creating shatra
  const [newShatra, setNewShatra] = useState({
    title: "",
    description: "",
    targetCount: "",
    startDate: "",
    endDate: ""
  });

  // Fetch all shatras on component mount and when token changes
  useEffect(() => {
    if (token) {
      fetchShatras();
    }
  }, [token]);

  // Load active shatra from localStorage on initial mount
  useEffect(() => {
    const savedShatraId = localStorage.getItem('activeShatraId');
    if (savedShatraId && shatras.length > 0) {
      const savedShatra = shatras.find(s => s._id === savedShatraId);
      if (savedShatra) {
        setActiveShatra(savedShatra);
        fetchLeaderboard(savedShatra._id);
      }
    }
  }, [shatras]);

  // Save active shatra to localStorage whenever it changes
  useEffect(() => {
    if (activeShatra) {
      localStorage.setItem('activeShatraId', activeShatra._id);
    }
  }, [activeShatra]);

  const fetchShatras = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const response = await axios.get(`${backend_url}/api/bhajan-shatra`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShatras(response.data);
      
      // If no active shatra is set, set the first active one
      if (!activeShatra && response.data.length > 0) {
        const active = response.data.find(s => s.status === "active") || 
                      response.data.find(s => s.status === "upcoming") || 
                      response.data[0];
        setActiveShatra(active);
        fetchLeaderboard(active._id);
      }
    } catch (error) {
      console.error("Error fetching shatras:", error);
      setFetchError("Failed to load shatras. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch leaderboard for specific shatra
  const fetchLeaderboard = async (shatraId) => {
    if (!shatraId) return;
    
    try {
      setLeaderboardLoading(true);
      const response = await axios.get(
        `${backend_url}/api/bhajan-shatra/${shatraId}/leaderboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  // Fetch contributors for current shatra
  const fetchContributors = async (page = 1) => {
    if (!activeShatra) return;
    
    try {
      setContributorsLoading(true);
      const response = await axios.get(
        `${backend_url}/api/bhajan-shatra/${activeShatra._id}/contributors?page=${page}&limit=10&search=${searchTerm}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContributors(response.data.contributors);
      setContributorsPagination(response.data.pagination);
      
      // Update the active shatra with latest contributor count
      setActiveShatra(prev => ({
        ...prev,
        totalContributors: response.data.pagination.totalItems
      }));
      
    } catch (error) {
      console.error("Error fetching contributors:", error);
    } finally {
      setContributorsLoading(false);
    }
  };

  // Fetch single contributor details
  const fetchContributorDetails = async (userId) => {
    if (!activeShatra) return;
    
    try {
      setDetailsLoading(true);
      const response = await axios.get(
        `${backend_url}/api/bhajan-shatra/${activeShatra._id}/contributors/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContributorDetails(response.data);
    } catch (error) {
      console.error("Error fetching contributor details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Export contributors to CSV
  const handleExport = async () => {
    if (!activeShatra) return;
    
    try {
      const response = await axios.get(
        `${backend_url}/api/bhajan-shatra/${activeShatra._id}/contributors/export`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${activeShatra.title}_contributors.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting:", error);
    }
  };

  // Open contributors modal
  const handleOpenContributors = () => {
    setShowContributorsModal(true);
    setSearchTerm("");
    setSelectedContributor(null);
    setContributorDetails(null);
    fetchContributors(1);
  };

  // Create new shatra (admin only)
  const handleCreateShatra = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backend_url}/api/bhajan-shatra`,
        {
          ...newShatra,
          targetCount: parseInt(newShatra.targetCount)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add status to the new shatra
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const startDate = new Date(response.data.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(response.data.endDate);
      endDate.setHours(23, 59, 59, 999);
      
      let status;
      if (today > endDate) {
        status = "completed";
      } else if (today >= startDate && today <= endDate) {
        status = "active";
      } else {
        status = "upcoming";
      }
      
      const newShatraWithStatus = {
        ...response.data,
        status,
        totalContribution: 0,
        progress: 0,
        totalContributors: 0
      };
      
      setShatras([newShatraWithStatus, ...shatras]);
      setShowCreateForm(false);
      setNewShatra({
        title: "",
        description: "",
        targetCount: "",
        startDate: "",
        endDate: ""
      });
      
      // Set the new shatra as active
      setActiveShatra(newShatraWithStatus);
      fetchLeaderboard(newShatraWithStatus._id);
      
    } catch (error) {
      console.error("Error creating shatra:", error);
      alert(error.response?.data?.message || "Failed to create shatra");
    }
  };

  // Add daily contribution
  const handleAddContribution = async () => {
    if (!activeShatra || !contributionInput) return;
    
    try {
      await axios.post(
        `${backend_url}/api/bhajan-shatra/${activeShatra._id}/contribute`,
        { count: parseInt(contributionInput) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh shatras to get updated totalContribution
      await fetchShatras();
      // Refresh leaderboard
      await fetchLeaderboard(activeShatra._id);
      
      setContributionInput("");
      
    } catch (error) {
      console.error("Error adding contribution:", error);
      alert(error.response?.data?.message || "Failed to add contribution");
    }
  };

  // Calculate user's total from leaderboard
  const userTotal = leaderboard.userRank?.total || 0;
  
  // Calculate progress
  const progressPercentage = activeShatra 
    ? (userTotal / activeShatra.targetCount) * 100 
    : 0;
  
  const barPercentage = Math.min(progressPercentage, 100);
  const remainingCount = activeShatra 
    ? Math.max(activeShatra.targetCount - userTotal, 0) 
    : 0;
    
  const isGoalAchieved = activeShatra && userTotal >= activeShatra.targetCount;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Check if user can contribute
  const canContribute = () => {
    if (!activeShatra) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(activeShatra.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(activeShatra.endDate);
    endDate.setHours(23, 59, 59, 999);
    
    return today >= startDate && today <= endDate;
  };

  // Get status color and text
  const getStatusInfo = (shatra) => {
    if (!shatra) return { color: "bg-gray-50", textColor: "text-gray-700", label: "Unknown", icon: "❓" };
    
    switch(shatra.status) {
      case "active":
        return { 
          color: "bg-green-50", 
          textColor: "text-green-700", 
          label: "Ongoing", 
          icon: <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        };
      case "upcoming":
        return { 
          color: "bg-blue-50", 
          textColor: "text-blue-700", 
          label: "Upcoming", 
          icon: "⏳"
        };
      case "completed":
        return { 
          color: "bg-gray-50", 
          textColor: "text-gray-700", 
          label: "Completed", 
          icon: "✅"
        };
      default:
        return { 
          color: "bg-gray-50", 
          textColor: "text-gray-700", 
          label: shatra.status || "Unknown", 
          icon: "❓"
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:15px_15px] sm:bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>
        <Navbar />
        <div className="pt-20 px-3 sm:px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-6 h-6 border-2 border-[#FF7722] border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading Bhajan Shastra...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:15px_15px] sm:bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>
        <Navbar />
        <div className="pt-20 px-3 sm:px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
                <p className="text-gray-500 text-sm mb-4">{fetchError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:15px_15px] sm:bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>
      
      <Navbar />
      
      <div className="relative max-w-6xl mx-auto space-y-6 sm:space-y-8 px-3 sm:px-4 pt-20 pb-8">
        {/* Header */}
        <motion.div 
          className="text-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4">
            <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-sans px-2">
              Bhajan <span className="text-[#FF7722]">Shastra</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg font-light max-w-2xl px-2">
              Collective spiritual sadhana for utsavs
            </p>
            <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
          </div>
        </motion.div>

        <LotusDivider />

        {/* Shatra Selection and Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-center gap-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {shatras.map((shatra) => {
              const statusInfo = getStatusInfo(shatra);
              
              return (
                <button
                  key={shatra._id}
                  onClick={() => {
                    setActiveShatra(shatra);
                    fetchLeaderboard(shatra._id);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                    activeShatra?._id === shatra._id
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
                  }`}
                >
                  {shatra.title}
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    shatra.status === "active" ? "bg-green-100 text-green-600" :
                    shatra.status === "upcoming" ? "bg-blue-100 text-blue-600" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {shatra.status === "active" ? "Ongoing" :
                     shatra.status === "upcoming" ? "Upcoming" : "Completed"}
                  </span>
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Contributors Button - Always visible when shatra exists */}
            {activeShatra && (
              <motion.button
                onClick={handleOpenContributors}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all whitespace-nowrap"
              >
                <span className="text-lg">👥</span>
                <span className="hidden sm:inline">Contributors</span>
                {/* This shows the contributor count */}
                {activeShatra.totalContributors > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-white text-blue-600 rounded-full text-xs font-bold">
                    {activeShatra.totalContributors}
                  </span>
                )}
              </motion.button>
            )}
            
            {/* Plus Button for Admin - Always Visible */}
            {user?.role === "admin" && (
              <motion.button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl font-bold">+</span>
                <span className="font-semibold hidden sm:inline">Create New</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Create Shatra Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Create New Bhajan Shatra</h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleCreateShatra} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={newShatra.title}
                        onChange={(e) => setNewShatra({...newShatra, title: e.target.value})}
                        placeholder="e.g., 20 Lakh Swaminarayan Mala"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={newShatra.description}
                        onChange={(e) => setNewShatra({...newShatra, description: e.target.value})}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Count</label>
                      <input
                        type="number"
                        value={newShatra.targetCount}
                        onChange={(e) => setNewShatra({...newShatra, targetCount: e.target.value})}
                        placeholder="2000000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={newShatra.startDate}
                        onChange={(e) => setNewShatra({...newShatra, startDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={newShatra.endDate}
                        onChange={(e) => setNewShatra({...newShatra, endDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-md transition-all"
                    >
                      Create Shatra
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeShatra ? (
          <>
            {/* Shatra Info Card */}
            <motion.div
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{activeShatra.title}</h2>
                  <p className="text-gray-600 text-sm mb-3">{activeShatra.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-gray-500">
                      📅 {formatDate(activeShatra.startDate)} - {formatDate(activeShatra.endDate)}
                    </span>
                    <span className="text-gray-500">
                      🎯 Target: {activeShatra.targetCount.toLocaleString()} malas
                    </span>
                    <span className="text-gray-500">
                      📊 Total: {activeShatra.totalContribution?.toLocaleString()} malas
                    </span>
                    {/* Contributor count shown here */}
                    <span className="text-gray-500 flex items-center gap-1">
                      👥 Contributors: <span className="font-semibold text-blue-600">{activeShatra.totalContributors || 0}</span>
                    </span>
                  </div>
                </div>
                
                {/* Status Badge */}
                {(() => {
                  const statusInfo = getStatusInfo(activeShatra);
                  return (
                    <div className={`px-4 py-2 rounded-lg ${statusInfo.color}`}>
                      <span className={`text-sm font-medium flex items-center gap-1 ${statusInfo.textColor}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                    </div>
                  );
                })()}
              </div>
              
              {/* Goal Achievement Badge - Only show for active shatras */}
              {isGoalAchieved && activeShatra.status === "active" && (
                <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-purple-700 text-sm flex items-center gap-2">
                    <span className="text-lg">🎉</span>
                    <span className="font-medium">Goal Achieved! </span>
                    You've surpassed the target count. Keep going until the end date!
                  </p>
                </div>
              )}
            </motion.div>

            {/* Progress Card */}
            <motion.div
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
              
              {/* Progress Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-orange-600">{userTotal.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">malas</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Remaining to Target</p>
                  <p className="text-2xl font-bold text-amber-600">{Math.max(remainingCount, 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">malas</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{progressPercentage.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">of target</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barPercentage}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full ${
                      isGoalAchieved && activeShatra.status === "active"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500" 
                        : "bg-gradient-to-r from-orange-500 to-amber-500"
                    }`}
                  />
                </div>
              </div>
              
              {/* Progress Stats Line */}
              <div className="flex justify-between text-xs text-gray-500 mb-6">
                <span>0</span>
                <span className="text-center">
                  {userTotal.toLocaleString()} / {activeShatra.targetCount.toLocaleString()} malas
                </span>
                <span>{activeShatra.targetCount.toLocaleString()}</span>
              </div>

              {/* Add Contribution Form */}
              {activeShatra.status === "active" && canContribute() ? (
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={contributionInput}
                    onChange={(e) => setContributionInput(e.target.value)}
                    placeholder="Enter malas done today"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="1"
                  />
                  <button
                    onClick={handleAddContribution}
                    disabled={!contributionInput || leaderboardLoading}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {leaderboardLoading ? "Adding..." : "Add Progress"}
                  </button>
                </div>
              ) : activeShatra.status === "upcoming" ? (
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-blue-700 text-sm">
                    ⏳ This shatra starts on {formatDate(activeShatra.startDate)}. Please wait until then to add progress.
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">
                    This shatra ended on {formatDate(activeShatra.endDate)}. No more contributions allowed.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Sadhana Leaderboard</h3>
                <span className="text-sm text-gray-500">Top 10 Contributors</span>
              </div>

              {/* Top 10 Leaderboard */}
              {leaderboardLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-[#FF7722] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : leaderboard.top10.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6">
                    {leaderboard.top10.map((entry, index) => (
                      <motion.div
                        key={entry.userId}
                        variants={fadeUp}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                          entry.userId === user?._id 
                            ? "bg-orange-50 border border-orange-200" 
                            : "bg-gray-50 hover:bg-orange-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? "bg-amber-500 text-white" :
                            index === 1 ? "bg-gray-500 text-white" :
                            index === 2 ? "bg-amber-400 text-white" :
                            "bg-gray-300 text-gray-700"
                          }`}>
                            {entry.rank}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{entry.name}</span>
                            {entry.userId === user?._id && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{entry.total.toLocaleString()} malas</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* User's rank if not in top 10 */}
                  {leaderboard.userRank && leaderboard.userRank.rank > 10 && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-bold">
                            {leaderboard.userRank.rank}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{leaderboard.userRank.name}</span>
                            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{leaderboard.userRank.total.toLocaleString()} malas</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 text-center mt-2">
                        You're #{leaderboard.userRank.rank} overall • {leaderboard.userRank.total.toLocaleString()} malas completed
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No contributions yet. Be the first to add your sadhana!</p>
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
            <p className="text-gray-500">No shatras available.</p>
          </div>
        )}

        {/* Contributors Modal */}
        <AnimatePresence>
          {showContributorsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={() => setShowContributorsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedContributor ? 'Contributor Details' : 'All Contributors'}
                    </h2>
                    <button
                      onClick={() => setShowContributorsModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <span className="text-2xl">×</span>
                    </button>
                  </div>
                  
                  {!selectedContributor && (
                    <div className="flex gap-3 mt-4">
                      <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchContributors(1)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => fetchContributors(1)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Search
                      </button>
                      {user?.role === "admin" && (
                        <button
                          onClick={handleExport}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                          <span>📥</span>
                          Export CSV
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  {selectedContributor ? (
                    // Contributor Details View
                    <div>
                      <button
                        onClick={() => {
                          setSelectedContributor(null);
                          setContributorDetails(null);
                        }}
                        className="mb-4 text-blue-500 hover:text-blue-700 flex items-center gap-1"
                      >
                        ← Back to list
                      </button>
                      
                      {detailsLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : contributorDetails && (
                        <div className="space-y-6">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{contributorDetails.user.name}</h3>
                            <p className="text-sm text-gray-600">{contributorDetails.user.email}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">Total Malas</p>
                              <p className="text-2xl font-bold text-blue-600">{contributorDetails.total.toLocaleString()}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">Total Days</p>
                              <p className="text-2xl font-bold text-blue-600">{contributorDetails.totalDays}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Contribution History</h4>
                            <div className="space-y-2">
                              {contributorDetails.contributions.map((c, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                  <span className="text-sm text-gray-600">{formatDate(c.date)}</span>
                                  <span className="text-sm font-semibold text-orange-600">+{c.count} malas</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Contributors List View
                    contributorsLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : contributors.length > 0 ? (
                      <div className="space-y-3">
                        {contributors.map((contributor) => (
                          <motion.div
                            key={contributor.userId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedContributor(contributor.userId);
                              fetchContributorDetails(contributor.userId);
                            }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                                {contributor.rank}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{contributor.name}</p>
                                <p className="text-sm text-gray-500">{contributor.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-blue-600">{contributor.total}</p>
                              <p className="text-xs text-gray-500">malas</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No contributors found</p>
                      </div>
                    )
                  )}
                </div>

                {/* Modal Footer - Pagination */}
                {!selectedContributor && contributorsPagination.totalPages > 1 && (
                  <div className="p-6 border-t border-gray-200">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => fetchContributors(contributorsPagination.currentPage - 1)}
                        disabled={!contributorsPagination.hasPrevPage}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                        Page {contributorsPagination.currentPage} of {contributorsPagination.totalPages}
                      </span>
                      <button
                        onClick={() => fetchContributors(contributorsPagination.currentPage + 1)}
                        disabled={!contributorsPagination.hasNextPage}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer 
          className="text-center py-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <LotusDivider className="mb-4" />
          <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">श्री स्वामिनारायणाय नमः</p>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            May our collective sadhana bring divine blessings
          </p>
          <p className="text-xs mt-2 text-gray-400">
            Developed by{' '}
            <a 
              href="https://buildcrew.co.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Build Crew
            </a>
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default BhajanShastra;
import { useEffect, useState, useCallback, useRef } from "react";
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

const BhajanShastra = () => {
  const { user, token } = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL;
  
  // Use refs to track if data is already fetched
  const initialFetchDone = useRef(false);
  const contributionsCache = useRef(new Map());
  
  // State for shatras
  const [shatras, setShatras] = useState([]);
  const [activeShatra, setActiveShatra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [contributionInput, setContributionInput] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

  // Fetch shatras
  useEffect(() => {
    if (token && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchShatras();
    }
  }, [token]);

  // Load active shatra from localStorage
  useEffect(() => {
    const savedShatraId = localStorage.getItem('activeShatraId');
    if (savedShatraId && shatras.length > 0 && !activeShatra) {
      const savedShatra = shatras.find(s => s._id === savedShatraId);
      if (savedShatra) {
        setActiveShatra(savedShatra);
      }
    }
  }, [shatras]);

  // Fetch leaderboard when activeShatra changes
  useEffect(() => {
    if (activeShatra?._id) {
      const cached = contributionsCache.current.get(activeShatra._id);
      if (cached) {
        setLeaderboard(cached);
      } else {
        fetchLeaderboard(activeShatra._id);
      }
      localStorage.setItem('activeShatraId', activeShatra._id);
    }
  }, [activeShatra?._id]);

  const fetchShatras = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const response = await axios.get(`${backend_url}/api/bhajan-shatra`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch contributor counts for each shatra
      const shatrasWithCounts = await Promise.all(
        response.data.map(async (shatra) => {
          try {
            const contributorsResponse = await axios.get(
              `${backend_url}/api/bhajan-shatra/${shatra._id}/contributors?page=1&limit=1`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return {
              ...shatra,
              totalContributors: contributorsResponse.data.pagination?.totalItems || 0
            };
          } catch (error) {
            console.error(`Error fetching contributors for shatra ${shatra._id}:`, error);
            return {
              ...shatra,
              totalContributors: 0
            };
          }
        })
      );
      
      setShatras(shatrasWithCounts);
      
      const savedShatraId = localStorage.getItem('activeShatraId');
      let active = null;
      
      if (savedShatraId) {
        active = shatrasWithCounts.find(s => s._id === savedShatraId);
      }
      
      if (!active) {
        active = shatrasWithCounts.find(s => s.status === "active") || 
                shatrasWithCounts.find(s => s.status === "upcoming") || 
                shatrasWithCounts[0];
      }
      
      if (active) {
        setActiveShatra(active);
      }
    } catch (error) {
      console.error("Error fetching shatras:", error);
      setFetchError("Failed to load shatras. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async (shatraId) => {
    if (!shatraId) return;
    
    if (contributionsCache.current.has(shatraId)) {
      setLeaderboard(contributionsCache.current.get(shatraId));
      return;
    }
    
    try {
      setLeaderboardLoading(true);
      const response = await axios.get(
        `${backend_url}/api/bhajan-shatra/${shatraId}/leaderboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      contributionsCache.current.set(shatraId, response.data);
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const fetchContributors = useCallback(async (page = 1) => {
    if (!activeShatra || contributorsLoading) return;
    
    try {
      setContributorsLoading(true);
      const response = await axios.get(
        `${backend_url}/api/bhajan-shatra/${activeShatra._id}/contributors?page=${page}&limit=10&search=${searchTerm}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setContributors(response.data.contributors);
      setContributorsPagination(response.data.pagination);
      
      // Update the total contributors count in active shatra
      setActiveShatra(prev => prev ? {
        ...prev,
        totalContributors: response.data.pagination.totalItems
      } : null);
      
      // Also update in shatras list
      setShatras(prev => prev.map(s => 
        s._id === activeShatra._id 
          ? { ...s, totalContributors: response.data.pagination.totalItems }
          : s
      ));
      
    } catch (error) {
      console.error("Error fetching contributors:", error);
    } finally {
      setContributorsLoading(false);
    }
  }, [activeShatra?._id, searchTerm]);

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

    const handleOpenContributors = () => {
    setShowContributorsModal(true);
    setSearchTerm("");
    setSelectedContributor(null);
    setContributorDetails(null);
    fetchContributors(1);
  };

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
      
      setShatras(prev => [newShatraWithStatus, ...prev]);
      setShowCreateForm(false);
      setNewShatra({
        title: "",
        description: "",
        targetCount: "",
        startDate: "",
        endDate: ""
      });
      
      setActiveShatra(newShatraWithStatus);
      setMobileMenuOpen(false);
      
    } catch (error) {
      console.error("Error creating shatra:", error);
      alert(error.response?.data?.message || "Failed to create shatra");
    }
  };

  const handleAddContribution = async (e) => {
    e.preventDefault();
    
    if (!activeShatra || !contributionInput || isSubmitting) return;
    
    const count = parseInt(contributionInput);
    setIsSubmitting(true);
    
    const previousLeaderboard = { ...leaderboard };
    const previousActiveShatra = { ...activeShatra };
    
    try {
      const response = await axios.post(
        `${backend_url}/api/bhajan-shatra/${activeShatra._id}/contribute`,
        { count },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const { totalContributions, totalContributors } = response.data;
      
      // Calculate new total contributors
      // Check if this is user's first contribution
      const isFirstContribution = !previousLeaderboard.top10?.some(e => e.userId === user?._id) && 
                                  !previousLeaderboard.userRank;
      
      const newTotalContributors = totalContributors || 
                                  (isFirstContribution ? previousActiveShatra.totalContributors + 1 : previousActiveShatra.totalContributors);
      
      setActiveShatra(prev => ({
        ...prev,
        totalContributions: totalContributions,
        totalContributors: newTotalContributors
      }));
      
      setShatras(prev => prev.map(s => 
        s._id === activeShatra._id 
          ? { 
              ...s, 
              totalContributions: totalContributions,
              totalContributors: newTotalContributors
            }
          : s
      ));
      
      contributionsCache.current.delete(activeShatra._id);
      await fetchLeaderboard(activeShatra._id);
      
      setContributionInput("");
      
    } catch (error) {
      console.error("Error adding contribution:", error);
      setLeaderboard(previousLeaderboard);
      setActiveShatra(previousActiveShatra);
      alert(error.response?.data?.message || "Failed to add contribution");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate COLLECTIVE progress (all users combined)
  const collectiveTotal = activeShatra?.totalContributions || 0;
  const collectiveProgress = activeShatra 
    ? (collectiveTotal / activeShatra.targetCount) * 100 
    : 0;
  const collectiveBarPercentage = Math.min(collectiveProgress, 100);
  const collectiveRemaining = activeShatra 
    ? Math.max(activeShatra.targetCount - collectiveTotal, 0) 
    : 0;
  const isCollectiveGoalAchieved = activeShatra && collectiveTotal >= activeShatra.targetCount;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const canContribute = useCallback(() => {
    if (!activeShatra) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(activeShatra.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(activeShatra.endDate);
    endDate.setHours(23, 59, 59, 999);
    
    return today >= startDate && today <= endDate && activeShatra.status === "active";
  }, [activeShatra]);

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
        <div className="pt-16 sm:pt-20 px-3 sm:px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
              <div className="flex justify-center items-center py-8 sm:py-12">
                <div className="flex items-center gap-2 sm:gap-3 text-gray-600 text-sm sm:text-base">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-[#FF7722] border-t-transparent rounded-full animate-spin"></div>
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
        <div className="pt-16 sm:pt-20 px-3 sm:px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
              <div className="text-center py-8 sm:py-12">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⚠️</div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
                <p className="text-gray-500 text-xs sm:text-sm mb-4">{fetchError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-sm sm:text-base font-medium"
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
      
      <div className="relative max-w-6xl mx-auto px-3 sm:px-4 pt-16 sm:pt-20 pb-6 sm:pb-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-4 sm:mb-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 sm:w-12 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 font-sans px-2">
              Bhajan <span className="text-[#FF7722]">Shatra</span>
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base font-light max-w-xs sm:max-w-sm md:max-w-md px-2">
              Collective spiritual sadhana for utsavs
            </p>
            <div className="w-10 sm:w-12 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
          </div>
        </motion.div>

        <LotusDivider className="my-3 sm:my-4" />

        {/* Mobile Action Buttons */}
        <div className="sm:hidden mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium text-sm shadow-md"
            >
              {mobileMenuOpen ? 'Hide Shatras' : 'Select Shatra'}
            </button>
            
            {activeShatra && (
              <button
                onClick={handleOpenContributors}
                className="px-4 py-2.5 bg-blue-500 text-white rounded-lg font-medium text-sm shadow-md flex items-center justify-center gap-1"
              >
                <span>👥</span>
                <span>{activeShatra.totalContributors || 0}</span>
              </button>
            )}
            
            {user?.role === "admin" && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium text-sm shadow-md"
              >
                <span className="text-lg">+</span>
              </button>
            )}
          </div>
          
          {/* Mobile Shatra Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 overflow-hidden"
              >
                <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-2 max-h-60 overflow-y-auto">
                  {shatras.map((shatra) => (
                    <button
                      key={shatra._id}
                      onClick={() => {
                        setActiveShatra(shatra);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1 last:mb-0 ${
                        activeShatra?._id === shatra._id
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium truncate max-w-[150px]">{shatra.title}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          shatra.status === "active" ? "bg-green-100 text-green-700" :
                          shatra.status === "upcoming" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-200 text-gray-700"
                        }`}>
                          {shatra.status === "active" ? "Live" :
                           shatra.status === "upcoming" ? "Soon" : "Done"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Shatra Selection */}
        <motion.div 
          className="hidden sm:flex sm:flex-row justify-between items-center gap-4 mb-4 sm:mb-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {shatras.map((shatra) => (
              <button
                key={shatra._id}
                onClick={() => setActiveShatra(shatra)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                  activeShatra?._id === shatra._id
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
                }`}
              >
                <span className="max-w-[100px] sm:max-w-[150px] truncate inline-block align-middle">
                  {shatra.title}
                </span>
                <span className={`ml-1 sm:ml-2 text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                  shatra.status === "active" ? "bg-green-100 text-green-600" :
                  shatra.status === "upcoming" ? "bg-blue-100 text-blue-600" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {shatra.status === "active" ? "Live" :
                   shatra.status === "upcoming" ? "Soon" : "Done"}
                </span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
           {user?.role === "admin" && activeShatra && (
  <motion.button
    onClick={handleOpenContributors}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all whitespace-nowrap"
  >
    <span className="text-base sm:text-lg">👥</span>
    <span className="hidden xs:inline">Contributors</span>

    {activeShatra.totalContributors > 0 && (
      <span className="ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 bg-white text-blue-600 rounded-full text-xs font-bold">
        {activeShatra.totalContributors}
      </span>
    )}
  </motion.button>
)}
            
            {user?.role === "admin" && (
              <motion.button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg sm:text-xl font-bold">+</span>
                <span className="hidden sm:inline">Create</span>
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
              className="overflow-hidden mb-4 sm:mb-6"
            >
              <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Create New Bhajan Shatra</h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleCreateShatra} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newShatra.title}
                      onChange={(e) => setNewShatra({...newShatra, title: e.target.value})}
                      placeholder="e.g., 20 Lakh Swaminarayan Mala"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newShatra.description}
                      onChange={(e) => setNewShatra({...newShatra, description: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Target Count</label>
                      <input
                        type="number"
                        value={newShatra.targetCount}
                        onChange={(e) => setNewShatra({...newShatra, targetCount: e.target.value})}
                        placeholder="2000000"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={newShatra.startDate}
                        onChange={(e) => setNewShatra({...newShatra, startDate: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={newShatra.endDate}
                        onChange={(e) => setNewShatra({...newShatra, endDate: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 sm:gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 sm:px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:shadow-md"
                    >
                      Create
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
              className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm mb-4 sm:mb-6"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                <div className="w-full">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{activeShatra.title}</h2>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">{activeShatra.description}</p>
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                    <span className="text-gray-500 col-span-2 sm:col-auto">
                      📅 {formatDate(activeShatra.startDate)} - {formatDate(activeShatra.endDate)}
                    </span>
                    <span className="text-gray-500">
                      🎯 Target: {activeShatra.targetCount.toLocaleString()}
                    </span>
                    <span className="text-gray-500">
                      📊 Total: {collectiveTotal.toLocaleString()}
                    </span>
                    <span className="text-gray-500 flex items-center gap-1">
                      👥 <span className="font-semibold text-blue-600">{activeShatra.totalContributors || 0}</span>
                    </span>
                  </div>
                </div>
                
                {/* Status Badge */}
                {(() => {
                  const statusInfo = getStatusInfo(activeShatra);
                  return (
                    <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${statusInfo.color} self-start`}>
                      <span className={`text-xs sm:text-sm font-medium flex items-center gap-1 ${statusInfo.textColor}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                    </div>
                  );
                })()}
              </div>
              
              {/* Collective Goal Achievement Badge */}
              {isCollectiveGoalAchieved && activeShatra.status === "active" && (
                <div className="mt-3 sm:mt-4 bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3">
                  <p className="text-purple-700 text-xs sm:text-sm flex items-center gap-2">
                    <span className="text-base sm:text-lg">🎉</span>
                    <span className="font-medium">Collective Goal Achieved!</span>
                  </p>
                </div>
              )}
            </motion.div>

            {/* Collective Progress Card */}
            <motion.div
              className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm mb-4 sm:mb-6"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Collective Progress</h3>
              
              {/* Progress Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-2 sm:p-4 rounded-lg text-center">
                  <p className="text-[10px] sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Total Done</p>
                  <p className="text-base sm:text-2xl font-bold text-orange-600">{collectiveTotal.toLocaleString()}</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-2 sm:p-4 rounded-lg text-center">
                  <p className="text-[10px] sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Remaining</p>
                  <p className="text-base sm:text-2xl font-bold text-amber-600">{collectiveRemaining.toLocaleString()}</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-2 sm:p-4 rounded-lg text-center">
                  <p className="text-[10px] sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Progress</p>
                  <p className="text-base sm:text-2xl font-bold text-gray-900">{collectiveProgress.toFixed(1)}%</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2 sm:mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${collectiveBarPercentage}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full ${
                      isCollectiveGoalAchieved && activeShatra.status === "active"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500" 
                        : "bg-gradient-to-r from-orange-500 to-amber-500"
                    }`}
                  />
                </div>
              </div>
              
              <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mb-4 sm:mb-6">
                <span>0</span>
                <span>{collectiveTotal.toLocaleString()} / {activeShatra.targetCount.toLocaleString()}</span>
                <span>{activeShatra.targetCount.toLocaleString()}</span>
              </div>

              {/* Add Contribution Form */}
              {activeShatra.status === "active" && canContribute() ? (
                <form onSubmit={handleAddContribution} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="number"
                    value={contributionInput}
                    onChange={(e) => setContributionInput(e.target.value)}
                    placeholder="Add your malas today"
                    className="w-full sm:flex-1 px-3 sm:px-4 py-2.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="1"
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={!contributionInput || isSubmitting}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-sm font-medium hover:shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding...</span>
                      </span>
                    ) : (
                      "Add Progress"
                    )}
                  </button>
                </form>
              ) : activeShatra.status === "upcoming" ? (
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
                  <p className="text-blue-700 text-xs sm:text-sm">
                    ⏳ Starts {formatDate(activeShatra.startDate)}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center">
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Ended {formatDate(activeShatra.endDate)}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Leaderboard</h3>
                <span className="text-[10px] sm:text-xs text-gray-500">Top 10 Contributors</span>
              </div>

              {leaderboardLoading ? (
                <div className="flex justify-center py-6 sm:py-8">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-[#FF7722] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : leaderboard.top10.length > 0 ? (
                <>
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {leaderboard.top10.map((entry, index) => (
                      <motion.div
                        key={entry.userId}
                        variants={fadeUp}
                        className={`flex items-center justify-between p-2 sm:p-3 rounded-lg ${
                          entry.userId === user?._id 
                            ? "bg-orange-50 border border-orange-200" 
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0 ${
                            index === 0 ? "bg-amber-500 text-white" :
                            index === 1 ? "bg-gray-500 text-white" :
                            index === 2 ? "bg-amber-400 text-white" :
                            "bg-gray-300 text-gray-700"
                          }`}>
                            {entry.rank}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                              {entry.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 ml-2 flex-shrink-0">
                          <span className="text-[10px] sm:text-xs text-gray-500 hidden xs:inline">malas</span>
                          <span className="font-bold text-orange-600 text-xs sm:text-sm">
                            {entry.total.toLocaleString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {leaderboard.userRank && leaderboard.userRank.rank > 10 && (
                    <div className="border-t border-gray-200 pt-3 sm:pt-4">
                      <div className="flex items-center justify-between p-2 sm:p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0">
                            {leaderboard.userRank.rank}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                              {leaderboard.userRank.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 ml-2 flex-shrink-0">
                          <span className="text-[10px] sm:text-xs text-gray-500">{leaderboard.userRank.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-gray-500 text-xs sm:text-sm">No contributions yet</p>
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <div className="bg-white p-8 sm:p-12 rounded-xl border border-gray-200 text-center">
            <p className="text-gray-500 text-sm sm:text-base">No shatras available.</p>
          </div>
        )}

        {/* Contributors Modal - Mobile Responsive */}
        <AnimatePresence>
          {showContributorsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black bg-opacity-50"
              onClick={() => setShowContributorsModal(false)}
            >
              <motion.div
                initial={{ y: "100%", scale: 1 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: "100%", scale: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-3 sm:p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                  <div className="flex justify-between items-center">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                      {selectedContributor ? 'Contributor Details' : 'Contributors'}
                    </h2>
                    <button
                      onClick={() => setShowContributorsModal(false)}
                      className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {!selectedContributor && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchContributors(1)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => fetchContributors(1)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                      >
                        Go
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-4 overflow-y-auto" style={{ maxHeight: "calc(90vh - 120px)" }}>
                  {selectedContributor ? (
                    // Contributor details
                    <div>
                      <button
                        onClick={() => {
                          setSelectedContributor(null);
                          setContributorDetails(null);
                        }}
                        className="mb-3 text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        ← Back
                      </button>
                      
                      {detailsLoading ? (
                        <div className="flex justify-center py-6">
                          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : contributorDetails && (
                        <div className="space-y-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="font-medium text-gray-900 text-sm">{contributorDetails.user.name}</p>
                            <p className="text-xs text-gray-600">{contributorDetails.user.email}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-600">Total</p>
                              <p className="text-base font-bold text-blue-600">{contributorDetails.total.toLocaleString()}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-600">Days</p>
                              <p className="text-base font-bold text-blue-600">{contributorDetails.totalDays}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">History</p>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {contributorDetails.contributions.map((c, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg text-xs">
                                  <span>{formatDate(c.date)}</span>
                                  <span className="font-semibold text-orange-600">+{c.count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Contributors list
                    contributorsLoading ? (
                      <div className="flex justify-center py-6">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : contributors.length > 0 ? (
                      <div className="space-y-2">
                        {contributors.map((contributor) => (
                          <div
                            key={contributor.userId}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg active:bg-blue-50 cursor-pointer"
                            onClick={() => {
                              setSelectedContributor(contributor.userId);
                              fetchContributorDetails(contributor.userId);
                            }}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {contributor.rank}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 text-sm truncate">{contributor.name}</p>
                              </div>
                            </div>
                            <div className="text-right ml-2 flex-shrink-0">
                              <p className="text-sm font-bold text-blue-600">{contributor.total}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 text-sm py-6">No contributors found</p>
                    )
                  )}
                </div>

                {!selectedContributor && contributorsPagination.totalPages > 1 && (
                  <div className="p-3 border-t border-gray-200 sticky bottom-0 bg-white">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => fetchContributors(contributorsPagination.currentPage - 1)}
                        disabled={!contributorsPagination.hasPrevPage}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs disabled:opacity-50"
                      >
                        Prev
                      </button>
                      <span className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs">
                        {contributorsPagination.currentPage}/{contributorsPagination.totalPages}
                      </span>
                      <button
                        onClick={() => fetchContributors(contributorsPagination.currentPage + 1)}
                        disabled={!contributorsPagination.hasNextPage}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs disabled:opacity-50"
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
          className="text-center py-4 sm:py-6 mt-4 sm:mt-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <LotusDivider className="mb-2 sm:mb-3" />
          <p className="text-[10px] sm:text-xs font-semibold text-gray-700 mb-1">श्री स्वामिनारायणाय नमः</p>
          <p className="text-[8px] sm:text-xs text-gray-500 max-w-[250px] sm:max-w-xs mx-auto">
            May our collective sadhana bring divine blessings
          </p>
          <p className="text-[8px] sm:text-xs mt-1 sm:mt-2 text-gray-400">
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
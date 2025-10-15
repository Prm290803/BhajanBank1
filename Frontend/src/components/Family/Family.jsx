import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";

const FamilyLeaderboard = () => {
  const [members, setMembers] = useState([]);
  const [familyName, setFamilyName] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL || "";

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backend_url}/family-leaderboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setFamilyName(data.familyName);
          setMembers(data.members);
        } else {
          console.warn(data.message || "Failed to fetch leaderboard");
          setMembers([]);
          setFamilyName("");
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setMembers([]);
        setFamilyName("");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchLeaderboard();
  }, [token, backend_url]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navbar />
        <div className="pt-20 lg:pt-24 p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-8 max-w-4xl mx-auto">
            <div className="flex justify-center items-center py-12">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
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
      
      {/* Main Content with proper desktop spacing */}
      <div className="pt-16 md:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 lg:mb-12"
          >
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-3xl lg:text-4xl">🏆</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {familyName || "Family"} Leaderboard
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Top contributors in your family
            </p>
          </motion.div>

          {/* Content Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-6 lg:p-10"
          >
            {/* Leaderboard Table */}
            {members.length > 0 ? (
              <div className="space-y-4 lg:space-y-6">
                {members.map((member, index) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 lg:p-6 rounded-xl lg:rounded-2xl transition-all duration-300 border-2 ${
                      index === 0
                        ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 shadow-lg"
                        : index === 1
                        ? "bg-gradient-to-r from-orange-50 to-red-50 border-orange-300 shadow-md"
                        : index === 2
                        ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 shadow-md"
                        : "bg-white border-gray-200 hover:border-orange-200"
                    } hover:shadow-lg hover:translate-x-2`}
                  >
                    <div className="flex items-center gap-4 lg:gap-6 min-w-0 flex-1">
                      {/* Rank Badge */}
                      <div className={`flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl font-bold text-lg lg:text-xl transition-all duration-300 flex-shrink-0 ${
                        index === 0 ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-xl" :
                        index === 1 ? "bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-lg" :
                        index === 2 ? "bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-lg" :
                        "bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600"
                      }`}>
                        {index + 1}
                      </div>
                      
                      {/* Member Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                          <span className={`font-semibold text-lg lg:text-xl truncate ${
                            index === 0 ? "text-gray-900" : "text-gray-800"
                          }`}>
                            {member.name}
                          </span>
                          {index === 0 && (
                            <div className="flex items-center gap-2 mt-1 lg:mt-0">
                              <span className="text-xs lg:text-sm text-amber-600 font-medium bg-amber-100 px-3 py-1 lg:px-4 lg:py-2 rounded-full border border-amber-300">
                                🏆 Leading
                              </span>
                            </div>
                          )}
                        </div>
                        {member.email && (
                          <p className="text-gray-500 text-sm lg:text-base mt-1 truncate">
                            {member.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Points Section */}
                    <div className="flex items-center gap-4 lg:gap-6 ml-4 flex-shrink-0">
                      <span className="text-gray-500 font-medium text-sm lg:text-base hidden sm:inline">
                        Points
                      </span>
                      <span className={`px-5 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-lg lg:text-xl min-w-20 lg:min-w-24 text-center shadow-lg ${
                        index === 0 ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white" :
                        index === 1 ? "bg-gradient-to-br from-gray-500 to-gray-600 text-white" :
                        index === 2 ? "bg-gradient-to-br from-amber-400 to-orange-400 text-white" :
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
                className="text-center py-16 lg:py-20"
              >
                <div className="text-6xl lg:text-7xl mb-6">👨‍👩‍👧‍👦</div>
                <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4">
                  No Family Members Yet
                </h3>
                <p className="text-gray-500 text-lg lg:text-xl max-w-md mx-auto mb-8">
                  Invite family members to join and start contributing to the leaderboard!
                </p>
                <motion.button
                  onClick={() => window.location.href = '/invite'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 lg:px-12 py-4 lg:py-5 rounded-xl lg:rounded-2xl font-semibold text-lg lg:text-xl shadow-lg hover:shadow-xl transition-all duration-200"
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
                className="mt-8 lg:mt-12 p-6 lg:p-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl lg:rounded-2xl shadow-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 lg:gap-8 text-center">
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold text-gray-900">{members.length}</div>
                    <div className="text-sm lg:text-base text-gray-600 font-medium">Total Members</div>
                  </div>
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold text-amber-600">
                      {members.reduce((sum, member) => sum + member.points, 0)}
                    </div>
                    <div className="text-sm lg:text-base text-gray-600 font-medium">Total Points</div>
                  </div>
                 
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold text-gray-900">
                      {members.filter(m => m.points > 0).length}
                    </div>
                    <div className="text-sm lg:text-base text-gray-600 font-medium">Active Members</div>
                  </div>
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
              className="text-center mt-8 lg:mt-12"
            >
              <p className="text-gray-500 text-sm lg:text-base">
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
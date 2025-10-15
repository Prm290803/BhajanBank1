import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import LotusDivider from "../Common/LotusDivider";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

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

function FamilyDashboard() {
  const [families, setFamilies] = useState([]);
  const [topFamily, setTopFamily] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const backend_url = import.meta.env.VITE_BACKENDURL;

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      const res = await axios.get(`${backend_url}/families/today`);
      if (!res.data || res.data.length === 0) {
        setFamilies([]);
        setTopFamily(null);
        return;
      }

      // Filter out families with zero points
      const nonZeroFamilies = res.data.filter(fam => (fam.totalPoints || 0) > 0);

      if (nonZeroFamilies.length === 0) {
        setFamilies([]);
        setTopFamily(null);
        return;
      }

      // Sort by totalPoints descending
      const sorted = nonZeroFamilies.sort((a, b) => b.totalPoints - a.totalPoints);
      setFamilies(sorted);
      setTopFamily(sorted[0]);

      console.log("Today's families (non-zero points):", sorted);
    } catch (err) {
      console.error("Error fetching today's families:", err);
    }
  };

  const handleJoinFamily = () => {
    navigate("/join-family");
  };

  const handleCreateFamily = () => {
    navigate("/create-family");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 md:p-6">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:15px_15px] sm:bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>

      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 relative">
        <Navbar />

        {/* Header Section */}
        <motion.div 
          className="pt-16 sm:pt-20 text-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-sans px-2">
              Family Seva Points
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg font-light max-w-xs sm:max-w-md px-2">
              Celebrating family devotion through selfless service
            </p>
            <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
          </div>

         
        
        </motion.div>

        <LotusDivider className="my-6 sm:my-8" />

        {/* Top Family Card */}
        {topFamily && (
          <motion.div
            className="relative bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 text-center overflow-hidden"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {/* Accent border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF7722] to-[#FF9933]"></div>
            
            {/* Floating elements */}
            <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 md:-top-4 md:-right-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-orange-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 md:-bottom-4 md:-left-4 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-orange-50 rounded-full opacity-70"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-orange-50 rounded-full mb-4 sm:mb-6">
                <span className="text-lg sm:text-xl">👑</span>
                <span className="text-xs sm:text-sm font-semibold text-orange-700 uppercase tracking-wide">
                  Divine Family of the Day
                </span>
              </div>
              
              <h3 className="text-xl sm:text-2xl md:text-3xl uppercase font-bold text-gray-900 mb-2 sm:mb-3">
                {topFamily.name}
              </h3>
              
              <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg">
                <span className="text-base sm:text-lg">⭐</span>
                <span className="text-lg sm:text-xl font-bold">{topFamily.totalPoints} Points</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Section */}
        <motion.div
          className="relative bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Family Leaderboard
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">Today's seva contributions ranked by points</p>
          </div>

          {families.length > 0 ? (
            <motion.ul 
              className="space-y-3 sm:space-y-4"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {families.map((fam, i) => (
                <motion.li
                  key={fam._id}
                  variants={fadeUp}
                  className={`group flex items-center justify-between p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl transition-all duration-300 border ${
                    i === 0
                      ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm"
                      : "bg-white border-gray-100 hover:border-orange-200"
                  } hover:shadow-md hover:translate-x-1`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 ${
                      i === 0 ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg" :
                      i === 1 ? "bg-gradient-to-br from-gray-400 to-gray-500 text-white" :
                      i === 2 ? "bg-gradient-to-br from-amber-400 to-orange-400 text-white" :
                      "bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600"
                    }`}>
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className={`text-base sm:text-lg font-semibold truncate block ${
                        i === 0 ? "text-gray-900" : "text-gray-800"
                      }`}>
                        {fam.name}
                      </span>
                      {i === 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-amber-600 font-medium bg-amber-100 px-2 py-0.5 rounded-full">
                            Leading
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 ml-2">
                    <span className="text-xs sm:text-sm text-gray-500 font-medium hidden xs:block">Points</span>
                    <span className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-bold text-xs sm:text-sm min-w-12 sm:min-w-16 text-center ${
                      i === 0 ? "bg-amber-500 text-white shadow-lg" :
                      i === 1 ? "bg-gray-500 text-white" :
                      i === 2 ? "bg-amber-400 text-white" :
                      "bg-gray-100 text-gray-700 group-hover:bg-orange-100 group-hover:text-orange-700"
                    }`}>
                      {fam.totalPoints.toFixed(0)}
                    </span>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.div 
              className="text-center py-12 sm:py-16"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">🌼</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                No family points yet
              </h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Be the first family to contribute seva and appear on the leaderboard
              </p>
              {!user?.family && (
                <motion.div
                  className="flex flex-col sm:flex-row gap-3 justify-center mt-6"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.button
                    onClick={handleJoinFamily}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 text-sm"
                  >
                    Join Family
                  </motion.button>
                  <motion.button
                    onClick={handleCreateFamily}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 text-sm"
                  >
                    Create Family
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Stats Bar */}
        {families.length > 0 && (
          <motion.div
            className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{families.length}</div>
                <div className="text-xs sm:text-sm text-gray-500">Total Families</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-amber-600">
                  {families.reduce((sum, fam) => sum + fam.totalPoints, 0)}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Total Points</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer 
          className="text-center py-6 sm:py-8"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <LotusDivider className="mb-4 sm:mb-6" />
          <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">श्री स्वामिनारायणाय नमः</p>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            May every family's devotion blossom in unity and service
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default FamilyDashboard;
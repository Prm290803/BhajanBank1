import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import LotusDivider from "../Data/LotusDivider";

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
  const backend_url = import.meta.env.VITE_BACKENDURL || "http://localhost:5000";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>

      <div className="max-w-4xl mx-auto space-y-8 relative">
        <Navbar />

        {/* Header Section */}
        <motion.div 
          className="pt-20 text-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-sans">
              Family Seva Points
            </h1>
            <p className="text-gray-600 text-lg font-light max-w-md">
              Celebrating family devotion through selfless service
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#FF7722] to-transparent"></div>
          </div>
        </motion.div>

        <LotusDivider className="my-8" />

        {/* Top Family Card */}
        {topFamily && (
          <motion.div
            className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center overflow-hidden"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {/* Accent border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF7722] to-[#FF9933]"></div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-50 rounded-full opacity-70"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-orange-50 rounded-full mb-6">
                <span className="text-xl">👑</span>
                <span className="text-sm font-semibold text-orange-700 uppercase tracking-wide">
                  Divine Family of the Day
                </span>
              </div>
              
              <h3 className="text-2xl md:text-3xl uppercase font-bold text-gray-900 mb-3">
                {topFamily.name}
              </h3>
              
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-full shadow-lg">
                <span className="text-lg">⭐</span>
                <span className="text-xl font-bold">{topFamily.totalPoints} Points</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Section */}
        <motion.div
          className="relative bg-white p-8 rounded-2xl shadow-sm border border-gray-200"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Family Leaderboard
            </h2>
            <p className="text-gray-500">Today's seva contributions ranked by points</p>
          </div>

          {families.length > 0 ? (
            <motion.ul 
              className="space-y-4"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {families.map((fam, i) => (
                <motion.li
                  key={fam._id}
                  variants={fadeUp}
                  className={`group flex items-center justify-between p-6 rounded-xl transition-all duration-300 border ${
                    i === 0
                      ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm"
                      : "bg-white border-gray-100 hover:border-orange-200"
                  } hover:shadow-md hover:translate-x-1`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg font-bold text-sm transition-all duration-300 ${
                      i === 0 ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg" :
                      i === 1 ? "bg-gradient-to-br from-gray-400 to-gray-500 text-white" :
                      i === 2 ? "bg-gradient-to-br from-amber-400 to-orange-400 text-white" :
                      "bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600"
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <span className={`text-lg font-semibold ${
                        i === 0 ? "text-gray-900" : "text-gray-800"
                      }`}>
                        {fam.name}
                      </span>
                      {i === 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-amber-600 font-medium bg-amber-100 px-2 py-1 rounded-full">
                            Leading
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 font-medium">Points</span>
                    <span className={`px-4 py-2 rounded-lg font-bold text-sm min-w-16 text-center ${
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
              className="text-center py-16"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌼</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No family points yet
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Be the first family to contribute seva and appear on the leaderboard
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Bar (Optional) */}
        {families.length > 0 && (
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{families.length}</div>
                <div className="text-sm text-gray-500">Total Families</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {families.reduce((sum, fam) => sum + fam.totalPoints, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(families.reduce((sum, fam) => sum + fam.totalPoints, 0) / families.length)}
                </div>
                <div className="text-sm text-gray-500">Average Points</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer 
          className="text-center py-8"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <LotusDivider className="mb-6" />
          <p className="text-sm font-semibold text-gray-700 mb-2">श्री स्वामिनारायणाय नमः</p>
          <p className="text-xs text-gray-500">May every family's devotion blossom in unity and service</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default FamilyDashboard;
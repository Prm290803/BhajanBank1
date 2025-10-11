import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import LotusDivider from "../Data/LotusDivider";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
      const res = await axios.get(`${backend_url}/families`);
      const sorted = res.data.sort((a, b) => b.totalPoints - a.totalPoints);
      setFamilies(sorted);
      setTopFamily(sorted[0]);
    } catch (err) {
      console.error("Error fetching families:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/Maharaj.jpg')] bg-cover bg-center p-6">
      {/* Divine Glow */}
      <div className="fixed inset-0 bg-radial-gradient from-yellow-100/30 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative">
        <Navbar />

        {/* Title */}
        <div className="pt-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FF7722] font-serif">
            <span className="text-gold-500">🙏</span> Family Points Dashboard
          </h1>
          <p className="text-gray-200 italic text-base md:text-lg mt-2">
            “Where family devotion shines through seva.”
          </p>
        </div>

        <LotusDivider className="my-8" />

        {/* Top Family */}
        {topFamily && (
          <motion.div
            className="mb-10 p-6 bg-gradient-to-r from-yellow-100/70 to-orange-50/50 border border-yellow-300 rounded-2xl shadow-xl text-center"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-2xl font-bold text-[#FF9933] flex items-center justify-center gap-2">
              <span className="text-yellow-500 text-2xl">👑</span> Divine Family of the Day
            </h3>
            <p className="mt-3 text-xl font-semibold text-[#800000]">{topFamily.name}</p>
            <p className="text-[#FF7722] font-medium mt-1">Code: {topFamily.code}</p>
            <p className="mt-3 text-lg font-bold text-[#FF7722]">
              Total Points: {topFamily.totalPoints}
            </p>
          </motion.div>
        )}

        {/* Family Leaderboard */}
        <motion.div
          className="relative bg-white/20 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30 overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {/* Liquid glow highlights */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-yellow-300 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-orange-400 rounded-full blur-3xl opacity-20"></div>

          <h2 className="text-3xl font-bold text-[#FF9933] mb-6 flex items-center gap-2 relative z-10">
            <span className="text-yellow-500 text-2xl">🏠</span> Family Seva Leaderboard
          </h2>

          {families.length > 0 ? (
            <ul className="space-y-4 relative z-10">
              {families.map((fam, i) => (
                <motion.li
                  key={fam._id}
                  className={`flex justify-between items-center p-4 rounded-xl relative overflow-hidden backdrop-blur-md ${
                    i === 0
                      ? "bg-gradient-to-r from-gold-100 to-yellow-50 border border-gold-300 shadow-md"
                      : "bg-saffron-50/80 border border-saffron-200"
                  }`}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    {i === 0 ? (
                      <div className="relative">
                        <span className="text-yellow-500 text-2xl">👑</span>
                        <div className="absolute inset-0 rounded-full bg-yellow-300 animate-ping opacity-30"></div>
                      </div>
                    ) : (
                      <span className="text-bhagwa-500 font-semibold">{i + 1}.</span>
                    )}
                    <span
                      className={`${
                        i === 0 ? "text-[#FF9933] font-semibold" : "text-[#FF9933]"
                      }`}
                    >
                      {fam.name}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      i === 0
                        ? "bg-yellow-100 text-bhagwa-800"
                        : "bg-saffron-100 text-bhagwa-700"
                    }`}
                  >
                    {fam.totalPoints.toFixed(0)} पुण्य
                  </span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 text-bhagwa-600 relative z-10">
              <p className="text-lg">No family points recorded yet</p>
              <p className="mt-2 text-sm">Be the first family to shine in seva!</p>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <footer className="text-center text-[#FFFFFF] font-semibold text-sm mt-12">
          <LotusDivider className="mb-4" />
          <p>श्री स्वामिनारायणाय नमः</p>
          <p>May every family’s devotion blossom in unity 🌼</p>
        </footer>
      </div>
    </div>
  );
}

export default FamilyDashboard;

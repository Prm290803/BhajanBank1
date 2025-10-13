import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { motion } from "framer-motion";


const FamilyLeaderboard = () => {
  const [members, setMembers] = useState([]);
  const [familyName, setFamilyName] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
const backend_url = import.meta.env.VITE_BACKENDURL || "http://localhost:5000";
  

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
          console.error(data.error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchLeaderboard();
  }, [token, backend_url]);



  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-8">
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            Loading leaderboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🏆</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {familyName} Family Leaderboard
        </h1>
        <p className="text-gray-600">Top contributors in your family</p>
      </div>

      {/* Leaderboard Table */}
      {members.length > 0 ? (
        <div className="space-y-3">
          {members.map((member, index) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 border ${
                index === 0
                  ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm"
                  : index === 1
                  ? "bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200"
                  : index === 2
                  ? "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200"
                  : "bg-white border border-gray-100"
              } hover:shadow-md hover:translate-x-1`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg font-bold text-sm transition-all duration-300 ${
                  index === 0 ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg" :
                  index === 1 ? "bg-gradient-to-br from-gray-400 to-gray-500 text-white" :
                  index === 2 ? "bg-gradient-to-br from-amber-400 to-orange-400 text-white" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {index + 1}
                </div>
                <div>
                  <span className={`font-semibold ${
                    index === 0 ? "text-gray-900" : "text-gray-800"
                  }`}>
                    {member.name}
                  </span>
                  {index === 0 && (
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
                  index === 0 ? "bg-amber-500 text-white shadow-lg" :
                  index === 1 ? "bg-gray-500 text-white" :
                  index === 2 ? "bg-amber-400 text-white" :
                  "bg-gray-100 text-gray-700"
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
          className="text-center py-12"
        >
          <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No family members yet
          </h3>
          <p className="text-gray-500">
            Invite family members to join and start contributing!
          </p>
        </motion.div>
      )}

      {/* Stats Summary */}
      {members.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{members.length}</div>
              <div className="text-sm text-gray-500">Total Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">
                {members.reduce((sum, member) => sum + member.points, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(members.reduce((sum, member) => sum + member.points, 0) / members.length) || 0}
              </div>
              <div className="text-sm text-gray-500">Avg Points</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FamilyLeaderboard;
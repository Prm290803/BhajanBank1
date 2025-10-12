import React, { useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const JoinFamily = () => {
  const { user, token } = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL || "";
  const [familyCode, setFamilyCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoinFamily = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${backend_url}/api/join-family`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          code: familyCode,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`${data.message}. Total Points: ${data.totalPoints}`);
        // Clear form on success
        setFamilyCode("");
        // Redirect after 2 seconds
        setTimeout(() => navigate("/profile"), 2000);
      } else {
        setMessage(data.error || "Failed to join family");
      }
    } catch (err) {
      setMessage("Error joining family");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-orange-50 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-orange-100 w-full max-w-md relative"
      >
        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-50 rounded-full opacity-70"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join Family
            </h1>
            <p className="text-gray-600">
              Enter your family code to join and start contributing
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleJoinFamily} className="space-y-6">
            <div>
              <label htmlFor="familyCode" className="block text-sm font-medium text-gray-700 mb-2">
                Family Code
              </label>
              <input
                id="familyCode"
                type="text"
                placeholder="Enter family code (e.g., _FyKUZIQ)"
                value={familyCode}
                onChange={(e) => setFamilyCode(e.target.value)}
                className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
                maxLength={8}
                title="Family code (uppercase, numbers, and underscore allowed)"
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter the exact family code including any underscores or special characters
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || !familyCode.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Joining Family...
                </div>
              ) : (
                "Join Family"
              )}
            </motion.button>
          </form>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl text-center font-medium ${
                message.includes("Success") || message.includes("joined") || message.includes("Points")
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Debug Info - Remove this in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-700">
                <strong>Debug Info:</strong><br />
                Code being sent: "{familyCode}"<br />
                Code length: {familyCode.length}<br />
                User ID: {user?._id}
              </p>
            </div>
          )}

          {/* Back Button */}
          <motion.button
            onClick={() => navigate("/profile")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg"
          >
            Back to Profile
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default JoinFamily;
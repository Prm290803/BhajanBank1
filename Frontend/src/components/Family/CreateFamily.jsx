import React, { useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CreateFamily = () => {
  const { user, token } = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL || "";
  const [familyName, setFamilyName] = useState("");
  const [familyCode, setFamilyCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCreateFamily = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${backend_url}/api/create-family`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          familyName,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setFamilyCode(data.familyCode);
      } else {
        setMessage(data.error || "Failed to create family");
      }
    } catch (err) {
      setMessage("Error creating family");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(familyCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const shareFamilyCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join My Family',
          text: `Join my family "${familyName}" using this code: ${familyCode}`,
          url: window.location.origin,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copy
      copyToClipboard();
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
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Family
            </h1>
            <p className="text-gray-600">
              Start your family journey and invite members to join
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateFamily} className="space-y-6">
            <div>
              <label htmlFor="familyName" className="block text-sm font-medium text-gray-700 mb-2">
                Family Name
              </label>
              <input
                id="familyName"
                type="text"
                placeholder="Enter your family name"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
                maxLength={50}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || familyCode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Family...
                </div>
              ) : (
                "Create Family"
              )}
            </motion.button>
          </form>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl text-center font-medium ${
                message.includes("Success") || message.includes("created")
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Family Code Display */}
          {familyCode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-2xl text-center"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🎉 Family Created Successfully!
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Your family code is:</p>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <code className="text-2xl font-bold text-blue-600 bg-white px-4 py-2 rounded-lg border-2 border-blue-300">
                    {familyCode}
                  </code>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Share this code with your family members to join
              </p>

              {/* Compact Action Buttons */}
              <div className="flex gap-2 justify-center">
                <motion.button
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm"
                >
                  {copied ? "✅ Copied" : "📋 Copy"}
                </motion.button>
                
                <motion.button
                  onClick={shareFamilyCode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm"
                >
                  📤 Share
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Back Button */}
          <motion.button
            onClick={() => navigate("/profile")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow"
          >
            Back to Profile
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateFamily;
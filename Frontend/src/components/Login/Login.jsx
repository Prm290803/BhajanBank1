import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import GoogleLoginButton from "../../Auth/GoogleLoginButton";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/data");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

 useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    navigate("/data"); // 
  }
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-orange-50 flex items-center justify-center p-4 sm:p-6">
      {/* Background Pattern - Optimized for mobile */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:15px_15px] sm:bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black_40%,transparent_100%)]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-orange-100 w-full max-w-md mx-auto relative"
      >
        {/* Decorative Elements - Smaller on mobile */}
        <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-20 sm:h-20 bg-orange-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-10 h-10 sm:w-16 sm:h-16 bg-orange-50 rounded-full opacity-70"></div>

        <div className="relative z-10 p-4 sm:p-6 md:p-8">
          {/* Back Button - Better mobile spacing */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors duration-200 mb-4 sm:mb-6"
          >
            <span className="text-base sm:text-lg">←</span>
            <span className="text-xs sm:text-sm font-medium">Back to Home</span>
          </button>

          {/* Header - Adjusted for mobile */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <img
                src="/1.png"
                alt="Bhajan Bank Logo"
                className="w-16 h-12 sm:w-20 sm:h-15 object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Bhajan Bank
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 px-2">
              Enter the divine portal
            </p>
          </div>

          {/* Form - Better mobile spacing */}
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-3 sm:p-4 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 p-3 sm:p-4 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base pr-10 sm:pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message - Mobile optimized */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-300 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl flex justify-between items-center text-xs sm:text-sm"
              >
                <span className="flex-1 pr-2">{error}</span>
                <button 
                  onClick={() => setError("")}
                  className="text-red-500 hover:text-red-700 font-bold text-base sm:text-lg flex-shrink-0"
                >
                  ×
                </button>
              </motion.div>
            )}

            {/* Submit Button - Better mobile sizing */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 shadow-lg disabled:shadow-none flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs sm:text-sm">Signing In...</span>
                </div>
              ) : (
                <>
                  <span className="text-base sm:text-lg">🙏</span>
                  <span>Sign In to Bhajan Bank</span>
                </>
              )}
            </motion.button>
        </form>
            <motion.div className="mt-5">
              <GoogleLoginButton />
            </motion.div>

          {/* Divider - Mobile optimized */}
          <div className="relative my-4 sm:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-gray-500 text-xs sm:text-sm">
                New to divine service?
              </span>
            </div>
          </div>

          {/* Register Link - Mobile optimized */}
          <div className="text-center">
            <button
              onClick={() => navigate("/register")}
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 underline underline-offset-2 sm:underline-offset-4 text-xs sm:text-sm"
            >
              Begin Your Spiritual Journey
            </button>
          </div>

          {/* Footer Blessing - Mobile optimized */}
          <div className="text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">
              श्री स्वामिनारायणाय नमः
            </p>
            <p className="text-xs text-gray-500 mt-1">
              May your devotion blossom
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
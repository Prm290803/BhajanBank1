import { useState } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { UserIcon, AtSymbolIcon, KeyIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password should be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(name, email, password);

      if (result.success) {
        navigate('/data');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-orange-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Background Pattern - Optimized for mobile */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:12px_12px] sm:bg-[size:15px_15px] md:bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black_40%,transparent_100%)]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-orange-100 w-full max-w-md mx-auto relative"
      >
        {/* Decorative Elements - Smaller on mobile */}
        <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 md:-top-4 md:-right-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-orange-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 md:-bottom-4 md:-left-4 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-orange-50 rounded-full opacity-70"></div>

        <div className="relative z-10 p-4 sm:p-6 md:p-8">
          {/* Back Button - Mobile optimized */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors duration-200 mb-4 sm:mb-6"
          >
            <span className="text-base sm:text-lg">←</span>
            <span className="text-xs sm:text-sm font-medium">Back to Home</span>
          </button>

          {/* Header - Mobile optimized */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <img
                src="/1.png"
                alt="Bhajan Bank Logo"
                className="w-16 h-12 sm:w-18 sm:h-14 md:w-20 md:h-15 object-contain"
              />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Join Bhajan Bank
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 px-2">
              Begin your spiritual journey with us
            </p>
          </div>

          {/* Error Message - Mobile optimized */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-300 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl mb-4 sm:mb-6 flex justify-between items-center text-xs sm:text-sm"
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

          {/* Form - Mobile optimized spacing */}
          <form className="space-y-4 sm:space-y-5 md:space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 p-3 sm:p-4 pl-9 sm:pl-12 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Email Address
              </label>
              <div className="relative">
                <AtSymbolIcon className="h-4 w-4 sm:h-5 sm:w-5 absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="w-full border border-gray-300 p-3 sm:p-4 pl-9 sm:pl-12 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <KeyIcon className="h-4 w-4 sm:h-5 sm:w-5 absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  className="w-full border border-gray-300 p-3 sm:p-4 pl-9 sm:pl-12 pr-10 sm:pr-12 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <KeyIcon className="h-4 w-4 sm:h-5 sm:w-5 absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="w-full border border-gray-300 p-3 sm:p-4 pl-9 sm:pl-12 pr-10 sm:pr-12 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button - Mobile optimized */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 shadow-lg disabled:shadow-none flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs sm:text-sm">Creating Account...</span>
                </div>
              ) : (
                <>
                  <span className="text-base sm:text-lg">🌱</span>
                  <span>Create Account</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Divider - Mobile optimized */}
          <div className="relative my-4 sm:my-5 md:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-gray-500 text-xs sm:text-sm">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link - Mobile optimized */}
          <div className="text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 underline underline-offset-2 sm:underline-offset-4 text-xs sm:text-sm"
            >
              Sign in to your account
            </button>
          </div>

          {/* Footer Blessing - Mobile optimized */}
          <div className="text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">
              श्री स्वामिनारायणाय नमः
            </p>
            <p className="text-xs text-gray-500 mt-1">
              May your spiritual journey begin
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
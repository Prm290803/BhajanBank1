import React, { useState } from "react";
import { useAuth } from '../../Auth/AuthContext';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "My Profile", href: "/profile", current: location.pathname === "/profile", icon: "👤" },
    { name: "Tasks", href: "/data", current: location.pathname === "/data", icon: "📝" },
    { name: "Family Dashboard", href: "/family-dashboard", current: location.pathname === "/family-dashboard", icon: "🏠" },
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate("/")}
          >
            <div className="flex-shrink-0">
              <img
                src="/1.png"
                alt="Bhajan Bank Logo"
                className="w-10 h-10 rounded-lg"
              />
            </div>
            <div className="block">
              <span className="text-xl sm:text-lg font-bold bg-gradient-to-br from-orange-600 to-amber-600 bg-clip-text text-transparent font-sans">
                Bhajan Bank
              </span>
              {user && (
                <p className="text-xs text-gray-500 mt-[-2px] hidden sm:block">
                  Welcome, <span className="text-gray-700 font-medium">{user.name}</span>
                </p>
              )}
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    item.current
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                      : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user?.family && (
                  <div className="flex items-center gap-2">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-4 py-2 rounded-full text-sm border border-orange-200 font-medium flex items-center gap-1 cursor-pointer hover:shadow-md transition-all duration-200"
                      onClick={() => navigate("/family")}
                    >
                      <span className="text-orange-600">👨‍👩‍👧‍👦</span>
                      </motion.div>
                  </div>
                )}

                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg"
                >
                  <span className="font-medium">Logout</span>
                </motion.button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button and family badge */}
          <div className="md:hidden flex items-center space-x-3">
            {user?.family && (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 px-3 py-2 rounded-full text-sm border border-orange-200 font-medium flex items-center gap-1 cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => {
                  navigate("/family");
                  setIsMenuOpen(false);
                }}
              >
                <span className="text-orange-600">👨‍👩‍👧‍👦</span>
                <span className="hidden xs:inline text-orange-800">{user.family.name}</span>
              </motion.div>
            )}
            
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-700 hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 transition-all duration-200"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* User Info in Mobile Menu */}
            {user && (
              <div className="px-3 py-2 border-b border-gray-200 mb-2">
                <p className="text-sm font-medium text-gray-900">Welcome, <span className="text-gray-900">{user.name}</span></p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            )}

            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  item.current
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                    : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}


            <div className="border-t border-gray-200 pt-3 mt-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full px-3 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <span>🚪 Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full px-3 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transition-all duration-200"
                >
                  <span>🔑 Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
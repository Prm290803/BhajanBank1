import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-orange-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>
      
      
      <div className="pt-24 px-4 relative min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto w-full">
          {/* Main 404 Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-8 sm:p-12 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-100 rounded-full opacity-20"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-100 rounded-full opacity-20"></div>

            <div className="relative z-10 text-center">
              {/* Logo instead of Om */}
              <div className="flex justify-center mb-6">
                <img
                  src="/1.png"
                  alt="Bhajan Bank Logo"
                  className="w-24 h-20 sm:w-28 sm:h-24 md:w-32 md:h-28 object-contain"
                />
              </div>

              {/* 404 Number */}
              <div className="mb-6">
                <div className="flex justify-center items-center gap-2 sm:gap-4">
                  <span className="text-7xl sm:text-8xl md:text-9xl font-bold text-orange-500">4</span>
                  
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-xl">
                      
                    </div>
                  </div>
                  
                  <span className="text-7xl sm:text-8xl md:text-9xl font-bold text-orange-500">4</span>
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Page Not Found
              </h1>
              
              <p className="text-gray-600 text-sm sm:text-base mb-8 max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved.
              </p>

              {/* Only Return to Home Button */}
              <Link
                to="/"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200"
              >
                <span>🏠</span>
                <span>Return to Home</span>
                <span className="text-xl">→</span>
              </Link>

              {/* Help Text */}
              <p className="mt-6 text-xs text-gray-400">
                Use the navigation menu above to find your way
              </p>
            </div>
          </div>

          {/* Footer Blessing */}
          <div className="text-center mt-8">
            <p className="text-sm font-semibold text-gray-700">
              श्री स्वामिनारायणाय नमः
            </p>
            <p className="text-xs text-gray-500 mt-1">
              May your spiritual journey continue peacefully
            </p>
            <div className="mt-4 text-xs text-gray-400">
              <p>© {new Date().getFullYear()} Bhajan Bank Vadtal</p>
              <p className="mt-1">Developed with 🙏 by Build Crew</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
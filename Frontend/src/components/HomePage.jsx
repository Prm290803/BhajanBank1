import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isInStandaloneMode = ('standalone' in window.navigator) && window.navigator.standalone;

    if (isIos && !isInStandaloneMode) {
      setShowInstall(true);
    }

    const handler = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      if (!isIos) setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!window.deferredPrompt) return;
    setIsInstalling(true);
    window.deferredPrompt.prompt();
    const { outcome } = await window.deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstall(false);
    }
    window.deferredPrompt = null;
    setIsInstalling(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-saffron-50 via-white to-orange-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_20%,transparent_100%)]"></div>
     
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-4 w-48 h-48 sm:top-20 sm:left-10 sm:w-72 sm:h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-50"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-4 w-48 h-48 sm:bottom-20 sm:right-10 sm:w-72 sm:h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -15, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-50"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Responsive Logos */}
      <div className="relative lg:fixed z-20 w-full">
        {/* Top Left Logo - Vadtal */}
        <div className="absolute top-10 left-3 sm:top-6 sm:left-4 md:top-6 md:left-6 lg:top-8 lg:left-8">
          <img
            src="/vadtal.png"
            alt="Vadtal Logo"
            className="w-auto h-12 sm:h-16 md:h-20 lg:h-24 object-contain"
          />
        </div>
        
        {/* Top Right Logo - Umreth */}
        <div className="absolute top-10 right-3 sm:top-6 sm:right-4 md:top-6 md:right-6 lg:top-8 lg:right-8">
          <img
            src="/umreth.png"
            alt="Umreth Logo"
            className="w-auto h-12 sm:h-16 md:h-20 lg:h-24 object-contain"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 text-center">
        
        {/* Sanskrit Blessing Text */}
        <motion.div
          className="mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm sm:text-base md:text-lg font-bold text-orange-600 pt-4 sm:pt-5">
            ।। श्री स्वामिनारायणो विजयतेतराम् ।।
          </p>
        </motion.div>

        {/* Maharaj Image with CSS Mask */}
        <motion.div
          className="mb-4 sm:mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <img
              src="/img2.png"
              alt="Shri Maharaj"
              className="h-48 w-32 sm:h-52 sm:w-36 md:h-60 md:w-40 lg:h-72 lg:w-48 object-cover mx-auto"
              style={{
                maskImage: 'linear-gradient(to bottom, black 80%, transparent 99%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 99%)'
              }}
            />
            {/* Bottom Fade Effect */}
            <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-t from-saffron-50 to-transparent"></div>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="bg-gradient-to-br from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Bhajan Bank
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-xs sm:max-w-md md:max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Track your spiritual journey with divine grace
          <br />
          <span className="text-base sm:text-lg text-gray-500">Record your daily bhajan and seva offerings</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 sm:mb-16 w-full max-w-xs sm:max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link to="/login" className="flex-1">
            <motion.button
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-base sm:text-lg">🙏</span>
              Enter Divine Portal
            </motion.button>
          </Link>
          
          <Link to="/register" className="flex-1">
            <motion.button
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold rounded-xl shadow-lg transition-all duration-200 text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Begin Spiritual Journey
            </motion.button>
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 max-w-xs sm:max-w-md md:max-w-4xl mx-auto w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { icon: "📿", title: "Daily Bhajan Tracking", desc: "Record your spiritual practices" },
            { icon: "👨‍👩‍👧‍👦", title: "Family Leaderboards", desc: "Compete with family in seva" },
            { icon: "🌱", title: "Spiritual Growth", desc: "Track your divine progress" }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-orange-100 shadow-lg"
              whileHover={{ scale: 1.03, y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">{feature.title}</h3>
              <p className="text-gray-600 text-xs sm:text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Install App Button */}
        {showInstall && (
          <motion.div className="mb-6 sm:mb-8 px-4">
            { /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) ? (
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-yellow-100 border border-yellow-300 rounded-xl text-gray-800 max-w-xs sm:max-w-sm mx-auto">
                <p className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">📱 Add to Home Screen</p>
                <p className="text-xs sm:text-sm">
                  Tap the <span className="font-medium">Share</span> button and choose 
                  <span className="font-medium"> "Add to Home Screen"</span> to install the app.
                </p>
              </div>
            ) : (
              <motion.button
                onClick={handleInstall}
                disabled={isInstalling}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 text-sm sm:text-base mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isInstalling ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Installing...
                  </>
                ) : (
                  <>
                    <span>📱</span>
                    Install App
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Footer Blessing */}
        <motion.div
          className="text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <p className="text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">
            श्री स्वामिनारायणाय नमः
          </p>
          <p className="text-gray-500 mb-3 text-xs sm:text-sm">
            May your devotion blossom like a lotus in divine light
          </p>
        </motion.div>
      </div>
    </div>
  );
}
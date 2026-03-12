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
        <div className="absolute top-4 left-3 sm:top-6 sm:left-4 md:top-6 md:left-6 lg:top-8 lg:left-8">
          <img
            src="https://res.cloudinary.com/dq85wnwj3/image/upload/v1772954400/vadtal_h6egqf.png"
            alt="Vadtal Logo"
            className="w-auto h-10 sm:h-14 md:h-16 lg:h-20 object-contain"
          />
        </div>
         {/* Sanskrit Blessing Text */}
        <motion.div
          className="mb-2 flex items-end justify-center  sm:mb-3 md:mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs sm:text-sm  mt-1 md:text-base lg:text-lg font-bold text-orange-600">
            ।। श्री स्वामिनारायणो विजयतेतराम् ।।
          </p>
        </motion.div> 
        {/* Top Right Logo - Umreth */}
        <div className="absolute top-4 right-3 sm:top-6 sm:right-4 md:top-6 md:right-6 lg:top-8 lg:right-8">
          <img
            src="https://res.cloudinary.com/dq85wnwj3/image/upload/v1772957604/umreth-Photoroom_bkmtqg.png"
            alt="Umreth Logo"
            className="w-auto h-10 sm:h-14 md:h-16 lg:h-20 object-contain"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 text-center pt-20 sm:pt-24 md:pt-16">
        
       

        
        {/* Three Images Container - PERFECTLY ALIGNED */}
<div className="flex flex-wrap items-end justify-center gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 mb-4 sm:mb-6 md:mb-8 px-2">
  
  {/* Laxminarayan Image */}
  <motion.div
    className="flex flex-col items-center"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.8 }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <div className="relative overflow-hidden rounded-xl shadow-sm border-2 sm:border-3 border-orange-300 bg-white">
      <img
        src="/dev1.png"
        alt="Laxminarayan Bhagwan"
        className="h-26 w-26 xs:h-28 xs:w-28 sm:h-32 sm:w-32 md:h-38 md:w-38 lg:h-40 lg:w-40 object-cover"
      />
    </div>
    <p className="mt-3 text-[10px] xs:text-xs sm:text-sm font-semibold text-orange-700 whitespace-nowrap">
      श्री लक्ष्मीनारायण देव
    </p>
  </motion.div>

  {/* Maharaj Image with CSS Mask - CENTER PIECE (TALLER) */}
  <motion.div
    className="flex flex-col items-center -mb-1"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
  >
    <div className="relative">
      <img
        src="https://res.cloudinary.com/dq85wnwj3/image/upload/v1772954406/img2_dcfres.png"
        alt="Shri Maharaj"
        className="h-36 w-20 xs:h-40 xs:w-24 sm:h-44 sm:w-28 md:h-52 md:w-32 lg:h-60 lg:w-36 object-contain"
        style={{
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 99%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 99%)'
        }}
      />
      {/* Bottom Fade Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-6 xs:h-8 sm:h-10 bg-gradient-to-t from-saffron-50 to-transparent"></div>
    </div>
  </motion.div>

  {/* Acharya Maharaj Image */}
  <motion.div
    className="flex flex-col items-center"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.8 }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <div className="relative overflow-hidden rounded-xl shadow-sm border-2 sm:border-3 border-orange-300 bg-white">
      <img
        src="/maharajshree.png"
        alt="Acharya Maharaj Shree"
        className="h-24 w-24 xs:h-28 xs:w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40 object-cover p-1"
      />
    </div>
    <div className="mt-2 text-[10px] xs:text-xs sm:text-sm text-center">
      <p className="font-semibold text-orange-700 whitespace-nowrap">પ.પૂ. ધ.ધુ. ૧૦૦૮ આચાર્ય</p>
      <p className="font-semibold text-orange-700 whitespace-nowrap"></p>
      <p className="font-semibold text-orange-700 whitespace-nowrap"> શ્રી રાકેશ પ્રસાદજી મહારાજ</p>
    </div>
  </motion.div>
  
</div>

        {/* Main Heading */}
        <motion.h1
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 sm:mb-3 md:mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="bg-gradient-to-br from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Bhajan Bank Vadtal
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-[280px] xs:max-w-sm sm:max-w-md md:max-w-2xl mx-auto leading-relaxed px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Track your spiritual journey with divine grace
          <br />
          <span className="text-xs xs:text-sm sm:text-base text-gray-500">Record your daily bhajan and seva offerings</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10 w-full max-w-[280px] xs:max-w-sm sm:max-w-md mx-auto px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link to="/login" className="flex-1">
            <motion.button
              className="w-full px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-lg xs:rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-xs xs:text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm xs:text-base sm:text-lg">🙏</span>
              <span className="whitespace-nowrap">Enter Divine Portal</span>
            </motion.button>
          </Link>
          
          <Link to="/register" className="flex-1">
            <motion.button
              className="w-full px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold rounded-lg xs:rounded-xl shadow-lg transition-all duration-200 text-xs xs:text-sm sm:text-base whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Begin Spiritual Journey
            </motion.button>
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8 max-w-[280px] xs:max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-4xl mx-auto w-full px-2"
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
              className="bg-white/70 backdrop-blur-sm p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl border border-orange-100 shadow-lg"
              whileHover={{ scale: 1.03, y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-xl xs:text-2xl sm:text-3xl mb-1 sm:mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-0.5 sm:mb-1 text-xs xs:text-sm sm:text-base">{feature.title}</h3>
              <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
    
        {/* Install App Button */}
        {showInstall && (
          <motion.div className="mb-4 sm:mb-6 px-2">
            { /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) ? (
              <div className="px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 sm:py-3 bg-yellow-100 border border-yellow-300 rounded-lg xs:rounded-xl text-gray-800 max-w-[260px] xs:max-w-xs sm:max-w-sm mx-auto">
                <p className="font-semibold mb-0.5 sm:mb-1 text-xs xs:text-sm">📱 Add to Home Screen</p>
                <p className="text-[10px] xs:text-xs sm:text-sm">
                  Tap the <span className="font-medium">Share</span> button and choose 
                  <span className="font-medium"> "Add to Home Screen"</span> to install.
                </p>
              </div>
            ) : (
              <motion.button
                onClick={handleInstall}
                disabled={isInstalling}
                className="px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg xs:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-70 text-xs xs:text-sm sm:text-base mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isInstalling ? (
                  <>
                    <div className="w-3 h-3 xs:w-4 xs:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
          className="text-center px-2 pb-3 sm:pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <p className="text-xs xs:text-sm sm:text-base font-semibold text-gray-700 mb-0.5 sm:mb-1">
            श्री स्वामिनारायणाय नमः
          </p>
          <p className="text-gray-500 text-[10px] xs:text-xs sm:text-sm">
            May your devotion blossom like a lotus in divine light
          </p>
              <p className="text-xs mt-2 text-gray-400">
    Developed with <span className="text-red-500">❤️</span> for the devotional community By {' '}
    <a 
      href="https://buildcrew.co.in" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-gray-600 block hover:text-gray-900 transition-colors duration-200 font-medium"
    >
      Build Crew
    </a>
  </p>

        </motion.div>
      </div>
    </div>
  );
}
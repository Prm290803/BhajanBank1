import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setShowInstall(true);
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
    
    <div className="relative h-screen w-full overflow-hidden"
   style={{ backgroundImage: "url('/Maharaj.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
aria-label="Background of Maharaj"
>
  
  
      {/* Overlay Blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Decorative Glows */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-orange-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-yellow-400/30 rounded-full blur-3xl animate-pulse"></div>

      {/* Page Layout */}
      <div className="relative h-full w-full flex flex-col justify-between items-center text-white">
        {/* Main Content */}
        <div className="flex-grow flex flex-col justify-center items-center px-6 text-center">
          {/* Heading with glow */}
          <motion.h1
            className="relative text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-xl"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <span className="absolute inset-0 blur-2xl bg-orange-500/30 rounded-full animate-pulse"></span>
            <span className="relative">Welcome to Bhajan Bank</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-lg md:text-xl mb-10 max-w-xl mx-auto text-orange-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
          >
           "Track your spiritual journey with divine grace"
          </motion.p>

          {/* Login Button */}
          <motion.a
            href="/login"
            className="px-8 py-4 rounded-2xl bg-white text-orange-600 font-semibold text-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Clean Loader */}
            Enter the divine portal

          </motion.a>
          {/* Install Button */}
           {showInstall && (
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            className="px-6 py-3 bg-gradient-to-r mt-5 from-indigo-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {isInstalling ? (
              // ✅ Clean Ring Loader
              <div className="h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span aria-label="Install Bhajan Bank App">Install App </span>
            )}
          </button>
        )}
        </div>

        {/* Footer */}
        <motion.div
          className="mb-6 text-sm font-semibold text-orange-400 drop-shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <p>श्री स्वामिनारायणाय नमः</p>
        </motion.div>
      </div>
    </div>
  );

}

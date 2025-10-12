import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed (running in standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e); // save the event
      setShowButton(true);  // show your install button
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    setIsInstalling(true);
    deferredPrompt.prompt(); // show the native install popup

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install: ${outcome}`);

    if (outcome === 'accepted') {
      setShowButton(false); // hide after successful install
    }
    
    setDeferredPrompt(null); // clear
    setIsInstalling(false);
  };

  // Don't show install button if app is already installed or no prompt available
  if (isStandalone || !showButton) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-70"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isInstalling ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Installing...
          </>
        ) : (
          <>
            <span className="text-lg">📱</span>
            Install App
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
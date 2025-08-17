import { useEffect, useState } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
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
    deferredPrompt.prompt(); // show the native install popup

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install: ${outcome}`);

    setDeferredPrompt(null); // clear
    setShowButton(false);    // hide after install
  };
if (isStandalone || !deferredPrompt) return null;
  return (
    <>
      {showButton && (
        <button
          onClick={handleInstallClick}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            margin: "20px"
          }}
        >
          📲 Install BhajanBank
        </button>
      )}
    </>
  );
}

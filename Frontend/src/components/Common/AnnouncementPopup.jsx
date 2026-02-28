import React, { useEffect, useState } from "react";

const AnnouncementPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const popupShown = localStorage.getItem("announcementShown");

    if (!popupShown) {
      // Show popup only if user hasn't seen it before
      setShowPopup(true);
      localStorage.setItem("announcementShown", "true");
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <div style={overlayStyle}>
          <div style={popupStyle}>
            <h2>Upcoming Event 🎉</h2>
            <p>Exciting news! We have a special event coming soon. Stay tuned!</p>
            <button onClick={closePopup} style={btnStyle}>OK</button>
          </div>
        </div>
      )}
    </>
  );
};

// Simple styling
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const popupStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  width: "300px",
};

const btnStyle = {
  marginTop: "10px",
  padding: "8px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default AnnouncementPopup;

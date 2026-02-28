// frontend/src/components/TestNotifications.jsx
import React from "react";
import { useAuth } from "../Auth/AuthContext";

const TestNotifications = () => {
  const { user, token } = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL;

  const testNotification = async () => {
    try {
      const response = await fetch(`${backend_url}/api/test`, {
        method: "GET",
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Test failed:", error);
      alert("Test failed!");
    }
  };

  const sendToMe = async () => {
    try {
      const response = await fetch(`${backend_url}/api/send-to-me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "Test from App",
          body: "Hello! This is a test notification.",
        }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Send to me failed:", error);
      alert("Failed to send!");
    }
  };

  const checkMyToken = async () => {
    try {
      const response = await fetch(`${backend_url}/api/my-token`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      alert(`Token Status: ${data.message}\nHas Token: ${data.hasToken}`);
      console.log("My token:", data.token);
    } catch (error) {
      console.error("Check token failed:", error);
      alert("Failed to check token!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🔔 Test Notifications</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button onClick={testNotification} style={{ padding: "10px" }}>
          Send Test Notification
        </button>
        <button onClick={sendToMe} style={{ padding: "10px" }}>
          Send Notification to My Device
        </button>
        <button onClick={checkMyToken} style={{ padding: "10px" }}>
          Check My FCM Token
        </button>
      </div>
      <div style={{ marginTop: "20px", background: "#f0f0f0", padding: "10px" }}>
        <h3>Debug Info:</h3>
        <p>User: {user ? user.name : "Not logged in"}</p>
        <p>User ID: {user?._id || "N/A"}</p>
        <p>Local Storage FCM Token: {localStorage.getItem("fcmToken") || "None"}</p>
      </div>
    </div>
  );
};

export default TestNotifications;
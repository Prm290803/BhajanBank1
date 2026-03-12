import "./App.css";
import "./index.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import HomePage from "./components/HomePage";
import Data from "./components/data/Data";
import { AuthProvider, useAuth } from "../src/Auth/AuthContext";

import Login from "./components/Login/Login";
import Register from "../src/components/register/register";

import InstallButton from "./components/InstallApp/InstallButton";
import UserProfile from "./components/UserProfile/UserProfile";
import Navbar from "./components/Navbar/Navbar";

import CreateFamily from "./components/Family/CreateFamily";
import JoinFamily from "./components/Family/JoinFamily";
import FamilyDashboard from "./components/data/FamilyDashboard";
import Family from "./components/Family/Family";

import TaskUpdatePage from "./components/UpdateTask/TaskUpdatePage";
import BhajanShatra from "./components/BhajanShatra/BhajanShatra";

import AnnouncementPopup from "./components/Common/AnnouncementPopup";

import { getFCMToken } from "./message/firebase";

import TestNotifications from "./components/testcomponent";

import TermsAndConditions from "./components/Terms&Conditions/Terms&Conditions";
import PrivacyPolicy from "./components/Terms&Conditions/PrivacyPolicy";

import PageNotFound from "./components/Common/PageNotFound";

import IntroPage from "./IntroPage/Intro";
import { Analytics } from "@vercel/analytics/react";

// ===============================
// FCM Initializer
// ===============================
function FCMInitializer() {

  const { user } = useAuth();

  useEffect(() => {

    const initializeFCM = async () => {

      if (!user) return;

      try {

        console.log("🔔 Initializing notifications");

        const token = await getFCMToken();

        if (token) {
          console.log("✅ FCM token ready");
        } else {
          console.warn("⚠ Notification token not generated");
        }

      } catch (error) {
        console.error("❌ FCM initialization failed:", error);
      }

    };

    const timer = setTimeout(initializeFCM, 1200);

    return () => clearTimeout(timer);

  }, [user]);

  return null;
}


// ===============================
// Main App
// ===============================
function App() {

  const introPlayed = sessionStorage.getItem("introPlayed");

  return (
<>
     
    <AuthProvider>

      <Router basename="/">
       
       <Analytics />

        <FCMInitializer />

        <AnnouncementPopup />

        <InstallButton />

       

        <Routes>

          {/* Intro only first time */}
          <Route
            path="/"
            element={introPlayed ? <HomePage /> : <IntroPage />}
          />

          <Route path="/home" element={<HomePage />} />

          <Route path="/data" element={<Data />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/profile" element={<UserProfile />} />

          <Route path="/navbar" element={<Navbar />} />

          <Route path="/create-family" element={<CreateFamily />} />

          <Route path="/join-family" element={<JoinFamily />} />

          <Route path="/family-dashboard" element={<FamilyDashboard />} />

          <Route path="/family" element={<Family />} />

          <Route path="/tasks/update/:id" element={<TaskUpdatePage />} />

          <Route path="/bhajan-shatra" element={<BhajanShatra />} />

          <Route path="/test-notifications" element={<TestNotifications />} />

          <Route path="/termsandconditions" element={<TermsAndConditions />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route path="*" element={<PageNotFound />} />

        </Routes>

      </Router>

    </AuthProvider>
</>
  );

}

export default App;
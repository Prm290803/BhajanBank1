import './App.css';
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './components/HomePage';
import Data from './components/data/Data';
import { AuthProvider, useAuth } from '../src/Auth/AuthContext';
import Login from './components/Login/Login';
import Register from '../src/components/register/register'
import InstallButton from "./components/InstallApp/InstallButton";
import UserProfile from './components/UserProfile/UserProfile';
import Navbar from './components/Navbar/Navbar';
import CreateFamily from './components/Family/CreateFamily';
import JoinFamily from './components/Family/JoinFamily';
import FamilyDashboard from './components/data/FamilyDashboard';
import Family from './components/Family/Family';
import TaskUpdatePage from './components/UpdateTask/TaskUpdatePage';
import BhajanShatra from './components/BhajanShatra/BhajanShatra';
import AnnouncementPopup from './components/Common/AnnouncementPopup';
import { getFCMToken } from './message/firebase';
import TestNotifications from './components/testcomponent';

// FCM Initializer Component
function FCMInitializer() {
  const { user } = useAuth();
  
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/firebase-messaging-sw.js")
        .then((reg) => console.log("✅ Service Worker Registered:", reg.scope))
        .catch((err) => console.error("❌ SW registration failed:", err));
    }
  }, []);
  
  useEffect(() => {
    const initializeFCM = async () => {
      if (user && user._id) {
        console.log("🔄 Initializing FCM for user:", user._id);
        
        try {
          const token = await getFCMToken(user._id);
          
          if (token) {
            console.log("✅ FCM token obtained:");
          } else {
            console.warn("⚠ FCM token not available");
          }
        } catch (error) {
          console.error("❌ FCM initialization failed:", error);
        }
      }
    };
    
    // Wait a moment for auth to settle
    const timer = setTimeout(initializeFCM, 1000);
    
    return () => clearTimeout(timer);
  }, [user]);
  
  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router basename='/'>
        <FCMInitializer />
        <AnnouncementPopup />
        <InstallButton />
        <Routes>
          <Route path="/" element={<HomePage />} />
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
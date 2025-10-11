import './App.css';
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Data from './components/data/Data';
import { AuthProvider } from '../src/Auth/AuthContext'; // ✅ Correct import
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



function App() {
  return (
    <AuthProvider> {/* ✅ Wrap your app in AuthProvider */}
      <Router basename='/'>
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

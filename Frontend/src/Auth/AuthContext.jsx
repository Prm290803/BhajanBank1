import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
// import { getFCMToken,  clearFCMToken } from '../message/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const backend_url = import.meta.env.VITE_BACKENDURL;
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  // Restore token & user from localStorage on mount
useEffect(() => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const expiry = localStorage.getItem('expiry');

  if (storedToken && storedUser && (!expiry || Date.now() < parseInt(expiry))) {
    setToken(storedToken);
    setUser(JSON.parse(storedUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expiry');
    setToken('');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  }

  // ✅ Mark as ready AFTER restoring token
  setLoading(false);
}, []);

  // Fetch fresh user info if token exists
useEffect(() => {
  // ✅ Only fetch user if we have a token AND not loading
  if (!token || loading) return;

  axios
    .get(`${backend_url}/api/user`)
    .then(res => setUser(res.data))
    .catch(err => {
      console.error('Failed to fetch user:', err);
      logout();
    });
}, [token, loading]);

  // const login = async (email, password) => {
  //   try {
  //     const res = await axios.post(`${backend_url}/api/login`, { email, password });

  //     const newToken = res.data.token;
  //     const newUser = res.data.user;

  //     setToken(newToken);
  //     setUser(newUser);
  //     localStorage.setItem('token', newToken);
  //     localStorage.setItem('user', JSON.stringify(newUser));
  //     localStorage.setItem('expiry', Date.now() + 1000 * 60 * 60 * 24); // optional 24h expiry
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

  //     return { success: true, user: newUser };
  //   } catch (err) {
  //     return {
  //       success: false,
  //       message: err.response?.data?.message || 'Login failed',
  //     };
  //   }
  // };

  const login = async (email, password) => {
  try {
    setLoading(true); // Start loading
    
    const res = await axios.post(`${backend_url}/api/login`, { email, password });

    const newToken = res.data.token;
    const newUser = res.data.user;

    setToken(newToken);
    setUser(newUser);

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("expiry", Date.now() + 1000 * 60 * 60 * 24);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

    // ✅ Get FCM token only if not already stored
    const existingToken = localStorage.getItem('fcmToken');
    if (!existingToken) {
      const fcmToken = await getFCMToken(); // Updated function name
      if (fcmToken) await saveFcmToken(fcmToken);
    }

    setLoading(false); // Stop loading
    return { success: true, user: newUser };

  } catch (err) {
    setLoading(false); // Stop loading on error
    return {
      success: false,
      message: err.response?.data?.message || "Login failed",
    };
  }
};
  const register = async (name, email, password) => {
    try {
      const res = await axios.post(
        `${backend_url}/api/register`,
        { name, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const newToken = res.data.token;
      const newUser = res.data.user;

      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('expiry', Date.now() + 1000 * 60 * 60 * 24); // optional 24h expiry
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return { success: true };
    } catch (err) {
      const errorMessage = err?.response?.data?.error || 'Registration failed. Please try again.';
      console.error('API Error:', err?.response?.data);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expiry');
    delete axios.defaults.headers.common['Authorization'];
    // optionally redirect to login page
  };


// const register = async (name, email, password) => {
//   try {
//     setLoading(true); // Start loading
    
//     const res = await axios.post(`${backend_url}/api/register`, {
//       name, email, password
//     });

//     const newToken = res.data.token;
//     const newUser = res.data.user;

//     setToken(newToken);
//     setUser(newUser);

//     localStorage.setItem("token", newToken);
//     localStorage.setItem("user", JSON.stringify(newUser));
//     localStorage.setItem("expiry", Date.now() + 1000 * 60 * 60 * 24);

//     axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

//     // ✅ Get FCM token only if not already stored
//     const existingToken = localStorage.getItem('fcmToken');
//     if (!existingToken) {
//       const fcmToken = await getFCMToken(); // Updated function name
//       if (fcmToken) await saveFcmToken(fcmToken);
//     }

//     setLoading(false); // Stop loading
//     return { success: true };

//   } catch (err) {
//     setLoading(false); // Stop loading on error
//     return {
//       success: false,
//       message: err?.response?.data?.error || "Registration failed",
//     };
//   }
// };

// const logout = () => {
//   setToken('');
//   setUser(null);
//   localStorage.removeItem('token');
//   localStorage.removeItem('user');
//   localStorage.removeItem('expiry');
//   clearFCMToken(); // ✅ Clear FCM token on logout
//   delete axios.defaults.headers.common['Authorization'];
// };
  return (
    <AuthContext.Provider value={{ user, setUser, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


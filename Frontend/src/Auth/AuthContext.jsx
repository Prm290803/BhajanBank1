import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  // const backend_url = import.meta.env.VITE_BACKENDURL;
  const backend_url  = "http://localhost:5000"
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (token) {
    // Save token & set axios header
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    axios .get(`${backend_url}/api/user`) .then(res => { setUser(res.data); })

    .catch(err => { console.error('Failed to fetch user:', err); 
      logout(); 
      // token invalid, log user out 
      })
      .finally(() => setLoading(false)); 
    }
     else {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null); 
        setLoading(false);
        } }, 
        [token]);
//   useEffect(() => {
//   if (token) {
//     // Save token & set axios header
//     localStorage.setItem('token', token);
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//     // Try to fetch user info
//     axios
//       .get(`${backend_url}/api/user`)
//       .then(res => {
//         setUser(res.data);
//       })
//       .catch(err => {
//         console.error('Failed to fetch user:', err);
//         logout(); // token invalid, log user out
//       })
//       .finally(() => setLoading(false));
//   } else {
//     // No token → clear everything
//     localStorage.removeItem('token');
//     delete axios.defaults.headers.common['Authorization'];
//     setUser(null);
//     setLoading(false);
//   }
// }, [token]);

const login = async (email, password) => {
  try {
    const res = await axios.post(`${backend_url}/api/login`, { email, password });


    // Save token to localStorage and state
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token); // This will trigger useEffect

    return { success: true, user: res.data.user };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Login failed'
    };
  }
};
// const login = async (email, password) => {
//   try {
//     const res = await axios.post(`${backend_url}/api/login`, { email, password });

//     // adjust based on backend response
//     const token = res.data.token || res.data.accessToken;
//     const user = res.data.user || null;

//     if (!token) throw new Error("No token received from backend");

//     // Save token in state, localStorage, and axios header
//     setToken(token);
//     localStorage.setItem('token', token);
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//     // Save user if backend sends it
//     setUser(user);

//     return { success: true, user };
//   } catch (err) {
//     console.error("Login error:", err.response?.data || err.message);
//     return {
//       success: false,
//       message: err.response?.data?.message || err.response?.data?.error || 'Login failed',
//     };
//   }
// };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post(
        `${backend_url}/api/register`,
        { name, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error || 'Registration failed. Please try again.';
      console.error('API Error:', err?.response?.data);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    // optional: navigate('/login') if you want redirect
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

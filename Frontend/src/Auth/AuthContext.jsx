import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const backend_url = import.meta.env.VITE_BACKENDURL;
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Save token & set axios header
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Try to fetch user info
      axios
        .get(`${backend_url}/api/user`)
        .then(res => {
          setUser(res.data);
        })
        .catch(err => {
          console.error('Failed to fetch user:', err);
          logout(); // token invalid, log user out
        })
        .finally(() => setLoading(false));
    } else {
      // No token → clear everything
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${backend_url}/api/login`, { email, password });

      // Save token in state and localStorage
      setToken(res.data.token);
      setUser(res.data.user);

      return { success: true, user: res.data.user };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed',
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

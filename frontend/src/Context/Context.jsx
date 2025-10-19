import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api.js';

// 1. Context create karein
const AuthContext = createContext();

// 2. Provider banayein
export const ContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/me') // Yeh backend route zaroori hai
        .then(res => {
          setUser(res.data);
        })
        .catch(() => {
          // Token ghalat ya expire ho gaya
          setToken(null);
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, isAuthenticated: !!token }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook (useAuth) banayein
// Ab baaqi files isay import karengi
export const useAuth = () => {
  return useContext(AuthContext);
};
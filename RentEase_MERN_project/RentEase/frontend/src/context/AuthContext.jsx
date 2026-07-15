import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login action
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || 'Invalid email or password';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // Register action
  const register = async (name, email, password, phone, role) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        phone,
        role,
      });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || 'Registration failed';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // Logout action
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

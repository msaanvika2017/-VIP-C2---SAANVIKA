import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rentease_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const res = await fetch(`http://localhost:3001/users?email=${email}&password=${password}`);
    const users = await res.json();
    if (users.length > 0) {
      const u = users[0];
      setUser(u);
      localStorage.setItem('rentease_user', JSON.stringify(u));
      return { success: true, user: u };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = async (data) => {
    const checkRes = await fetch(`http://localhost:3001/users?email=${data.email}`);
    const existing = await checkRes.json();
    if (existing.length > 0) return { success: false, error: 'Email already registered' };

    const res = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, savedProperties: [], bookings: [] })
    });
    const newUser = await res.json();
    setUser(newUser);
    localStorage.setItem('rentease_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rentease_user');
  };

  const updateUser = (updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem('rentease_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, logout as apiLogout } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    setUser(getUser());
    setToken(getToken());
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 

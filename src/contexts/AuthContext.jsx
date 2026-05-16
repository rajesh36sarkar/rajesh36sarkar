import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { verifyToken } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be utilized within an active AuthProvider container');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await verifyToken();
        if (isMounted) {
          if (response?.data?.valid) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Authentication check sequence rejected:', error);
        if (isMounted) {
          localStorage.removeItem('token');
          setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();
    return () => { isMounted = false; };
  }, []);

  // 1. Memoize actions so consumer hooks keep stable dependency chains
  const login = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  // 2. Prevent application-wide component re-renders on state checks
  const contextValue = useMemo(() => ({
    user,
    loading,
    login,
    logout
  }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
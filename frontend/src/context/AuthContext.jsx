import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('crm_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('crm_token') || null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    setToken(null);
    setUser(null);
  }, []);

  // Sync and verify current user on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const existingToken = localStorage.getItem('crm_token');
      if (existingToken) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('crm_user', JSON.stringify(res.data));
          }
        } catch (error) {
          console.warn('[AuthContext] Session expired or invalid token:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    // Event listener for unauthorized responses
    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener('crm-auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('crm-auth-expired', handleAuthExpired);
    };
  }, [logout]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res.success && res.data) {
      const { token: newToken, employee } = res.data;
      localStorage.setItem('crm_token', newToken);
      localStorage.setItem('crm_user', JSON.stringify(employee));
      setToken(newToken);
      setUser(employee);
      return employee;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.success && res.data) {
      const { token: newToken, employee } = res.data;
      localStorage.setItem('crm_token', newToken);
      localStorage.setItem('crm_user', JSON.stringify(employee));
      setToken(newToken);
      setUser(employee);
      return employee;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const refreshUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('crm_user', JSON.stringify(res.data));
      }
    } catch (err) {
      console.warn('[AuthContext] Failed to refresh user profile:', err);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

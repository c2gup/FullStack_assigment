import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('fastor_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('fastor_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [pendingPhone, setPendingPhone] = useState(() => {
    try {
      const stored = sessionStorage.getItem('fastor_pending_phone');
      return stored ? JSON.parse(stored) : { phone: '9818979450', dialCode: '+91' };
    } catch {
      return { phone: '9818979450', dialCode: '+91' };
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Validate token existence on mount
    const savedToken = localStorage.getItem('fastor_token');
    const savedUser = localStorage.getItem('fastor_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const savePendingPhone = (data) => {
    setPendingPhone(data);
    sessionStorage.setItem('fastor_pending_phone', JSON.stringify(data));
  };

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('fastor_token', jwtToken);
    localStorage.setItem('fastor_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fastor_token');
    localStorage.removeItem('fastor_user');
    sessionStorage.removeItem('fastor_pending_phone');
  };

  const updateUser = (updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem('fastor_user', JSON.stringify(updated));
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    pendingPhone,
    savePendingPhone,
    login,
    logout,
    updateUser,
    isLoading,
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

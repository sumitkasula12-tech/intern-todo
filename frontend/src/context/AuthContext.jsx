import { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('todo_token'));

  useEffect(() => {
    if (token) {
      authService.setToken(token);
      const storedUser = localStorage.getItem('todo_user');
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, [token]);

  const login = (data) => {
    localStorage.setItem('todo_token', data.token);
    localStorage.setItem('todo_user', JSON.stringify(data.user));
    authService.setToken(data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('todo_token');
    localStorage.removeItem('todo_user');
    authService.clearToken();
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

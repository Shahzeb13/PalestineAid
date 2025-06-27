import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/is-auth', {}, {
        withCredentials: true
      });
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    }, { withCredentials: true });
    
    setUser(response.data.user);
    return response.data;
  };

  const register = async (userData) => {
    const response = await axios.post('http://localhost:5000/api/auth/register', userData, {
      withCredentials: true
    });
    setUser(response.data.user);
    return response.data;
  };

  const createSuperAdmin = async (userData) => {
    const response = await axios.post('http://localhost:5000/api/auth/create-first-super-admin', userData, {
      withCredentials: true
    });
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    await axios.post('http://localhost:5000/api/auth/logout', {}, {
      withCredentials: true
    });
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';
  const isDonater = () => user?.role === 'donater';
  const isReceiver = () => user?.role === 'receiver';
  const isSuperAdmin = () => user?.isSuperAdmin === true;

  const value = {
    user,
    login,
    register,
    createSuperAdmin,
    logout,
    isAdmin,
    isDonater,
    isReceiver,
    isSuperAdmin,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const[authToken , setAuthToken] = useState('')
    
    const navigate = useNavigate()
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }, []);
  
    const login = (token) => {
      localStorage.setItem('token', token);
      setAuthToken(token)
      setIsAuthenticated(true);
    };
  
    const logout = () => {
      localStorage.removeItem('token');
      navigate('/')
      setIsAuthenticated(false);
     
    };
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout,authToken }}>
        {children}
      </AuthContext.Provider>
    );
  };
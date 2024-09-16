import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {

    const[authToken , setAuthToken] = useState('')
  
    const navigate = useNavigate()
    return (
      <AuthContext.Provider value={{setAuthToken,authToken }}>
        {children}
      </AuthContext.Provider>
    );
  };
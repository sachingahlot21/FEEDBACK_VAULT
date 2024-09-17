import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';


const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {

    const[userIDContext , setUserIDContext] = useState('')
    const[userNameContext , setUserNameContext] = useState('')

    useEffect(() => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUserIDContext(decodedToken.userData.userId);
          setUserNameContext(decodedToken.userData.userName);
        } catch (error) {
          console.error('Invalid token', error);
        }
      }
    }, []);
  
    return (
      <UserContext.Provider value={{ userIDContext , setUserIDContext , userNameContext , setUserNameContext}}>
        {children}
      </UserContext.Provider>
    );
  };
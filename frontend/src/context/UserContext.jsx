import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {

    const[userIDContext , setUserIDContext] = useState('')
    const[userNameContext , setUserNameContext] = useState('')
  
    return (
      <UserContext.Provider value={{ userIDContext , setUserIDContext , userNameContext , setUserNameContext}}>
        {children}
      </UserContext.Provider>
    );
  };
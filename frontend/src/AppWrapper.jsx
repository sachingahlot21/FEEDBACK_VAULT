import React from 'react';
import App from './App'
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';

export default function AppWrapper() {
  return (

    <UserProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </UserProvider>

  );
}
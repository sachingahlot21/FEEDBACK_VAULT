import './App.css'
import Login from './components/Login/Login'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Signup/Signup'
import Home from './components/Home/Home'
import Dashboard from './components/Dashboard/Dashboard'
import { useEffect, useState } from 'react';
import { useAuth, AuthProvider } from './context/AuthContext';
import Public from './components/Public/Public';

function App() {

  const { isAuthenticated, setIsAuthenticated } = useAuth();
  console.log("isAuth?", isAuthenticated)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ideally, you would validate the token here
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [setIsAuthenticated]);

  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/public/:username' element={<Public />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  )
}

export default App

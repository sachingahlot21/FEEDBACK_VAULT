import './App.css'
import Login from './components/Login/Login'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Signup/Signup'
import Home from './components/Home/Home'
import Dashboard from './components/Dashboard/Dashboard'
import { useEffect, useState } from 'react';
import { useAuth , AuthProvider } from './context/AuthContext';

function App() {

  const { isAuthenticated } = useAuth();

  // const [isAuthenticated, setIsAuthenticated] = useState(false)
  // const checkAuthentication = () => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     setIsAuthenticated(true);
  //   } else {
  //     setIsAuthenticated(false);
  //   }
  // };

  // useEffect(() => {
  //   checkAuthentication();
  // }, []);

  // const handleLogin = () => {
  //   checkAuthentication(); 
  // };

  return (
    <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
    </>
  )
}

export default App
